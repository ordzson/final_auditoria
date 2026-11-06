import type { StationId } from '../audit/types';
import { reviewRules } from '../audit/rules';
import { computerSourceIds } from '../data/computers';
import type {
  AppId, AppDrafts, ApplicationState, ApplicationWorkspace, Bounds, ComputerDefinition,
  PendingCheck, PersistenceChange, PersistenceEvent, Point, ScrollPositions, StationWorkspace, WorkspaceState,
} from './types';

export const WORKSPACE_STORAGE_KEY = 'rednova.computers.workspace.v1';
const delay = 300;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const object = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const validPoint = (value: unknown): value is Point => object(value) && finite(value.x) && finite(value.y);
const validBounds = (value: unknown): value is Bounds => object(value) && finite(value.x) && finite(value.y)
  && finite(value.width) && finite(value.height) && value.width > 0 && value.height > 0;

function defaultDraft<A extends AppId>(appId: A): AppDrafts[A] {
  const record = { search: '', selectedSourceId: null, scroll: {} };
  if (appId === 'station-report') return { scroll: {} } as AppDrafts[A];
  if (appId === 'query-studio') return { ...record, query: "SELECT hora, sistema, cuenta, detalle FROM registros WHERE sistema = 'SQL Server' OR sistema = 'Monitoreo de red' ORDER BY fecha, hora;", lastExecutedQuery: null } as AppDrafts[A];
  if (appId === 'recovery-console') return { ...record, recoveryStep: 0 } as AppDrafts[A];
  return record as AppDrafts[A];
}

function initialStation(computer: ComputerDefinition): StationWorkspace {
  const apps: StationWorkspace['apps'] = {};
  for (const appId of computer.installedApps) {
    const initial = computer.initialWindows.find((item) => item.appId === appId);
    apps[appId] = {
      window: { open: Boolean(initial), minimized: false, mode: initial?.mode ?? 'normal', bounds: clone(initial?.bounds ?? { x: 240, y: 40, width: 600, height: 420 }) },
      draft: defaultDraft(appId),
    } as never;
  }
  const order = computer.initialWindows.map((item) => item.appId).filter((appId) => appId !== computer.initialActiveAppId);
  if (computer.initialWindows.some((item) => item.appId === computer.initialActiveAppId)) order.push(computer.initialActiveAppId);
  return { apps, activeAppId: order.at(-1) ?? null, windowOrder: order,
    note: { position: clone(computer.note.position), expandedTaskId: null }, comparisonSourceIds: [], pendingChecks: {} };
}

function restoreDraft<A extends AppId>(appId: A, value: unknown, sources: string[]): AppDrafts[A] {
  const result = defaultDraft(appId);
  if (!object(value)) return result;
  const scroll: ScrollPositions = {};
  if (object(value.scroll)) for (const [key, position] of Object.entries(value.scroll)) {
    if (validPoint(position)) scroll[key] = { x: Math.max(0, position.x), y: Math.max(0, position.y) };
  }
  Object.assign(result, { scroll });
  if (appId !== 'station-report') Object.assign(result, {
    search: typeof value.search === 'string' ? value.search : '',
    selectedSourceId: typeof value.selectedSourceId === 'string' && sources.includes(value.selectedSourceId) ? value.selectedSourceId : null,
  });
  if (appId === 'query-studio') Object.assign(result, {
    query: typeof value.query === 'string' ? value.query : defaultDraft('query-studio').query,
    lastExecutedQuery: typeof value.lastExecutedQuery === 'string' && value.lastExecutedQuery === value.query ? value.lastExecutedQuery : null,
  });
  if (appId === 'recovery-console') Object.assign(result, { recoveryStep: finite(value.recoveryStep) ? Math.max(0, Math.min(4, Math.floor(value.recoveryStep))) : 0 });
  return result;
}

