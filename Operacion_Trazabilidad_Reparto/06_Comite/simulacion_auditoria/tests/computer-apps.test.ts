import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditStore } from '../src/audit/store';
import { createReviewBridge } from '../src/computer/reviewBridge';
import { WorkspaceStore } from '../src/computer/workspace';
import type { AppId, ApplicationContext } from '../src/computer/types';
import { computers } from '../src/data/computers';
import { CONTENT_VERSION } from '../src/data/canon';
import { reviewRules } from '../src/audit/rules';
import { checkSourceIds, comparisonMarkup, hasValidRecordedCheck } from '../src/ui/apps/RecordComparison';
import { recordViewerMarkup, toggleComparison } from '../src/ui/apps/RecordViewer';
import { queryResultMarkup, restoreQueryResult } from '../src/ui/apps/QueryStudio';
import { availableSources, isLinked } from '../src/ui/apps/utils';

let store: AuditStore;
let workspace: WorkspaceStore;
let review: ReturnType<typeof createReviewBridge>;

beforeEach(() => {
  vi.useFakeTimers();
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  });
  store = new AuditStore();
  workspace = new WorkspaceStore(computers);
  review = createReviewBridge(store, workspace, 'sql_red');
});

afterEach(() => { review.dispose(); workspace.dispose(); vi.useRealTimers(); vi.unstubAllGlobals(); });

function context<A extends AppId>(appId: A): ApplicationContext<A> {
  return { stationId: 'sql_red', reviewId: 'AU-02', appId, store, workspace: workspace.forApp('sql_red', appId), review,
    navigation: { openApp: () => {}, openNotebook: () => {}, openInterview: () => {}, exitToOffice: () => {} } };
}

