import { documentedCount, evaluateReview } from '../audit/evaluate';
import { reviewRules, reviewIds } from '../audit/rules';
import type { AuditStore } from '../audit/store';
import type { Recommendation, ReviewId } from '../audit/types';
import { stationForReview } from '../data/stations';
import { sourceName } from '../data/investigation';
import { downloadNotebook, printNotebook } from '../export/report';
import { escapeHtml, icon } from './dom';

const recommendationSuggestions: Record<ReviewId, string> = {
  'AU-01': 'Aplicar MFA y recertificar accesos; comprobar una muestra de sesiones y titularidad autorizada.',
  'AU-02': 'Conservar flujo, proceso y contenido con correlación verificable; repetir el contraste sobre copias preservadas.',
  'AU-03': 'Conciliar órdenes y formalizar cambios; reproducir diferencias y revisar aprobación y trazabilidad.',
  'AU-04': 'Documentar asignación, primera acción, escalamiento y cierre; probar el procedimiento con una alerta controlada.',
  'AU-05': 'Realizar restauraciones controladas y aprobar RTO/RPO; verificar integridad, tiempos y conciliación.',
  'AU-06': 'Preservar originales, custodia, hashes y sincronización; volver a calcular hashes y comparar horas originales.',
};

export class Notebook {
  private readonly unsubscribe: () => void;
  private resetPending = false;

  constructor(
    private readonly dialog: HTMLDialogElement,
    private readonly store: AuditStore,
    private readonly onOpenReview: (reviewId: ReviewId) => void,
    private readonly onNavigate: (reviewId: ReviewId) => void,
    private readonly onReset: () => void,
  ) {
    this.dialog.className = 'app-dialog notebook-dialog';
    this.dialog.onclick = (event) => this.click(event);
    this.dialog.onchange = (event) => this.change(event);
    this.unsubscribe = store.subscribe(() => this.render());
    this.render();
  }

  private render(): void {
    if (!this.dialog.open) return;
    const closingWasOpen = this.dialog.querySelector<HTMLDetailsElement>('.closing-section')?.open ?? false;
    const count = documentedCount(this.store.state.assessments, this.store.state.inspected);
    this.dialog.innerHTML = `
      <header class="dialog-header notebook-header">
        <div><h2>Tablita de auditoría</h2><p>Lo que encontraste, lo que puedes sostener y las preguntas que quedan abiertas.</p></div>
        <div class="dialog-header-actions"><strong>${count} / 6 documentadas</strong><button class="icon-button" data-action="close" aria-label="Bajar la tablita">${icon('close')}</button></div>
      </header>
      <div class="notebook-body">
        <div class="table-wrap notebook-table-wrap">
          <table class="notebook-table">
            <thead><tr><th>Asunto</th><th>Fuentes vinculadas</th><th>Comprobación</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>${reviewIds.map((reviewId) => this.row(reviewId)).join('')}</tbody>
          </table>
        </div>
        <p class="notebook-boundary">«Documentado» acredita la actividad educativa dentro del expediente, no un hallazgo formal, una causa o un culpable.</p>
        <details class="closing-section" ${closingWasOpen ? 'open' : ''}>
          <summary>Cierre, recomendaciones y exportación</summary>
          <p>Las recomendaciones y sus pruebas de cierre son editables y no se califican por significado. No completan ni sustituyen las revisiones.</p>
          <div class="recommendation-list">
            ${reviewIds.map((reviewId) => this.recommendation(reviewId)).join('')}
          </div>
          <div class="export-actions">
            <button class="primary-button" data-action="export">${icon('download')} Exportar libreta JSON</button>
            <button class="secondary-button" data-action="print">${icon('print')} Imprimir o guardar PDF</button>
          </div>
        </details>
        <div class="notebook-footer"><button class="secondary-button" data-action="close">Seguir explorando</button><button class="text-button danger-text" data-action="reset" aria-expanded="${this.resetPending}">Reiniciar partida y borrar guardado</button></div>
        ${this.resetPending ? `<section class="reset-confirmation" aria-labelledby="reset-title">
          <h3 id="reset-title">¿Reiniciar la partida?</h3>
          <p>Se borrarán fuentes, conclusiones, recomendaciones y posición guardada.</p>
          <div class="export-actions"><button class="secondary-button" data-action="cancel-reset">Conservar mi partida</button><button class="primary-button" data-action="confirm-reset">Borrar guardado y reiniciar</button></div>
        </section>` : ''}
      </div>`;
  }

