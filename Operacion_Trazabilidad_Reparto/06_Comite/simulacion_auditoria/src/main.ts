import './styles.css';
import './interview.css';
import './computer.css';
import { documentedCount, evaluateReview } from './audit/evaluate';
import { reviewIds } from './audit/rules';
import { AuditStore } from './audit/store';
import type { ReviewId, StationId } from './audit/types';
import { registryForComputer } from './computer/registry';
import type { PersistenceEvent } from './computer/types';
import { WorkspaceStore } from './computer/workspace';
import { computers, getComputer } from './data/computers';
import { createInterviewSession } from './data/interview';
import { stationById, stationForReview, stations } from './data/stations';
import { OfficeScene, type InteractionTarget } from './scene/OfficeScene';
import { IntroPlayer } from './ui/IntroPlayer';
import { ComputerDesktop } from './ui/desktop/ComputerDesktop';
import { InterviewPanel } from './ui/InterviewPanel';
import { Notebook } from './ui/Notebook';
import { ReviewPanel } from './ui/ReviewPanel';
import { SourcePanel } from './ui/SourcePanel';
import { escapeHtml, icon } from './ui/dom';
import './overlays.css';

type Panel = { dispose: () => void };

class App {
  private readonly store = new AuditStore();
  private readonly workspace = new WorkspaceStore(computers);
  private readonly interviewSession = createInterviewSession();
  private readonly root: HTMLElement;
  private scene: OfficeScene | null = null;
  private readonly intro: IntroPlayer;
  private activePanel: Panel | null = null;
  private activeDialog: HTMLDialogElement | null = null;
  private returnStation: StationId | null = null;
  private readonly persistence = new Map<PersistenceEvent['domain'], PersistenceEvent>();
  private mode: 'intro' | 'visit' = 'intro';
  private pointerLocked = false;
  private toastTimer = 0;
  private previousDocumented = new Set<ReviewId>();

  constructor(container: HTMLElement) {
    this.root = container;
    this.root.innerHTML = `
      <main id="experience">
        <div id="scene-container"></div>
        <div id="intro-root" hidden></div>
        <header class="topbar">
          <div class="brand"><strong>Operación Trazabilidad</strong><span>La oficina después del incidente</span></div>
          <div class="topbar-actions">
            <button class="topbar-button visit-only" data-action="notebook">${icon('clipboard')} Tablita <span class="shortcut">J</span></button>
            <button class="topbar-button" data-action="replay-intro">Reconstrucción</button>
            <details class="settings-menu"><summary>Accesibilidad y controles</summary><div class="settings-popover">
              <h2>Controles de la visita</h2>
              <label><input type="checkbox" data-setting="projector" /> Modo proyector · texto mayor</label>
              <label><input type="checkbox" data-setting="reducedMotion" /> Reducir movimiento</label>
              <label><input type="checkbox" data-setting="audioEnabled" /> Aviso sonoro opcional</label>
              <label><input type="checkbox" data-setting="flatMode" /> Modo plano sin WebGL</label>
              <label>Sensibilidad del mouse<input type="range" min="0.4" max="2" step="0.1" data-setting="sensitivity" /></label>
              <p>WASD o flechas · Mouse para mirar<br>E interactuar · J tablita · Esc liberar/cerrar</p>
            </div></details>
          </div>
        </header>
        <section id="visit-hud" class="visit-hud visit-only" aria-label="Controles de exploración">
          <div id="reticle" class="reticle" aria-hidden="true"></div>
          <div id="interaction-prompt" class="interaction-prompt" hidden></div>
          <button id="journal-hint" class="journal-hint" data-action="notebook" hidden>J · Leer la tablita</button>
        </section>
        <section id="entry-overlay" class="entry-overlay" hidden>
          <button id="enter-office" class="primary-button">Entrar a la oficina</button>
          <p>Un clic activa el mouse. Esc lo libera; tus documentos detienen la caminata.</p>
        </section>
        <section id="flat-office" class="flat-office" hidden aria-label="Sala de revisión en modo plano">
          <div class="flat-heading"><div><h1>Sala de revisión</h1><p>Acceso plano a las mismas fuentes y revisiones. No requiere WebGL ni bloqueo del puntero.</p></div><button class="secondary-button" data-flat="liaison">Recibir tablita / hablar con TI</button></div>
          <div class="flat-stations">${stations.map((station) => `<button class="flat-station" data-flat="${station.id}"><span class="station-letter">${station.short}</span><span><strong>${escapeHtml(station.title)}</strong><small><span data-flat-status="${station.reviewId}">Pendiente</span></small></span><span>Usar ordenador</span></button>`).join('')}</div>
          <p class="flat-note">La oficina concentra copias por conveniencia didáctica; no representa la infraestructura física de RedNova.</p>
        </section>
        <div id="toast" class="toast" role="status" aria-live="polite"></div>
        <dialog id="panel-dialog"></dialog>
        <dialog id="notebook-dialog"></dialog>
        <div id="print-report"></div>
      </main>`;

    if (!this.store.state.settings.flatMode || !this.store.state.introSeen) this.initializeScene();
    this.intro = new IntroPlayer(this.root.querySelector('#intro-root')!, this.store, () => this.scene, () => this.enterVisit());
    this.bind();
    this.previousDocumented = this.documentedReviews();
    this.onStateChange();
    if (this.store.state.introSeen) this.enterVisit();
    else this.intro.start();
  }

