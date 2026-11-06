import type { AuditStore } from '../../audit/store';
import type { ApplicationContext, ApplicationDefinition, ApplicationRegistry, AppId, Bounds, ComputerDefinition, ComputerNavigation, MountedApplication, PersistenceEvent, Point } from '../../computer/types';
import type { WorkspaceStore } from '../../computer/workspace';
import { createReviewBridge } from '../../computer/reviewBridge';
import { deriveTaskProgress } from '../../computer/taskProgress';
import { computerAssets, computerIcons } from '../../data/computerAssets';
import type { ComputerIcon, ComputerIconKey } from '../../data/computerAssets';
import { escapeHtml } from '../dom';
import { fitNote, fitWindow, moveWindow, resizeWindow, usesSingleWindow } from './geometry';
import '../../desktop.css';

export type ComputerDesktopOptions = {
  computer: ComputerDefinition;
  registry: ApplicationRegistry;
  store: AuditStore;
  workspace: WorkspaceStore;
  // El coordinador conserva el último resultado al volver de libreta/entrevista.
  initialPersistence?: readonly PersistenceEvent[];
  navigation: Omit<ComputerNavigation, 'openApp'>;
};

type WindowView = { abort: AbortController; element: HTMLElement; body: HTMLElement; title: HTMLButtonElement; task: HTMLButtonElement; maximize: HTMLButtonElement; application: MountedApplication };
type Gesture = { abort: AbortController; finish: () => void };
let desktopId = 0;

/** Capa reutilizable. El coordinador de entrada/salida conserva el diálogo y la cámara. */
export class ComputerDesktop {
  readonly element: HTMLElement;
  private readonly options: ComputerDesktopOptions;
  private readonly review;
  private readonly navigation: ComputerNavigation;
  private readonly abort = new AbortController();
  private readonly unsubscribers: (() => void)[] = [];
  private readonly windows = new Map<AppId, WindowView>();
  private readonly shortcuts = new Map<AppId, HTMLButtonElement>();
  private readonly taskItems = new Map<string, { button: HTMLButtonElement; status: HTMLElement; hint: HTMLElement }>();
  private readonly area: HTMLElement;
  private readonly note: HTMLElement;
  private readonly menu: HTMLElement;
  private readonly start: HTMLButtonElement;
  private readonly tasks: HTMLElement;
  private readonly status: HTMLElement;
  private readonly progress: HTMLElement;
  private readonly observer: ResizeObserver;
  private readonly prefix = `pc-${++desktopId}`;
  private selectedAppId: AppId | null = null;
  private singleWindow = false;
  private lastArea = { width: 0, height: 0 };
  private rendering = false;
  private rerender = false;
  private disposed = false;
  private gesture: Gesture | null = null;
  private noticeTimer: ReturnType<typeof setTimeout> | null = null;
  private failedDomains = new Set<PersistenceEvent['domain']>();
  private lastRevision = new Map<PersistenceEvent['domain'], number>();

