import type { AuditStore } from '../audit/store';
import { evaluateReview } from '../audit/evaluate';
import { reviewRules } from '../audit/rules';
import type { ReviewId, StationId } from '../audit/types';
import { minutesBetween } from '../data/canon';
import { displayCell, getSourceDocument, type SourceDocument } from '../data/documents';
import { stationById } from '../data/stations';
import { sourceName, sourceContext, readableReferences } from '../data/investigation';
import { escapeHtml, icon, refLabel } from './dom';
import { reviewHelpMarkup } from './guidance';

export function sourceDocumentMarkup(document: SourceDocument, reviewId: ReviewId, linked: boolean, showAll = false): string {
  const pertinent = reviewRules[reviewId].sourceGroups.some((group) => group.alternatives.includes(document.id));
  const rows = showAll ? document.rows : document.rows.slice(0, 12);
  return `
    <article class="source-document" data-document="${escapeHtml(document.id)}">
      <div class="document-heading">
        <div>
          <h3>${escapeHtml(sourceName(document.id))}</h3>
          <p class="document-kind">${escapeHtml(document.kindLabel)}</p>
        </div>
      </div>
      <p class="source-summary">${escapeHtml(document.summary)}</p>${document.readingNote ? `<p class="source-reading-note">${escapeHtml(document.readingNote)}</p>` : ''}
      <div class="table-wrap">
        <table>
          <thead><tr>${document.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('')}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.values.map((value) => `<td>${escapeHtml(displayCell(value))}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      ${document.rows.length > 12 ? `<button class="text-button" data-action="toggle-rows">${showAll ? 'Mostrar primeras 12 filas' : `Mostrar las ${document.rows.length} filas`}</button>` : ''}
      <details class="provenance-details">
        <summary>Referencia, procedencia y límites</summary>
        <p><code>${escapeHtml(document.id)}</code> · ${escapeHtml(document.version)}</p>
        <p>${escapeHtml(document.provenanceText)}</p>
        ${document.notes.map((note) => `<p>${escapeHtml(note)}</p>`).join('')}
      </details>
      ${document.queryIds.length ? `<details class="query-card"><summary>Referencias SQL académicas: ${document.queryIds.map(escapeHtml).join(', ')}</summary><p>Las consultas académicas se ejecutaron sobre datos ficticios; sus sentencias y resultados están en los anexos de laboratorio. El juego consulta resúmenes del caso.</p><p>Query Studio permite consultar localmente estos resúmenes. Esa exploración no ejecuta SQL Server ni valida las consultas académicas del plan.</p></details>` : ''}
      ${pertinent ? `<button class="primary-button" data-action="pin-source" data-source="${escapeHtml(document.id)}" ${linked ? 'disabled' : ''}>${linked ? 'Pista guardada en la libreta' : 'Guardar pista en la libreta'}</button>` : '<p class="context-note">Registro de contexto para esta revisión.</p>'}
    </article>`;
}

export class ReviewPanel {
  private selectedSourceId: string | null = null;
  private showAll = false;
  private notice = '';
  private readonly unsubscribe: () => void;

  constructor(
    private readonly dialog: HTMLDialogElement,
    private readonly store: AuditStore,
    private readonly stationId: StationId,
    private readonly onInterview: () => void,
    private readonly onComputer?: () => void,
  ) {
    this.dialog.className = 'app-dialog station-dialog';
    this.dialog.onclick = (event) => this.click(event);
    this.dialog.onchange = (event) => this.change(event);
    this.unsubscribe = store.subscribe(() => this.render());
    this.render();
  }

  openSource(sourceId: string): void {
    if (!stationById(this.stationId).sourceIds.includes(sourceId)) return;
    this.selectedSourceId = sourceId;
    this.showAll = false;
    this.store.inspect(sourceId);
    this.render();
  }

  private render(): void {
    if (!this.dialog.open) return;
    const focusKey = (document.activeElement as HTMLElement | null)?.dataset.focus;
    const station = stationById(this.stationId);
    const rule = reviewRules[station.reviewId];
    const assessment = this.store.state.assessments[station.reviewId];
    const evaluation = evaluateReview(assessment, this.store.state.inspected);
    const selected = this.selectedSourceId ? getSourceDocument(this.selectedSourceId) : null;
    const linked = this.selectedSourceId && assessment.sourceRefs.some((ref) => ref.sourceId === this.selectedSourceId);
    const hintLevel = this.store.state.hintLevels[station.reviewId];
    const attempted = assessment.conclusionId !== null || assessment.checkAnswers.length > 0 || assessment.sourceRefs.length > 0;

    this.dialog.innerHTML = `
      <header class="dialog-header">
        <div>
          <h2>Libreta · ${escapeHtml(rule.title)}</h2>
          <p>Reúne las pistas y decide qué puedes sostener con ellas.</p>
        </div>
        <div class="dialog-header-actions">
          ${this.onComputer ? '<button class="secondary-button" data-action="computer">Volver al ordenador</button>' : ''}
          <span class="status status-${evaluation.status === 'Documentado' ? 'done' : 'pending'}" data-review-status="${station.reviewId}">${evaluation.status}</span>
          <button class="icon-button" data-action="close" aria-label="Cerrar estación">${icon('close')}</button>
        </div>
      </header>
      <div class="station-layout">
        <aside class="source-index" aria-label="Fuentes de la estación">
          <h3>Fuentes y contexto</h3>
          <p>Abre los documentos para consultarlos mientras elaboras tu conclusión.</p>
          <div class="source-list">
            ${station.sourceIds.map((sourceId) => {
              const inspected = this.store.state.inspected.some((ref) => ref.sourceId === sourceId);
              return `<button class="source-link ${this.selectedSourceId === sourceId ? 'selected' : ''}" data-action="select-source" data-source="${sourceId}" data-focus="source-${sourceId}">
                <span><strong>${escapeHtml(sourceName(sourceId))}</strong>${escapeHtml(sourceContext(sourceId))}</span>
                <span class="inspection-label">${inspected ? 'Consultada' : 'Abrir documento'}</span>
              </button>`;
            }).join('')}
          </div>
          <button class="secondary-button interview-shortcut" data-action="interview">Entrevistar al enlace de TI</button>
        </aside>
        <section class="document-pane" aria-label="Documento seleccionado">
          ${selected ? sourceDocumentMarkup(selected, station.reviewId, Boolean(linked), this.showAll) : `
            <div class="empty-state">
              ${icon('clipboard')}
              <h3>Selecciona una fuente</h3>
              <p>El documento se abrirá aquí con su procedencia. Después podrás vincularlo sin copiar identificadores a mano.</p>
            </div>`}
        </section>
        <section class="review-pane" aria-label="${station.reviewId}: ${escapeHtml(rule.title)}">
          <div class="review-title">
            <h3>${escapeHtml(rule.title)}</h3>
            <p>${escapeHtml(rule.question)}</p>
          </div>
          ${reviewHelpMarkup(station.reviewId)}
          <div class="review-progress"><span>${evaluation.gatheredGroups}/${evaluation.totalGroups} grupos de fuentes</span><strong>${evaluation.status}</strong></div>
          ${this.reviewForm(station.reviewId)}
          ${attempted && evaluation.missingReasons.length ? `<details class="pending-details" ${assessment.checkAnswers.length || assessment.conclusionId ? 'open' : ''}><summary>Qué falta para documentar</summary><ul>${evaluation.missingReasons.map((reason) => `<li>${escapeHtml(rule.checks.reduce((text, check) => text.replaceAll(check.id, `«${check.question}»`), reason))}</li>`).join('')}</ul></details>` : ''}
          ${evaluation.isDocumented ? '<p class="documented-note">Actividad documentada con sustento. No es un hallazgo académico aprobado automáticamente.</p>' : ''}
          <div class="hint-block">
            <button class="text-button" data-action="hint" ${hintLevel >= 2 ? 'disabled' : ''}>${hintLevel ? 'Ver pista siguiente' : 'Necesito una pista'}</button>
            ${rule.hints.slice(0, hintLevel).map((hint) => `<p>${escapeHtml(readableReferences(rule.checks.reduce((text, check) => text.replaceAll(check.id, 'el contraste de las fuentes'), hint)))}</p>`).join('')}
          </div>
          <details class="save-note"><summary>Referencias técnicas de esta revisión</summary><p>${station.reviewId} · ${escapeHtml(assessment.rulesVersion)}</p></details>
        </section>
      </div>
      ${this.notice ? `<div class="panel-notice" role="alert">${escapeHtml(this.notice)}</div>` : ''}`;
    if (focusKey) this.dialog.querySelector<HTMLElement>(`[data-focus="${focusKey}"]`)?.focus();
  }

  private reviewForm(reviewId: ReviewId): string {
    const rule = reviewRules[reviewId];
    const assessment = this.store.state.assessments[reviewId];
    const calculations = reviewId === 'AU-03'
      ? `Cálculo local sobre horas reportadas: ${minutesBetween('EVT-06', 'EVT-07')} minutos entre 02:42 y 03:02.`
      : reviewId === 'AU-04'
        ? `Cálculo local sobre horas reportadas: ${minutesBetween('EVT-02', 'EVT-08')} minutos entre acceso y alerta.`
        : reviewId === 'AU-05'
          ? `Cálculos locales: ${minutesBetween('EVT-09', 'EVT-11')} min hasta solo consulta; ${minutesBetween('EVT-09', 'EVT-12')} min hasta escritura. No prueban integridad ni cumplimiento de objetivos de recuperación.`
          : '';
    return `
      <section class="review-section">
        <h4>Lo observado</h4>
        ${assessment.sourceRefs.length ? `<ul class="linked-sources">${assessment.sourceRefs.map((ref) => `
          <li><span title="${escapeHtml(refLabel(ref))}">${escapeHtml(sourceName(ref.sourceId))}</span><button class="text-button danger-text" data-action="unpin" data-source="${ref.sourceId}" aria-label="Retirar ${escapeHtml(sourceName(ref.sourceId))}">Retirar</button></li>`).join('')}</ul>` : '<p>Aún no has guardado pistas para este asunto. Puedes recogerlas en el ordenador o consultar los documentos de la izquierda.</p>'}
      </section>
      <section class="review-section">
        <h4>Con qué lo comparo</h4>
        ${calculations ? `<p class="calculation-note">${escapeHtml(calculations)}</p>` : ''}
        ${rule.checks.map((check) => {
          const saved = assessment.checkAnswers.find((answer) => answer.checkId === check.id);
          return `<fieldset class="check-fieldset"><legend>${escapeHtml(check.question)}</legend>
            ${check.options.map((option) => `<label class="radio-option"><input type="radio" name="${check.id}" value="${option.id}" ${saved?.answerId === option.id ? 'checked' : ''} /> <span>${escapeHtml(option.text)}</span></label>`).join('')}
            <button class="secondary-button" data-action="save-check" data-check="${check.id}">Registrar este contraste</button>
            ${saved ? `<p class="check-source-note">Sustento: ${saved.sourceRefs.map((ref) => escapeHtml(sourceName(ref.sourceId))).join(', ')}</p>` : ''}
          </fieldset>`;
        }).join('')}
      </section>
      <section class="review-section">
        <h4>Qué puedo afirmar</h4>
        <fieldset><legend class="sr-only">Conclusión estructurada</legend>
          ${rule.conclusions.map((conclusion) => `<label class="radio-option"><input type="radio" name="conclusion" value="${conclusion.id}" data-focus="conclusion-${conclusion.id}" ${assessment.conclusionId === conclusion.id ? 'checked' : ''} /> <span>${escapeHtml(conclusion.text)}</span></label>`).join('')}
        </fieldset>
      </section>
      <section class="review-section">
        <h4>Qué falta</h4>
        <fieldset><legend>Limitaciones que debe conservar la conclusión</legend>
          ${rule.limitations.map((limitation) => `<label class="check-option"><input type="checkbox" data-limitation="${limitation.id}" ${assessment.limitationIds.includes(limitation.id) ? 'checked' : ''} /> <span>${escapeHtml(limitation.text)}</span></label>`).join('')}
        </fieldset>
        <fieldset><legend>Solicitudes de soporte</legend>
          ${rule.requests.map((request) => `<label class="check-option"><input type="checkbox" data-request="${request.id}" ${assessment.requestIds.includes(request.id) ? 'checked' : ''} /> <span>${escapeHtml(request.text)}</span></label>`).join('')}
        </fieldset>
        <p class="context-note">Registrar la solicitud basta; el documento ausente no tiene que llegar para cerrar esta actividad.</p>
        <label class="free-note-label" for="free-note">Anotación personal: sin evaluación automática</label>
        <textarea id="free-note" rows="3" maxlength="2000" placeholder="Comentario opcional; no sustituye fuentes ni respuestas.">${escapeHtml(assessment.freeNote)}</textarea>
      </section>`;
  }

  private click(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    this.notice = '';
    try {
      if (action === 'close') this.dialog.close();
      if (action === 'interview') this.onInterview();
      if (action === 'computer') this.onComputer?.();
      if (action === 'select-source' && button.dataset.source) this.openSource(button.dataset.source);
      if (action === 'toggle-rows') { this.showAll = !this.showAll; this.render(); }
      if (action === 'pin-source' && button.dataset.source) this.store.pin(stationById(this.stationId).reviewId, button.dataset.source);
      if (action === 'unpin' && button.dataset.source) {
        const assessment = this.store.state.assessments[stationById(this.stationId).reviewId];
        const ref = assessment.sourceRefs.find((item) => item.sourceId === button.dataset.source);
        if (ref) this.store.unpin(assessment.reviewId, ref);
      }
      if (action === 'save-check' && button.dataset.check) {
        const reviewId = stationById(this.stationId).reviewId;
        const selected = this.dialog.querySelector<HTMLInputElement>(`input[name="${button.dataset.check}"]:checked`);
        if (!selected) throw new Error('Selecciona una respuesta antes de guardar la comprobación.');
        this.store.answerCheck(reviewId, button.dataset.check, selected.value);
      }
      if (action === 'hint') this.store.requestHint(stationById(this.stationId).reviewId);
    } catch (error) {
      this.notice = error instanceof Error ? error.message : 'No se pudo completar la acción.';
      this.render();
    }
  }

  private change(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const reviewId = stationById(this.stationId).reviewId;
    if (input instanceof HTMLInputElement && input.name === 'conclusion') this.store.setConclusion(reviewId, input.value);
    if (input instanceof HTMLInputElement && input.dataset.limitation) this.store.toggleLimitation(reviewId, input.dataset.limitation);
    if (input instanceof HTMLInputElement && input.dataset.request) this.store.toggleRequest(reviewId, input.dataset.request);
    if (input instanceof HTMLTextAreaElement && input.id === 'free-note') this.store.setFreeNote(reviewId, input.value);
  }

  dispose(): void {
    this.unsubscribe();
  }
}
