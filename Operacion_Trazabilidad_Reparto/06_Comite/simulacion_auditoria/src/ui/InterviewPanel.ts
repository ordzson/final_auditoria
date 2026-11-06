import type { AuditStore } from '../audit/store';
import type { ReviewId } from '../audit/types';
import {
  availableInterviewQuestions, baseQuestions, followupQuestions, interviewTopics,
  type InterviewSession,
} from '../data/interview';
import { sourceName } from '../data/investigation';
import { interviewAudioUrl } from '../data/interviewAudio';
import { escapeHtml, icon } from './dom';

export class InterviewPanel {
  private readonly unsubscribe: () => void;
  private readonly voice = new Audio();
  private voiceId = '';
  private greetingId: string;

  constructor(
    private readonly dialog: HTMLDialogElement,
    private readonly store: AuditStore,
    private readonly session: InterviewSession,
    private readonly onSource: (sourceId: string, reviewId: ReviewId) => void,
    private readonly onQuestion: () => void,
  ) {
    this.greetingId = this.session.started ? 'SALUDO-REGRESO' : 'SALUDO-INICIAL';
    this.voice.controls = true;
    this.voice.muted = this.session.voiceMuted ?? false;
    this.voice.onvolumechange = () => { this.session.voiceMuted = this.voice.muted; };
    this.voice.preload = 'none';
    this.voice.setAttribute('aria-label', 'Voz del enlace de TI');
    this.voice.style.cssText = 'width: min(100%, 360px); display: block; margin-top: 12px;';
    this.dialog.className = 'app-dialog interview-dialog';
    this.dialog.setAttribute('aria-label', 'Conversación con el enlace de TI');
    this.dialog.onclick = (event) => this.click(event);
    this.dialog.onkeydown = (event) => this.keydown(event);
    this.unsubscribe = store.subscribe(() => this.render());
    this.render();
    this.session.started = true;
    if (this.session.questionId) this.focusChoice(this.session.questionId);
    else this.dialog.querySelector<HTMLButtonElement>('[data-action="topic"], [data-action="ask"]')?.focus({ preventScroll: true });
    this.dialog.scrollTop = 0;
  }

  private render(): void {
    if (!this.dialog.open) return;
    const focused = this.dialog.contains(document.activeElement) ? (document.activeElement as HTMLElement).dataset.choice : undefined;
    const scrollTop = this.dialog.querySelector('.dialogue-options')?.scrollTop ?? 0;
    const topic = interviewTopics.find((item) => item.id === this.session.topicId);
    const questions = availableInterviewQuestions(this.session, new Set(this.store.state.inspected.map((ref) => ref.sourceId)));
    const current = questions.find((question) => question.id === this.session.questionId);
    const greeting = this.greetingId === 'TE-ESCUCHO' ? 'Te escucho.' : this.greetingId === 'SALUDO-REGRESO'
      ? '¿Encontraste algo más? Dime qué quieres revisar y lo vemos juntos.'
      : 'Hola. ¿Vienes por lo del CRM? Ya tienes la tablita. Pregúntame lo que necesites y vamos viendo qué dicen los registros.';
    const answer = current?.answer ?? topic?.answer ?? greeting;
    this.dialog.innerHTML = `
      <header class="dialog-header dialogue-header">
        <h2 class="sr-only">Enlace de TI · entrevista</h2>
        <span>RedNova · sala de revisión</span>
        <button class="dialogue-exit" data-action="close" aria-label="Cerrar entrevista">Terminar conversación ${icon('close')}</button>
      </header>
      <div class="dialogue-speaker"><h3>Enlace de TI</h3><p>Te escucho.</p></div>
      <section class="dialogue-response" aria-label="Respuesta del enlace de TI">
        <p class="dialogue-player" ${!current ? 'hidden' : ''}>Tú: ${escapeHtml(current?.question)}</p>
        <blockquote aria-live="polite" aria-atomic="true"><span class="sr-only">Enlace de TI: </span>${escapeHtml(answer)}</blockquote>
        <div class="dialogue-response-footer">
          <p>Conversación orientativa. Contrasta las declaraciones con sus fuentes.</p>
          ${current?.sourceId ? `<button class="dialogue-source" data-action="source" data-source="${escapeHtml(current.sourceId)}" data-review="${current.reviewId}" data-choice="source">${icon('folder')} Consultar ${escapeHtml(sourceName(current.sourceId))}</button>` : ''}
        </div>
        <div class="dialogue-voice"><button class="dialogue-source" data-action="repeat-voice">${icon('sound')} Repetir voz</button></div>
      </section>
        <section class="dialogue-menu" aria-label="Opciones de conversación">
          <h3>${topic ? escapeHtml(topic.question) : '¿Qué quieres decir?'}</h3>
          <div class="dialogue-options">
            ${topic ? questions.map((question) => this.choice('ask', question.id, question.question, this.session.discussed.has(question.id), Boolean(question.requires?.length))).join('')
              : interviewTopics.map((item) => this.choice('topic', item.id, item.question,
                baseQuestions.filter((question) => question.reviewId === item.id).every((question) => this.session.discussed.has(question.id)))).join('')}
            ${topic ? this.choice('topics', 'topics', 'Quería preguntarte por otra cosa.') : ''}
            ${this.choice('close', 'goodbye', 'Eso es todo por ahora. Gracias.')}
          </div>
          <p class="dialogue-keyboard"><span>↑ ↓ Elegir</span><span>Enter Hablar</span><span>Esc Salir</span></p>
        </section>`;
    this.dialog.querySelector('.dialogue-options')!.scrollTop = scrollTop;
    this.dialog.querySelector('.dialogue-voice')!.append(this.voice);
    const voiceId = current?.id ?? topic?.id ?? this.greetingId;
    if (voiceId !== this.voiceId) {
      this.voiceId = voiceId;
      this.voice.pause();
      this.voice.src = interviewAudioUrl(voiceId);
      void this.voice.play().catch(() => { /* Los controles permiten iniciar la voz manualmente. */ });
    }
    if (focused) this.focusChoice(focused);
  }