describe('programas SQL, red y visores compartidos', () => {
  it('restaura resultados locales con NULL y referencias sin inspeccionar ni vincular filas', () => {
    const before = JSON.stringify(store.state);
    const result = restoreQueryResult("SELECT hora, cuenta, referencia FROM registros WHERE sistema = 'SQL Server';").result!;
    expect(result.rows).toEqual([{ sourceId: 'EVT-04', values: ['02:31', null, 'EVT-04'] }]);
    const markup = queryResultMarkup(result, availableSources('sql_red', store.state));
    expect(markup).toContain('data-pc-open="EVT-04"');
    expect(markup).toContain('pc-app-null">NULL');
    expect(JSON.stringify(store.state)).toBe(before);
    expect(restoreQueryResult(null)).toEqual({ result: null, error: '' });
  });

  it('retira resultados ante SQL inválido y evita abrir registros externos al puesto', () => {
    const restored = restoreQueryResult('DELETE FROM registros;');
    expect(restored.result).toBeNull();
    expect(restored.error).toContain('SELECT');
    const result = restoreQueryResult("SELECT hora FROM registros WHERE sistema = 'CRM';").result!;
    const markup = queryResultMarkup(result, availableSources('sql_red', store.state));
    expect(markup).toContain('Contexto de otra estación');
    expect(markup).not.toContain('data-pc-open=');
    expect(store.state.inspected).toEqual([]);
  });

  it('escapa el contenido tabular y conserva números, booleanos y datos ausentes', () => {
    const markup = queryResultMarkup({ table: 'registros', columns: ['<script>'], rows: [{ sourceId: 'EVT-04', values: ['<img src=x onerror=alert(1)>', 0, false, null] }] }, ['EVT-04']);
    expect(markup).toContain('&lt;script&gt;');
    expect(markup).toContain('&lt;img');
    expect(markup).not.toContain('<img src=x');
    expect(markup).toContain('<td>0</td>');
    expect(markup).toContain('<td>false</td>');
  });

  it('renderizar un registro seleccionado restaurado no concede una inspección', () => {
    const markup = recordViewerMarkup(context('query-studio'), 'EVT-04');
    expect(markup).toContain('31,840');
    expect(markup).toContain('Hora original');
    expect(markup).toContain(CONTENT_VERSION);
    expect(store.state.inspected).toEqual([]);
    expect(store.state.assessments['AU-02'].sourceRefs).toEqual([]);
  });

  it('oculta declaraciones no obtenidas, incluida la que figura en el índice antiguo de respaldos', () => {
    expect(availableSources('respaldos', store.state)).not.toContain('DECL-07');
    expect(availableSources('sql_red', store.state)).not.toContain('DECL-05');
    expect(recordViewerMarkup(context('local-dossier'), 'DECL-05')).not.toContain('Declaración de');
    store.inspect('DECL-05');
    expect(availableSources('sql_red', store.state)).toContain('DECL-05');
    expect(recordViewerMarkup(context('local-dossier'), 'DECL-05')).toContain('Declaración atribuida');
    store.state.inspected = [{ sourceId: 'DECL-05', sourceVersion: 'antigua' }];
    expect(availableSources('sql_red', store.state)).not.toContain('DECL-05');
  });

  it('comparte comparación SQL/red, vincula sustento explícito y no elige una conclusión', () => {
    const sql = context('query-studio');
    const network = context('network-monitor');
    toggleComparison(sql, 'EVT-04');
    toggleComparison(network, 'EVT-05');
    expect(sql.workspace.getComparison()).toEqual(['EVT-04', 'EVT-05']);
    expect(network.workspace.getComparison()).toEqual(sql.workspace.getComparison());
    expect(isLinked(review.getAssessment(), store.state, 'EVT-04')).toBe(true);
    expect(isLinked(review.getAssessment(), store.state, 'EVT-05')).toBe(true);
    const markup = comparisonMarkup(network);
    expect(markup).toContain('31,840');
    expect(markup).toContain('1.6 GB');
    expect(markup).toContain('no demuestra causalidad');
    expect(store.state.assessments['AU-02'].conclusionId).toBeNull();
    expect(store.state.assessments['AU-02'].checkAnswers).toEqual([]);
    toggleComparison(network, 'EVT-04');
    expect(sql.workspace.getComparison()).toEqual(['EVT-05']);
    expect(workspace.getStation('accesos').comparisonSourceIds).toEqual([]);
  });

  it('conserva la elección pendiente y la registra al aportar Seguridad desde el expediente', () => {
    const app = context('network-monitor');
    toggleComparison(app, 'EVT-04'); toggleComparison(app, 'EVT-05');
    const result = review.answerCheck('C02-CONTENIDO', 'VOLUMEN_DEMUESTRA_EXFILTRACION', ['EVT-04', 'EVT-05']);
    expect(result.status).toBe('draft');
    expect(review.getPendingCheck('C02-CONTENIDO')?.answerId).toBe('VOLUMEN_DEMUESTRA_EXFILTRACION');
    expect(review.getAssessment().checkAnswers).toEqual([]);
    store.inspect('DECL-05');
    review.useSource('DECL-05');
    expect(review.getPendingCheck('C02-CONTENIDO')).toBeNull();
    expect(review.getAssessment().checkAnswers[0].answerId).toBe('VOLUMEN_DEMUESTRA_EXFILTRACION');
    expect(review.getEvaluation().isDocumented).toBe(false);
  });

  it('excluye contexto opcional del sustento y retira la etiqueta de contraste vigente al perder una fuente', () => {
    const app = context('network-monitor');
    review.useSource('EVT-04'); review.useSource('EVT-05');
    store.inspect('DECL-05'); review.useSource('DECL-05');
    app.workspace.setComparison(['EVT-02', 'EVT-05']);
    expect(checkSourceIds(app)).toEqual(['EVT-04', 'EVT-05', 'DECL-05']);
    review.answerCheck('C02-CONTENIDO', 'SIN_VINCULO_NI_CONTENIDO', checkSourceIds(app));
    const check = reviewRules['AU-02'].checks[0];
    expect(hasValidRecordedCheck(app, check)).toBe(true);
    store.unpin('AU-02', review.getAssessment().sourceRefs.find((ref) => ref.sourceId === 'EVT-04')!);
    expect(hasValidRecordedCheck(app, check)).toBe(false);
    expect(review.getAssessment().checkAnswers).toHaveLength(1);
  });
});
