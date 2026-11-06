import type { ApplicationDefinition } from '../../computer/types';
import { canon } from '../../data/canon';
import { sourceName } from '../../data/investigation';
import { RecordComparison } from './RecordComparison';
import { RecordViewer } from './RecordViewer';
import { AppLifetime, appIcon, availableSources, h, navigate, showError } from './utils';

export const clockComparator: ApplicationDefinition<'clock-comparator'> = {
  id: 'clock-comparator', title: 'Comparador de relojes', icon: 'time', minSize: { width: 470, height: 340 },
  mount(container, context) {
    container.innerHTML = `<div class="pc-app pc-app-clocks"><div class="pc-app-toolbar"><span>${appIcon(context.stationId, 'time')} Campos temporales por fuente</span><button type="button" data-pc-open="META-TIEMPO">Inspeccionar vista temporal</button><button type="button" data-pc-navigate="report">Informe del puesto</button></div>
      <div class="pc-app-body" data-pc-scroll="clocks-body"><p class="pc-app-introduction">Compara las horas reportadas sin corregir relojes. Un desfase desconocido no es cero y la cercanía temporal no demuestra causalidad.</p>
      <label class="pc-app-search">Buscar sistema o registro <input type="search" aria-label="Filtrar registros" placeholder="Sistema, hora, cuenta o actividad…" maxlength="500"></label><p class="pc-app-count" role="status"></p>
      <div class="pc-app-table-wrap pc-app-clock-table" data-pc-scroll="clock-table"><table><thead><tr><th scope="col">Sistema / registro</th><th scope="col">Hora reportada</th><th scope="col">Hora original</th><th scope="col">Desfase verificado</th></tr></thead><tbody></tbody></table></div><p class="pc-app-no-matches" hidden>No hay registros con ese filtro.</p>
      <section class="pc-app-inspector" data-pc-scroll="clocks-inspector" aria-label="Detalle temporal"></section><div class="pc-app-comparison-host"></div><p class="pc-app-error" role="alert" hidden></p></div></div>`;
    const root = container.querySelector<HTMLElement>('.pc-app')!;
    const lifetime = new AppLifetime(root, context, 'input[type="search"]');
    const input = root.querySelector<HTMLInputElement>('input[type="search"]')!;
    const rows = root.querySelector<HTMLTableSectionElement>('tbody')!;
    const count = root.querySelector<HTMLElement>('.pc-app-count')!;
    const empty = root.querySelector<HTMLElement>('.pc-app-no-matches')!;
    const error = root.querySelector<HTMLElement>(':scope > .pc-app-body > .pc-app-error')!;
    const viewer = new RecordViewer(root.querySelector('.pc-app-inspector')!, context,
      () => context.workspace.getDraft().selectedSourceId,
      (selectedSourceId) => context.workspace.patchDraft({ selectedSourceId }));
    const comparison = new RecordComparison(root.querySelector('.pc-app-comparison-host')!, context, `clocks-${context.stationId}`);
    input.value = context.workspace.getDraft().search;
    let signature = '';
    const refresh = () => {
      const search = context.workspace.getDraft().search.toLocaleLowerCase();
      const available = availableSources(context.stationId, context.store.state);
      const events = canon.events.filter((event) => `${event.id} ${event.systemLabel} ${event.reportedAt} ${event.account ?? ''} ${event.description}`.toLocaleLowerCase().includes(search));
      const selected = context.workspace.getDraft().selectedSourceId;
      const markup = events.map((event) => `<tr class="${selected === event.id ? 'pc-app-selected' : ''}"><td>${available.includes(event.id) ? `<button type="button" class="pc-app-record-link" data-pc-open="${h(event.id)}">${h(sourceName(event.id))}</button>` : `<span>${h(sourceName(event.id))}</span><small>Contexto de otra estación</small>`}<small>${h(event.systemLabel)}</small></td><td><time datetime="${h(event.reportedAt)}">${h(event.reportedAt.slice(11, 16))}</time></td><td>${h(event.originalTime ?? 'No aportada')}</td><td>${event.clockOffsetVerified ? h(String(event.clockOffsetSeconds)) : 'Sin verificar'}</td></tr>`).join('');
      if (markup !== signature) { signature = markup; rows.innerHTML = markup; }
      count.textContent = `${events.length} registros · solo las fuentes del puesto pueden abrirse aquí`;
      empty.hidden = events.length > 0;
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
        if (button.dataset.pcNavigate === 'report') navigate(lifetime, 'report');
      } catch (caught) { showError(error, caught); }
    }, { signal: lifetime.controller.signal });
    lifetime.addCleanup(context.store.subscribe(refresh)); lifetime.addCleanup(context.workspace.subscribe(refresh));
    lifetime.addCleanup(() => viewer.dispose()); lifetime.addCleanup(() => comparison.dispose());
    refresh(); lifetime.restoreScroll();
    return lifetime;
  },
};
