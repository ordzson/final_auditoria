import type { AuditStore } from '../audit/store';
import type { ReviewId } from '../audit/types';
import { getSourceDocument } from '../data/documents';
import { stationForReview } from '../data/stations';
import { escapeHtml, icon } from './dom';
import { sourceDocumentMarkup } from './ReviewPanel';

export class SourcePanel {
  private readonly unsubscribe: () => void;
  private notice = '';

  constructor(
    private readonly dialog: HTMLDialogElement,
    private readonly store: AuditStore,
    private readonly sourceId: string,
    private readonly reviewId: ReviewId,
    private readonly onContrast: (reviewId: ReviewId) => void,
    private readonly onReturnInterview: () => void,
  ) {
    this.dialog.className = 'app-dialog source-dialog';
    this.dialog.onclick = (event) => this.click(event);
    this.unsubscribe = store.subscribe(() => this.render());
    this.render();
  }

  private render(): void {
    if (!this.dialog.open) return;
    const source = getSourceDocument(this.sourceId);
    if (!source) return;
    const linked = this.store.state.assessments[this.reviewId].sourceRefs.some((ref) => ref.sourceId === this.sourceId);
    this.dialog.innerHTML = `
      <header class="dialog-header">
        <div><h2>Documento facilitado por el enlace</h2><p>Guarda la pista y vuelve al ordenador para contrastarla.</p></div>
        <button class="icon-button" data-action="close" aria-label="Cerrar documento">${icon('close')}</button>
      </header>
      <div class="standalone-document">
        ${sourceDocumentMarkup(source, this.reviewId, linked)}
        <button class="secondary-button" data-action="contrast">Contrastar en ${stationForReview(this.reviewId).short} · ${escapeHtml(stationForReview(this.reviewId).title)}</button>
        <button class="secondary-button" data-action="return-interview">Volver a la conversación</button>
      </div>
      ${this.notice ? `<div class="panel-notice" role="alert">${escapeHtml(this.notice)}</div>` : ''}`;
  }

  private click(event: MouseEvent): void {
    const action = (event.target as HTMLElement).closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action === 'close') this.dialog.close();
    if (action === 'contrast') this.onContrast(this.reviewId);
    if (action === 'return-interview') this.onReturnInterview();
    if (action === 'pin-source') {
      try { this.store.pin(this.reviewId, this.sourceId); }
      catch (error) {
        this.notice = error instanceof Error ? error.message : 'No se pudo vincular.';
        this.render();
      }
    }
  }

  dispose(): void {
    this.unsubscribe();
  }
}
