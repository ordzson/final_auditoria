import type { ApplicationDefinition } from '../../computer/types';
import { sourceSummary, classroomText } from '../../data/language';
import { eventById } from '../../data/canon';
import { getSourceDocument } from '../../data/documents';
import { sourceContext, sourceName } from '../../data/investigation';
import { RecordComparison } from './RecordComparison';
import { RecordViewer } from './RecordViewer';
import { AppLifetime, appIcon, availableSources, h, navigate, showError } from './utils';

const timelineIds = ['EVT-02', 'EVT-03', 'EVT-08', 'EVT-09'];

export const eventDesk: ApplicationDefinition<'event-desk'> = {
  id: 'event-desk', title: 'Event Desk', icon: 'events', minSize: { width: 440, height: 330 },
  mount(container, context) {
    container.innerHTML = `<div class="pc-app pc-app-events"><div class="pc-app-toolbar"><span>${appIcon(context.stationId, 'events')} Cronología preliminar</span><button type="button" data-pc-navigate="interview">Consultar al enlace de TI</button><button type="button" data-pc-navigate="report">Informe del puesto</button></div>
      <div class="pc-app-body" data-pc-scroll="events-body"><p class="pc-app-introduction">Ordena la lectura por las horas reportadas. La alerta existe; su asignación, respuesta y cierre deben comprobarse en el seguimiento.</p>
      <label class="pc-app-search">Buscar eventos <input type="search" aria-label="Filtrar registros" placeholder="Cuenta, hora, sistema o actividad…" maxlength="500"></label><p class="pc-app-count" role="status"></p>
      <div class="pc-app-timeline" aria-label="Cronología del incidente"></div><p class="pc-app-no-matches" hidden>No hay eventos con ese filtro. Prueba otra hora, cuenta o sistema.</p>
      <section class="pc-app-inspector" data-pc-scroll="events-inspector" aria-label="Detalle del evento"></section><div class="pc-app-comparison-host"></div><p class="pc-app-error" role="alert" hidden></p></div></div>`;
    const root = container.querySelector<HTMLElement>('.pc-app')!;
    const lifetime = new AppLifetime(root, context, 'input[type="search"]');
    const input = root.querySelector<HTMLInputElement>('input[type="search"]')!;
    const timeline = root.querySelector<HTMLElement>('.pc-app-timeline')!;
    const count = root.querySelector<HTMLElement>('.pc-app-count')!;
    const empty = root.querySelector<HTMLElement>('.pc-app-no-matches')!;
    const error = root.querySelector<HTMLElement>(':scope > .pc-app-body > .pc-app-error')!;
    const viewer = new RecordViewer(root.querySelector('.pc-app-inspector')!, context,
      () => context.workspace.getDraft().selectedSourceId,
      (selectedSourceId) => context.workspace.patchDraft({ selectedSourceId }));
    const comparison = new RecordComparison(root.querySelector('.pc-app-comparison-host')!, context, `events-${context.stationId}`);
    input.value = context.workspace.getDraft().search;
    let signature = '';
    const refresh = () => {
      const search = context.workspace.getDraft().search.toLocaleLowerCase();
      const available = availableSources(context.stationId, context.store.state);
      const ids = timelineIds.filter((id) => available.includes(id)).filter((id) => {
        const event = eventById(id)!;
        return `${id} ${sourceName(id)} ${sourceContext(id)} ${event.account ?? ''} ${event.description} ${getSourceDocument(id)?.summary ?? ''}`.toLocaleLowerCase().includes(search);
      });
      const selected = context.workspace.getDraft().selectedSourceId;
      const markup = ids.map((id) => {
        const event = eventById(id)!;
        return `<article class="pc-app-event ${id === 'EVT-08' ? 'pc-app-event-alert' : ''} ${id === selected ? 'pc-app-event-selected' : ''}"><time datetime="${h(event.reportedAt)}">${h(event.reportedAt.slice(11, 16))}<small>${h(event.reportedAt.slice(8, 10))}/${h(event.reportedAt.slice(5, 7))}</small></time><div><button type="button" class="pc-app-record-link" data-pc-open="${h(id)}">${h(sourceName(id))}</button><p>${h(sourceSummary(id))}</p><small>${h(classroomText(event.systemLabel))} · ${h(event.account ?? 'Cuenta no aportada')}</small></div></article>`;
      }).join('');
      if (markup !== signature) {
        const active = root.ownerDocument.activeElement;
        const focusedSource = active instanceof HTMLElement && timeline.contains(active) ? active.dataset.pcOpen : null;
        signature = markup; timeline.innerHTML = markup;
        if (focusedSource) {
          const replacement = [...timeline.querySelectorAll<HTMLButtonElement>('[data-pc-open]')].find((button) => button.dataset.pcOpen === focusedSource);
          (replacement ?? input).focus({ preventScroll: true });
        }
      }
      count.textContent = `${ids.length} eventos disponibles · horas reportadas, sin corregir relojes`;
      empty.hidden = ids.length > 0;
      if (input.value !== context.workspace.getDraft().search) input.value = context.workspace.getDraft().search;
    };
    root.addEventListener('input', (event) => {
      if (event.target !== input) return;
      context.workspace.patchDraft({ search: input.value }); refresh();
    }, { signal: lifetime.controller.signal });
    root.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('button');
      if (!button || !root.contains(button)) return;
      try {
        error.hidden = true;
        if (button.dataset.pcOpen) viewer.open(button.dataset.pcOpen);
        if (button.dataset.pcViewer === 'follow-account' && button.dataset.pcAccount) {
          context.workspace.patchDraft({ search: button.dataset.pcAccount, selectedSourceId: null });
          input.focus(); refresh();
        }
        if (button.dataset.pcNavigate === 'interview') navigate(lifetime, 'interview');
        if (button.dataset.pcNavigate === 'report') navigate(lifetime, 'report');
      } catch (caught) { showError(error, caught); }
    }, { signal: lifetime.controller.signal });
    lifetime.addCleanup(context.store.subscribe(refresh)); lifetime.addCleanup(context.workspace.subscribe(refresh));
    lifetime.addCleanup(() => viewer.dispose()); lifetime.addCleanup(() => comparison.dispose());
    refresh(); lifetime.restoreScroll();
    return lifetime;
  },
};
