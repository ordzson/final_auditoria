import { CONTENT_VERSION } from '../data/canon';
import type { PersistenceChange, PersistenceEvent } from '../computer/types';
import { currentSourceVersion, createAssessment, sameSourceRef } from './evaluate';
import { reviewRules, reviewIds, RULES_VERSION } from './rules';
import type {
  Assessment,
  GameState,
  PlayerPose,
  Recommendation,
  ReviewId,
  Settings,
  SourceRef,
} from './types';

export const STORAGE_KEY = 'rednova.auditoria.oficina.v2';

function defaultState(): GameState {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return {
    schemaVersion: 2,
    contentVersion: CONTENT_VERSION,
    rulesVersion: RULES_VERSION,
    assessments: Object.fromEntries(reviewIds.map((id) => [id, createAssessment(id)])) as GameState['assessments'],
    inspected: [],
    clipboardReceived: false,
    pose: { x: 0, z: 4.4, yaw: 0, pitch: 0 },
    settings: { projector: false, reducedMotion, audioEnabled: false, sensitivity: 1, flatMode: false },
    recommendations: Object.fromEntries(reviewIds.map((id) => [id, { action: '', owner: '', verification: '' }])) as GameState['recommendations'],
    hintLevels: Object.fromEntries(reviewIds.map((id) => [id, 0])) as GameState['hintLevels'],
    introSeen: false,
  };
}

function sourceRefs(value: unknown): SourceRef[] {
  if (!Array.isArray(value)) return [];
  return value.filter((ref): ref is SourceRef => Boolean(ref)
    && typeof ref === 'object'
    && typeof (ref as SourceRef).sourceId === 'string'
    && typeof (ref as SourceRef).sourceVersion === 'string')
    .map((ref) => ({ sourceId: ref.sourceId, sourceVersion: ref.sourceVersion, ...(ref.rowId ? { rowId: String(ref.rowId) } : {}) }));
}

function restoreAssessment(reviewId: ReviewId, value: unknown): Assessment {
  const fallback = createAssessment(reviewId);
  if (!value || typeof value !== 'object') return fallback;
  const saved = value as Partial<Assessment>;
  return {
    ...fallback,
    rulesVersion: typeof saved.rulesVersion === 'string' ? saved.rulesVersion : RULES_VERSION,
    sourceRefs: sourceRefs(saved.sourceRefs),
    checkAnswers: Array.isArray(saved.checkAnswers) ? saved.checkAnswers.flatMap((answer) => {
      if (!answer || typeof answer.checkId !== 'string' || typeof answer.answerId !== 'string') return [];
      return [{ checkId: answer.checkId, answerId: answer.answerId, sourceRefs: sourceRefs(answer.sourceRefs) }];
    }) : [],
    conclusionId: typeof saved.conclusionId === 'string' ? saved.conclusionId : null,
    limitationIds: Array.isArray(saved.limitationIds) ? saved.limitationIds.filter((id): id is string => typeof id === 'string') : [],
    requestIds: Array.isArray(saved.requestIds) ? saved.requestIds.filter((id): id is string => typeof id === 'string') : [],
    freeNote: typeof saved.freeNote === 'string' ? saved.freeNote : '',
  };
}