function restoreStation(computer: ComputerDefinition, value: unknown): StationWorkspace {
  const fallback = initialStation(computer);
  if (!object(value) || !object(value.apps) || !object(value.note) || !validPoint(value.note.position)
    || !Array.isArray(value.windowOrder) || !Array.isArray(value.comparisonSourceIds) || !object(value.pendingChecks)) return fallback;
  const sources = computerSourceIds(computer.stationId);
  for (const appId of computer.installedApps) {
    const entry = value.apps[appId];
    if (!object(entry) || !object(entry.window) || !validBounds(entry.window.bounds)
      || typeof entry.window.open !== 'boolean' || typeof entry.window.minimized !== 'boolean'
      || !['normal', 'maximized'].includes(String(entry.window.mode))) return fallback;
    fallback.apps[appId] = {
      window: { open: entry.window.open, minimized: entry.window.open && entry.window.minimized,
        mode: entry.window.mode as 'normal' | 'maximized', bounds: { ...entry.window.bounds } },
      draft: restoreDraft(appId, entry.draft, sources),
    } as never;
  }
  fallback.windowOrder = [...new Set(value.windowOrder.filter((id): id is AppId => typeof id === 'string'
    && computer.installedApps.includes(id as AppId) && fallback.apps[id as AppId]?.window.open === true))];
  for (const appId of computer.installedApps) if (fallback.apps[appId]?.window.open && !fallback.windowOrder.includes(appId)) fallback.windowOrder.push(appId);
  const active = value.activeAppId as AppId;
  fallback.activeAppId = fallback.windowOrder.includes(active) && !fallback.apps[active]?.window.minimized
    ? active : [...fallback.windowOrder].reverse().find((id) => !fallback.apps[id]?.window.minimized) ?? null;
  if (fallback.activeAppId) fallback.windowOrder = [...fallback.windowOrder.filter((id) => id !== fallback.activeAppId), fallback.activeAppId];
  const note = value.note;
  fallback.note = { position: { ...(note.position as Point) }, expandedTaskId: typeof note.expandedTaskId === 'string'
    && computer.note.tasks.some((task) => task.id === note.expandedTaskId) ? note.expandedTaskId : null };
  fallback.comparisonSourceIds = [...new Set(value.comparisonSourceIds.filter((id): id is string => typeof id === 'string' && sources.includes(id)))].slice(0, 2);
  const rule = reviewRules[computer.reviewId];
  for (const check of rule.checks) {
    const draft = value.pendingChecks[check.id];
    if (object(draft) && check.options.some((option) => option.id === draft.answerId) && Array.isArray(draft.sourceIds)) {
      fallback.pendingChecks[check.id] = { answerId: String(draft.answerId), sourceIds: [...new Set(draft.sourceIds.filter((id): id is string => typeof id === 'string' && sources.includes(id)))] };
    }
  }
  return fallback;
}

export function restoreWorkspace(raw: string | null, computers: readonly ComputerDefinition[]): WorkspaceState {
  let saved: unknown;
  try { saved = raw ? JSON.parse(raw) : null; } catch { saved = null; }
  const stations = object(saved) && saved.schemaVersion === 1 && object(saved.stations) ? saved.stations : {};
  return { schemaVersion: 1, stations: Object.fromEntries(computers.map((computer) => [computer.stationId, restoreStation(computer, stations[computer.stationId])])) };
}

export class WorkspaceStore {
  private state: WorkspaceState;
  private listeners = new Set<() => void>();
  private persistenceListeners = new Set<(event: PersistenceEvent) => void>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private revision = 0;
  private pending: PersistenceChange | null = null;
  private readonly onPageHide = () => this.flush();

  constructor(private readonly computers: readonly ComputerDefinition[]) {
    let raw: string | null = null;
    try { raw = localStorage.getItem(WORKSPACE_STORAGE_KEY); } catch { /* Sesión sin almacenamiento. */ }
    this.state = restoreWorkspace(raw, computers);
    if (typeof window !== 'undefined') window.addEventListener('pagehide', this.onPageHide);
  }

  getStation(stationId: StationId): Readonly<StationWorkspace> {
    const station = this.state.stations[stationId];
    if (!station) throw new Error('Computadora no admitida.');
    return station;
  }

  private mutableStation(stationId: StationId): StationWorkspace {
    return this.getStation(stationId) as StationWorkspace;
  }

  private computer(stationId: StationId): ComputerDefinition {
    const computer = this.computers.find((item) => item.stationId === stationId);
    if (!computer) throw new Error('Computadora no admitida.');
    return computer;
  }

