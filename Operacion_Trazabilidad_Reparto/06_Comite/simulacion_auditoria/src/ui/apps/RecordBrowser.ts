import type { ApplicationContext, MountedApplication } from '../../computer/types';
import type { ComputerIconKey } from '../../data/computerAssets';
import { getSourceDocument } from '../../data/documents';
import { sourceContext, sourceName } from '../../data/investigation';
import { RecordComparison } from './RecordComparison';
import { RecordViewer } from './RecordViewer';
import { AppLifetime, appIcon, availableSources, h, navigate, recordListMarkup, showError } from './utils';

type BrowserApp = 'session-viewer' | 'account-directory' | 'network-monitor' | 'order-history' | 'change-manager'
  | 'time-tracker' | 'backup-manager' | 'local-dossier';

export function mountRecordBrowser<A extends BrowserApp>(container: HTMLElement, context: ApplicationContext<A>, options: { title: string; icon: ComputerIconKey; introduction: string; sourceIds?: readonly string[] }): MountedApplication {
  container.innerHTML = `<div class="pc-app pc-app-record-browser"><div class="pc-app-toolbar"><span>${appIcon(context.stationId, options.icon)} ${h(options.title)}</span><button type="button" data-pc-navigate="interview">Consultar al enlace de TI</button><button type="button" data-pc-navigate="report">Informe del puesto</button></div>
    <div class="pc-app-body" data-pc-scroll="browser-body"><p class="pc-app-introduction">${h(options.introduction)}</p><label class="pc-app-search">Buscar registros <input type="search" aria-label="Filtrar registros" placeholder="Cuenta, sistema, hora o actividad…" maxlength="500"></label><p class="pc-app-count" role="status"></p>
    <div class="pc-app-record-layout"><section class="pc-app-table-wrap" data-pc-scroll="record-list" aria-label="Registros disponibles"><table><thead><tr><th scope="col">Registro y procedencia</th><th scope="col">Resumen reportado</th></tr></thead><tbody></tbody></table><p class="pc-app-no-matches" hidden>No hay coincidencias. Prueba otra cuenta, hora o palabra del expediente.</p></section><section class="pc-app-inspector" data-pc-scroll="record-inspector" aria-label="Detalle del registro"></section></div>
    <div class="pc-app-comparison-host"></div><p class="pc-app-error" role="alert" hidden></p></div></div>`;
  const root = container.querySelector<HTMLElement>('.pc-app')!;
  const lifetime = new AppLifetime(root, context, 'input[type="search"]');
  const input = root.querySelector<HTMLInputElement>('input[type="search"]')!;
  const rows = root.querySelector<HTMLTableSectionElement>('tbody')!;
  const count = root.querySelector<HTMLElement>('.pc-app-count')!;
  const empty = root.querySelector<HTMLElement>('.pc-app-no-matches')!;
  const error = root.querySelector<HTMLElement>(':scope > .pc-app-body > .pc-app-error')!;
  const viewer = new RecordViewer(root.querySelector('.pc-app-inspector')!, context,
    () => context.workspace.getDraft().selectedSourceId,
    (selectedSourceId) => context.workspace.patchDraft({ selectedSourceId } as Partial<import('../../computer/types').AppDrafts[A]>));
  const comparison = new RecordComparison(root.querySelector('.pc-app-comparison-host')!, context, `${context.appId}-${context.stationId}`);
  input.value = context.workspace.getDraft().search;
  let signature = '';
  const refresh = () => {
    const available = availableSources(context.stationId, context.store.state).filter((id) => !options.sourceIds || options.sourceIds.includes(id) || id.startsWith('DECL-'));
    const search = context.workspace.getDraft().search.toLocaleLowerCase();
    const ids = available.filter((id) => `${id} ${sourceName(id)} ${sourceContext(id)} ${getSourceDocument(id)?.summary ?? ''} ${getSourceDocument(id)?.rows.flatMap((row) => row.values).join(' ') ?? ''}`.toLocaleLowerCase().includes(search));
    // Selection only changes the row state; keep the opener mounted and focused.
    const markup = recordListMarkup(ids, null);
    if (markup !== signature) {
      const active = root.ownerDocument.activeElement;
      const focusedSource = active instanceof HTMLElement && rows.contains(active) ? active.dataset.pcOpen : null;
      signature = markup; rows.innerHTML = markup;
      if (focusedSource) {
        const replacement = [...rows.querySelectorAll<HTMLButtonElement>('[data-pc-open]')].find((button) => button.dataset.pcOpen === focusedSource);
        (replacement ?? input).focus({ preventScroll: true });
      }
    }
    const selected = context.workspace.getDraft().selectedSourceId;
    for (const button of rows.querySelectorAll<HTMLButtonElement>('[data-pc-open]')) {
      button.closest('tr')?.classList.toggle('pc-app-selected', button.dataset.pcOpen === selected);
    }
    count.textContent = `${ids.length} de ${available.length} registros y soportes disponibles`;
    empty.hidden = ids.length > 0;
    if (input.value !== context.workspace.getDraft().search) input.value = context.workspace.getDraft().search;
  };
  root.addEventListener('input', (event) => {
    if (event.target !== input) return;
    context.workspace.patchDraft({ search: input.value } as Partial<import('../../computer/types').AppDrafts[A]>);
    refresh();
  }, { signal: lifetime.controller.signal });
  root.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('button');
    if (!button || !root.contains(button)) return;
    try {
      error.hidden = true;
      if (button.dataset.pcOpen) viewer.open(button.dataset.pcOpen);
      if (button.dataset.pcViewer === 'follow-account' && button.dataset.pcAccount) {
        context.workspace.patchDraft({ search: button.dataset.pcAccount, selectedSourceId: null } as Partial<import('../../computer/types').AppDrafts[A]>);
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
}
