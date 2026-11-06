import { currentSourceVersion, sameSourceRef } from '../../audit/evaluate';
import { reviewRules, type CheckRule } from '../../audit/rules';
import { eventById } from '../../data/canon';
import { getSourceDocument } from '../../data/documents';
import { sourceContext, sourceName } from '../../data/investigation';
import { availableSources, h, isLinked, isPertinent, showError, type SharedContext } from './utils';

export function comparisonMarkup(context: SharedContext): string {
  const available = availableSources(context.stationId, context.store.state);
  const ids = context.workspace.getComparison().filter((id) => available.includes(id));
  if (!ids.length) return '<p class="pc-app-empty">Elige «Comparar registro» en dos fuentes. La mesa se comparte con los otros programas de esta PC.</p>';
  const events = ids.map(eventById);
  const difference = events.length === 2 && events.every(Boolean)
    ? Math.round(Math.abs(Date.parse(events[1]!.reportedAt) - Date.parse(events[0]!.reportedAt)) / 60000) : null;
  return `<div class="pc-app-comparison-records">${ids.map((id) => `<article><h4>${h(sourceName(id))}</h4><p class="pc-app-context">${h(id)} · ${h(sourceContext(id))}</p><p>${h(getSourceDocument(id)?.summary ?? '')}</p><button type="button" data-pc-remove-comparison="${h(id)}">Retirar de la mesa</button></article>`).join('')}</div>
    ${ids.length === 1 ? '<p>Falta un segundo registro para comparar.</p>' : `<p>${difference === null ? 'Compara el alcance, la procedencia y los campos ausentes de cada fuente.' : `${difference} minutos entre las horas reportadas. Los desfases de los relojes no están verificados; la cercanía temporal no demuestra causalidad.`}</p>`}`;
}

export function hasValidRecordedCheck(context: SharedContext, check: CheckRule): boolean {
  const assessment = context.review.getAssessment();
  const answer = assessment.checkAnswers.find((item) => item.checkId === check.id);
  if (!answer || !check.options.some((option) => option.id === answer.answerId)) return false;
  return reviewRules[context.reviewId].sourceGroups.filter((group) => check.sourceGroupIds.includes(group.id)).every((group) =>
    answer.sourceRefs.some((ref) => group.alternatives.includes(ref.sourceId)
      && ref.sourceVersion === currentSourceVersion(ref.sourceId)
      && context.store.state.inspected.some((item) => sameSourceRef(item, ref))
      && assessment.sourceRefs.some((item) => sameSourceRef(item, ref))));
}

export function checkSourceIds(context: SharedContext): string[] {
  const assessment = context.review.getAssessment();
  return [...new Set([...assessment.sourceRefs.map((ref) => ref.sourceId), ...context.workspace.getComparison()])]
    .filter((id) => isPertinent(context.reviewId, id));
}

export class RecordComparison {
  private readonly controller = new AbortController();
  private readonly unsubscribes: (() => void)[];
  private readonly records: HTMLElement;
  private readonly error: HTMLElement;
  private recordsSignature = '';

  constructor(root: HTMLElement, private readonly context: SharedContext, prefix: string) {
    const rule = reviewRules[context.reviewId];
    root.innerHTML = `<section class="pc-app-comparison" aria-label="Mesa de comparación"><h3>Comparar registros</h3><div data-pc-comparison-records></div></section>
      <section class="pc-app-checks" aria-label="Contrastes del puesto"><h3>Registrar un contraste</h3><p>La respuesta se incorpora a la libreta cuando dispone de sus fuentes. Si faltan, se conserva como borrador.</p>
      ${rule.checks.map((check) => `<fieldset><legend>${h(check.question)}</legend><label for="${h(prefix)}-${h(check.id)}">Mi respuesta</label><select id="${h(prefix)}-${h(check.id)}" data-pc-check="${h(check.id)}"><option value="">Selecciona una respuesta…</option>${check.options.map((option) => `<option value="${h(option.id)}">${h(option.text)}</option>`).join('')}</select><p class="pc-app-check-status" data-pc-check-status="${h(check.id)}" role="status"></p></fieldset>`).join('')}
      <button type="button" data-pc-comparison-report>Continuar en Informe del puesto</button></section><p class="pc-app-error" role="alert" hidden></p>`;
    this.records = root.querySelector<HTMLElement>('[data-pc-comparison-records]')!;
    this.error = root.querySelector<HTMLElement>('[role="alert"]')!;
    root.addEventListener('change', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLSelectElement) || !input.dataset.pcCheck || !input.value) return;
      try {
        this.error.hidden = true;
        context.review.answerCheck(input.dataset.pcCheck, input.value, checkSourceIds(context));
        this.refresh(root);
      } catch (error) { showError(this.error, error); }
    }, { signal: this.controller.signal });
    root.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('button');
      if (!button || !root.contains(button)) return;
      if (button.dataset.pcRemoveComparison) context.workspace.setComparison(context.workspace.getComparison().filter((id) => id !== button.dataset.pcRemoveComparison));
      if (button.hasAttribute('data-pc-comparison-report')) { context.review.flush(); context.navigation.openApp('station-report'); }
    }, { signal: this.controller.signal });
    this.unsubscribes = [context.store.subscribe(() => this.refresh(root)), context.workspace.subscribe(() => this.refresh(root))];
    this.refresh(root);
  }

  private refresh(root: HTMLElement): void {
    const markup = comparisonMarkup(this.context);
    if (markup !== this.recordsSignature) {
      const active = root.ownerDocument.activeElement;
      const focusedSource = active instanceof HTMLElement && this.records.contains(active) ? active.dataset.pcRemoveComparison : null;
      this.recordsSignature = markup; this.records.innerHTML = markup;
      if (focusedSource) {
        const replacement = [...this.records.querySelectorAll<HTMLButtonElement>('[data-pc-remove-comparison]')]
          .find((button) => button.dataset.pcRemoveComparison === focusedSource);
        const fallback = this.records.querySelector<HTMLButtonElement>('[data-pc-remove-comparison]') ?? root.querySelector<HTMLSelectElement>('[data-pc-check]');
        (replacement ?? fallback)?.focus({ preventScroll: true });
      }
    }
    const rule = reviewRules[this.context.reviewId];
    const assessment = this.context.review.getAssessment();
    for (const check of rule.checks) {
      const pending = this.context.review.getPendingCheck(check.id);
      const answer = assessment.checkAnswers.find((item) => item.checkId === check.id);
      const input = root.querySelector<HTMLSelectElement>(`[data-pc-check="${check.id}"]`)!;
      const value = pending?.answerId ?? answer?.answerId ?? '';
      if (input.value !== value) input.value = value;
      const status = root.querySelector<HTMLElement>(`[data-pc-check-status="${check.id}"]`)!;
      const missing = rule.sourceGroups.filter((group) => check.sourceGroupIds.includes(group.id)
        && !group.alternatives.some((id) => isLinked(assessment, this.context.store.state, id)));
      status.textContent = pending ? `Borrador conservado. Falta sustento: ${missing.map((group) => group.label).join('; ') || 'revisar las referencias seleccionadas'}.`
        : answer ? hasValidRecordedCheck(this.context, check) ? `Contraste registrado. Sustento: ${answer.sourceRefs.map((ref) => sourceName(ref.sourceId)).join('; ')}.`
          : 'Las fuentes cambiaron o se retiraron. Revisa el sustento y vuelve a elegir tu respuesta.'
          : 'Aún no has elegido una respuesta.';
    }
  }

  dispose(): void { this.controller.abort(); this.unsubscribes.forEach((unsubscribe) => unsubscribe()); }
}