  private app<A extends AppId>(stationId: StationId, appId: A): ApplicationState<A> {
    if (!this.computer(stationId).installedApps.includes(appId)) throw new Error('Programa no instalado en esta computadora.');
    return this.getStation(stationId).apps[appId] as ApplicationState<A>;
  }

  private emit(status: PersistenceEvent['status'], change: PersistenceChange): void {
    const event: PersistenceEvent = { domain: 'workspace', status, change, revision: this.revision };
    this.persistenceListeners.forEach((listener) => listener(event));
  }

  private changed(change: PersistenceChange): void {
    clearTimeout(this.timer);
    this.pending = change;
    this.revision++;
    this.emit('pending', change);
    this.timer = setTimeout(() => this.flush(), delay);
    this.listeners.forEach((listener) => listener());
  }

  forApp<A extends AppId>(stationId: StationId, appId: A): ApplicationWorkspace<A> {
    this.app(stationId, appId);
    return {
      getDraft: () => this.app(stationId, appId).draft,
      patchDraft: (patch) => {
        const current = this.app(stationId, appId);
        const draft = { ...current.draft, ...patch };
        if (appId === 'query-studio' && 'query' in patch && (patch as Partial<AppDrafts['query-studio']>).query !== (current.draft as AppDrafts['query-studio']).query) {
          (draft as AppDrafts['query-studio']).lastExecutedQuery = null;
        }
        current.draft = restoreDraft(appId, draft, computerSourceIds(stationId));
        this.changed('draft');
      },
      getComparison: () => this.getStation(stationId).comparisonSourceIds,
      setComparison: (sourceIds) => {
        const admitted = computerSourceIds(stationId);
        const unique = [...new Set(sourceIds)];
        if (unique.length > 2 || unique.some((id) => !admitted.includes(id))) throw new Error('Selecciona hasta dos fuentes de esta computadora.');
        this.getStation(stationId).comparisonSourceIds.splice(0, 2, ...unique);
        this.changed('draft');
      },
      subscribe: (listener) => {
        let previous = JSON.stringify([this.app(stationId, appId).draft, this.getStation(stationId).comparisonSourceIds, this.getStation(stationId).pendingChecks]);
        return this.subscribe(() => {
          const next = JSON.stringify([this.app(stationId, appId).draft, this.getStation(stationId).comparisonSourceIds, this.getStation(stationId).pendingChecks]);
          if (next !== previous) { previous = next; listener(); }
        });
      },
      flush: () => this.flush(),
    };
  }

  openApp(stationId: StationId, appId: AppId): void {
    this.flush();
    const app = this.app(stationId, appId);
    app.window.open = true; app.window.minimized = false;
    this.activateApp(stationId, appId);
  }

  activateApp(stationId: StationId, appId: AppId): void {
    const app = this.app(stationId, appId);
    if (!app.window.open) return;
    const station = this.mutableStation(stationId);
    if (station.activeAppId === appId && !app.window.minimized && station.windowOrder.at(-1) === appId) return;
    this.flush();
    app.window.minimized = false;
    station.activeAppId = appId;
    station.windowOrder.splice(0, station.windowOrder.length, ...station.windowOrder.filter((id) => id !== appId), appId);
    this.changed('layout');
  }

  private nextActive(station: StationWorkspace): void {
    station.activeAppId = [...station.windowOrder].reverse().find((id) => station.apps[id]?.window.open && !station.apps[id]?.window.minimized) ?? null;
  }

  closeApp(stationId: StationId, appId: AppId): void {
    this.flush();
    const app = this.app(stationId, appId);
    app.window.open = false; app.window.minimized = false;
    const station = this.mutableStation(stationId);
    station.windowOrder.splice(0, station.windowOrder.length, ...station.windowOrder.filter((id) => id !== appId));
    this.nextActive(station); this.changed('layout');
  }

  minimizeApp(stationId: StationId, appId: AppId): void {
    this.flush();
    const app = this.app(stationId, appId);
    if (!app.window.open) return;
    app.window.minimized = true;
    this.nextActive(this.mutableStation(stationId)); this.changed('layout');
  }