  constructor(host: HTMLElement, options: ComputerDesktopOptions) {
    this.options = options;
    this.review = createReviewBridge(options.store, options.workspace, options.computer.stationId);
    this.navigation = {
      openApp: (id) => this.openApp(id),
      openNotebook: () => this.navigate(options.navigation.openNotebook),
      openInterview: () => this.navigate(options.navigation.openInterview),
      exitToOffice: () => this.navigate(options.navigation.exitToOffice),
    };
    const asset = computerAssets.stations[options.computer.stationId];
    this.element = document.createElement('section');
    this.element.className = 'computer-session';
    this.element.setAttribute('aria-label', options.computer.title);
    this.element.innerHTML = `<div class="computer-hud">
      <div class="computer-hud-title"><strong>${escapeHtml(options.computer.title)}</strong><span data-progress></span></div>
      <p class="computer-save-status" role="status" aria-live="polite" aria-atomic="true">Trabajo en este equipo</p>
      <nav aria-label="Controles de la investigación"><button type="button" data-desktop-action="notebook">Libreta</button><button type="button" data-desktop-action="interview">Enlace de TI</button><button type="button" data-desktop-action="exit">Volver a la oficina <kbd>Esc</kbd></button></nav>
    </div>
    <div class="computer-monitor"><div class="computer-desktop" data-theme="${asset.theme}">
      <div class="pc-desktop-area"><div class="pc-shortcuts" role="group" aria-label="Programas del escritorio"></div>
        <aside class="pc-note" aria-label="Asuntos del puesto"><button type="button" class="pc-note-handle" title="Arrastrar la nota o mover con las flechas">Asuntos del puesto</button><h2>${escapeHtml(options.computer.title)}</h2><ul></ul></aside>
      </div>
      <div class="pc-start-menu" id="${this.prefix}-start-menu" hidden><div class="pc-start-heading">${escapeHtml(options.computer.title)}</div><div class="pc-start-programs" role="group" aria-label="Programas instalados"></div><div class="pc-start-footer"><button type="button" data-desktop-action="exit">Volver a la oficina</button></div></div>
      <div class="pc-taskbar" role="group" aria-label="Barra de tareas"><button type="button" class="pc-start" aria-expanded="false" aria-controls="${this.prefix}-start-menu"><img src="${computerAssets.branding.windowsFlag}" alt="">Inicio</button><button type="button" class="pc-show-desktop" title="Mostrar escritorio" aria-label="Mostrar escritorio"><span aria-hidden="true"></span></button><div class="pc-tasks" role="group" aria-label="Ventanas abiertas"></div><span class="pc-tray" title="Expediente local · sin conexión a producción">Local</span></div>
    </div><div class="computer-monitor-foot" aria-hidden="true"><span>REDNOVA</span><i></i></div></div>`;
    host.append(this.element);
    const query = <T extends Element>(selector: string) => this.element.querySelector<T>(selector)!;
    this.area = query('.pc-desktop-area');
    this.area.style.backgroundImage = `url("${asset.wallpaper}")`;
    this.note = query('.pc-note');
    this.menu = query('.pc-start-menu');
    this.start = query('.pc-start');
    this.tasks = query('.pc-tasks');
    this.status = query('.computer-save-status');
    this.progress = query('[data-progress]');
    for (const id of options.computer.shortcuts) {
      const definition = this.definition(id);
      if (!definition) continue;
      const shortcut = this.button(`<img src="${this.icon(definition.icon, 32)}" alt=""><span>${escapeHtml(definition.title)}</span>`, definition.title, 'pc-shortcut');
      shortcut.dataset.appId = id;
      shortcut.addEventListener('click', (event) => {
        this.selectedAppId = id;
        this.updateSelection();
        // Un toque abre; ratón selecciona y doble clic abre. Enter se atiende abajo.
        if ((event as PointerEvent).pointerType === 'touch' || (event as PointerEvent).pointerType === 'pen') this.openApp(id);
      }, { signal: this.abort.signal });
      shortcut.addEventListener('dblclick', () => this.openApp(id), { signal: this.abort.signal });
      shortcut.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { event.preventDefault(); this.openApp(id); }
      }, { signal: this.abort.signal });
      query('.pc-shortcuts').append(shortcut);
      this.shortcuts.set(id, shortcut);
    }
    for (const id of options.computer.installedApps) {
      const definition = this.definition(id);
      if (!definition) continue;
      const button = this.button(`<img src="${this.icon(definition.icon, 32)}" alt="">${escapeHtml(definition.title)}`, definition.title, 'pc-start-program');
      button.addEventListener('click', () => { this.setMenu(false); this.openApp(id); }, { signal: this.abort.signal });
      query('.pc-start-programs').append(button);
    }
    const noteList = this.note.querySelector('ul')!;
    for (const task of options.computer.note.tasks) {
      const li = document.createElement('li');
      const button = this.button(escapeHtml(task.label), task.label, 'pc-note-task');
      const status = document.createElement('small');
      const hint = document.createElement('p');
      hint.id = `${this.prefix}-${task.id}`;
      hint.className = 'pc-note-hint';
      hint.textContent = task.hint;
      button.setAttribute('aria-controls', hint.id);
      button.addEventListener('click', () => {
        const expanded = options.workspace.getStation(options.computer.stationId).note.expandedTaskId;
        options.workspace.setNote(options.computer.stationId, { expandedTaskId: expanded === task.id ? null : task.id });
      }, { signal: this.abort.signal });
      li.append(button, status, hint);
      noteList.append(li);
      this.taskItems.set(task.id, { button, status, hint });
    }
    this.start.addEventListener('click', () => this.setMenu(this.menu.hidden), { signal: this.abort.signal });
    query('.pc-show-desktop').addEventListener('click', () => {
      this.flush();
      this.setMenu(false);
      options.workspace.showDesktop(options.computer.stationId);
      (this.note.querySelector('button') as HTMLElement).focus();
    }, { signal: this.abort.signal });
    this.element.querySelectorAll<HTMLElement>('[data-desktop-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.desktopAction;
        if (action === 'notebook') this.navigation.openNotebook();
        else if (action === 'interview') this.navigation.openInterview();
        else this.navigation.exitToOffice();
      }, { signal: this.abort.signal });
    });
    this.element.addEventListener('keydown', (event) => this.onKeyDown(event), { signal: this.abort.signal });
    this.element.addEventListener('pointerdown', (event) => {
      if (!this.menu.hidden && !this.menu.contains(event.target as Node) && !this.start.contains(event.target as Node)) this.setMenu(false, false);
    }, { signal: this.abort.signal });
    const noteHandle = this.note.querySelector<HTMLButtonElement>('.pc-note-handle')!;
    noteHandle.addEventListener('pointerdown', (event) => this.dragNote(event), { signal: this.abort.signal });
    noteHandle.addEventListener('keydown', (event) => {
      const delta = this.arrowDelta(event);
      if (!delta) return;
      event.preventDefault();
      const position = options.workspace.getStation(options.computer.stationId).note.position;
      this.moveNote({ x: position.x + delta.x, y: position.y + delta.y });
    }, { signal: this.abort.signal });
    window.addEventListener('pagehide', () => this.flush(), { signal: this.abort.signal });
    this.unsubscribers.push(options.workspace.subscribe(() => this.render()), options.store.subscribe(() => this.updateAudit()));
    this.unsubscribers.push(options.workspace.subscribePersistence((event) => this.persistence(event)), options.store.subscribePersistence((event) => this.persistence(event)));
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(this.area);
    this.resize();
    this.render();
    this.updateAudit();
    // Recuperar un fallo no repite avisos académicos de una visita anterior.
    for (const event of options.initialPersistence ?? []) this.persistence({ ...event, change: 'layout' });
  }

  private definition<A extends AppId>(id: A): ApplicationDefinition<A> | undefined {
    if (!this.options.computer.installedApps.includes(id)) return undefined;
    return this.options.registry[id] as ApplicationDefinition<A> | undefined;
  }

  private icon(key: ComputerIconKey, size: 16 | 32): string {
    const classic = computerIcons.classic as Partial<Record<ComputerIconKey, ComputerIcon>>;
    const theme = computerAssets.stations[this.options.computer.stationId].theme;
    return (theme === 'server-classic' ? classic[key] ?? computerIcons.classic.document : computerIcons.xp[key]).sizes[size];
  }

  private button(html: string, label: string, className: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.innerHTML = html;
    button.setAttribute('aria-label', label);
    return button;
  }

  openApp(id: AppId): void {
    if (!this.definition(id) || this.disposed) return;
    this.flush();
    this.options.workspace.openApp(this.options.computer.stationId, id);
    this.windows.get(id)?.application.focus();
  }

  private mountWindow<A extends AppId>(id: A): WindowView | null {
    const definition = this.definition(id);
    if (!definition) return null;
    const abort = new AbortController();
    const element = document.createElement('section');
    element.className = 'pc-window';
    element.dataset.appId = id;
    element.setAttribute('role', 'region');
    element.setAttribute('aria-labelledby', `${this.prefix}-${id}-title`);
    element.innerHTML = `<div class="pc-window-titlebar"><img src="${this.icon(definition.icon, 16)}" alt=""><h2><button type="button" class="pc-window-title" id="${this.prefix}-${id}-title" title="Arrastrar o mover con las flechas">${escapeHtml(definition.title)}</button></h2><div class="pc-window-controls"><button type="button" data-window-action="minimize" aria-label="Minimizar ${escapeHtml(definition.title)}"><span class="pc-glyph-minimize" aria-hidden="true"></span></button><button type="button" data-window-action="maximize" aria-label="Maximizar ${escapeHtml(definition.title)}"><span class="pc-glyph-maximize" aria-hidden="true"></span></button><button type="button" class="pc-window-close" data-window-action="close" aria-label="Cerrar ${escapeHtml(definition.title)}"><span class="pc-glyph-close" aria-hidden="true"></span></button></div></div><div class="pc-window-body"></div><button type="button" class="pc-window-resize" aria-label="Redimensionar ${escapeHtml(definition.title)}" title="Arrastrar o redimensionar con las flechas"></button>`;
    const title = element.querySelector<HTMLButtonElement>('.pc-window-title')!;
    const body = element.querySelector<HTMLElement>('.pc-window-body')!;
    const maximize = element.querySelector<HTMLButtonElement>('[data-window-action="maximize"]')!;
    const task = this.button(`<img src="${this.icon(definition.icon, 16)}" alt=""><span>${escapeHtml(definition.title)}</span>`, definition.title, 'pc-task');
    task.dataset.appId = id;
    task.addEventListener('click', () => {
      const state = this.options.workspace.getStation(this.options.computer.stationId);
      if (state.activeAppId === id && !state.apps[id]?.window.minimized) this.windowAction(id, 'minimize');
      else this.openApp(id);
    }, { signal: abort.signal });
    element.addEventListener('pointerdown', () => this.activate(id), { signal: abort.signal });
    element.addEventListener('focusin', () => this.activate(id), { signal: abort.signal });
    element.querySelectorAll<HTMLElement>('[data-window-action]').forEach((button) => {
      button.addEventListener('click', () => this.windowAction(id, button.dataset.windowAction!), { signal: abort.signal });
    });
    title.addEventListener('dblclick', () => this.windowAction(id, 'maximize'), { signal: abort.signal });
    title.addEventListener('pointerdown', (event) => this.dragWindow(event, id, false), { signal: abort.signal });
    const resize = element.querySelector<HTMLButtonElement>('.pc-window-resize')!;
    resize.addEventListener('pointerdown', (event) => this.dragWindow(event, id, true), { signal: abort.signal });
    for (const [handle, resizing] of [[title, false], [resize, true]] as const) {
      handle.addEventListener('keydown', (event) => {
        const delta = this.arrowDelta(event);
        if (!delta || this.singleWindow) return;
        const state = this.options.workspace.getStation(this.options.computer.stationId).apps[id]!.window;
        if (state.mode === 'maximized') return;
        event.preventDefault();
        const bounds = resizing ? resizeWindow(state.bounds, delta, this.lastArea, definition.minSize) : moveWindow(state.bounds, delta, this.lastArea, definition.minSize);
        this.options.workspace.setBounds(this.options.computer.stationId, id, bounds);
      }, { signal: abort.signal });
    }
    this.area.append(element);
    this.tasks.append(task);
    // El contenido necesita su tamaño real antes de restaurar desplazamientos.
    const state = this.options.workspace.getStation(this.options.computer.stationId).apps[id]!.window;
    const bounds = this.singleWindow || state.mode === 'maximized' ? { x: 0, y: 0, ...this.lastArea } : fitWindow(state.bounds, this.lastArea, definition.minSize);
    Object.assign(element.style, { left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${bounds.width}px`, height: `${bounds.height}px` });
    const context: ApplicationContext<A> = { stationId: this.options.computer.stationId, reviewId: this.options.computer.reviewId, appId: id, store: this.options.store, workspace: this.options.workspace.forApp(this.options.computer.stationId, id), review: this.review, navigation: this.navigation };
    const application = definition.mount(body, context);
    return { abort, element, body, title, task, maximize, application };
  }

  private activate(id: AppId): void {
    if (this.options.workspace.getStation(this.options.computer.stationId).activeAppId === id) return;
    this.flush();
    this.options.workspace.activateApp(this.options.computer.stationId, id);
  }

  private windowAction(id: AppId, action: string): void {
    this.flush();
    this.gesture?.finish();
    const workspace = this.options.workspace;
    const station = this.options.computer.stationId;
    if (action === 'close') workspace.closeApp(station, id);
    else if (action === 'minimize') workspace.minimizeApp(station, id);
    else workspace.toggleMaximize(station, id);
    const active = workspace.getStation(station).activeAppId;
    if (active) this.windows.get(active)?.application.focus();
    else this.start.focus();
  }

  private render(): void {
    if (this.disposed) return;
    if (this.rendering) { this.rerender = true; return; }
    this.rendering = true;
    try {
      do {
        this.rerender = false;
        const state = this.options.workspace.getStation(this.options.computer.stationId);
        for (const [id, view] of this.windows) {
          if (state.apps[id]?.window.open) continue;
          view.application.flush();
          view.application.dispose();
          view.abort.abort();
          view.element.remove();
          view.task.remove();
          this.windows.delete(id);
        }
        for (const [order, id] of state.windowOrder.entries()) {
          const appState = state.apps[id];
          if (!appState?.window.open) continue;
          let view = this.windows.get(id);
          if (!view) {
            const mounted = this.mountWindow(id);
            if (!mounted) continue;
            view = mounted;
            this.windows.set(id, view);
          }
          const active = state.activeAppId === id;
          const maximized = this.singleWindow || appState.window.mode === 'maximized';
          const bounds = maximized ? { x: 0, y: 0, ...this.lastArea } : fitWindow(appState.window.bounds, this.lastArea, this.definition(id)!.minSize);
          view.element.hidden = appState.window.minimized || (this.singleWindow && !active);
          view.element.classList.toggle('is-active', active);
          view.element.classList.toggle('is-maximized', maximized);
          Object.assign(view.element.style, { left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${bounds.width}px`, height: `${bounds.height}px`, zIndex: String(order + 2) });
          view.maximize.setAttribute('aria-label', `${maximized ? 'Restaurar' : 'Maximizar'} ${this.definition(id)!.title}`);
          view.maximize.disabled = this.singleWindow;
          view.maximize.classList.toggle('is-restoring', maximized);
          view.task.classList.toggle('is-active', active);
          view.task.setAttribute('aria-pressed', String(active));
          view.task.title = `${this.definition(id)!.title}${appState.window.minimized ? ' · minimizado' : ''}`;
        }
        const position = fitNote(state.note.position, this.lastArea, { width: this.note.offsetWidth, height: this.note.offsetHeight });
        Object.assign(this.note.style, { left: `${position.x}px`, top: `${position.y}px` });
        for (const [id, item] of this.taskItems) {
          const expanded = state.note.expandedTaskId === id;
          item.button.setAttribute('aria-expanded', String(expanded));
          item.hint.hidden = !expanded;
        }
      } while (this.rerender);
    } finally { this.rendering = false; }
  }

  private updateAudit(): void {
    if (this.disposed) return;
    for (const task of deriveTaskProgress(this.options.computer, this.options.store.state)) {
      const item = this.taskItems.get(task.taskId);
      if (!item) continue;
      item.status.textContent = task.label;
      item.status.classList.toggle('is-satisfied', task.satisfied);
    }
    this.progress.textContent = this.review.getEvaluation().status;
    this.element.dataset.projector = String(this.options.store.state.settings.projector);
    this.element.dataset.reducedMotion = String(this.options.store.state.settings.reducedMotion);
    this.resize();
  }

  private resize(): void {
    if (this.disposed) return;
    const next = { width: this.area.clientWidth, height: this.area.clientHeight };
    if (!next.width || !next.height) return;
    const singleWindow = usesSingleWindow(next, this.options.store.state.settings.projector);
    if (next.width === this.lastArea.width && next.height === this.lastArea.height && singleWindow === this.singleWindow) return;
    this.gesture?.finish();
    this.lastArea = next;
    this.singleWindow = singleWindow;
    this.element.dataset.singleWindow = String(singleWindow);
    // En móvil se proyecta una ventana: no se sobrescribe la disposición amplia.
    if (!singleWindow) this.options.workspace.constrain(this.options.computer.stationId, next);
    this.render();
  }

  private updateSelection(): void {
    for (const [id, shortcut] of this.shortcuts) shortcut.classList.toggle('is-selected', this.selectedAppId === id);
  }

  private setMenu(open: boolean, focus = true): void {
    this.menu.hidden = !open;
    this.start.setAttribute('aria-expanded', String(open));
    if (focus) {
      if (open) this.menu.querySelector<HTMLButtonElement>('button')?.focus();
      else this.start.focus();
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (this.gesture) this.gesture.finish();
      else if (!this.menu.hidden) this.setMenu(false);
      else this.navigation.exitToOffice();
    } else if (!this.menu.hidden && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const buttons = [...this.menu.querySelectorAll<HTMLButtonElement>('button')];
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }
  }

  private arrowDelta(event: KeyboardEvent): Point | null {
    const step = event.shiftKey ? 20 : 4;
    return ({ ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 }, ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step } } as Record<string, Point>)[event.key] ?? null;
  }

  private beginGesture(event: PointerEvent, move: (delta: Point) => void): void {
    if (event.button !== 0) return;
    event.preventDefault();
    this.gesture?.finish();
    const abort = new AbortController();
    const origin = { x: event.clientX, y: event.clientY };
    const pointerId = event.pointerId;
    const finish = () => {
      abort.abort();
      this.gesture = null;
      this.element.classList.remove('is-dragging');
      this.flush();
    };
    this.gesture = { abort, finish };
    this.element.classList.add('is-dragging');
    window.addEventListener('pointermove', (next) => { if (next.pointerId === pointerId) move({ x: next.clientX - origin.x, y: next.clientY - origin.y }); }, { signal: abort.signal });
    window.addEventListener('pointerup', (next) => { if (next.pointerId === pointerId) finish(); }, { signal: abort.signal });
    window.addEventListener('pointercancel', finish, { signal: abort.signal });
    window.addEventListener('blur', finish, { signal: abort.signal });
  }

  private dragWindow(event: PointerEvent, id: AppId, resizing: boolean): void {
    this.activate(id);
    const state = this.options.workspace.getStation(this.options.computer.stationId).apps[id]!.window;
    if (this.singleWindow || state.mode === 'maximized') return;
    const bounds: Bounds = { ...state.bounds };
    const minSize = this.definition(id)!.minSize;
    this.beginGesture(event, (delta) => {
      const next = resizing ? resizeWindow(bounds, delta, this.lastArea, minSize) : moveWindow(bounds, delta, this.lastArea, minSize);
      this.options.workspace.setBounds(this.options.computer.stationId, id, next);
    });
    this.windows.get(id)?.title.focus();
  }

  private dragNote(event: PointerEvent): void {
    const position = { ...this.options.workspace.getStation(this.options.computer.stationId).note.position };
    this.beginGesture(event, (delta) => this.moveNote({ x: position.x + delta.x, y: position.y + delta.y }));
    this.note.querySelector<HTMLButtonElement>('button')?.focus();
  }

  private moveNote(position: Point): void {
    this.options.workspace.setNote(this.options.computer.stationId, { position: fitNote(position, this.lastArea, { width: this.note.offsetWidth, height: this.note.offsetHeight }) });
  }

  private persistence(event: PersistenceEvent): void {
    if (this.disposed) return;
    const previous = this.lastRevision.get(event.domain) ?? -1;
    if (event.revision < previous) return;
    this.lastRevision.set(event.domain, event.revision);
    if (event.status === 'session-only') this.failedDomains.add(event.domain);
    else if (event.status === 'saved') this.failedDomains.delete(event.domain);
    if (this.failedDomains.size) {
      if (this.noticeTimer) clearTimeout(this.noticeTimer);
      this.status.textContent = 'Solo en esta sesión';
      this.status.dataset.status = 'session-only';
      return;
    }
    const relevant = event.domain === 'audit' && ['inspection', 'source', 'check', 'conclusion', 'note', 'recommendation', 'interview'].includes(event.change) && (!event.reviewId || event.reviewId === this.options.computer.reviewId);
    if (!relevant) {
      if (this.status.dataset.status === 'session-only') { this.status.textContent = 'Guardado local'; this.status.dataset.status = 'saved'; }
      return;
    }
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    if (event.status === 'pending') {
      this.status.textContent = 'Guardado pendiente';
      this.status.dataset.status = 'pending';
    } else {
      this.noticeTimer = setTimeout(() => {
        this.noticeTimer = null;
        this.status.textContent = event.change === 'conclusion' ? 'Conclusión guardada' : 'Libreta actualizada';
        this.status.dataset.status = 'saved';
      }, 180);
    }
  }

  private navigate(action: () => void): void {
    this.gesture?.finish();
    this.setMenu(false, false);
    this.flush();
    action();
  }

  focus(): void {
    const active = this.options.workspace.getStation(this.options.computer.stationId).activeAppId;
    if (active && this.windows.has(active)) this.windows.get(active)!.application.focus();
    else this.start.focus();
  }

  flush(): void {
    for (const view of this.windows.values()) view.application.flush();
    this.review.flush();
    this.options.workspace.flush();
  }

  dispose(): void {
    if (this.disposed) return;
    this.gesture?.finish();
    this.flush();
    this.disposed = true;
    this.abort.abort();
    this.observer.disconnect();
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    for (const view of this.windows.values()) { view.application.dispose(); view.abort.abort(); }
    this.windows.clear();
    this.review.dispose();
    if (this.noticeTimer) clearTimeout(this.noticeTimer);
    this.element.remove();
  }
}
