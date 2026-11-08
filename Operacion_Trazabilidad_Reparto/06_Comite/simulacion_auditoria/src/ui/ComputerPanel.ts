import { sourceSummary } from '../data/language';
import type { AuditStore } from '../audit/store';
import { evaluateReview } from '../audit/evaluate';
import { reviewRules } from '../audit/rules';
import type { StationId } from '../audit/types';
import { canon, eventById, evidenceById } from '../data/canon';
import { displayCell, getSourceDocument } from '../data/documents';
import { sourceContext, sourceName, stationSources, workstations } from '../data/investigation';
import { stationById } from '../data/stations';
import { queryExamples, querySchema, runQuery, type QueryResult } from '../investigation/query';
import { escapeHtml as h, icon } from './dom';

type ComputerState = {
  view: string;
  selected: string | null;
  search: string;
  query: string;
  result: QueryResult | null;
  queryError: string;
  comparison: string[];
  recoveryStep: number;
};

// Keep the desk as the player left it when moving between a program and notes.
const desks = new Map<StationId, ComputerState>();
const recoveryIds = ['EVT-09', 'EVT-10', 'EVT-11', 'EVT-12', 'EVT-13'];

export class ComputerPanel {
  private readonly unsubscribe: () => void;
  private readonly state: ComputerState;
  private notice = '';

