import type { ApplicationDefinition } from '../../computer/types';
import { canon } from '../../data/canon';
import { RecordComparison } from './RecordComparison';
import { RecordViewer } from './RecordViewer';
import { AppLifetime, appIcon, h, navigate, showError } from './utils';

export const fileExplorer: ApplicationDefinition<'file-explorer'> = {
  id: 'file-explorer', title: 'Explorador del expediente', icon: 'explorer', minSize: { width: 470, height: 340 },
  mount(container, context) {
    container.innerHTML = `<div class="pc-app pc-app-files"><div class="pc-app-toolbar"><span>${appIcon(context.stationId, 'explorer')} Inventario recibido</span><button type="button" data-pc-open="META-CUSTODIA">Inspeccionar procedencia</button><button type="button" data-pc-navigate="report">Informe del puesto</button></div>
      <div class="pc-app-body" data-pc-scroll="files-body"><p class="pc-app-introduction">El inventario se calcula desde los resúmenes recibidos. Comprobar una entrada no lee ni autentica un archivo original.</p>
      <label class="pc-app-search">Buscar material <input type="search" aria-label="Filtrar registros" placeholder="Tipo, ruta, hash o identificador…" maxlength="500"></label><p class="pc-app-count" role="status"></p>
      <div class="pc-app-table-wrap pc-app-inventory" data-pc-scroll="inventory"><table><thead><tr><th scope="col">Material</th><th scope="col">Archivo original</th><th scope="col">SHA-256</th><th scope="col">Comprobación</th></tr></thead><tbody></tbody></table></div><p class="pc-app-no-matches" hidden>No hay material con ese filtro.</p>
      <p class="pc-app-feedback" role="status">Selecciona «Comprobar archivo» para revisar qué metadatos están realmente aportados.</p>
      <div class="pc-app-toolbar pc-app-context-sources"><span>Soportes de contexto</span><button type="button" data-pc-open="E-09">Abrir E-09</button><button type="button" data-pc-open="E-10">Abrir E-10</button></div>
      <section class="pc-app-inspector" data-pc-scroll="files-inspector" aria-label="Detalle del material"></section><div class="pc-app-comparison-host"></div><p class="pc-app-error" role="alert" hidden></p></div></div>`;
    const root = container.querySelector<HTMLElement>('.pc-app')!;
    const lifetime = new AppLifetime(root, context, 'input[type="search"]');
    const input = root.querySelector<HTMLInputElement>('input[type="search"]')!;
    const rows = root.querySelector<HTMLTableSectionElement>('tbody')!;
    const count = root.querySelector<HTMLElement>('.pc-app-count')!;
    const empty = root.querySelector<HTMLElement>('.pc-app-no-matches')!;
    const feedback = root.querySelector<HTMLElement>('.pc-app-feedback')!;
    const error = root.querySelector<HTMLElement>(':scope > .pc-app-body > .pc-app-error')!;
    const viewer = new RecordViewer(root.querySelector('.pc-app-inspector')!, context,
      () => context.workspace.getDraft().selectedSourceId,
      (selectedSourceId) => context.workspace.patchDraft({ selectedSourceId }));
    const comparison = new RecordComparison(root.querySelector('.pc-app-comparison-host')!, context, `files-${context.stationId}`);
    input.value = context.workspace.getDraft().search;
    let signature = '';
    const refresh = () => {
      const search = context.workspace.getDraft().search.toLocaleLowerCase();
      const sources = canon.evidenceSummaries.filter((source) => `${source.id} ${source.type} ${source.artifactPath ?? ''} ${source.sha256 ?? ''}`.toLocaleLowerCase().includes(search));
      const markup = sources.map((source) => `<tr><td><strong>${h(source.type)}</strong><small>${h(source.id)}</small></td><td>${h(source.artifactPath ?? 'No aportado')}</td><td>${h(source.sha256 ?? 'No aportado')}</td><td><button type="button" data-pc-verify-file="${h(source.id)}">Comprobar archivo</button></td></tr>`).join('');
      if (markup !== signature) { signature = markup; rows.innerHTML = markup; }
      count.textContent = `${sources.length} de ${canon.evidenceSummaries.length} resúmenes de material`;
      empty.hidden = sources.length > 0;
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
        if (button.dataset.pcVerifyFile) {
          const source = canon.evidenceSummaries.find((item) => item.id === button.dataset.pcVerifyFile)!;
          feedback.textContent = source.artifactPath && source.sha256
            ? 'El expediente aporta metadatos; no se ha leído ni autenticado un archivo original.'
            : 'No hay archivo original ni SHA-256 aportados para comprobar. Puedes documentar esta ausencia.';
          viewer.open('META-CUSTODIA');
        }
        if (button.dataset.pcOpen) viewer.open(button.dataset.pcOpen);
        if (button.dataset.pcNavigate === 'report') navigate(lifetime, 'report');
      } catch (caught) { showError(error, caught); }
    }, { signal: lifetime.controller.signal });
    lifetime.addCleanup(context.workspace.subscribe(refresh));
    lifetime.addCleanup(() => viewer.dispose()); lifetime.addCleanup(() => comparison.dispose());
    refresh(); lifetime.restoreScroll();
    return lifetime;
  },
};