  toggleMaximize(stationId: StationId, appId: AppId): void {
    const app = this.app(stationId, appId);
    app.window.mode = app.window.mode === 'maximized' ? 'normal' : 'maximized';
    this.changed('layout');
  }

  setBounds(stationId: StationId, appId: AppId, bounds: Bounds): void {
    if (!validBounds(bounds)) throw new Error('Geometría de ventana no válida.');
    this.app(stationId, appId).window.bounds = { ...bounds };
    this.changed('layout');
  }

  showDesktop(stationId: StationId): void {
    this.flush();
    const station = this.mutableStation(stationId);
    station.windowOrder.forEach((id) => { this.app(stationId, id).window.minimized = true; });
    station.activeAppId = null; this.changed('layout');
  }

  setNote(stationId: StationId, patch: Partial<StationWorkspace['note']>): void {
    const station = this.mutableStation(stationId);
    if (patch.position && !validPoint(patch.position)) throw new Error('Posición de nota no válida.');
    if (patch.expandedTaskId != null && !this.computer(stationId).note.tasks.some((task) => task.id === patch.expandedTaskId)) throw new Error('Asunto no admitido.');
    station.note = { ...station.note, ...patch, ...(patch.position ? { position: { ...patch.position } } : {}) };
    this.changed('layout');
  }

  setPendingCheck(stationId: StationId, checkId: string, draft: PendingCheck | null): void {
    const check = reviewRules[this.computer(stationId).reviewId].checks.find((item) => item.id === checkId);
    if (!check || (draft && (!check.options.some((option) => option.id === draft.answerId)
      || draft.sourceIds.some((id) => !computerSourceIds(stationId).includes(id))))) throw new Error('Borrador de contraste no admitido.');
    const station = this.mutableStation(stationId);
    if (draft) station.pendingChecks[checkId] = { answerId: draft.answerId, sourceIds: [...new Set(draft.sourceIds)] };
    else delete station.pendingChecks[checkId];
    this.changed('draft');
  }

  constrain(stationId: StationId, area: { width: number; height: number }): void {
    if (!finite(area.width) || !finite(area.height) || area.width <= 0 || area.height <= 0) return;
    const station = this.mutableStation(stationId);
    const before = JSON.stringify([station.apps, station.note.position]);
    for (const appId of this.computer(stationId).installedApps) {
      const bounds = this.app(stationId, appId).window.bounds;
      bounds.width = Math.min(area.width, Math.max(Math.min(300, area.width), bounds.width));
      bounds.height = Math.min(area.height, Math.max(Math.min(180, area.height), bounds.height));
      bounds.x = Math.max(0, Math.min(area.width - bounds.width, bounds.x));
      bounds.y = Math.max(0, Math.min(area.height - bounds.height, bounds.y));
    }
    station.note.position.x = Math.max(0, Math.min(Math.max(0, area.width - 210), station.note.position.x));
    station.note.position.y = Math.max(0, Math.min(Math.max(0, area.height - 200), station.note.position.y));
    if (JSON.stringify([station.apps, station.note.position]) !== before) this.changed('layout');
  }

  subscribe(listener: () => void): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); }
  subscribePersistence(listener: (event: PersistenceEvent) => void): () => void {
    this.persistenceListeners.add(listener); return () => this.persistenceListeners.delete(listener);
  }

  flush(): void {
    clearTimeout(this.timer); this.timer = undefined;
    const change = this.pending;
    if (!change) return;
    this.pending = null;
    let status: PersistenceEvent['status'] = 'saved';
    try { localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(this.state)); } catch { status = 'session-only'; }
    this.emit(status, change);
  }

  reset(): void {
    clearTimeout(this.timer); this.timer = undefined; this.pending = null;
    this.state = restoreWorkspace(null, this.computers); this.revision++;
    this.emit('pending', 'reset');
    let status: PersistenceEvent['status'] = 'saved';
    try { localStorage.removeItem(WORKSPACE_STORAGE_KEY); } catch { status = 'session-only'; }
    this.emit(status, 'reset'); this.listeners.forEach((listener) => listener());
  }

  dispose(): void {
    this.flush();
    if (typeof window !== 'undefined') window.removeEventListener('pagehide', this.onPageHide);
    this.listeners.clear(); this.persistenceListeners.clear();
  }
}