  constructor(
    private readonly dialog: HTMLDialogElement,
    private readonly store: AuditStore,
    private readonly stationId: StationId,
    private readonly onReview: () => void,
    private readonly onInterview: () => void,
  ) {
    this.state = desks.get(stationId) ?? {
      view: workstations[stationId].views[0].id, selected: null, search: '',
      query: queryExamples[0].sql, result: null, queryError: '', comparison: [], recoveryStep: 0,
    };
    desks.set(stationId, this.state);
    this.dialog.className = `app-dialog legacy-computer-dialog computer-${stationId}`;
    this.dialog.onclick = (event) => this.click(event);
    this.dialog.oninput = (event) => this.input(event);
    this.dialog.onkeydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && this.state.view === 'query') {
        event.preventDefault(); this.execute();
      }
    };
    this.unsubscribe = store.subscribe(() => this.render());
    this.render();
  }

  private get reviewId() { return stationById(this.stationId).reviewId; }
  private get assessment() { return this.store.state.assessments[this.reviewId]; }
  private get sourceIds() { return [...new Set(stationSources(this.stationId, this.store.state.inspected.map((ref) => ref.sourceId)))]; }

  private render(): void {
    if (!this.dialog.open) return;
    const active = document.activeElement as HTMLInputElement | null;
    const focus = active?.dataset.computerFocus;
    const selection = focus && active?.matches('textarea, input[type="search"], input[type="text"]') ? [active.selectionStart, active.selectionEnd] : null;
    const focusedAction = active?.dataset.action ? { ...active.dataset } : null;
    const scrollPositions = [...this.dialog.querySelectorAll<HTMLElement>('[data-scroll]')].map((element) => [element.dataset.scroll!, element.scrollTop] as const);
    const station = stationById(this.stationId);
    const app = workstations[this.stationId];
    const status = evaluateReview(this.assessment, this.store.state.inspected).status;
    this.dialog.innerHTML = `
      <header class="dialog-header computer-titlebar">
        <div class="computer-app-name"><span class="app-symbol" aria-hidden="true">${icon(this.stationId === 'sql_red' ? 'code' : 'folder')}</span><div><h2>${h(app.app)}</h2><p>${h(app.context)}</p></div></div>
        <div class="dialog-header-actions"><button class="computer-notes-button" data-action="open-review">${icon('clipboard')} Libreta <span>${this.assessment.sourceRefs.length} ${this.assessment.sourceRefs.length === 1 ? 'pista' : 'pistas'}</span></button><button class="icon-button" data-action="close" aria-label="Volver a la oficina">${icon('close')}</button></div>
      </header>
      <div class="computer-menubar"><span>RedNova / ${h(station.title)}</span><span>Copia del expediente · sin conexión a producción</span></div>
      <div class="computer-layout" data-scroll="layout">
        <aside class="computer-explorer" data-scroll="explorer" aria-label="Explorador del ordenador">
          <h3>Herramientas</h3>
          <nav class="computer-apps" aria-label="Herramientas del puesto">${app.views.map((view) => `<button data-action="work-view" data-view="${view.id}" aria-current="${this.state.view === view.id ? 'page' : 'false'}">${h(view.label)}</button>`).join('')}</nav>
          ${this.stationId === 'sql_red' ? `<details class="database-schema" open><summary>Tablas del expediente</summary>${Object.entries(querySchema).map(([table, columns]) => `<details><summary>${h(table)}</summary><p>${columns.map(h).join('<br>')}</p></details>`).join('')}</details>` : ''}
          <div class="explorer-heading"><h3>Registros y soportes</h3><span>${this.sourceIds.length}</span></div>
          <div class="computer-source-list">${this.sourceIds.map((id) => `<button class="source-link ${this.state.selected === id ? 'selected' : ''}" data-action="select-source" data-source="${id}" data-computer-focus="source-${id}" title="${h(sourceName(id))}"><span>${h(sourceName(id))}</span><small>${h(sourceContext(id))}${this.assessment.sourceRefs.some((ref) => ref.sourceId === id) ? ' · Guardada' : ''}</small></button>`).join('')}</div>
          <button class="secondary-button computer-contact" data-action="interview">Consultar al enlace de TI</button>
        </aside>
        <section class="computer-workarea" data-scroll="workarea" aria-label="Área de investigación">
          <div class="investigation-brief"><h3>${h(app.question)}</h3><p>${h(app.prompt)}</p></div>
          ${this.notice ? `<p class="workspace-feedback" role="status">${h(this.notice)}</p>` : ''}
          <div class="computer-work-content">${this.workspaceMarkup()}</div>
          ${this.comparisonMarkup()}
        </section>
        ${this.state.selected ? this.inspectorMarkup(this.state.selected) : `<aside class="computer-inspector inspector-idle"><div>${icon('search')}<h3>El registro es el punto de partida.</h3><p>Abre una fila para ver el detalle. Guarda lo que te ayude a reconstruir lo ocurrido.</p><p>También puedes comparar dos registros sin salir del programa.</p></div></aside>`}
      </div>
      <footer class="computer-statusbar"><span data-review-status="${this.reviewId}">${status === 'Pendiente' ? 'Investigación abierta' : h(status)}</span><span>Horas reportadas · UTC−6</span><span>Los registros conservan su procedencia al guardarlos en la libreta.</span></footer>`;
    for (const [key, top] of scrollPositions) this.dialog.querySelector<HTMLElement>(`[data-scroll="${key}"]`)?.scrollTo(0, top);
    if (focus) {
      const element = this.dialog.querySelector<HTMLInputElement>(`[data-computer-focus="${focus}"]`);
      element?.focus({ preventScroll: true });
      if (selection && element) element.setSelectionRange(selection[0], selection[1]);
    } else if (focusedAction) {
      [...this.dialog.querySelectorAll<HTMLButtonElement>('button[data-action]')].find((button) =>
        Object.entries(focusedAction).every(([key, value]) => button.dataset[key] === value))?.focus({ preventScroll: true });
    }
  }

  private workspaceMarkup(): string {
    if (this.state.view === 'query') return this.queryMarkup();
    if (this.state.view === 'recovery') return this.recoveryMarkup();
    if (this.state.view === 'custody') return this.custodyMarkup();
    if (this.state.view === 'clocks') return this.clocksMarkup();
    const app = workstations[this.stationId];
    const view = app.views.find((item) => item.id === this.state.view)!;
    const available = [...new Set([...view.sourceIds.filter((id) => this.sourceIds.includes(id)),
      ...this.sourceIds.filter((id) => id.startsWith('DECL-'))])];
    const ids = available.filter((id) => `${sourceName(id)} ${getSourceDocument(id)?.summary} ${sourceContext(id)} ${eventById(id)?.account ?? ''}`.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()));
    const search = `<label class="record-search">${icon('search')}<span class="sr-only">Filtrar registros</span><input type="search" data-input="record-search" data-computer-focus="record-search" placeholder="Buscar una cuenta, hora o actividad…" value="${h(this.state.search)}"></label>`;
    if (this.state.view === 'timeline') return `${search}<div class="incident-timeline">${ids.map((id) => {
      const event = eventById(id)!;
      return `<div class="incident-entry ${id === 'EVT-08' ? 'incident-alert' : ''}"><time>${h(event.reportedAt.slice(11, 16))}</time><button data-action="select-source" data-source="${id}"><strong>${h(sourceName(id))}</strong><span>${h(sourceSummary(event.id))}</span></button><button class="compare-toggle" data-action="compare" data-source="${id}" aria-pressed="${this.state.comparison.includes(id)}" aria-label="Comparar ${h(sourceName(id))}">${icon('compare')}</button></div>`;
    }).join('')}</div>${!ids.length ? '<p class="workspace-empty">No hay registros con ese filtro. Prueba con otra hora o cuenta.</p>' : ''}`;
    const network = this.state.view === 'network' ? `<div class="network-observation"><h4>Lectura y tráfico son registros distintos</h4><div><span>SQL Server<br><strong>${canon.reportedFacts.customerRecordsRead.toLocaleString('en-US')} registros leídos</strong></span>${icon('compare')}<span>Destino externo no clasificado<br><strong>~${canon.reportedFacts.outboundTransfer.reportedValue} GB transferidos</strong></span></div><p>Abre ambos registros y busca una cuenta, un proceso o contenido que permita relacionarlos.</p></div>` : '';
    return `${network}${search}<div class="table-wrap program-table"><table><thead><tr><th>Hora / tipo</th><th>Actividad</th><th>Cuenta / soporte</th><th><span class="sr-only">Comparar registros</span></th></tr></thead><tbody>${ids.map((id) => {
      const event = eventById(id);
      return `<tr class="${this.state.selected === id ? 'active-record' : ''}"><td>${event ? `<time>${h(event.reportedAt.slice(11, 16))}</time><small>${h(event.reportedAt.slice(8, 10))}/${h(event.reportedAt.slice(5, 7))}</small>` : '<span class="record-type">Soporte</span>'}</td><td><button class="record-open" data-action="select-source" data-source="${id}"><strong>${h(sourceName(id))}</strong><span>${h(getSourceDocument(id)?.summary ?? '')}</span></button></td><td>${event ? `<code>${h(event.account ?? 'No aportada')}</code>` : 'Resumen del expediente'}</td><td><button class="compare-toggle" data-action="compare" data-source="${id}" aria-pressed="${this.state.comparison.includes(id)}" aria-label="Comparar ${h(sourceName(id))}">${icon('compare')}</button></td></tr>`;
    }).join('')}</tbody></table></div>${!ids.length ? '<p class="workspace-empty">No hay registros con ese filtro. Prueba con otra hora o cuenta.</p>' : ''}${this.state.view === 'backup' ? '<p class="workspace-observation">La programación y la ejecución son cosas distintas. El resumen no incluye un resultado de restauración. Consulta a Continuidad a través del enlace de TI.</p>' : ''}`;
  }

  private queryMarkup(): string {
    const result = this.state.result;
    return `<div class="query-tab">consulta.sql <span>SELECT · copia local</span></div>
      <div class="query-toolbar"><button class="primary-button" data-action="run-query">${icon('play')} Ejecutar consulta</button><span>Ctrl / ⌘ + Enter</span><details class="query-help"><summary>Sintaxis disponible</summary><p>SELECT columnas FROM registros o soportes. Filtros con WHERE, =, &lt;&gt;, &gt;, &lt;, LIKE, IS NULL, AND / OR y paréntesis. ORDER BY, TOP y LIMIT. Un SELECT por ejecución; sin JOIN ni agregaciones.</p><p>Consulta local sobre los resúmenes del expediente. No es una conexión a SQL Server ni una ejecución de las referencias Q del plan.</p></details></div>
      <label class="sql-editor"><span class="sr-only">Consulta SQL</span><span class="sql-line-numbers" aria-hidden="true">1<br>2<br>3<br>4<br>5<br>6<br>7</span><textarea spellcheck="false" data-input="query" data-computer-focus="query" aria-label="Consulta SQL" maxlength="8000">${h(this.state.query)}</textarea></label>
      <div class="query-examples"><span>Cargar consulta:</span>${queryExamples.map((example, index) => `<button data-action="query-example" data-example="${index}">${h(example.label)}</button>`).join('')}</div>
      <div class="query-results-heading"><h4>Resultados</h4><span role="status">${this.state.queryError ? 'Consulta con errores' : result ? `${result.rows.length} ${result.rows.length === 1 ? 'fila' : 'filas'} · ${h(result.table)}` : 'Consulta lista para ejecutar'}</span></div>
      ${this.state.queryError ? `<div class="query-error" role="alert"><strong>No se pudo ejecutar</strong><p>${h(this.state.queryError)}</p><p>Corrige el editor y vuelve a ejecutar. El resultado anterior se ha retirado.</p></div>` : result ? `<div class="table-wrap program-table query-result-table"><table><thead><tr><th aria-label="Abrir registro"></th>${result.columns.map((column) => `<th>${h(column)}</th>`).join('')}<th aria-label="Comparar registro"></th></tr></thead><tbody>${result.rows.map((row, index) => `<tr data-action="select-source" data-source="${row.sourceId}" class="${this.state.selected === row.sourceId ? 'active-record' : ''}"><td><button class="query-row-open" data-action="select-source" data-source="${row.sourceId}" aria-label="Abrir ${h(sourceName(row.sourceId))}">${index + 1} ${icon('open')}</button></td>${row.values.map((cell) => `<td>${cell === null ? '<span class="sql-null">NULL</span>' : h(String(cell))}</td>`).join('')}<td><button class="compare-toggle" data-action="compare" data-source="${row.sourceId}" aria-pressed="${this.state.comparison.includes(row.sourceId)}" aria-label="Comparar ${h(sourceName(row.sourceId))}">${icon('compare')}</button></td></tr>`).join('')}</tbody></table></div>${!result.rows.length ? '<p class="workspace-empty">Ninguna fila coincide. Amplía el filtro; que una cuenta no aparezca aquí no demuestra que no participara.</p>' : '<p class="query-result-hint">Abre una fila para inspeccionarla y guardarla. NULL significa que el dato no fue aportado.</p>'}` : '<div class="query-ready"><h4>La consulta está en tus manos.</h4><p>Ejecuta el SELECT para ver los registros disponibles. Cambia el filtro para seguir una cuenta, un sistema o una actividad.</p></div>'}`;
  }

  private recoveryMarkup(): string {
    const step = this.state.recoveryStep;
    const event = eventById(recoveryIds[step])!;
    const read = step >= 2;
    const write = step >= 3;
    return `<div class="recovery-console"><h4>Estados reportados del CRM</h4><p>Recorre la secuencia para revisar qué se había recuperado en cada momento.</p><div class="recovery-stages">${recoveryIds.map((id, index) => `<button data-action="recovery-step" data-step="${index}" aria-pressed="${step === index}"><time>${eventById(id)!.reportedAt.slice(11, 16)}</time><span>${['Caída', 'Solicitud', 'Consulta', 'Escritura', 'Conciliación'][index]}</span></button>`).join('')}</div><label class="recovery-slider">Momento de la revisión<input type="range" min="0" max="4" step="1" value="${step}" data-input="recovery-step" data-computer-focus="recovery-step" aria-valuetext="${h(sourceName(event.id))}"></label><div class="recovery-snapshot ${step === 0 ? 'service-down' : ''}"><time>${event.reportedAt.slice(11, 16)}</time><h4>${h(sourceName(event.id))}</h4><p>${h(sourceSummary(event.id))}</p><dl><div><dt>Consulta</dt><dd>${read ? 'Restablecida según el expediente' : 'Sin retorno reportado todavía'}</dd></div><div><dt>Escritura</dt><dd>${write ? 'Restablecida según el expediente' : 'Sin retorno reportado todavía'}</dd></div><div><dt>Integridad validada</dt><dd>No aportada</dd></div></dl><button class="secondary-button" data-action="select-source" data-source="${event.id}">Abrir registro de este momento</button></div><p class="workspace-observation">Volver a escribir no acredita una restauración validada. Compara la caída con el retorno y revisa los respaldos y sus pruebas.</p></div>`;
  }

  private custodyMarkup(): string {
    return `<div class="inventory-toolbar"><h4>Inventario recibido</h4><button class="secondary-button" data-action="select-source" data-source="META-CUSTODIA">Inspeccionar procedencia</button></div><div class="table-wrap program-table"><table><thead><tr><th>Material</th><th>Archivo original</th><th>SHA-256</th><th>Comprobación</th></tr></thead><tbody>${canon.evidenceSummaries.map((source) => `<tr><td>${h(sourceName(source.id))}</td><td>${h(source.artifactPath ?? 'No aportado')}</td><td>${h(source.sha256 ?? 'No aportado')}</td><td><button class="text-button" data-action="verify-file" data-source="${source.id}">Ver metadatos</button></td></tr>`).join('')}</tbody></table></div><p class="workspace-observation">Este inventario se calcula desde los resúmenes recibidos. Abre la procedencia antes de guardarlo como pista.</p>`;
  }

  private clocksMarkup(): string {
    return `<div class="inventory-toolbar"><h4>¿Estaban sincronizados los relojes?</h4><button class="secondary-button" data-action="select-source" data-source="META-TIEMPO">Inspeccionar vista temporal</button></div><div class="table-wrap program-table"><table><thead><tr><th>Sistema</th><th>Hora reportada</th><th>Hora original</th><th>Desfase verificado</th></tr></thead><tbody>${canon.events.map((event) => `<tr><td><button class="record-open" data-action="select-source" data-source="${event.id}">${h(sourceName(event.id))}</button></td><td>${event.reportedAt.slice(11, 16)}</td><td>${h(event.originalTime ?? 'No aportada')}</td><td>${event.clockOffsetVerified ? h(String(event.clockOffsetSeconds)) : 'Sin verificar'}</td></tr>`).join('')}</tbody></table></div><p class="workspace-observation">Un desfase desconocido no es cero. Las comparaciones usan horas reportadas, sin corregir relojes.</p>`;
  }

  private inspectorMarkup(id: string): string {
    const source = getSourceDocument(id)!;
    const event = eventById(id);
    const pertinent = reviewRules[this.reviewId].sourceGroups.some((group) => group.alternatives.includes(id));
    const linked = this.assessment.sourceRefs.some((ref) => ref.sourceId === id);
    const rows = source.rows.filter((row) => !['Evidencias relacionadas', 'Procedencia', 'Página', 'Fuente', 'Tipo', 'Señal observada', 'Declaración resumida'].includes(String(row.values[0])));
    const technicalFields = ['Hora original', 'Desfase (segundos)', 'Desfase verificado'];
    const fields = (technical: boolean) => rows.filter((row) => technicalFields.includes(String(row.values[0])) === technical).map((row) => `
      <div><dt>${h(id.startsWith('META-') ? sourceName(String(row.values[0])) : String(row.values[0]))}</dt>
      <dd>${h(row.values.slice(1).map(displayCell).join(' · '))}</dd></div>`).join('');
    return `<aside class="computer-inspector" data-scroll="inspector" aria-label="Detalle del registro">
      <div class="inspector-top"><h3>Inspector</h3><button class="icon-button" data-action="close-inspector" aria-label="Cerrar inspector">${icon('close')}</button></div>
      <article class="source-document" data-document="${h(id)}">
        <h4 tabindex="-1">${h(sourceName(id))}</h4>
        <p class="inspector-context">${h(sourceContext(id))}</p>
        <p class="inspector-summary">${h(source.summary)}</p>${source.readingNote ? `<p class="source-reading-note">${h(source.readingNote)}</p>` : ''}
        <div class="inspector-actions">
          ${pertinent ? `<button class="primary-button" data-action="pin-source" data-source="${id}" ${linked ? 'disabled' : ''}>${icon(linked ? 'check' : 'clipboard')}${linked ? 'Pista guardada en la libreta' : 'Guardar pista en la libreta'}</button>` : '<p class="context-note">Registro de contexto para este puesto. Puedes contrastarlo sin incorporarlo como sustento de este asunto.</p>'}
          <button class="secondary-button" data-action="compare" data-source="${id}" aria-pressed="${this.state.comparison.includes(id)}">${icon('compare')}${this.state.comparison.includes(id) ? 'Quitar de la comparación' : 'Comparar con otro registro'}</button>
          ${event?.account && ['accesos', 'sql_red', 'siem'].includes(this.stationId) ? `<button class="text-button" data-action="follow-account" data-account="${h(event.account)}">Buscar más actividad de ${h(event.account)}</button>` : ''}
        </div>
        <dl class="inspector-fields">${fields(false)}</dl>
        ${this.nextLead(id)}
        ${fields(true) ? `<details class="provenance-details"><summary>Metadatos y verificación temporal</summary><dl class="inspector-fields">${fields(true)}</dl></details>` : ''}
        <details class="provenance-details"><summary>Referencia y procedencia</summary>
          <p><code>${h(id)}</code> · ${h(source.version)}</p>
          <p>${h(source.kindLabel)}. ${h(source.provenanceText)}</p>
          ${source.notes.map((note) => `<p>${h(note)}</p>`).join('')}
          ${source.queryIds.length ? `<p>Referencias de consultas académicas: ${source.queryIds.map(h).join(', ')}. No se ejecutan en el navegador; los resultados del laboratorio usan datos ficticios.</p>` : ''}
        </details>
      </article>
    </aside>`;
  }

  private nextLead(id: string): string {
    const leads: Record<string, string> = {
      'EVT-02': 'Tenemos una cuenta. ¿Quién la usó y qué política de verificación adicional a la contraseña le correspondía? Revisa el directorio; el nombre de usuario por sí solo no resuelve la atribución.',
      'EVT-03': 'El registro de elevación no aporta una cuenta. Comprueba ese campo antes de unirlo con la sesión remota.',
      'EVT-04': 'La lectura tiene una hora y un volumen. Busca la transferencia en el monitor de red y compara lo que cada registro permite identificar.',
      'EVT-05': 'No se identifica el contenido transferido. Consulta al enlace qué sostiene Seguridad sobre la relación con SQL.',
      'EVT-06': 'Busca el despliegue y compáralo con este cambio. La diferencia de horas puede cambiar tu hipótesis.',
      'EVT-07': 'Que exista un despliegue no acredita su aprobación. Revisa el ticket y consulta a Desarrollo.',
      'EVT-08': 'La alerta existe. Abre el resumen de atención para buscar quién la recibió, qué hizo y cómo se cerró.',
      'E-07': 'Sin cierre documentado, la respuesta queda por reconstruir. Puedes registrar una solicitud de trazabilidad en la libreta.',
      'E-08': '¿Dónde está la prueba de restauración? El enlace puede facilitar la declaración atribuida a Continuidad.',
      'E-06': 'La aprobación final no está documentada. Contrasta el ticket con lo declarado por Desarrollo y BD.',
    };
    return leads[id] ? `<div class="next-lead"><h5>Una pregunta para seguir</h5><p>${h(leads[id])}</p></div>` : '';
  }

  private comparisonMarkup(): string {
    const ids = this.state.comparison;
    if (!ids.length) return '';
    const events = ids.map(eventById);
    const difference = events.length === 2 && events.every(Boolean)
      ? Math.round(Math.abs(Date.parse(events[1]!.reportedAt) - Date.parse(events[0]!.reportedAt)) / 60000) : null;
    const ordered = difference !== null ? [...events].sort((a, b) => Date.parse(a!.reportedAt) - Date.parse(b!.reportedAt)) : [];
    return `<section class="comparison-desk" aria-label="Mesa de comparación"><div class="comparison-heading"><h4>Comparar registros</h4><button class="text-button" data-action="clear-comparison">Vaciar mesa</button></div><div class="comparison-records">${ids.map((id) => `<div><strong>${h(sourceName(id))}</strong><span>${h(sourceContext(id))}</span><p>${h(getSourceDocument(id)?.summary ?? '')}</p><button class="text-button" data-action="compare" data-source="${id}">Retirar de la mesa</button></div>`).join('')}${ids.length === 1 ? '<p class="comparison-slot">Elige otro registro con el botón de comparar para ponerlos frente a frente.</p>' : ''}</div>${ids.length === 2 ? `<div class="comparison-reading" role="status">${difference !== null ? `<strong>${difference} minutos entre las horas reportadas.</strong><p>${h(sourceName(ordered[0]!.id))} aparece antes que ${h(sourceName(ordered[1]!.id)).toLocaleLowerCase()}${difference === 0 ? ' o en la misma hora reportada' : ''}. Los relojes no están verificados; esta secuencia no demuestra causalidad.</p>` : '<strong>¿Dicen lo mismo y tienen el mismo alcance?</strong><p>Contrasta la descripción, la procedencia y los campos ausentes. Dos resúmenes de un mismo registro no son corroboraciones independientes.</p>'}${events.some((event) => event?.id === 'EVT-04') && events.some((event) => event?.id === 'EVT-05') ? '<p>Falta una clave que relacione lectura y flujo: cuenta, proceso o contenido. La cercanía temporal no identifica lo que salió.</p>' : ''}<button class="secondary-button" data-action="open-review">Llevar el razonamiento a la libreta</button></div>` : ''}</section>`;
  }

  private open(id: string): void {
    if (!getSourceDocument(id)) return;
    this.state.selected = id;
    this.store.inspect(id);
    this.render();
    if (window.matchMedia('(max-width: 760px)').matches) {
      this.dialog.querySelector<HTMLElement>('.computer-inspector h4')?.focus();
    }
  }

  private execute(): void {
    try { this.state.result = runQuery(this.state.query); this.state.queryError = ''; }
    catch (error) { this.state.result = null; this.state.queryError = error instanceof Error ? error.message : 'Revisa la consulta.'; }
    this.render();
  }

  private click(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'close') { this.dialog.close(); return; }
    if (action === 'open-review') { this.onReview(); return; }
    if (action === 'interview') { this.onInterview(); return; }
    this.notice = '';
    if (action === 'work-view' && button.dataset.view) { this.state.view = button.dataset.view; this.state.search = ''; }
    if (action === 'select-source' && button.dataset.source) { this.open(button.dataset.source); return; }
    if (action === 'close-inspector') this.state.selected = null;
    if (action === 'run-query') { this.execute(); return; }
    if (action === 'query-example') {
      this.state.query = queryExamples[Number(button.dataset.example)].sql;
      this.state.result = null; this.state.queryError = '';
    }
    if (action === 'follow-account' && button.dataset.account) {
      if (this.stationId === 'sql_red') {
        this.state.view = 'query';
        this.state.query = `SELECT hora, sistema, cuenta, detalle\nFROM registros\nWHERE cuenta = '${button.dataset.account.replaceAll("'", "''")}'\nORDER BY fecha, hora;`;
        this.execute(); return;
      }
      const searchView = workstations[this.stationId].views.find((view) => ['sessions', 'timeline'].includes(view.id));
      if (searchView) { this.state.view = searchView.id; this.state.search = button.dataset.account; }
    }
    if (action === 'recovery-step') this.state.recoveryStep = Number(button.dataset.step);
    if (action === 'compare' && button.dataset.source) {
      const id = button.dataset.source;
      if (this.state.comparison.includes(id)) this.state.comparison = this.state.comparison.filter((item) => item !== id);
      else {
        if (this.state.comparison.length === 2) this.state.comparison.shift();
        this.state.comparison.push(id);
        this.state.selected = id;
        this.store.inspect(id);
      }
    }
    if (action === 'clear-comparison') this.state.comparison = [];
    if (action === 'verify-file' && button.dataset.source) {
      const source = evidenceById(button.dataset.source)!;
      this.notice = source.artifactPath && source.sha256 ? 'El expediente aporta metadatos; no se ha leído ni autenticado un archivo original.' : 'No hay archivo original ni SHA-256 aportados para comprobar. Puedes documentar esta ausencia.';
      this.open('META-CUSTODIA');
    }
    if (action === 'pin-source' && button.dataset.source) {
      try { this.store.pin(this.reviewId, button.dataset.source); this.notice = 'Pista guardada con su referencia. La conclusión sigue en tus manos.'; }
      catch (error) { this.notice = error instanceof Error ? error.message : 'No se pudo guardar la pista.'; }
    }
    this.render();
    if (action === 'compare') this.dialog.querySelector('.comparison-desk')?.scrollIntoView({ block: 'nearest' });
  }

  private input(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (input.dataset.input === 'query') {
      this.state.query = input.value;
      const hadResult = Boolean(this.state.result || this.state.queryError);
      this.state.result = null; this.state.queryError = '';
      if (hadResult) this.render();
    }
    if (input.dataset.input === 'record-search') { this.state.search = input.value; this.render(); }
    if (input.dataset.input === 'recovery-step') { this.state.recoveryStep = Number(input.value); this.render(); }
  }

  dispose(): void {
    this.unsubscribe();
    this.dialog.oninput = null;
    this.dialog.onkeydown = null;
  }
}
