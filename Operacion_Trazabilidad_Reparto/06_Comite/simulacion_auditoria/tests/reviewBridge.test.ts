import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditStore, STORAGE_KEY } from '../src/audit/store';
import { createReviewBridge } from '../src/computer/reviewBridge';
import { WorkspaceStore } from '../src/computer/workspace';
import { computers } from '../src/data/computers';
import type { PersistenceEvent, ReviewBridge } from '../src/computer/types';

let store: AuditStore;
let workspace: WorkspaceStore;
let bridge: ReviewBridge;
let values: Map<string, string>;
beforeEach(() => {
  vi.useFakeTimers(); values = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
  store = new AuditStore(); workspace = new WorkspaceStore(computers);
  bridge = createReviewBridge(store, workspace, 'sql_red');
});
afterEach(() => { bridge.dispose(); workspace.dispose(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('puente académico y autosave', () => {
  it('no concede fuentes ni resultados al montar y restringe fuentes y declaraciones al puesto', () => {
    expect(store.state.inspected).toEqual([]);
    expect(() => bridge.inspect('DECL-05')).toThrow('enlace');
    expect(() => bridge.inspect('META-CUSTODIA')).toThrow('no está disponible');
    expect(() => bridge.inspect('presentation.ransomNote')).toThrow();
    bridge.inspect('EVT-02');
    expect(store.state.inspected).toHaveLength(1);
    expect(() => bridge.useSource('EVT-02')).toThrow('contexto');
    expect(bridge.getAssessment().sourceRefs).toEqual([]);
  });

  it('conserva respuesta sin Seguridad, sobrevive recarga y registra solo al elegir sustento', () => {
    const submission = bridge.answerCheck('C02-CONTENIDO', 'SIN_VINCULO_NI_CONTENIDO', ['EVT-04', 'EVT-05']);
    expect(submission).toMatchObject({ status: 'draft', missingSourceGroupIds: ['seguridad'] });
    expect(bridge.getAssessment().checkAnswers).toEqual([]);
    expect(bridge.getPendingCheck('C02-CONTENIDO')?.answerId).toBe('SIN_VINCULO_NI_CONTENIDO');
    bridge.flush(); bridge.dispose(); workspace.dispose();
    workspace = new WorkspaceStore(computers);
    store = new AuditStore(); bridge = createReviewBridge(store, workspace, 'sql_red');
    expect(bridge.getAssessment().checkAnswers).toEqual([]);
    expect(bridge.getPendingCheck('C02-CONTENIDO')).not.toBeNull();
    store.inspect('DECL-05'); // Respuesta del enlace: inspeccionada, todavía sin vínculo.
    expect(bridge.getAssessment().checkAnswers).toEqual([]);
    bridge.useSource('DECL-05');
    expect(bridge.getAssessment().checkAnswers).toMatchObject([{ checkId: 'C02-CONTENIDO', answerId: 'SIN_VINCULO_NI_CONTENIDO' }]);
    expect(bridge.getPendingCheck('C02-CONTENIDO')).toBeNull();
    expect(bridge.getEvaluation().isDocumented).toBe(false);
    bridge.answerCheck('C02-CONTENIDO', 'VOLUMEN_DEMUESTRA_EXFILTRACION', []);
    expect(bridge.getAssessment().checkAnswers).toHaveLength(1);
    expect(bridge.getAssessment().checkAnswers[0].answerId).toBe('VOLUMEN_DEMUESTRA_EXFILTRACION');
    const ref = bridge.getAssessment().sourceRefs.find((item) => item.sourceId === 'DECL-05')!;
    store.unpin('AU-02', ref);
    expect(bridge.getEvaluation().missingReasons.some((reason) => reason.includes('cambiaron o se retiraron'))).toBe(true);
    expect(bridge.getAssessment().sourceRefs.some((item) => item.sourceId === 'DECL-05')).toBe(false);
  });

  it('valida elecciones antes de registrar trabajo y conserva la nota compartida sin perder foco', () => {
    expect(() => bridge.answerCheck('fake', 'fake', ['EVT-04'])).toThrow('no admitida');
    expect(() => bridge.setConclusion('fake')).toThrow('no admitida');
    expect(() => bridge.toggleLimitation('fake')).toThrow('no admitida');
    expect(() => bridge.toggleRequest('fake')).toThrow('no admitida');
    expect(store.state.inspected).toEqual([]);
    bridge.setFreeNote('La última frase sin desenfocar.');
    expect(store.state.assessments['AU-02'].freeNote).toBe('La última frase sin desenfocar.');
    expect(values.has(STORAGE_KEY)).toBe(false);
    bridge.flush();
    expect(JSON.parse(values.get(STORAGE_KEY)!).assessments['AU-02'].freeNote).toBe('La última frase sin desenfocar.');
    bridge.setConclusion('A02-NO_CONCLUYENTE'); bridge.toggleLimitation('L02-CONTENIDO'); bridge.toggleRequest('S02-FLUJO');
    expect(new AuditStore().state.assessments['AU-02']).toMatchObject({ conclusionId: 'A02-NO_CONCLUYENTE', limitationIds: ['L02-CONTENIDO'], requestIds: ['S02-FLUJO'] });
  });

  it('confirma solo éxitos reales, agrupa pulsaciones y cancela escritura anterior al reiniciar', () => {
    const events: PersistenceEvent[] = []; store.subscribePersistence((event) => events.push(event));
    bridge.setFreeNote('a'); bridge.setFreeNote('ab'); bridge.setFreeNote('abc');
    expect(events.every((event) => event.status === 'pending')).toBe(true);
    vi.advanceTimersByTime(300);
    expect(events.filter((event) => event.status === 'saved')).toHaveLength(1);
    expect(events.at(-1)).toMatchObject({ change: 'note', reviewId: 'AU-02', status: 'saved' });
    vi.stubGlobal('localStorage', { setItem: () => { throw new Error('blocked'); }, removeItem: () => { throw new Error('blocked'); } });
    events.length = 0;
    bridge.setConclusion('A02-NO_CONCLUYENTE');
    expect(events.map((event) => event.status)).toEqual(['pending', 'session-only']);
    bridge.setFreeNote('texto anterior');
    store.reset(); workspace.reset();
    vi.advanceTimersByTime(300);
    expect(bridge.getAssessment().freeNote).toBe('');
    expect(events.at(-1)).toMatchObject({ status: 'session-only', change: 'reset' });
  });
});
