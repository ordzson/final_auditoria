import * as THREE from 'three';
import { simulationVisualKey, type SimulationFrame } from '../data/simulation';

export type ScreenTone = 'normal' | 'warning' | 'critical';

export class ScreenPainter {
  readonly texture: THREE.CanvasTexture;
  readonly canvas = document.createElement('canvas');
  private readonly context: CanvasRenderingContext2D;
  private lastKey = '';

  constructor() {
    this.canvas.width = 1024;
    this.canvas.height = 640;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D no disponible');
    this.context = context;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 4;
  }

  update(title: string, lines: string[], tone: ScreenTone = 'normal', key = ''): void {
    const stateKey = `${key}|${title}|${lines.join('|')}|${tone}`;
    if (stateKey === this.lastKey) return;
    this.lastKey = stateKey;
    const ctx = this.context;
    const critical = tone === 'critical';
    const warning = tone === 'warning';
    ctx.fillStyle = critical ? '#432f31' : '#17262e';
    ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = critical ? '#b84a48' : warning ? '#c49a52' : '#b67a50';
    ctx.fillRect(0, 0, 1024, 14);
    ctx.fillStyle = '#f4f0e6';
    ctx.font = '700 48px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(title, 54, 54, 916);
    ctx.fillStyle = critical ? '#f0c4bd' : '#b8c9c4';
    ctx.font = '500 27px sans-serif';
    let y = 142;
    for (const line of lines) {
      y = this.wrap(line, 54, y, 916, 39) + 20;
    }
    ctx.fillStyle = '#9fb4b2';
    ctx.font = '500 21px sans-serif';
    ctx.fillText('RED NOVA · COPIA DE REVISIÓN', 54, 580);
    this.texture.needsUpdate = true;
  }

  animate(frame: SimulationFrame): void {
    const key = `simulation:${simulationVisualKey(frame)}`;
    if (key === this.lastKey) return;
    this.lastKey = key;
    const ctx = this.context;
    const light = ['orders', 'reconcile', 'ticket'].includes(frame.kind);
    const ink = light ? '#243b40' : '#e4eeec';
    const muted = light ? '#4a6468' : '#a5bdbf';
    const accent = frame.kind === 'outage' ? '#ec948b' : frame.kind === 'alert' ? '#e6bd76' : light ? '#326966' : '#9fd8c6';
    ctx.fillStyle = light ? '#e9ede6' : '#101d26';
    ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = '#21383f';
    ctx.fillRect(0, 0, 1024, 76);
    this.text('RN', 30, 23, 26, '#b7d6cc', true);
    this.text(frame.title, 108, 24, 26, '#edf3ed', true);
    this.text('ENTORNO ILUSTRATIVO', 685, 30, 18, '#b8cdce');
    ctx.fillStyle = light ? '#d7dfd7' : '#1b3039';
    ctx.fillRect(0, 76, 1024, 42);
    this.text(this.tabs(frame.kind), 30, 88, 18, muted);

    if (frame.kind === 'sql') this.drawSql(frame, accent);
    else if (frame.kind === 'transfer') this.drawTransfer(frame, accent);
    else if (frame.kind === 'orders' || frame.kind === 'reconcile') this.drawOrders(frame, ink, muted);
    else if (frame.kind === 'access' || frame.kind === 'identity') this.drawAccess(frame, ink, accent);
    else if (frame.kind === 'deploy' || frame.kind === 'recovery') this.drawPipeline(frame, ink, muted, accent);
    else if (frame.kind === 'alert') this.drawAlert(frame, ink, muted, accent);
    else if (frame.kind === 'outage') this.drawOutage(frame, accent);
    else this.drawTicket(frame, ink, muted);

    ctx.fillStyle = light ? '#d7dfd7' : '#1b3039';
    ctx.fillRect(0, 586, 1024, 54);
    this.text('RECREACIÓN · filas, pasos y progreso ilustrativos', 30, 604, 18, muted);
    this.texture.needsUpdate = true;
  }