  private row(reviewId: ReviewId): string {
    const assessment = this.store.state.assessments[reviewId];
    const evaluation = evaluateReview(assessment, this.store.state.inspected);
    const station = stationForReview(reviewId);
    return `<tr data-notebook-row="${reviewId}">
      <td><strong title="${reviewId}">${escapeHtml(reviewRules[reviewId].title)}</strong><br><small>${escapeHtml(reviewRules[reviewId].question)}</small></td>
      <td>${assessment.sourceRefs.length ? assessment.sourceRefs.map((ref) => `<span title="${ref.sourceId}">${escapeHtml(sourceName(ref.sourceId))}</span>`).join(', ') : 'Todavía sin pistas guardadas'}<br><small>${evaluation.gatheredGroups}/${evaluation.totalGroups} grupos de sustento</small></td>
      <td>${assessment.checkAnswers.length}/${reviewRules[reviewId].checks.length} registradas</td>
      <td><span class="status status-${evaluation.isDocumented ? 'done' : 'pending'}">${evaluation.isDocumented ? icon('check') : '<span class="empty-check" aria-hidden="true"></span>'}${evaluation.status}</span></td>
      <td><button class="text-button" data-action="open-review" data-review="${reviewId}">Abrir revisión</button><button class="text-button" data-action="navigate" data-review="${reviewId}">Situarme en ${station.short}</button></td>
    </tr>`;
  }

  private recommendation(reviewId: ReviewId): string {
    const recommendation = this.store.state.recommendations[reviewId];
    return `<fieldset class="recommendation-card"><legend>${escapeHtml(reviewRules[reviewId].title)}</legend>
      <label>Recomendación<input list="suggestion-${reviewId}" data-review="${reviewId}" data-field="action" value="${escapeHtml(recommendation.action)}" placeholder="Acción concreta opcional" /></label>
      <datalist id="suggestion-${reviewId}"><option value="${escapeHtml(recommendationSuggestions[reviewId])}"></option></datalist>
      <label>Responsable<input data-review="${reviewId}" data-field="owner" value="${escapeHtml(recommendation.owner)}" placeholder="Rol responsable" /></label>
      <label>Prueba de cierre<input data-review="${reviewId}" data-field="verification" value="${escapeHtml(recommendation.verification)}" placeholder="Cómo se verificaría" /></label>
    </fieldset>`;
  }

  private click(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'close') this.dialog.close();
    if (action === 'open-review' && button.dataset.review) this.onOpenReview(button.dataset.review as ReviewId);
    if (action === 'navigate' && button.dataset.review) this.onNavigate(button.dataset.review as ReviewId);
    if (action === 'export') downloadNotebook(this.store);
    if (action === 'print') printNotebook(this.store);
    if (action === 'reset' || action === 'cancel-reset') {
      this.resetPending = action === 'reset';
      this.render();
      this.dialog.querySelector<HTMLButtonElement>(this.resetPending ? '[data-action="cancel-reset"]' : '[data-action="reset"]')?.focus();
    }
    if (action === 'confirm-reset' && this.resetPending) this.onReset();
  }

  private change(event: Event): void {
    const input = event.target as HTMLInputElement;
    const reviewId = input.dataset.review as ReviewId | undefined;
    const field = input.dataset.field as keyof Recommendation | undefined;
    if (reviewId && field) this.store.setRecommendation(reviewId, { [field]: input.value });
  }

  dispose(): void {
    this.unsubscribe();
  }
}