  private choice(action: string, id: string, label: string, discussed = false, contextual = false): string {
    return `<button class="dialogue-choice${discussed ? ' is-discussed' : ''}" data-action="${action}" data-choice="${id}"${action === 'ask' ? ` data-question="${id}"` : ''}${action === 'topic' ? ` data-topic="${id}"` : ''}>
      <svg class="dialogue-cursor" viewBox="0 0 16 20" aria-hidden="true"><path d="m3 3 9 7-9 7" fill="none" stroke="currentColor" stroke-width="2" /></svg>
      <span>${escapeHtml(label)}${contextual ? '<small>Sobre lo que encontraste</small>' : ''}</span>
      ${discussed ? `<span class="dialogue-discussed">${icon('check')}<span class="sr-only">Ya hablado</span></span>` : ''}
    </button>`;
  }

  private focusChoice(id: string): void {
    const button = [...this.dialog.querySelectorAll<HTMLButtonElement>('[data-choice]')].find((item) => item.dataset.choice === id);
    button?.focus({ preventScroll: true });
  }

  private click(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'repeat-voice') {
      this.voice.currentTime = 0;
      void this.voice.play().catch(() => { /* El texto sigue disponible. */ });
    }
    if (action === 'close') this.dialog.close();
    if (action === 'topic') {
      const topic = interviewTopics.find((item) => item.id === button.dataset.topic);
      if (!topic) return;
      this.session.topicId = topic.id;
      this.session.questionId = null;
      this.render();
      this.dialog.querySelector<HTMLButtonElement>('[data-action="ask"]')?.focus();
      this.dialog.querySelector('.dialogue-options')!.scrollTop = 0;
    }
    if (action === 'topics') {
      this.greetingId = 'TE-ESCUCHO';
      const previousTopic = this.session.topicId;
      this.session.topicId = null;
      this.session.questionId = null;
      this.render();
      if (previousTopic) this.focusChoice(previousTopic);
    }
    if (action === 'ask') {
      const question = availableInterviewQuestions(this.session, new Set(this.store.state.inspected.map((ref) => ref.sourceId)))
        .find((item) => item.id === button.dataset.question);
      if (!question) return;
      this.session.questionId = question.id;
      this.session.discussed.add(question.id);
      this.render();
      this.onQuestion();
      this.focusChoice(question.id);
      this.dialog.querySelector('.dialogue-response')?.scrollIntoView({ block: 'nearest' });
    }
    if (action === 'source') {
      const current = [...baseQuestions, ...followupQuestions].find((item) => item.id === this.session.questionId);
      if (current?.sourceId) this.onSource(current.sourceId, current.reviewId);
    }
  }

  private keydown(event: KeyboardEvent): void {
    if ((event.target as HTMLElement).closest('audio')) return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const choices = [...this.dialog.querySelectorAll<HTMLButtonElement>('.dialogue-choice')];
    if (!choices.length) return;
    event.preventDefault();
    const index = choices.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1
      : (index + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length;
    choices[next].focus();
    choices[next].scrollIntoView({ block: 'nearest' });
  }

  dispose(): void {
    this.voice.pause();
    this.voice.removeAttribute('src');
    this.voice.load();
    this.unsubscribe();
    this.dialog.removeAttribute('aria-label');
    this.dialog.onclick = null;
    this.dialog.onkeydown = null;
  }
}
