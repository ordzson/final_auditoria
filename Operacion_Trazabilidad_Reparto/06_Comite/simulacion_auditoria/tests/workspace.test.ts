import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuditStore, STORAGE_KEY } from '../src/audit/store';
import { computers } from '../src/data/computers';
import { restoreWorkspace, WORKSPACE_STORAGE_KEY, WorkspaceStore } from '../src/computer/workspace';
import type { PersistenceEvent } from '../src/computer/types';

let values: Map<string, string>;
beforeEach(() => {
  vi.useFakeTimers(); values = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('espacio de trabajo aislado de las computadoras', () => {
  it('abre una instancia, conserva borrador y geometría al minimizar, cerrar y recargar', () => {
    const workspace = new WorkspaceStore(computers);
    const port = workspace.forApp('sql_red', 'query-studio');
    port.patchDraft({ query: 'SELECT * FROM soportes;' });
    port.patchDraft({ lastExecutedQuery: 'SELECT * FROM soportes;' });
    workspace.setBounds('sql_red', 'query-studio', { x: 25, y: 35, width: 600, height: 450 });
    workspace.toggleMaximize('sql_red', 'query-studio');
    workspace.minimizeApp('sql_red', 'query-studio');
    expect(workspace.getStation('sql_red').apps['query-studio']?.window.mode).toBe('maximized');
    workspace.openApp('sql_red', 'query-studio'); workspace.openApp('sql_red', 'query-studio');
    expect(workspace.getStation('sql_red').windowOrder.filter((id) => id === 'query-studio')).toHaveLength(1);
    workspace.closeApp('sql_red', 'query-studio');
    workspace.openApp('sql_red', 'query-studio'); workspace.flush();
    const restored = new WorkspaceStore(computers);
    expect(restored.forApp('sql_red', 'query-studio').getDraft().query).toBe('SELECT * FROM soportes;');
    expect(restored.forApp('sql_red', 'query-studio').getDraft().lastExecutedQuery).toBe('SELECT * FROM soportes;');
    expect(restored.getStation('sql_red').apps['query-studio']?.window.bounds).toEqual({ x: 25, y: 35, width: 600, height: 450 });
    port.patchDraft({ query: 'SELECT * FROM registros;' });
    expect(port.getDraft().lastExecutedQuery).toBeNull();
    workspace.dispose(); restored.dispose();
  });

  it('Mostrar escritorio conserva ventanas y permite recuperar su orden y tarea', () => {
    const workspace = new WorkspaceStore(computers);
    workspace.showDesktop('sql_red');
    expect(workspace.getStation('sql_red').activeAppId).toBeNull();
    expect(workspace.getStation('sql_red').apps['query-studio']?.window.open).toBe(true);
    workspace.activateApp('sql_red', 'network-monitor');
    expect(workspace.getStation('sql_red').activeAppId).toBe('network-monitor');
    expect(workspace.getStation('sql_red').windowOrder.at(-1)).toBe('network-monitor');
    expect(workspace.getStation('sql_red').apps['query-studio']?.window.minimized).toBe(true);
    workspace.dispose();
  });

  it('aísla filtros, comparación y suscripciones, y rechaza programas o fuentes ajenos', () => {
    const workspace = new WorkspaceStore(computers);
    const b = workspace.forApp('sql_red', 'network-monitor');
    const a = workspace.forApp('accesos', 'session-viewer');
    const listener = vi.fn(); a.subscribe(listener);
    b.patchDraft({ search: 'exterior', selectedSourceId: 'EVT-05' });
    b.setComparison(['EVT-04', 'EVT-05']);
    expect(a.getDraft().search).toBe(''); expect(a.getComparison()).toEqual([]); expect(listener).not.toHaveBeenCalled();
    expect(() => workspace.openApp('accesos', 'query-studio')).toThrow('no instalado');
    expect(() => b.setComparison(['EVT-04', 'EVT-05', 'E-03'])).toThrow('dos fuentes');
    expect(() => b.setComparison(['META-CUSTODIA'])).toThrow('dos fuentes');
    workspace.dispose();
  });

  it('restaura cada PC de forma independiente y descarta versión, apps o datos desconocidos', () => {
    const workspace = new WorkspaceStore(computers);
    workspace.forApp('sql_red', 'query-studio').patchDraft({ query: 'SELECT * FROM soportes;' });
    workspace.flush();
    const saved = JSON.parse(values.get(WORKSPACE_STORAGE_KEY)!);
    saved.stations.accesos.apps['session-viewer'].window.bounds.width = -1;
    saved.stations.sql_red.windowOrder.push('query-studio', 'unknown');
    saved.stations.sql_red.apps.unknown = { window: { open: true } };
    saved.stations.sql_red.pendingChecks.hacked = { answerId: 'hacked', sourceIds: ['hacked'] };
    const restored = restoreWorkspace(JSON.stringify(saved), computers);
    expect(restored.stations.sql_red?.apps['query-studio']?.draft.query).toBe('SELECT * FROM soportes;');
    expect(restored.stations.accesos?.apps['session-viewer']?.window.bounds.width).toBe(640);
    expect(restored.stations.sql_red?.windowOrder).toHaveLength(2);
    expect(restored.stations.sql_red?.pendingChecks).toEqual({});
    expect(restoreWorkspace('{', computers).stations.sql_red?.activeAppId).toBe('query-studio');
    expect(restoreWorkspace('{"schemaVersion":2}', computers).schemaVersion).toBe(1);
    workspace.dispose();
  });

  it('limita ventana y nota a un área pequeña y rechaza números no finitos', () => {
    const workspace = new WorkspaceStore(computers);
    workspace.setBounds('sql_red', 'query-studio', { x: 9000, y: 5000, width: 4000, height: 3000 });
    workspace.setNote('sql_red', { position: { x: -100, y: 10000 } });
    workspace.constrain('sql_red', { width: 390, height: 500 });
    expect(workspace.getStation('sql_red').apps['query-studio']?.window.bounds).toEqual({ x: 0, y: 0, width: 390, height: 500 });
    expect(workspace.getStation('sql_red').note.position).toEqual({ x: 0, y: 300 });
    expect(() => workspace.setBounds('sql_red', 'query-studio', { x: NaN, y: 0, width: 200, height: 200 })).toThrow();
    workspace.dispose();
  });

  it('normaliza borradores, comparaciones y contrastes al restaurar sin conceder actividad', () => {
    const saved = restoreWorkspace(null, computers);
    const b = saved.stations.sql_red!;
    b.apps['query-studio']!.draft.query = 'SELECT * FROM soportes;';
    b.apps['query-studio']!.draft.lastExecutedQuery = 'SELECT * FROM registros;';
    b.apps['query-studio']!.draft.selectedSourceId = 'META-CUSTODIA';
    b.apps['query-studio']!.draft.scroll = { table: { x: -3, y: 15 } };
    b.comparisonSourceIds = ['EVT-04', 'EVT-04', 'META-CUSTODIA', 'EVT-05'];
    b.pendingChecks = {
      'C02-CONTENIDO': { answerId: 'SIN_VINCULO_NI_CONTENIDO', sourceIds: ['EVT-04', 'EVT-04', 'META-CUSTODIA'] },
      invalid: { answerId: 'invalid', sourceIds: [] },
    };
    const restored = restoreWorkspace(JSON.stringify(saved), computers).stations.sql_red!;
    expect(restored.apps['query-studio']!.draft).toMatchObject({
      query: 'SELECT * FROM soportes;', lastExecutedQuery: null, selectedSourceId: null, scroll: { table: { x: 0, y: 15 } },
    });
    expect(restored.comparisonSourceIds).toEqual(['EVT-04', 'EVT-05']);
    expect(restored.pendingChecks).toEqual({ 'C02-CONTENIDO': { answerId: 'SIN_VINCULO_NI_CONTENIDO', sourceIds: ['EVT-04'] } });
    expect(values.has(STORAGE_KEY)).toBe(false);
  });

  it('agrupa escritura, informa fallos reales y reinicia sin tocar auditoría v2', () => {
    const audit = new AuditStore(); audit.setConclusion('AU-02', 'A02-NO_CONCLUYENTE');
    const before = values.get(STORAGE_KEY);
    const workspace = new WorkspaceStore(computers);
    const events: PersistenceEvent[] = []; workspace.subscribePersistence((event) => events.push(event));
    workspace.forApp('sql_red', 'query-studio').patchDraft({ query: 'SELECT' });
    expect(values.has(WORKSPACE_STORAGE_KEY)).toBe(false);
    vi.advanceTimersByTime(300);
    expect(events.at(-1)?.status).toBe('saved');
    vi.stubGlobal('localStorage', { setItem: () => { throw new Error('blocked'); }, removeItem: () => { throw new Error('blocked'); } });
    workspace.forApp('sql_red', 'query-studio').patchDraft({ query: 'SELECT *' });
    workspace.flush(); expect(events.at(-1)?.status).toBe('session-only');
    workspace.reset(); expect(events.at(-1)).toMatchObject({ status: 'session-only', change: 'reset' });
    expect(workspace.getStation('sql_red').pendingChecks).toEqual({});
    expect(workspace.forApp('sql_red', 'query-studio').getDraft().query).not.toBe('SELECT *');
    expect(values.get(STORAGE_KEY)).toBe(before);
    workspace.dispose();
  });
});
