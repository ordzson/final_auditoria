import { currentSourceVersion, sameSourceRef } from '../../audit/evaluate';
import { reviewRules } from '../../audit/rules';
import type { Assessment, GameState, ReviewId, StationId } from '../../audit/types';
import type { AppId, ApplicationContext, MountedApplication } from '../../computer/types';
import { availableComputerSources } from '../../data/computers';
import { computerAssets, computerIcons, type ComputerIconKey } from '../../data/computerAssets';
import { getSourceDocument } from '../../data/documents';
import { sourceContext, sourceName } from '../../data/investigation';
import { escapeHtml } from '../dom';
import './apps.css';

export const h = escapeHtml;
export type SharedContext = Pick<ApplicationContext<AppId>, 'stationId' | 'reviewId' | 'appId' | 'store' | 'review' | 'navigation'> & {
  workspace: Pick<ApplicationContext<AppId>['workspace'], 'getComparison' | 'setComparison' | 'subscribe'>;
};

export function availableSources(stationId: StationId, state: GameState): string[] {
  return availableComputerSources(stationId, state);
}

export function isLinked(assessment: Readonly<Assessment>, state: GameState, sourceId: string): boolean {
  return assessment.sourceRefs.some((ref) => ref.sourceId === sourceId
    && ref.sourceVersion === currentSourceVersion(sourceId)
    && state.inspected.some((item) => sameSourceRef(item, ref)));
}

export function isPertinent(reviewId: ReviewId, sourceId: string): boolean {
  return reviewRules[reviewId].sourceGroups.some((group) => group.alternatives.includes(sourceId));
}

export function appIcon(stationId: StationId, key: ComputerIconKey): string {
  const family = computerAssets.stations[stationId].theme === 'server-classic' ? computerIcons.classic : computerIcons.xp;
  const item = (family as Partial<typeof computerIcons.xp>)[key] ?? family.document;
  return `<img class="pc-app-icon" src="${h(item.sizes[16])}" width="16" height="16" alt="">`;
}

export function recordListMarkup(ids: readonly string[], selectedId: string | null): string {
  return ids.map((id) => `<tr${selectedId === id ? ' class="pc-app-selected"' : ''}>
    <td><button type="button" class="pc-app-record-link" data-pc-open="${h(id)}">${h(sourceName(id))}</button><small>${h(id)} · ${h(sourceContext(id))}</small></td>
    <td>${h(getSourceDocument(id)?.summary ?? '')}</td>
  </tr>`).join('');
}

// Listeners, subscriptions and scroll positions belong to this mounted instance.
export class AppLifetime<A extends AppId> implements MountedApplication {
  readonly controller = new AbortController();
  private readonly cleanup: (() => void)[] = [];
  private disposed = false;

  constructor(readonly root: HTMLElement, readonly context: ApplicationContext<A>, private readonly focusSelector: string) {
    root.addEventListener('scroll', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.dataset.pcScroll) return;
      this.captureScroll(target);
    }, { capture: true, signal: this.controller.signal });
  }

  addCleanup(callback: () => void): void { this.cleanup.push(callback); }

  restoreScroll(): void {
    const positions = this.context.workspace.getDraft().scroll;
    for (const element of this.root.querySelectorAll<HTMLElement>('[data-pc-scroll]')) {
      const point = positions[element.dataset.pcScroll!];
      if (point) { element.scrollTop = point.y; element.scrollLeft = point.x; }
    }
  }

  private captureScroll(element: HTMLElement): void {
    const key = element.dataset.pcScroll!;
    const current = this.context.workspace.getDraft().scroll;
    const point = { x: element.scrollLeft, y: element.scrollTop };
    if (current[key]?.x === point.x && current[key]?.y === point.y) return;
    this.context.workspace.patchDraft({ scroll: { ...current, [key]: point } } as Partial<import('../../computer/types').AppDrafts[A]>);
  }

  focus(): void { this.root.querySelector<HTMLElement>(this.focusSelector)?.focus({ preventScroll: true }); }

  flush(): void {
    if (this.disposed) return;
    for (const element of this.root.querySelectorAll<HTMLElement>('[data-pc-scroll]')) this.captureScroll(element);
    this.context.review.flush();
    this.context.workspace.flush();
  }

  dispose(): void {
    if (this.disposed) return;
    this.flush();
    this.disposed = true;
    this.controller.abort();
    for (const callback of this.cleanup.splice(0)) callback();
    this.root.replaceChildren();
  }
}

export function showError(element: HTMLElement, error: unknown): void {
  element.hidden = false;
  element.textContent = error instanceof Error ? error.message : 'No se pudo completar la acción. Revisa las fuentes disponibles.';
}

export function navigate<A extends AppId>(lifetime: AppLifetime<A>, action: 'report' | 'interview' | 'notebook'): void {
  lifetime.flush();
  if (action === 'report') lifetime.context.navigation.openApp('station-report');
  if (action === 'interview') lifetime.context.navigation.openInterview();
  if (action === 'notebook') lifetime.context.navigation.openNotebook();
}
