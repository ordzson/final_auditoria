import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditStore, STORAGE_KEY } from '../src/audit/store';
import { evaluateReview } from '../src/audit/evaluate';
import { CONTENT_VERSION } from '../src/data/canon';

let values: Map<string, string>;

beforeEach(() => {
  values = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() { return values.size; },
  } satisfies Storage);
});

afterEach(() => vi.unstubAllGlobals());

describe('guardado local versionado', () => {
  it('conserva el plazo opcional y admite recomendaciones anteriores sin plazo', () => {
    const store = new AuditStore();
    store.setRecommendation('AU-02', { deadline: '24 h desde T0 futuro', action: 'Preservar copias' });
    const restored = new AuditStore();
    expect(restored.state.recommendations['AU-02'].deadline).toBe('24 h desde T0 futuro');
    expect(restored.state.recommendations['AU-01'].deadline).toBe('');
    expect(restored.state.recommendations['AU-02'].action).toBe('Preservar copias');
  });
  it('conserva entrega, inspección, referencias y anotaciones al recargar', () => {
    const store = new AuditStore();
    store.receiveClipboard();
    store.inspect('E-03');
    store.pin('AU-02', 'E-03');
    store.setFreeNote('AU-02', 'Contenido no identificado.');
    store.setPose({ x: 1.1, z: 2.2, yaw: 0.3, pitch: -0.1 });
    const restored = new AuditStore();
    expect(restored.state.clipboardReceived).toBe(true);
    expect(restored.state.assessments['AU-02'].sourceRefs).toEqual([{ sourceId: 'E-03', sourceVersion: CONTENT_VERSION }]);
    expect(restored.state.assessments['AU-02'].freeNote).toBe('Contenido no identificado.');
    expect(restored.state.pose.x).toBe(1.1);
  });

  it('no permite vincular sin inspección ni comprobar sin todos los grupos', () => {
    const store = new AuditStore();
    expect(() => store.pin('AU-02', 'E-03')).toThrow('inspecciona');
    store.inspect('E-03');
    store.pin('AU-02', 'E-03');
    expect(() => store.answerCheck('AU-02', 'C02-CONTENIDO', 'SIN_VINCULO_NI_CONTENIDO')).toThrow('todos los grupos');
    expect(store.state.assessments['AU-02'].checkAnswers).toEqual([]);
  });

  it('reevalúa versiones antiguas sin borrar el trabajo guardado', () => {
    const store = new AuditStore();
    store.inspect('E-01');
    store.pin('AU-01', 'E-01');
    store.setConclusion('AU-01', 'A01-OBSERVACION');
    store.state.assessments['AU-01'].rulesVersion = 'auditoria_reglas_v1';
    store.updateSettings({ projector: true });
    const restored = new AuditStore();
    const assessment = restored.state.assessments['AU-01'];
    expect(evaluateReview(assessment, restored.state.inspected).isDocumented).toBe(false);
    expect(assessment.conclusionId).toBe('A01-OBSERVACION');
    expect(restored.state.settings.projector).toBe(true);
  });

  it('recupera un estado seguro ante JSON corrupto o esquema incompatible', () => {
    values.set(STORAGE_KEY, '{incorrecto');
    expect(new AuditStore().state.assessments['AU-01'].sourceRefs).toEqual([]);
    values.set(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, clipboardReceived: true }));
    expect(new AuditStore().state.clipboardReceived).toBe(false);
  });

  it('reinicia la partida y elimina la copia guardada', () => {
    const store = new AuditStore();
    store.receiveClipboard();
    expect(values.has(STORAGE_KEY)).toBe(true);
    store.reset();
    expect(values.has(STORAGE_KEY)).toBe(false);
    expect(store.state.clipboardReceived).toBe(false);
  });

  it('comunica el resultado real sin modificar el esquema v2 y distingue pose de conclusión', () => {
    const store = new AuditStore();
    const listener = vi.fn(); const unsubscribe = store.subscribePersistence(listener);
    store.setConclusion('AU-02', 'A02-NO_CONCLUYENTE');
    expect(listener.mock.calls.map(([event]) => event.status)).toEqual(['pending', 'saved']);
    expect(listener.mock.calls[1][0]).toMatchObject({ domain: 'audit', change: 'conclusion', reviewId: 'AU-02' });
    expect(JSON.parse(values.get(STORAGE_KEY)!).schemaVersion).toBe(2);
    vi.stubGlobal('localStorage', { setItem: () => { throw new Error('blocked'); }, removeItem: () => { throw new Error('blocked'); } });
    listener.mockClear(); store.setPose({ x: 1, z: 1, yaw: 0, pitch: 0 });
    expect(listener.mock.calls.map(([event]) => event.status)).toEqual(['pending', 'session-only']);
    expect(listener.mock.calls[1][0].change).toBe('pose');
    listener.mockClear(); store.reset();
    expect(listener.mock.calls.map(([event]) => event.status)).toEqual(['pending', 'session-only']);
    unsubscribe();
  });

  it('no registra contrastes con referencias antiguas aunque sigan vinculadas', () => {
    const store = new AuditStore();
    for (const id of ['EVT-04', 'EVT-05', 'DECL-05']) { store.inspect(id); store.pin('AU-02', id); }
    store.state.assessments['AU-02'].sourceRefs[0].sourceVersion = 'old';
    expect(() => store.answerCheck('AU-02', 'C02-CONTENIDO', 'SIN_VINCULO_NI_CONTENIDO')).toThrow('todos los grupos');
    expect(store.state.assessments['AU-02'].checkAnswers).toEqual([]);
  });
});