export function restoreState(raw: string | null): GameState {
  const fallback = defaultState();
  if (!raw) return fallback;
  try {
    const saved = JSON.parse(raw) as Partial<GameState>;
    if (saved.schemaVersion !== 2) return fallback;
    const pose = saved.pose as Partial<PlayerPose> | undefined;
    const settings = saved.settings as Partial<Settings> | undefined;
    return {
      ...fallback,
      contentVersion: typeof saved.contentVersion === 'string' ? saved.contentVersion : CONTENT_VERSION,
      rulesVersion: typeof saved.rulesVersion === 'string' ? saved.rulesVersion : RULES_VERSION,
      assessments: Object.fromEntries(reviewIds.map((id) => [id, restoreAssessment(id, saved.assessments?.[id])])) as GameState['assessments'],
      inspected: sourceRefs(saved.inspected),
      clipboardReceived: saved.clipboardReceived === true,
      pose: {
        x: Number.isFinite(pose?.x) ? Number(pose?.x) : fallback.pose.x,
        z: Number.isFinite(pose?.z) ? Number(pose?.z) : fallback.pose.z,
        yaw: Number.isFinite(pose?.yaw) ? Number(pose?.yaw) : 0,
        pitch: Number.isFinite(pose?.pitch) ? Math.max(-1.45, Math.min(1.45, Number(pose?.pitch))) : 0,
      },
      settings: {
        projector: settings?.projector === true,
        reducedMotion: typeof settings?.reducedMotion === 'boolean' ? settings.reducedMotion : fallback.settings.reducedMotion,
        audioEnabled: settings?.audioEnabled === true,
        sensitivity: Number.isFinite(settings?.sensitivity) ? Math.max(0.4, Math.min(2, Number(settings?.sensitivity))) : 1,
        flatMode: settings?.flatMode === true,
      },
      recommendations: Object.fromEntries(reviewIds.map((id) => {
        const recommendation = saved.recommendations?.[id] as Partial<Recommendation> | undefined;
        return [id, {
          action: typeof recommendation?.action === 'string' ? recommendation.action : '',
          owner: typeof recommendation?.owner === 'string' ? recommendation.owner : '',
          verification: typeof recommendation?.verification === 'string' ? recommendation.verification : '',
        }];
      })) as GameState['recommendations'],
      hintLevels: Object.fromEntries(reviewIds.map((id) => [id, Math.max(0, Math.min(2, Number(saved.hintLevels?.[id]) || 0))])) as GameState['hintLevels'],
      introSeen: saved.introSeen === true,
    };
  } catch {
    return fallback;
  }
}

export class AuditStore {
  state: GameState;
  private listeners = new Set<() => void>();
  private persistenceListeners = new Set<(event: PersistenceEvent) => void>();
  private revision = 0;

