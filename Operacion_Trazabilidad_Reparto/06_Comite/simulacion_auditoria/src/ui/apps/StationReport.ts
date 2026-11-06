import { reviewRules } from '../../audit/rules';
import type { ApplicationDefinition } from '../../computer/types';
import { sourceName } from '../../data/investigation';
import { hasValidRecordedCheck } from './RecordComparison';
import { AppLifetime, appIcon, h, navigate, showError } from './utils';

export const stationReport: ApplicationDefinition<'station-report'> = {
  id: 'station-report', title: 'Informe del puesto', icon: 'report', minSize: { width: 430, height: 330 },
  mount(container, context) {
    const rule = reviewRules[context.reviewId];
    const prefix = `report-${context.stationId}`;
    container.innerHTML = `<div class="pc-app pc-app-report"><div class="pc-app-toolbar"><span>${appIcon(context.stationId, 'report')} Informe · ${h(rule.title)}</span><button type="button" data-pc-navigate="notebook">Consultar libreta</button><button type="button" data-pc-navigate="interview">Enlace de TI</button></div>
      <div class="pc-app-body" data-pc-scroll="report-body"><header class="pc-app-report-heading"><h2>${h(rule.title)}</h2><p>${h(rule.question)}</p><p class="pc-app-report-status" role="status"></p></header>
      <section><h3>Fuentes y contrastes</h3><div class="pc-app-report-sources"></div><div class="pc-app-report-checks"></div><button type="button" data-pc-dossier>Consultar Expediente local</button></section>
      <section><h3>Qué puedo afirmar</h3><fieldset><legend>Conclusión estructurada</legend>${rule.conclusions.map((item) => `<label class="pc-app-choice"><input type="radio" name="${prefix}-conclusion" value="${h(item.id)}" data-pc-conclusion><span>${h(item.text)}</span></label>`).join('')}<button type="button" data-pc-clear-conclusion>Retirar conclusión</button></fieldset></section>
      <section><h3>Qué falta</h3><fieldset><legend>Limitaciones de la conclusión</legend>${rule.limitations.map((item) => `<label class="pc-app-choice"><input type="checkbox" data-pc-limitation="${h(item.id)}"><span>${h(item.text)}</span></label>`).join('')}</fieldset>
      <fieldset><legend>Solicitudes de soporte</legend>${rule.requests.map((item) => `<label class="pc-app-choice"><input type="checkbox" data-pc-request="${h(item.id)}"><span>${h(item.text)}</span></label>`).join('')}</fieldset><p>La solicitud se registra sin tener que recibir el documento ausente.</p></section>
      <section><h3>Anotación personal</h3><label for="${prefix}-note">Comentario opcional, sin evaluación automática</label><textarea id="${prefix}-note" class="pc-app-free-note" rows="5" maxlength="2000" placeholder="Explica el razonamiento y sus límites…"></textarea><p class="pc-app-context">Las elecciones y el texto se incorporan automáticamente a la misma libreta.</p></section>
      <details class="pc-app-missing"><summary>Qué falta para documentar</summary><ul></ul></details><p class="pc-app-report-disclaimer" hidden>Actividad documentada con sustento. La aprobación académica corresponde a la revisión humana.</p><p class="pc-app-error" role="alert" hidden></p></div></div>`;
    const root = container.querySelector<HTMLElement>('.pc-app')!;
    const lifetime = new AppLifetime(root, context, '[data-pc-conclusion]');
    const note = root.querySelector<HTMLTextAreaElement>('.pc-app-free-note')!;
    const status = root.querySelector<HTMLElement>('.pc-app-report-status')!;
    const sources = root.querySelector<HTMLElement>('.pc-app-report-sources')!;
    const checks = root.querySelector<HTMLElement>('.pc-app-report-checks')!;
    const missing = root.querySelector<HTMLUListElement>('.pc-app-missing ul')!;
    const disclaimer = root.querySelector<HTMLElement>('.pc-app-report-disclaimer')!;
    const error = root.querySelector<HTMLElement>(':scope > .pc-app-body > .pc-app-error')!;
    const refresh = () => {
      const assessment = context.review.getAssessment();
      const evaluation = context.review.getEvaluation();
      status.textContent = `${evaluation.status} · ${evaluation.gatheredGroups}/${evaluation.totalGroups} grupos de fuentes`;
      const sourceMarkup = assessment.sourceRefs.length ? `<ul>${assessment.sourceRefs.map((ref) => `<li>${h(sourceName(ref.sourceId))} <small>${h(ref.sourceId)} · ${h(ref.sourceVersion)}</small></li>`).join('')}</ul>` : '<p>Todavía no hay fuentes vinculadas. Elige «Usar como sustento» o compara registros en los programas.</p>';
      if (sources.innerHTML !== sourceMarkup) sources.innerHTML = sourceMarkup;
      const checkMarkup = rule.checks.map((check) => {
        const pending = context.review.getPendingCheck(check.id);
        const saved = assessment.checkAnswers.find((answer) => answer.checkId === check.id);
        const selected = check.options.find((option) => option.id === (pending?.answerId ?? saved?.answerId));
        return `<p><strong>${h(check.question)}</strong><br>${selected ? h(selected.text) : 'Sin respuesta todavía.'}${pending ? ' · Borrador pendiente de fuentes.' : saved ? hasValidRecordedCheck(context, check) ? ' · Contraste registrado; la evaluación conserva sus requisitos.' : ' · Sustento cambiado; revisa el contraste.' : ''}</p>`;
      }).join('');
      if (checks.innerHTML !== checkMarkup) checks.innerHTML = checkMarkup;
      for (const input of root.querySelectorAll<HTMLInputElement>('[data-pc-conclusion]')) input.checked = assessment.conclusionId === input.value;
      for (const input of root.querySelectorAll<HTMLInputElement>('[data-pc-limitation]')) input.checked = assessment.limitationIds.includes(input.dataset.pcLimitation!);
      for (const input of root.querySelectorAll<HTMLInputElement>('[data-pc-request]')) input.checked = assessment.requestIds.includes(input.dataset.pcRequest!);
      if (note.value !== assessment.freeNote) note.value = assessment.freeNote;
      const missingMarkup = evaluation.missingReasons.map((reason) => `<li>${h(rule.checks.reduce((text, check) => text.replaceAll(check.id, `«${check.question}»`), reason))}</li>`).join('');
      if (missing.innerHTML !== missingMarkup) missing.innerHTML = missingMarkup;
      disclaimer.hidden = !evaluation.isDocumented;
    };
    root.addEventListener('change', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) return;
      try {
        error.hidden = true;
        if (input.hasAttribute('data-pc-conclusion')) context.review.setConclusion(input.value);
        if (input.dataset.pcLimitation) context.review.toggleLimitation(input.dataset.pcLimitation);
        if (input.dataset.pcRequest) context.review.toggleRequest(input.dataset.pcRequest);
      } catch (caught) { showError(error, caught); }
    }, { signal: lifetime.controller.signal });
    note.addEventListener('input', () => context.review.setFreeNote(note.value), { signal: lifetime.controller.signal });
    root.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('button');
      if (!button || !root.contains(button)) return;
      try {
        error.hidden = true;
        if (button.dataset.pcNavigate === 'notebook') navigate(lifetime, 'notebook');
        if (button.dataset.pcNavigate === 'interview') navigate(lifetime, 'interview');
        if (button.hasAttribute('data-pc-clear-conclusion')) context.review.setConclusion(null);
        if (button.hasAttribute('data-pc-dossier')) { lifetime.flush(); context.navigation.openApp('local-dossier'); }
      } catch (caught) { showError(error, caught); }
    }, { signal: lifetime.controller.signal });
    lifetime.addCleanup(context.store.subscribe(refresh)); lifetime.addCleanup(context.workspace.subscribe(refresh));
    refresh(); lifetime.restoreScroll();
    return lifetime;
  },
};
