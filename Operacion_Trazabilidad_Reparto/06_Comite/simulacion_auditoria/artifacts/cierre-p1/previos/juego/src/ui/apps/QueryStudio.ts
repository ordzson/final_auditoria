import type { ApplicationDefinition } from '../../computer/types';
import { queryExamples, querySchema, runQuery, type QueryResult } from '../../investigation/query';
import { sourceName } from '../../data/investigation';
import { RecordComparison } from './RecordComparison';
import { RecordViewer } from './RecordViewer';
import { AppLifetime, appIcon, availableSources, h, navigate, showError } from './utils';

export function restoreQueryResult(sql: string | null): { result: QueryResult | null; error: string } {
  if (sql === null) return { result: null, error: '' };
  try { return { result: runQuery(sql), error: '' }; }
  catch (error) { return { result: null, error: error instanceof Error ? error.message : 'Revisa la consulta.' }; }
}

export function queryResultMarkup(result: QueryResult, availableIds: readonly string[]): string {
  return `<div class="pc-app-table-wrap" data-pc-scroll="query-results"><table><thead><tr><th scope="col">Registro</th>${result.columns.map((column) => `<th scope="col">${h(column)}</th>`).join('')}</tr></thead>
    <tbody>${result.rows.map((row) => `<tr><td>${availableIds.includes(row.sourceId)
      ? `<button type="button" class="pc-app-record-link" data-pc-open="${h(row.sourceId)}" aria-label="Abrir ${h(sourceName(row.sourceId))}">${h(row.sourceId)}</button>`
      : `<span title="Registro fuera del material de este puesto">${h(row.sourceId)}</span><small>Contexto de otra estación</small>`}</td>${row.values.map((value) => `<td>${value === null ? '<span class="pc-app-null">NULL</span>' : h(String(value))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    ${result.rows.length ? '<p class="pc-app-context">Abre una fila de este puesto para inspeccionarla. NULL indica un dato no aportado; mostrar resultados no consulta ni vincula sus fuentes.</p>' : '<p class="pc-app-empty">Ninguna fila coincide. Amplía el filtro; una ausencia en esta consulta no prueba ausencia de actividad.</p>'}`;
}

export const queryStudio: ApplicationDefinition<'query-studio'> = {
  id: 'query-studio', title: 'Query Studio', icon: 'query', minSize: { width: 460, height: 330 },
  mount(container, context) {
    container.innerHTML = `<div class="pc-app pc-app-query"><div class="pc-app-toolbar"><span>${appIcon(context.stationId, 'query')} Expediente local · solo lectura</span><button type="button" data-pc-run>Ejecutar consulta</button><span>Ctrl / ⌘ + Enter</span></div>
      <div class="pc-app-body" data-pc-scroll="query-body"><div class="pc-app-query-layout"><aside class="pc-app-schema"><h3>Explorador de objetos</h3>${Object.entries(querySchema).map(([table, columns]) => `<details open><summary>${h(table)}</summary><ul>${columns.map((column) => `<li>${h(column)}</li>`).join('')}</ul></details>`).join('')}<button type="button" data-pc-navigate="interview">Consultar al enlace de TI</button></aside>
      <section class="pc-app-query-work" aria-label="Editor y resultados SQL"><label class="pc-app-editor-label">consulta.sql<textarea class="pc-app-sql" aria-label="Consulta SQL" spellcheck="false" maxlength="8000"></textarea></label>
      <div class="pc-app-toolbar"><label>Ejemplo <select data-pc-example aria-label="Cargar consulta de ejemplo"><option value="">Elegir consulta…</option>${queryExamples.map((example, index) => `<option value="${index}">${h(example.label)}</option>`).join('')}</select></label>
      <details class="pc-app-help"><summary>Sintaxis disponible</summary><p>SELECT sobre registros o soportes. WHERE, AND / OR, paréntesis, LIKE, IS NULL, ORDER BY, TOP y LIMIT. Sin JOIN ni agregaciones.</p><p>Consulta local de los resúmenes. No conecta a SQL Server ni ejecuta las referencias Q del plan.</p></details></div>
      <p class="pc-app-query-status" role="status"></p><div class="pc-app-results"></div></section></div>
      <section class="pc-app-inspector" data-pc-scroll="query-inspector" aria-label="Detalle del registro"></section><div class="pc-app-comparison-host"></div><p class="pc-app-error" role="alert" hidden></p></div></div>`;
    const root = container.querySelector<HTMLElement>('.pc-app')!;
    const lifetime = new AppLifetime(root, context, '.pc-app-sql');
    const editor = root.querySelector<HTMLTextAreaElement>('.pc-app-sql')!;
    const results = root.querySelector<HTMLElement>('.pc-app-results')!;
    const status = root.querySelector<HTMLElement>('.pc-app-query-status')!;
    const error = root.querySelector<HTMLElement>(':scope > .pc-app-body > .pc-app-error')!;
    const viewer = new RecordViewer(root.querySelector('.pc-app-inspector')!, context,
      () => context.workspace.getDraft().selectedSourceId,
      (selectedSourceId) => context.workspace.patchDraft({ selectedSourceId }));
    const comparison = new RecordComparison(root.querySelector('.pc-app-comparison-host')!, context, `query-${context.stationId}`);
    editor.value = context.workspace.getDraft().query;
    let result: QueryResult | null = null;
    let queryError = '';
    const renderResults = () => {
      status.textContent = queryError ? 'Consulta con errores' : result ? `${result.rows.length} ${result.rows.length === 1 ? 'fila' : 'filas'} · ${result.table}` : 'Consulta lista para ejecutar';
      results.innerHTML = queryError ? `<div class="pc-app-query-error" role="alert"><strong>No se pudo ejecutar</strong><p>${h(queryError)}</p><p>Corrige el editor y ejecuta de nuevo. Se retiró el resultado anterior.</p></div>`
        : result ? queryResultMarkup(result, availableSources(context.stationId, context.store.state))
          : '<p class="pc-app-empty">Edita el SELECT y pulsa «Ejecutar consulta» para explorar los registros del expediente.</p>';
    };
    const execute = () => {
      const restored = restoreQueryResult(editor.value);
      result = restored.result; queryError = restored.error;
      context.workspace.patchDraft({ query: editor.value, lastExecutedQuery: result ? editor.value : null });
      renderResults();
    };
    const restored = restoreQueryResult(context.workspace.getDraft().lastExecutedQuery);
    result = restored.result; queryError = restored.error;
    let lastExecutedQuery = context.workspace.getDraft().lastExecutedQuery;
    renderResults();
    lifetime.addCleanup(context.workspace.subscribe(() => {
      const draft = context.workspace.getDraft();
      const editorChanged = editor.value !== draft.query;
      if (!editorChanged && lastExecutedQuery === draft.lastExecutedQuery) return;
      if (editorChanged) editor.value = draft.query;
      lastExecutedQuery = draft.lastExecutedQuery;
      const current = restoreQueryResult(lastExecutedQuery);
      result = current.result; queryError = current.error;
      renderResults();
    }));
    root.addEventListener('input', (event) => {
      if (event.target !== editor) return;
      context.workspace.patchDraft({ query: editor.value, lastExecutedQuery: null });
      if (result || queryError) { result = null; queryError = ''; renderResults(); }
    }, { signal: lifetime.controller.signal });
    root.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); execute(); }
    }, { signal: lifetime.controller.signal });
    root.addEventListener('change', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLSelectElement) || !input.hasAttribute('data-pc-example') || !input.value) return;
      editor.value = queryExamples[Number(input.value)].sql;
      context.workspace.patchDraft({ query: editor.value, lastExecutedQuery: null });
      result = null; queryError = ''; renderResults(); editor.focus(); input.value = '';
    }, { signal: lifetime.controller.signal });
    root.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('button');
      if (!button || !root.contains(button)) return;
      try {
        error.hidden = true;
        if (button.hasAttribute('data-pc-run')) execute();
        if (button.dataset.pcOpen) viewer.open(button.dataset.pcOpen);
        if (button.dataset.pcViewer === 'follow-account' && button.dataset.pcAccount) {
          editor.value = `SELECT hora, sistema, cuenta, detalle\nFROM registros\nWHERE cuenta = '${button.dataset.pcAccount.replaceAll("'", "''")}'\nORDER BY fecha, hora;`;
          execute(); editor.focus();
        }
        if (button.dataset.pcNavigate === 'interview') navigate(lifetime, 'interview');
      } catch (caught) { showError(error, caught); }
    }, { signal: lifetime.controller.signal });
    lifetime.addCleanup(() => viewer.dispose()); lifetime.addCleanup(() => comparison.dispose());
    lifetime.restoreScroll();
    return lifetime;
  },
};