  constructor() {
    let raw: string | null = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch { raw = null; }
    this.state = restoreState(raw);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribePersistence(listener: (event: PersistenceEvent) => void): () => void {
    this.persistenceListeners.add(listener);
    return () => this.persistenceListeners.delete(listener);
  }

  private persistence(status: PersistenceEvent['status'], change: PersistenceChange, reviewId?: ReviewId): void {
    const event: PersistenceEvent = { domain: 'audit', status, change, revision: this.revision, ...(reviewId ? { reviewId } : {}) };
    this.persistenceListeners.forEach((listener) => listener(event));
  }

  notifyPending(change: PersistenceChange, reviewId?: ReviewId): void {
    this.revision++;
    this.persistence('pending', change, reviewId);
  }

  private commit(change: PersistenceChange, reviewId?: ReviewId): void {
    this.notifyPending(change, reviewId);
    let status: PersistenceEvent['status'] = 'saved';
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch { status = 'session-only'; }
    this.persistence(status, change, reviewId);
    this.listeners.forEach((listener) => listener());
  }

  inspect(sourceId: string): void {
    const sourceVersion = currentSourceVersion(sourceId);
    if (!sourceVersion) throw new Error('Esta presentación no es una fuente admitida para la auditoría.');
    const ref = { sourceId, sourceVersion };
    if (!this.state.inspected.some((item) => sameSourceRef(item, ref))) {
      this.state.inspected.push(ref);
      this.commit('inspection');
    }
  }

  pin(reviewId: ReviewId, sourceId: string): void {
    const ref = { sourceId, sourceVersion: currentSourceVersion(sourceId) ?? '' };
    if (!ref.sourceVersion || !this.state.inspected.some((item) => sameSourceRef(item, ref))) {
      throw new Error('Abre e inspecciona la fuente antes de vincularla.');
    }
    const assessment = this.state.assessments[reviewId];
    const group = reviewRules[reviewId].sourceGroups.find((item) => item.alternatives.includes(sourceId));
    if (!group) throw new Error('Esta fuente no pertenece a los grupos de sustento de la revisión.');
    if (!assessment.sourceRefs.some((item) => sameSourceRef(item, ref))) assessment.sourceRefs.push(ref);
    this.commit('source', reviewId);
  }

  unpin(reviewId: ReviewId, ref: SourceRef): void {
    const assessment = this.state.assessments[reviewId];
    assessment.sourceRefs = assessment.sourceRefs.filter((item) => !sameSourceRef(item, ref));
    this.commit('source', reviewId);
  }

  answerCheck(reviewId: ReviewId, checkId: string, answerId: string): void {
    const rule = reviewRules[reviewId];
    const check = rule.checks.find((item) => item.id === checkId);
    if (!check || !check.options.some((option) => option.id === answerId)) throw new Error('Comprobación no admitida.');
    const groups = rule.sourceGroups.filter((group) => check.sourceGroupIds.includes(group.id));
    const assessment = this.state.assessments[reviewId];
    const usedRefs = assessment.sourceRefs.filter((ref) => ref.sourceVersion === currentSourceVersion(ref.sourceId)
      && this.state.inspected.some((item) => sameSourceRef(item, ref))
      && groups.some((group) => group.alternatives.includes(ref.sourceId)));
    const complete = groups.every((group) => usedRefs.some((ref) => group.alternatives.includes(ref.sourceId)));
    if (!complete) throw new Error('Vincula todos los grupos de fuentes requeridos antes de comprobar.');
    assessment.checkAnswers = assessment.checkAnswers.filter((answer) => answer.checkId !== checkId);
    assessment.checkAnswers.push({ checkId, answerId, sourceRefs: usedRefs.map((ref) => ({ ...ref })) });
    this.commit('check', reviewId);
  }

  setConclusion(reviewId: ReviewId, conclusionId: string | null): void {
    this.state.assessments[reviewId].conclusionId = conclusionId;
    this.commit('conclusion', reviewId);
  }

  toggleLimitation(reviewId: ReviewId, limitationId: string): void {
    const ids = this.state.assessments[reviewId].limitationIds;
    this.state.assessments[reviewId].limitationIds = ids.includes(limitationId)
      ? ids.filter((id) => id !== limitationId)
      : [...ids, limitationId];
    this.commit('conclusion', reviewId);
  }

  toggleRequest(reviewId: ReviewId, requestId: string): void {
    const ids = this.state.assessments[reviewId].requestIds;
    this.state.assessments[reviewId].requestIds = ids.includes(requestId)
      ? ids.filter((id) => id !== requestId)
      : [...ids, requestId];
    this.commit('conclusion', reviewId);
  }

  setFreeNote(reviewId: ReviewId, freeNote: string): void {
    this.state.assessments[reviewId].freeNote = freeNote;
    this.commit('note', reviewId);
  }

  receiveClipboard(): void {
    if (this.state.clipboardReceived) return;
    this.state.clipboardReceived = true;
    this.commit('interview');
  }

  setPose(pose: PlayerPose): void {
    this.state.pose = pose;
    this.commit('pose');
  }

  updateSettings(patch: Partial<Settings>): void {
    this.state.settings = { ...this.state.settings, ...patch };
    this.commit('settings');
  }

  setRecommendation(reviewId: ReviewId, patch: Partial<Recommendation>): void {
    this.state.recommendations[reviewId] = { ...this.state.recommendations[reviewId], ...patch };
    this.commit('recommendation', reviewId);
  }

  requestHint(reviewId: ReviewId): void {
    this.state.hintLevels[reviewId] = Math.min(2, this.state.hintLevels[reviewId] + 1);
    this.commit('draft', reviewId);
  }

  markIntroSeen(): void {
    this.state.introSeen = true;
    this.commit('settings');
  }

  reset(): void {
    this.notifyPending('reset');
    let status: PersistenceEvent['status'] = 'saved';
    try { localStorage.removeItem(STORAGE_KEY); } catch { status = 'session-only'; }
    this.state = defaultState();
    this.persistence(status, 'reset');
    this.listeners.forEach((listener) => listener());
  }
}