  private tabs(kind: SimulationFrame['kind']): string {
    if (kind === 'sql') return 'CONSULTA     /     RESULTADOS     /     ACTIVIDAD';
    if (kind === 'transfer') return 'FLUJO SALIENTE     /     PAQUETES     /     SESIÓN';
    if (kind === 'orders' || kind === 'reconcile') return 'COMERCIAL     /     ÓRDENES     /     FACTURACIÓN';
    if (kind === 'alert') return 'EVENTOS     /     CORRELACIÓN     /     ALERTAS';
    return 'OPERACIÓN     /     REGISTRO     /     ESTADO';
  }

  private text(value: string, x: number, y: number, size: number, color: string, bold = false, mono = false): void {
    this.context.fillStyle = color;
    this.context.font = `${bold ? 700 : 400} ${size}px ${mono ? 'monospace' : 'sans-serif'}`;
    this.context.textBaseline = 'top';
    this.context.fillText(value, x, y);
  }

  private bar(x: number, y: number, width: number, progress: number, color: string): void {
    this.context.fillStyle = '#31494f';
    this.context.fillRect(x, y, width, 12);
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width * progress, 12);
  }

  private drawSql(frame: SimulationFrame, accent: string): void {
    const ctx = this.context;
    this.text('01', 30, 144, 22, '#799b9e', false, true);
    this.text('SELECT', 83, 144, 24, '#e6bd76', true, true);
    this.text('cliente_id, segmento, estado', 190, 144, 24, '#e4eeec', false, true);
    this.text('02', 30, 181, 22, '#799b9e', false, true);
    this.text('FROM', 83, 181, 24, '#e6bd76', true, true);
    this.text('clientes_demo;', 163, 181, 24, '#a7d3de', false, true);
    this.text('Resultados de ejemplo / lectura por lotes', 83, 221, 19, '#a5bdbf');
    ctx.fillStyle = '#243c43';
    ctx.fillRect(28, 267, 968, 37);
    this.text('CLIENTE         SEGMENTO          ESTADO       MUESTRA', 44, 276, 20, '#b8cece', true, true);
    const count = Math.round(31840 * frame.progress);
    for (let row = 0; row < 7; row += 1) {
      const id = Math.max(1, count - 6 + row);
      const y = 312 + row * 24;
      if (row % 2 === 0) { ctx.fillStyle = '#162a33'; ctx.fillRect(28, y - 2, 968, 24); }
      this.text(`C-${String(id).padStart(5, '0')}        ${['HOGAR   ', 'EMPRESA ', 'COMERCIO'][id % 3]}          ACTIVO       DEMO`, 44, y, 20, '#c5ddd7', false, true);
    }
    this.bar(30, 490, 964, frame.progress, accent);
    this.text(frame.settled ? `${frame.reportedValue} registros · lectura reportada` : `${count.toLocaleString('en-US')} filas / lectura en curso`, 30, 520, 28, accent, true, true);
  }

  private drawTransfer(frame: SimulationFrame, accent: string): void {
    const ctx = this.context;
    this.text('FLUJO SALIENTE', 32, 146, 22, '#a5bdbf', true);
    this.text('Transferencia de datos', 32, 185, 40, '#e4eeec', true);
    this.text('ORIGEN NO IDENTIFICADO', 32, 260, 19, '#b8cece');
    this.text('DESTINO EXTERNO', 695, 260, 19, '#b8cece');
    this.bar(35, 319, 950, 1, '#466569');
    const packets = frame.reducedMotion || frame.settled ? 1 : 7;
    for (let i = 0; i < packets; i += 1) {
      const phase = frame.settled ? 0.96 : ((frame.localTime * 0.5 + i / 7) % 1);
      ctx.fillStyle = i % 2 ? '#6fadb7' : accent;
      ctx.fillRect(40 + phase * 890, 303, 22, 43);
    }
    const amount = (1.6 * frame.progress).toFixed(2);
    this.text(frame.settled ? frame.reportedValue : `${amount} GB`, 32, 382, 65, accent, true, true);
    this.text(frame.settled ? 'Volumen reportado' : 'Progreso visual de transferencia', 380, 400, 24, '#c2d8d4');
    this.text(`${Math.round(frame.progress * 100)}%`, 894, 434, 24, '#c2d8d4', false, true);
    this.bar(32, 476, 960, frame.progress, accent);
    this.text('Contenido sin identificar · vínculo con SQL no demostrado', 32, 521, 23, '#d8c79e');
  }

  private drawOrders(frame: SimulationFrame, ink: string, muted: string): void {
    const ctx = this.context;
    const reconcile = frame.kind === 'reconcile';
    this.text(reconcile ? 'Órdenes / facturación' : 'Órdenes comerciales', 30, 143, 34, ink, true);
    this.text(reconcile ? 'Revisión solicitada por Finanzas' : 'Vista de actividad · datos de ejemplo', 30, 191, 21, muted);
    ctx.fillStyle = '#cad6ce'; ctx.fillRect(28, 244, 968, 38);
    this.text('ORDEN         CLIENTE       REVISIÓN        ESTADO', 43, 254, 21, ink, true, true);
    for (let row = 0; row < 6; row += 1) {
      const y = 293 + row * 34;
      const changed = frame.progress > row / 6;
      ctx.fillStyle = changed && !reconcile ? '#d0e2d5' : row % 2 ? '#e0e7de' : '#f2f3ec';
      ctx.fillRect(28, y - 4, 968, 33);
      this.text(`D-${String(1200 + row + (frame.settled ? 0 : frame.tick * 3)).padStart(5, '0')}       DEMO-${row + 1}       ${reconcile ? 'PENDIENTE' : changed ? 'MODIFICADA' : 'EN COLA  '}       ${reconcile ? 'POR CONCILIAR' : 'POR VERIFICAR'}`, 43, y, 20, ink, false, true);
    }
    this.text(reconcile ? 'Conciliación pendiente' : `${frame.settled ? frame.reportedValue : Math.round(216 * frame.progress)} órdenes${frame.settled ? ' modificadas · reporte del caso' : ' / actualización en curso'}`, 32, 526, 27, '#326966', true);
  }

  private drawAccess(frame: SimulationFrame, ink: string, accent: string): void {
    const identity = frame.kind === 'identity';
    this.text(identity ? 'Cambio de privilegios' : 'Conexión remota', 32, 152, 40, ink, true);
    this.text(identity ? 'Cuenta: no aportada' : 'Cuenta: ext_ops_04', 32, 217, 27, '#c2d8d4', false, true);
    const steps = identity ? ['Solicitud de elevación', 'Procesando cambio', 'Privilegios elevados'] : ['Abriendo canal remoto', 'Validando credenciales', 'Sesión establecida'];
    steps.forEach((step, i) => {
      const complete = frame.progress >= (i + 1) / 3;
      this.text(complete ? '[ OK ]' : '[ .. ]', 38, 291 + i * 49, 23, complete ? accent : '#799b9e', true, true);
      this.text(step, 166, 291 + i * 49, 25, complete ? ink : '#a5bdbf');
    });
    this.bar(32, 474, 960, frame.progress, accent);
    this.text(frame.settled ? identity ? 'Elevación reportada · identidad sin atribuir' : 'Sin verificación adicional a la contraseña' : frame.operation, 32, 522, 27, identity ? accent : '#e6bd76', true);
  }

  private drawPipeline(frame: SimulationFrame, ink: string, muted: string, accent: string): void {
    const ctx = this.context;
    const recovery = frame.kind === 'recovery';
    this.text(frame.operation, 32, 150, 36, ink, true);
    this.text(recovery ? 'Estados del servicio · secuencia ilustrativa' : 'Canal de integración · pasos ilustrativos', 32, 203, 22, muted);
    const labels = recovery ? ['Solicitud', 'Disponibilidad', 'Acceso al CRM'] : ['Paquete', 'Publicación', 'Versión nueva'];
    labels.forEach((label, i) => {
      const active = frame.progress >= (i + 1) / 3;
      ctx.fillStyle = active ? '#355d58' : '#223a42';
      ctx.fillRect(32 + i * 329, 285, 304, 105);
      this.text(label, 50 + i * 329, 307, 24, active ? '#d9f0de' : '#a5bdbf', true);
      this.text(active ? 'VISIBLE' : 'EN CURSO', 50 + i * 329, 349, 19, active ? accent : muted, false, true);
    });
    this.bar(32, 436, 960, frame.progress, accent);
    this.text(frame.settled ? frame.reportedValue : 'Secuencia en curso…', 32, 480, 34, accent, true);
    this.text(frame.detail, 32, 540, 21, '#d8c79e');
  }

  private drawAlert(frame: SimulationFrame, ink: string, muted: string, accent: string): void {
    const ctx = this.context;
    this.text('Cola de eventos', 32, 147, 36, ink, true);
    for (let row = 0; row < 4; row += 1) {
      const y = 213 + row * 53;
      ctx.fillStyle = '#1a3039'; ctx.fillRect(28, y, 968, 44);
      this.text(`EV-${String(100 + row + (frame.settled ? 0 : frame.tick)).padStart(4, '0')}`, 44, y + 12, 20, muted, false, true);
      this.text(row === 3 && frame.progress >= 0.45 ? 'ALERTA CRÍTICA' : 'Evento ilustrativo / procesando', 240, y + 12, 23, row === 3 ? accent : muted, row === 3);
    }
    ctx.fillStyle = '#4b3e28'; ctx.fillRect(28, 458, 968, 94);
    this.text(frame.progress >= 0.45 ? '03:18 · ALERTA CRÍTICA EMITIDA' : 'Correlacionando eventos…', 48, 475, 29, accent, true);
    this.text('Asignación, respuesta y cierre: no aportados', 48, 518, 21, '#e7d4af');
  }

  private drawOutage(frame: SimulationFrame, accent: string): void {
    const ctx = this.context;
    const failed = frame.progress >= 0.35;
    this.text('CRM / Ventas y facturación', 32, 156, 34, '#e4eeec', true);
    ['Consultando órdenes', 'Conectando con facturación', 'Esperando respuesta del servicio'].forEach((line, i) => {
      this.text(`${failed ? '[ -- ]' : '[ .. ]'}  ${line}`, 32, 233 + i * 43, 24, failed ? '#c5b0ac' : '#a5bdbf', false, true);
    });
    ctx.fillStyle = failed ? '#41282d' : '#223a42'; ctx.fillRect(28, 394, 968, 153);
    this.text(failed ? 'SERVICIO NO DISPONIBLE' : 'Esperando respuesta…', 48, 416, 40, accent, true);
    this.text('Integridad y alcance por verificar', 48, 479, 25, '#e4cbc5');
    this.text('Recreación de disponibilidad · no simula cifrado real', 48, 520, 18, '#c5b0ac');
  }

  private drawTicket(frame: SimulationFrame, ink: string, muted: string): void {
    this.text('Solicitud de acceso', 32, 152, 38, ink, true);
    this.text('Proveedor / API', 32, 224, 30, '#326966', true);
    this.text('12 OCT · 16:15', 32, 285, 25, muted, false, true);
    this.text('Aprobación pendiente', 32, 357, 37, ink, true);
    this.text('La madrugada siguiente comienza el incidente.', 32, 486, 25, muted);
    this.text(frame.detail, 32, 536, 22, muted);
  }

  private wrap(text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
    const words = text.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (this.context.measureText(test).width > maxWidth && line) {
        this.context.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    }
    this.context.fillText(line, x, y);
    return y + lineHeight;
  }
}
