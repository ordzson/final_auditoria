import type { AuditStore } from '../audit/store';
import { sourceName, sourceSummary } from '../data/language';
import { canon, eventById } from '../data/canon';
import { getIntroFrame, introHistory, shotIndex, shots } from '../data/intro';
import { getSimulationFrame } from '../data/simulation';
import type { OfficeScene } from '../scene/OfficeScene';
import { ScreenPainter } from '../scene/screens';
import { escapeHtml, icon } from './dom';

export class IntroPlayer {
  private time = 0;
  private playing = true;
  private speed = 1;
  private active = false;
  private lastTick = 0;
  private animationFrame = 0;
  private alertPlayed = false;
  private audioContext: AudioContext | null = null;
  private fallbackScreen: ScreenPainter | null = null;
  private lastHistoryKey = '';
  private noteShown = false;

  constructor(
    private readonly root: HTMLElement,
    private readonly store: AuditStore,
    private readonly getScene: () => OfficeScene | null,
    private readonly onFinish: () => void,
  ) {
    this.root.addEventListener('click', (event) => this.click(event));
    this.root.addEventListener('input', (event) => this.input(event));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.active) {
        this.playing = false;
        this.lastTick = 0;
        this.renderFrame();
      }
    });
    this.store.subscribe(() => { if (this.active) this.renderFrame(); });
    window.addEventListener('resize', () => { if (this.active) this.renderFrame(); });
  }

  start(startTime = 0): void {
    cancelAnimationFrame(this.animationFrame);
    this.active = true;
    this.time = Math.max(0, Math.min(110, startTime));
    this.playing = this.time < 110;
    this.alertPlayed = this.time >= 53;
    this.lastTick = 0;
    this.root.hidden = false;
    this.root.innerHTML = `
      <div class="scene-fade" aria-hidden="true"></div>
      <section class="intro-overlay" aria-label="Reconstrucción del incidente">
        <div class="intro-heading">
          <div class="intro-datetime"><span id="intro-date"></span><strong id="intro-time"></strong><span>UTC−6 · Hora reportada</span></div>
          <div class="intro-shot"><span id="intro-shot"></span><span>Reconstrucción del expediente · puesta en escena ilustrativa</span></div>
        </div>
        <div id="intro-flat-screen" class="intro-flat-screen" hidden></div>
        <div class="intro-activity" aria-live="off"><span id="intro-operation"></span><span id="intro-phase"></span></div>
        <div id="ransom-note" class="ransom-note" hidden></div>
        <div class="intro-message-wrap">
          <p id="intro-message" class="intro-message" aria-live="polite"></p>
          <p id="intro-provenance" class="intro-provenance"></p>
        </div>
        <details class="intro-history"><summary>Historial de registros</summary><ol id="intro-history-list"></ol></details>
        <div class="intro-controls">
          <div class="transport-controls">
            <button class="control-button" data-action="play" aria-label="Pausar reconstrucción"></button>
            <button class="control-button" data-action="previous">${icon('previous')} Plano anterior</button>
            <button class="control-button" data-action="next">${icon('next')} Plano siguiente</button>
            <button class="control-button" data-action="replay">Repetir</button>
            <button class="control-button" data-action="speed">1×</button>
            <button class="control-button" data-action="audio"></button>
          </div>
          <label class="timeline-label"><span class="sr-only">Tiempo de la reconstrucción</span><input id="intro-timeline" type="range" min="0" max="110" step="0.05" value="0" /><span id="intro-elapsed">0:00 / 1:50</span></label>
          <button class="primary-button skip-button" data-action="skip">Omitir y entrar a la oficina</button>
        </div>
      </section>`;
    this.lastHistoryKey = '';
    this.noteShown = false;
    this.getScene()?.setMode('intro');
    this.renderFrame();
    this.animationFrame = requestAnimationFrame((time) => this.tick(time));
  }

  private tick(timestamp: number): void {
    if (!this.active) return;
    const elapsed = this.lastTick ? Math.max(0, (timestamp - this.lastTick) / 1000) : 0;
    this.lastTick = timestamp;
    const previous = this.time;
    if (this.playing) {
      this.time = Math.min(110, this.time + elapsed * this.speed);
      if (!this.alertPlayed && previous < 53 && this.time >= 53) {
        this.alertPlayed = true;
        this.playAlert();
      }
      this.getScene()?.setIntroTime(this.time);
      this.renderFrame();
    }
    if (this.time >= 110) {
      this.finish();
      return;
    }
    this.animationFrame = requestAnimationFrame((time) => this.tick(time));
  }

  private renderFrame(): void {
    if (!this.active) return;
    const frame = getIntroFrame(this.time);
    const simulation = getSimulationFrame(this.time, this.store.state.settings.reducedMotion);
    this.getScene()?.setIntroTime(this.time);
    const overlay = this.root.querySelector<HTMLElement>('.intro-overlay')!;
    const controls = this.root.querySelector<HTMLElement>('.intro-controls')!;
    overlay.style.setProperty('--intro-controls-height', `${controls.offsetHeight}px`);
    const explaining = simulation.settled || frame.noteVisible || frame.shot.id === 'P01' || frame.visitLabel;
    overlay.dataset.phase = explaining ? 'explanation' : 'activity';
    this.setText('intro-operation', simulation.operation);
    this.setText('intro-phase', explaining ? 'Registro del caso' : 'Recreación en curso');
    const fallback = this.root.querySelector<HTMLElement>('#intro-flat-screen')!;
    fallback.hidden = Boolean(this.getScene()) && !this.store.state.settings.flatMode && window.innerWidth > 760;
    overlay.dataset.screenLayout = fallback.hidden ? 'spatial' : 'flat';
    if (!fallback.hidden) {
      this.fallbackScreen ??= new ScreenPainter();
      if (!fallback.firstChild) fallback.appendChild(this.fallbackScreen.canvas);
      this.fallbackScreen.animate(simulation);
      this.fallbackScreen.canvas.setAttribute('role', 'img');
      this.fallbackScreen.canvas.setAttribute('aria-label', `${simulation.title}. ${simulation.operation}. ${simulation.detail}. Recreación ilustrativa.`);
    }
    this.setText('intro-date', frame.dateLabel);
    this.setText('intro-time', frame.timeLabel);
    this.setText('intro-message', frame.message);
    this.setText('intro-provenance', frame.provenance);
    this.setText('intro-shot', `Plano ${shotIndex(this.time) + 1} de 10`);
    this.setText('intro-elapsed', `${formatElapsed(this.time)} / 1:50`);
    const timeline = this.root.querySelector<HTMLInputElement>('#intro-timeline');
    if (timeline) timeline.value = String(this.time);
    const play = this.root.querySelector<HTMLButtonElement>('[data-action="play"]');
    if (play && play.dataset.playing !== String(this.playing)) {
      play.dataset.playing = String(this.playing);
      play.innerHTML = `${icon(this.playing ? 'pause' : 'play')} ${this.playing ? 'Pausar' : 'Reproducir'}`;
      play.setAttribute('aria-label', this.playing ? 'Pausar reconstrucción' : 'Reanudar reconstrucción');
    }
    const speed = this.root.querySelector<HTMLButtonElement>('[data-action="speed"]');
    if (speed && speed.textContent !== `${this.speed}×`) speed.textContent = `${this.speed}×`;
    const audio = this.root.querySelector<HTMLButtonElement>('[data-action="audio"]');
    if (audio && audio.dataset.enabled !== String(this.store.state.settings.audioEnabled)) {
      audio.dataset.enabled = String(this.store.state.settings.audioEnabled);
      audio.innerHTML = `${icon(this.store.state.settings.audioEnabled ? 'sound' : 'muted')} ${this.store.state.settings.audioEnabled ? 'Aviso sonoro activado' : 'Sin sonido'}`;
    }
    const noteRoot = this.root.querySelector<HTMLElement>('#ransom-note');
    if (noteRoot) {
      noteRoot.hidden = !frame.noteVisible;
      if (frame.noteVisible && !this.noteShown) {
        const note = canon.presentation.ransomNote;
        noteRoot.innerHTML = `<div class="ransom-card"><h2>${escapeHtml(note.title)}</h2>${note.body.split('\n').map((line) => `<p>${escapeHtml(line)}</p>`).join('')}<strong>${escapeHtml(note.visibleLabel)}</strong><small>El caso reporta una nota, sin texto original ni hora de aparición. Su ubicación durante la caída del sistema comercial es ilustrativa; no acredita que apareciera a las 03:42.</small></div>`;
      }
      this.noteShown = frame.noteVisible;
    }
    const history = this.root.querySelector<HTMLOListElement>('#intro-history-list');
    const historyIds = introHistory(this.time);
    const historyKey = historyIds.join(',');
    if (history && historyKey !== this.lastHistoryKey) {
      this.lastHistoryKey = historyKey;
      history.innerHTML = historyIds.map((id) => {
        const event = eventById(id)!;
        return `<li><strong>${event.reportedAt.slice(11, 16)} · ${escapeHtml(sourceName(id))}</strong><span>${escapeHtml(sourceSummary(id))}</span></li>`;
      }).join('');
    }
    const fade = this.root.querySelector<HTMLElement>('.scene-fade');
    if (fade) {
      const duration = this.store.state.settings.reducedMotion ? 0.15 : 0.45;
      fade.style.opacity = String(Math.max(0, Math.min(0.88, (1 - frame.localTime / duration) * 0.88)));
    }
  }

  private click(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'play') { this.playing = !this.playing; this.lastTick = 0; }
    if (action === 'previous') this.seek(shots[Math.max(0, shotIndex(this.time) - 1)].start);
    if (action === 'next') this.seek(shots[Math.min(shots.length - 1, shotIndex(this.time) + 1)].start);
    if (action === 'replay') {
      this.time = 0;
      this.lastTick = 0;
      this.alertPlayed = false;
      this.playing = true;
    }
    if (action === 'speed') this.speed = this.speed === 1 ? 1.5 : this.speed === 1.5 ? 2 : 1;
    if (action === 'audio') this.store.updateSettings({ audioEnabled: !this.store.state.settings.audioEnabled });
    if (action === 'skip') this.finish();
    this.renderFrame();
  }

  private input(event: Event): void {
    if ((event.target as HTMLElement).id === 'intro-timeline') {
      this.seek(Number((event.target as HTMLInputElement).value));
    }
  }

  private seek(time: number): void {
    this.time = time;
    this.alertPlayed = this.alertPlayed || time >= 53;
    this.getScene()?.setIntroTime(time);
    this.renderFrame();
  }

  private playAlert(): void {
    if (!this.store.state.settings.audioEnabled) return;
    try {
      this.audioContext ??= new AudioContext();
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      oscillator.frequency.value = 520;
      gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.18);
      oscillator.connect(gain).connect(this.audioContext.destination);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.18);
    } catch { /* La secuencia se entiende sin audio. */ }
  }

  private setText(id: string, text: string): void {
    const element = this.root.querySelector<HTMLElement>(`#${id}`);
    if (element && element.textContent !== text) element.textContent = text;
  }

  private finish(): void {
    if (!this.active) return;
    this.active = false;
    cancelAnimationFrame(this.animationFrame);
    this.root.hidden = true;
    this.store.markIntroSeen();
    this.onFinish();
  }
}

function formatElapsed(time: number): string {
  const seconds = Math.floor(time);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