  private initializeScene(): void {
    if (this.scene) return;
    try {
      this.scene = new OfficeScene(this.root.querySelector<HTMLElement>('#scene-container')!, {
        onInteract: (target) => this.interact(target),
        onJournal: () => this.toggleNotebook(),
        onTargetChange: (target) => this.showTarget(target),
        onPointerLockChange: (locked) => { this.pointerLocked = locked; this.updateEntryOverlay(); },
        onPointerError: () => {
          this.store.updateSettings({ flatMode: true });
          this.toast('El navegador no permitió controlar el mouse. Se activó el modo plano; toda la revisión sigue disponible.');
        },
        onPoseChange: (pose) => this.store.setPose(pose),
      });
    } catch {
      this.store.state.settings.flatMode = true;
    }
  }

  private bind(): void {
    this.root.addEventListener('click', (event) => {
      const actionElement = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
      const action = actionElement?.dataset.action;
      if (action === 'notebook') this.toggleNotebook();
      if (action === 'replay-intro') {
        this.closePanel();
        this.mode = 'intro';
        this.root.querySelector<HTMLElement>('#experience')!.dataset.mode = 'intro';
        this.intro.start();
      }
      const flat = (event.target as HTMLElement).closest<HTMLElement>('[data-flat]')?.dataset.flat;
      if (flat === 'liaison') this.interact({ kind: 'liaison' });
      if (flat && flat !== 'liaison') this.openStation(flat as StationId);
    });
    this.root.querySelector('#enter-office')!.addEventListener('click', () => this.scene?.requestControl());
    this.root.querySelectorAll<HTMLInputElement>('[data-setting]').forEach((input) => {
      input.addEventListener('change', () => {
        const setting = input.dataset.setting!;
        if (setting === 'sensitivity') this.store.updateSettings({ sensitivity: Number(input.value) });
        else {
          this.store.updateSettings({ [setting]: input.checked });
          input.closest<HTMLDetailsElement>('.settings-menu')!.open = false;
        }
      });
    });
    for (const dialog of this.root.querySelectorAll<HTMLDialogElement>('dialog')) {
      dialog.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab' || event.defaultPrevented) return;
        const controls = [...dialog.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], summary, [tabindex]')]
          .filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') && element.getClientRects().length > 0);
        const target = document.activeElement;
        if (!controls.length) { event.preventDefault(); dialog.focus(); return; }
        if (event.shiftKey && (target === controls[0] || target === dialog)) {
          event.preventDefault(); controls.at(-1)!.focus();
        } else if (!event.shiftKey && target === controls.at(-1)) {
          event.preventDefault(); controls[0].focus();
        }
      });
      dialog.addEventListener('cancel', (event) => { event.preventDefault(); this.closePanel(true); });
      dialog.addEventListener('close', () => {
        // close se entrega de forma asíncrona; el mismo diálogo puede haberse
        // reutilizado ya para la libreta, entrevista o escritorio de retorno.
        if (this.activeDialog === dialog && !dialog.open) this.closePanel(true);
      });
    }
    document.addEventListener('keydown', (event) => {
      const element = event.target as HTMLElement | null;
      if (element?.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (event.code === 'KeyJ' && !event.repeat && (this.activePanel instanceof Notebook || !this.scene || this.store.state.settings.flatMode)) {
        event.preventDefault();
        this.toggleNotebook();
      }
    });
    this.store.subscribe(() => this.onStateChange());
    this.store.subscribePersistence((event) => this.persistence.set(event.domain, event));
    this.workspace.subscribePersistence((event) => this.persistence.set(event.domain, event));
  }

  private onStateChange(): void {
    const settings = this.store.state.settings;
    if (!settings.flatMode && !this.scene) {
      this.initializeScene();
      const scene = this.scene as OfficeScene | null;
      scene?.setMode(this.mode, this.store.state.pose);
    }
    this.root.classList.toggle('projector', settings.projector);
    this.root.classList.toggle('reduced-motion', settings.reducedMotion);
    this.root.querySelectorAll<HTMLInputElement>('[data-setting]').forEach((input) => {
      const key = input.dataset.setting!;
      if (key === 'sensitivity') input.value = String(settings.sensitivity);
      else input.checked = Boolean(settings[key as keyof typeof settings]);
    });
    this.scene?.setPreferences(settings.reducedMotion, settings.sensitivity);
    this.scene?.setClipboardReceived(this.store.state.clipboardReceived);
    this.scene?.setDocumented([...this.documentedReviews()]);
    const flat = settings.flatMode || !this.scene;
    this.root.querySelector<HTMLElement>('#flat-office')!.hidden = !(this.mode === 'visit' && flat);
    this.root.querySelector('#scene-container')!.classList.toggle('is-flat', flat && this.mode === 'visit');
    this.root.querySelector<HTMLElement>('#visit-hud')!.classList.toggle('flat-active', flat);
    if (flat && document.pointerLockElement) document.exitPointerLock();
    this.renderFlatStatuses();
    this.updateEntryOverlay();
    const journalHint = this.root.querySelector<HTMLButtonElement>('#journal-hint')!;
    journalHint.hidden = !(this.mode === 'visit' && this.store.state.clipboardReceived && !flat);
    const current = this.documentedReviews();
    for (const reviewId of current) {
      if (!this.previousDocumented.has(reviewId)) this.toast(`${stationForReview(reviewId).title}: revisión documentada. El sustento y los límites se conservaron.`);
    }
    this.previousDocumented = current;
  }

  private enterVisit(): void {
    this.mode = 'visit';
    this.root.querySelector<HTMLElement>('#experience')!.dataset.mode = 'visit';
    this.root.querySelector<HTMLElement>('#intro-root')!.hidden = true;
    this.scene?.setMode('visit', this.store.state.pose);
    this.onStateChange();
    this.updateEntryOverlay();
  }

  private interact(target: InteractionTarget): void {
    if (this.mode !== 'visit') return;
    if (target.kind === 'station') {
      this.openStation(target.stationId);
      return;
    }
    if (!this.store.state.clipboardReceived) {
      this.store.receiveClipboard();
      this.toast('Recibiste la tablita de auditoría. Pulsa J para leer los seis asuntos.');
    }
    this.openInterview();
  }

  private openStation(stationId: StationId, review = false): void {
    if (!review) this.returnStation = null;
    const dialog = this.root.querySelector<HTMLDialogElement>('#panel-dialog')!;
    this.preparePanel(dialog);
    if (!review) {
      const computer = getComputer(stationId);
      dialog.className = 'computer-dialog';
      this.scene?.setComputerView(true);
      const desktop = new ComputerDesktop(dialog, {
        computer, registry: registryForComputer(computer), store: this.store, workspace: this.workspace,
        initialPersistence: [...this.persistence.values()],
        navigation: {
          openNotebook: () => this.openComputerAuxiliary(stationId, () => this.openStation(stationId, true)),
          openInterview: () => this.openComputerAuxiliary(stationId, () => this.interact({ kind: 'liaison' })),
          exitToOffice: () => this.closePanel(),
        },
      });
      this.activePanel = desktop;
      desktop.focus();
      return;
    }
    this.activePanel = new ReviewPanel(dialog, this.store, stationId,
      () => this.switchPanel(() => this.openInterview()),
      () => this.switchPanel(() => this.openStation(stationId)));
  }

  private openInterview(): void {
    const dialog = this.root.querySelector<HTMLDialogElement>('#panel-dialog')!;
    this.preparePanel(dialog);
    this.scene?.setInterviewView(true);
    this.activePanel = new InterviewPanel(dialog, this.store, this.interviewSession, (sourceId, reviewId) => {
      this.switchPanel(() => {
        this.store.inspect(sourceId);
        this.openSource(sourceId, reviewId);
      });
    }, () => this.scene?.playLiaisonResponse());
  }

  private openSource(sourceId: string, reviewId: ReviewId): void {
    const dialog = this.root.querySelector<HTMLDialogElement>('#panel-dialog')!;
    this.preparePanel(dialog);
    this.activePanel = new SourcePanel(dialog, this.store, sourceId, reviewId, (targetReview) => {
      this.switchPanel(() => this.openStation(stationForReview(targetReview).id));
    }, () => this.switchPanel(() => this.openInterview()));
  }

  private toggleNotebook(): void {
    if (this.mode !== 'visit') return;
    if (this.activePanel instanceof Notebook) { this.closePanel(); return; }
    if (this.activePanel) return;
    if (!this.store.state.clipboardReceived) {
      this.toast('Primero acércate al enlace de TI y pulsa E para recibir la tablita. Omitir la reconstrucción no omite esta entrega.');
      return;
    }
    const dialog = this.root.querySelector<HTMLDialogElement>('#notebook-dialog')!;
    this.preparePanel(dialog);
    this.activePanel = new Notebook(dialog, this.store,
      (reviewId) => this.switchPanel(() => this.openStation(stationForReview(reviewId).id, true)),
      (reviewId) => {
        const station = stationForReview(reviewId);
        if (this.store.state.settings.flatMode || !this.scene) this.switchPanel(() => this.openStation(station.id));
        else {
          this.scene.moveToStation(station.id);
          this.closePanel();
          this.toast(`Estás frente a ${station.short} · ${station.title}. Mira el equipo y pulsa E.`);
        }
      },
      () => {
        this.closePanel();
        this.workspace.reset();
        this.store.reset();
        window.location.reload();
      },
    );
  }

  private preparePanel(dialog: HTMLDialogElement): void {
    if (this.activePanel) this.closePanel();
    // Los paneles heredados usan propiedades de eventos sobre este contenedor.
    // No deben seguir atendiendo controles de la siguiente superficie.
    dialog.onclick = null;
    dialog.oninput = null;
    dialog.onchange = null;
    dialog.onkeydown = null;
    dialog.replaceChildren();
    this.activeDialog = dialog;
    this.scene?.setPanelOpen(true);
    if (!dialog.open) dialog.showModal();
  }

  private switchPanel(callback: () => void): void {
    const returnStation = this.returnStation;
    this.closePanel();
    this.returnStation = returnStation;
    callback();
  }

  private openComputerAuxiliary(stationId: StationId, callback: () => void): void {
    this.switchPanel(() => {
      this.returnStation = stationId;
      callback();
    });
  }

  private closePanel(resumeComputer = false): void {
    const returnStation = resumeComputer ? this.returnStation : null;
    this.returnStation = null;
    const dialog = this.activeDialog;
    this.activePanel?.dispose();
    this.activePanel = null;
    this.activeDialog = null;
    if (dialog?.open) dialog.close();
    this.scene?.setComputerView(false);
    this.scene?.setInterviewView(false);
    if (returnStation) this.openStation(returnStation);
    else this.syncPanelState();
  }

  private syncPanelState(): void {
    const open = Boolean(this.root.querySelector('dialog[open]'));
    this.scene?.setPanelOpen(open);
    this.updateEntryOverlay();
  }

  private showTarget(target: InteractionTarget | null): void {
    const prompt = this.root.querySelector<HTMLElement>('#interaction-prompt')!;
    prompt.hidden = !target || this.mode !== 'visit';
    if (!target) return;
    prompt.textContent = target.kind === 'liaison'
      ? `E · ${this.store.state.clipboardReceived ? 'Hablar con el enlace de TI' : 'Recibir la tablita del enlace de TI'}`
      : `E · Revisar ${stationById(target.stationId).short} · ${stationById(target.stationId).title}`;
  }

  private updateEntryOverlay(): void {
    const overlay = this.root.querySelector<HTMLElement>('#entry-overlay')!;
    const panelOpen = Boolean(this.root.querySelector('dialog[open]'));
    const visible = this.mode === 'visit' && !this.pointerLocked && !panelOpen && !this.store.state.settings.flatMode && Boolean(this.scene);
    overlay.hidden = !visible;
    if (visible) overlay.querySelector('button')!.textContent = this.store.state.introSeen ? 'Entrar / continuar explorando' : 'Entrar a la oficina';
    this.root.querySelector<HTMLElement>('#reticle')!.style.opacity = this.pointerLocked ? '1' : '0';
  }

  private renderFlatStatuses(): void {
    for (const reviewId of reviewIds) {
      const evaluation = evaluateReview(this.store.state.assessments[reviewId], this.store.state.inspected);
      const status = this.root.querySelector(`[data-flat-status="${reviewId}"]`);
      if (status) status.textContent = evaluation.status;
    }
    const count = documentedCount(this.store.state.assessments, this.store.state.inspected);
    this.root.querySelectorAll('.topbar-button[data-action="notebook"]').forEach((button) => {
      button.setAttribute('aria-label', `Abrir tablita: ${count} de 6 revisiones documentadas`);
    });
  }

  private documentedReviews(): Set<ReviewId> {
    return new Set(reviewIds.filter((id) => evaluateReview(this.store.state.assessments[id], this.store.state.inspected).isDocumented));
  }

  private toast(message: string): void {
    const toast = this.root.querySelector<HTMLElement>('#toast')!;
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 4500);
  }
}

const container = document.getElementById('app');
if (container) new App(container);
