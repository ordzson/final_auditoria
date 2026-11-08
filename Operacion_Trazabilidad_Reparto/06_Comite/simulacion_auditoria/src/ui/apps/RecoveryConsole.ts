import type { ApplicationDefinition } from '../../computer/types';
import { sourceSummary } from '../../data/language';
import { eventById } from '../../data/canon';
import { sourceName } from '../../data/investigation';
import { RecordComparison } from './RecordComparison';
import { RecordViewer } from './RecordViewer';
import { AppLifetime, appIcon, h, navigate, showError } from './utils';

const recoveryIds = ['EVT-09', 'EVT-10', 'EVT-11', 'EVT-12', 'EVT-13'];
const stageNames = ['Caída', 'Solicitud', 'Consulta', 'Escritura', 'Comparación de órdenes'];

export const recoveryConsole: ApplicationDefinition<'recovery-console'> = {
  id: 'recovery-console', title: 'Recovery Console', icon: 'recovery', minSize: { width: 460, height: 350 },
  mount(container, context) {
    container.innerHTML = `<div class="pc-app pc-app-recovery"><div class="pc-app-toolbar"><span>${appIcon(context.stationId, 'recovery')} Estados reportados del sistema comercial</span><button type="button" data-pc-navigate="interview">Consultar a Continuidad</button><button type="button" data-pc-navigate="report">Informe del puesto</button></div>
      <div class="pc-app-body" data-pc-scroll="recovery-body"><p class="pc-app-introduction">Recorre la secuencia para revisar qué se había recuperado en cada momento. Esta consola no ejecuta una restauración.</p>
      <div class="pc-app-recovery-stages" aria-label="Estados de recuperación">${recoveryIds.map((id, index) => `<button type="button" data-pc-recovery-step="${index}" aria-pressed="false"><time>${h(eventById(id)!.reportedAt.slice(11, 16))}</time><span>${h(stageNames[index])}</span></button>`).join('')}</div>
      <label class="pc-app-recovery-slider">Momento de la revisión<input type="range" min="0" max="4" step="1" aria-label="Momento de la revisión"></label>
      <section class="pc-app-recovery-snapshot" aria-live="polite"></section><p class="pc-app-observation">Volver a escribir no acredita una restauración validada. Falta validar la integridad y comparar órdenes con facturas.</p>
      <section class="pc-app-inspector" data-pc-scroll="recovery-inspector" aria-label="Detalle del estado"></section><div class="pc-app-comparison-host"></div><p class="pc-app-error" role="alert" hidden></p></div></div>`;
    const root = container.querySelector<HTMLElement>('.pc-app')!;
    const lifetime = new AppLifetime(root, context, 'input[type="range"]');
    const slider = root.querySelector<HTMLInputElement>('input[type="range"]')!;
    const snapshot = root.querySelector<HTMLElement>('.pc-app-recovery-snapshot')!;
    const error = root.querySelector<HTMLElement>(':scope > .pc-app-body > .pc-app-error')!;
    const viewer = new RecordViewer(root.querySelector('.pc-app-inspector')!, context,
      () => context.workspace.getDraft().selectedSourceId,
      (selectedSourceId) => context.workspace.patchDraft({ selectedSourceId }));
    const comparison = new RecordComparison(root.querySelector('.pc-app-comparison-host')!, context, `recovery-${context.stationId}`);
    let renderedStep = -1;
    const refresh = () => {
      const step = Math.max(0, Math.min(4, context.workspace.getDraft().recoveryStep));
      if (slider.value !== String(step)) slider.value = String(step);
      for (const button of root.querySelectorAll<HTMLButtonElement>('[data-pc-recovery-step]')) {
        button.setAttribute('aria-pressed', String(Number(button.dataset.pcRecoveryStep) === step));
      }
      if (renderedStep === step) return;
      renderedStep = step;
      const event = eventById(recoveryIds[step])!;
      snapshot.classList.toggle('pc-app-service-down', step === 0);
      snapshot.innerHTML = `<time datetime="${h(event.reportedAt)}">${h(event.reportedAt.slice(11, 16))}</time><h3>${h(sourceName(event.id))}</h3><p>${h(sourceSummary(event.id))}</p>
        <dl><div><dt>Consulta</dt><dd>${step >= 2 ? 'Restablecida según el expediente' : 'Sin retorno reportado todavía'}</dd></div><div><dt>Escritura</dt><dd>${step >= 3 ? 'Restablecida según el expediente' : 'Sin retorno reportado todavía'}</dd></div><div><dt>Integridad validada</dt><dd>No aportada</dd></div></dl>
        <button type="button" data-pc-open="${h(event.id)}">Abrir registro de este momento</button>`;
      slider.setAttribute('aria-valuetext', sourceName(event.id));
    };
    const selectStep = (step: number) => { context.workspace.patchDraft({ recoveryStep: step }); refresh(); };
    root.addEventListener('input', (event) => {
      if (event.target === slider) selectStep(Number(slider.value));
    }, { signal: lifetime.controller.signal });
    root.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('button');
      if (!button || !root.contains(button)) return;
      try {
        error.hidden = true;
        if (button.dataset.pcRecoveryStep !== undefined) {
          selectStep(Number(button.dataset.pcRecoveryStep));
          slider.scrollIntoView({ block: 'nearest' });
        }
        if (button.dataset.pcOpen) viewer.open(button.dataset.pcOpen);
        if (button.dataset.pcNavigate === 'interview') navigate(lifetime, 'interview');
        if (button.dataset.pcNavigate === 'report') navigate(lifetime, 'report');
      } catch (caught) { showError(error, caught); }
    }, { signal: lifetime.controller.signal });
    lifetime.addCleanup(context.workspace.subscribe(refresh));
    lifetime.addCleanup(() => viewer.dispose()); lifetime.addCleanup(() => comparison.dispose());
    refresh(); lifetime.restoreScroll();
    return lifetime;
  },
};
