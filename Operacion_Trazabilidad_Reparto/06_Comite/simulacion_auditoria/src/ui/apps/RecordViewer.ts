import { eventById } from '../../data/canon';
import { displayCell, getSourceDocument } from '../../data/documents';
import { sourceContext, sourceName } from '../../data/investigation';
import { availableSources, h, isLinked, isPertinent, showError, type SharedContext } from './utils';

export function recordViewerMarkup(context: SharedContext, id: string): string {
  if (!availableSources(context.stationId, context.store.state).includes(id)) return '<p class="pc-app-empty">Este registro no está disponible en el material del puesto.</p>';
  const source = getSourceDocument(id);
  if (!source) return '<p class="pc-app-empty">No se encontró el registro. Selecciona otra fuente del expediente.</p>';
  const linked = isLinked(context.review.getAssessment(), context.store.state, id);
  const compared = context.workspace.getComparison().includes(id);
  const account = eventById(id)?.account;
  const canFollowAccount = account && ['session-viewer', 'query-studio', 'event-desk'].includes(context.appId);
  return `<article class="pc-app-document" data-document="${h(id)}">
    <header><h3>${h(sourceName(id))}</h3><button type="button" data-pc-viewer="close" aria-label="Cerrar detalle del registro">Cerrar detalle</button></header>
    <p class="pc-app-context">${h(id)} · ${h(sourceContext(id))}</p><p>${h(source.summary)}</p>
    <div class="pc-app-toolbar">
      ${isPertinent(context.reviewId, id) ? `<button type="button" data-pc-viewer="use" ${linked ? 'disabled' : ''}>${linked ? 'Vinculada a la revisión' : 'Usar como sustento'}</button>` : '<span>Registro de contexto del puesto</span>'}
      <button type="button" data-pc-viewer="compare" aria-pressed="${compared}">${compared ? 'Retirar de comparación' : 'Comparar registro'}</button>
      ${canFollowAccount ? `<button type="button" data-pc-viewer="follow-account" data-pc-account="${h(account)}">Buscar más actividad de ${h(account)}</button>` : ''}
    </div>
    <div class="pc-app-table-wrap"><table><thead><tr>${source.columns.map((column) => `<th scope="col">${h(column)}</th>`).join('')}</tr></thead>
    <tbody>${source.rows.map((row) => `<tr>${row.values.map((value) => `<td>${h(displayCell(value))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <details><summary>Referencia, procedencia y límites</summary><p>${h(source.version)} · ${h(source.kindLabel)}</p><p>${h(source.provenanceText)}</p>${source.notes.map((note) => `<p>${h(note)}</p>`).join('')}
    ${source.queryIds.length ? `<p>Referencias previstas: ${source.queryIds.map(h).join(', ')}. No son consultas ejecutadas en SQL Server.</p>` : ''}</details>
  </article>`;
}

export function toggleComparison(context: SharedContext, id: string): void {
  const current = context.workspace.getComparison();
  if (current.includes(id)) { context.workspace.setComparison(current.filter((item) => item !== id)); return; }
  if (isPertinent(context.reviewId, id)) context.review.useSource(id);
  else context.review.inspect(id);
  context.workspace.setComparison([...current.slice(-1), id]);
}

export class RecordViewer {
  private readonly controller = new AbortController();
  private readonly unsubscribes: (() => void)[];
  private signature = '';
  private renderedSourceId: string | null = null;
  private readonly document: HTMLElement;
  private readonly error: HTMLElement;

  constructor(private readonly root: HTMLElement, private readonly context: SharedContext, private readonly selected: () => string | null, private readonly select: (id: string | null) => void) {
    root.innerHTML = '<div data-pc-viewer-document></div><p class="pc-app-error" role="alert" hidden></p>';
    this.document = root.querySelector<HTMLElement>('[data-pc-viewer-document]')!;
    this.error = root.querySelector<HTMLElement>('[role="alert"]')!;
    root.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('[data-pc-viewer]');
      if (!button || !root.contains(button)) return;
      try {
        this.error.hidden = true;
        const id = this.selected();
        if (button.dataset.pcViewer === 'close') this.select(null);
        if (id && button.dataset.pcViewer === 'use') context.review.useSource(id);
        if (id && button.dataset.pcViewer === 'compare') toggleComparison(context, id);
        this.refresh();
      } catch (error) { showError(this.error, error); }
    }, { signal: this.controller.signal });
    this.unsubscribes = [context.store.subscribe(() => this.refresh()), context.workspace.subscribe(() => this.refresh())];
    this.refresh();
  }

  open(id: string): void {
    this.context.review.inspect(id);
    this.select(id);
    this.refresh();
  }

  refresh(): void {
    const id = this.selected();
    const markup = id ? recordViewerMarkup(this.context, id) : '<p class="pc-app-empty">Abre un registro para consultar su detalle y procedencia.</p>';
    if (markup === this.signature) return;
    this.signature = markup;
    const previousSourceId = this.renderedSourceId;
    this.renderedSourceId = id;
    const active = this.root.ownerDocument.activeElement;
    const focusedAction = active instanceof HTMLElement && this.document.contains(active) ? active.dataset.pcViewer : null;
    const focusedSummary = active instanceof HTMLElement && this.document.contains(active) && active.matches('summary')
      ? [...this.document.querySelectorAll('summary')].indexOf(active) : -1;
    const previousTop = this.root.scrollTop;
    const opened = [...this.document.querySelectorAll('details')].map((element) => element.open);
    this.document.innerHTML = markup;
    [...this.document.querySelectorAll('details')].forEach((element, index) => { element.open = opened[index] ?? false; });
    if (focusedAction) {
      const equivalent = [...this.document.querySelectorAll<HTMLButtonElement>('[data-pc-viewer]')]
        .find((button) => button.dataset.pcViewer === focusedAction && !button.disabled);
      const fallback = this.document.querySelector<HTMLButtonElement>('[data-pc-viewer="compare"]:not(:disabled)')
        ?? this.document.querySelector<HTMLButtonElement>('[data-pc-viewer="close"]:not(:disabled)');
      if (equivalent ?? fallback) (equivalent ?? fallback)!.focus({ preventScroll: true });
      else this.focusOrigin(previousSourceId);
    } else if (focusedSummary >= 0) {
      const summary = this.document.querySelectorAll<HTMLElement>('summary')[focusedSummary];
      if (summary) summary.focus({ preventScroll: true });
      else this.focusOrigin(previousSourceId);
    }
    this.root.scrollTop = previousTop;
  }

  private focusOrigin(sourceId: string | null): void {
    const app = this.root.closest<HTMLElement>('.pc-app');
    if (!app) return;
    const source = [...app.querySelectorAll<HTMLButtonElement>('[data-pc-open]')]
      .find((button) => button.dataset.pcOpen === sourceId && !button.disabled);
    const fallback = app.querySelector<HTMLElement>('input[type="search"]')
      ?? app.querySelector<HTMLElement>('.pc-app-sql') ?? app.querySelector<HTMLElement>('button:not(:disabled)');
    (source ?? fallback)?.focus({ preventScroll: true });
  }

  dispose(): void { this.controller.abort(); this.unsubscribes.forEach((unsubscribe) => unsubscribe()); }
}
