import type { AuditStore } from '../audit/store';
import { currentSourceVersion, evaluateReview, sameSourceRef } from '../audit/evaluate';
import { reviewRules } from '../audit/rules';
import type { StationId } from '../audit/types';
import { availableComputerSources, getComputer } from '../data/computers';
import type { CheckSubmission, ReviewBridge } from './types';
import type { WorkspaceStore } from './workspace';

export function createReviewBridge(store: AuditStore, workspace: WorkspaceStore, stationId: StationId): ReviewBridge {
  const computer = getComputer(stationId);
  const reviewId = computer.reviewId;
  const rule = reviewRules[reviewId];
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pendingNote: string | null = null;
  let updating = false;
  const assessment = () => store.state.assessments[reviewId];
  const requireSource = (sourceId: string) => {
    if (!availableComputerSources(stationId, store.state).includes(sourceId) || !currentSourceVersion(sourceId)) {
      throw new Error('La fuente no está disponible en esta computadora; solicita las declaraciones al enlace de TI.');
    }
  };
  const requireSustento = (sourceId: string) => {
    requireSource(sourceId);
    if (!rule.sourceGroups.some((group) => group.alternatives.includes(sourceId))) throw new Error('Esta fuente es contexto y no pertenece a los grupos de sustento de la revisión.');
  };
  const currentLinked = () => assessment().sourceRefs.filter((ref) => ref.sourceVersion === currentSourceVersion(ref.sourceId)
    && store.state.inspected.some((item) => sameSourceRef(item, ref)) && availableComputerSources(stationId, store.state).includes(ref.sourceId));

  function attempt(checkId: string, answerId: string, sourceIds: readonly string[]): CheckSubmission {
    const check = rule.checks.find((item) => item.id === checkId);
    if (!check || !check.options.some((option) => option.id === answerId)) throw new Error('Comprobación no admitida.');
    sourceIds.forEach(requireSustento);
    updating = true;
    try {
      for (const sourceId of new Set(sourceIds)) {
        store.inspect(sourceId);
        store.pin(reviewId, sourceId);
      }
      const refs = currentLinked();
      const missingSourceGroupIds = check.sourceGroupIds.filter((groupId) => {
        const group = rule.sourceGroups.find((item) => item.id === groupId)!;
        return !refs.some((ref) => group.alternatives.includes(ref.sourceId));
      });
      if (missingSourceGroupIds.length) {
        workspace.setPendingCheck(stationId, checkId, { answerId, sourceIds: [...new Set(sourceIds)] });
        const labels = missingSourceGroupIds.map((id) => rule.sourceGroups.find((group) => group.id === id)!.label);
        return { status: 'draft', missingSourceGroupIds, reason: `Respuesta conservada como borrador. Falta sustento: ${labels.join('; ')}.` };
      }
      store.answerCheck(reviewId, checkId, answerId);
      if (workspace.getStation(stationId).pendingChecks[checkId]) workspace.setPendingCheck(stationId, checkId, null);
      return { status: 'recorded' };
    } finally { updating = false; }
  }

  function retryPending(): void {
    if (updating) return;
    for (const [checkId, draft] of Object.entries(workspace.getStation(stationId).pendingChecks)) {
      const check = rule.checks.find((item) => item.id === checkId);
      if (!check) continue;
      const refs = currentLinked();
      const complete = check.sourceGroupIds.every((id) => {
        const group = rule.sourceGroups.find((item) => item.id === id)!;
        return refs.some((ref) => group.alternatives.includes(ref.sourceId));
      });
      if (complete) attempt(checkId, draft.answerId, []);
    }
  }

  const unsubscribe = store.subscribePersistence((event) => {
    if (event.change === 'reset') {
      clearTimeout(timer); timer = undefined; pendingNote = null;
      return;
    }
    if (event.status !== 'pending' && event.change === 'source' && event.reviewId === reviewId) retryPending();
  });
  const flush = () => {
    clearTimeout(timer); timer = undefined;
    if (pendingNote !== null) {
      const text = pendingNote; pendingNote = null;
      store.setFreeNote(reviewId, text);
    }
    workspace.flush();
  };
  if (typeof window !== 'undefined') window.addEventListener('pagehide', flush);

  return {
    getAssessment: assessment,
    getPendingCheck: (checkId) => workspace.getStation(stationId).pendingChecks[checkId] ?? null,
    getEvaluation: () => evaluateReview(assessment(), store.state.inspected),
    inspect: (sourceId) => { requireSource(sourceId); store.inspect(sourceId); },
    useSource: (sourceId) => {
      requireSustento(sourceId);
      store.inspect(sourceId); store.pin(reviewId, sourceId);
      retryPending();
    },
    answerCheck: attempt,
    setConclusion: (id) => {
      if (id !== null && !rule.conclusions.some((item) => item.id === id)) throw new Error('Conclusión no admitida.');
      store.setConclusion(reviewId, id);
    },
    toggleLimitation: (id) => {
      if (!rule.limitations.some((item) => item.id === id)) throw new Error('Limitación no admitida.');
      store.toggleLimitation(reviewId, id);
    },
    toggleRequest: (id) => {
      if (!rule.requests.some((item) => item.id === id)) throw new Error('Solicitud no admitida.');
      store.toggleRequest(reviewId, id);
    },
    setFreeNote: (text) => {
      assessment().freeNote = text;
      pendingNote = text;
      store.notifyPending('note', reviewId);
      clearTimeout(timer); timer = setTimeout(flush, 300);
    },
    flush,
    dispose: () => {
      flush(); unsubscribe();
      if (typeof window !== 'undefined') window.removeEventListener('pagehide', flush);
    },
  };
}
