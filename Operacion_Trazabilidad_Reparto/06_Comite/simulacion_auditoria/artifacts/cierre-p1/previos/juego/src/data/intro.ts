import { canon, eventById } from './canon';

export type ShotId = 'P01' | 'P02' | 'P03' | 'P04' | 'P05' | 'P06' | 'P07' | 'P08' | 'P09' | 'P10';
export type Shot = { id: ShotId; start: number; end: number; anchor: string };

export const shots: Shot[] = [
  { id: 'P01', start: 0, end: 8, anchor: 'general' },
  { id: 'P02', start: 8, end: 16, anchor: 'accesos' },
  { id: 'P03', start: 16, end: 23, anchor: 'accesos' },
  { id: 'P04', start: 23, end: 37, anchor: 'sql_red' },
  { id: 'P05', start: 37, end: 45, anchor: 'crm_cambios' },
  { id: 'P06', start: 45, end: 53, anchor: 'crm_cambios' },
  { id: 'P07', start: 53, end: 61, anchor: 'siem' },
  { id: 'P08', start: 61, end: 77, anchor: 'crm_cambios' },
  { id: 'P09', start: 77, end: 95, anchor: 'respaldos' },
  { id: 'P10', start: 95, end: 110, anchor: 'mesa_auditor' },
];

const eventTimes: [string, number][] = [
  ['EVT-01', 0], ['EVT-02', 8], ['EVT-03', 16], ['EVT-04', 23], ['EVT-05', 30],
  ['EVT-06', 37], ['EVT-07', 45], ['EVT-08', 53], ['EVT-09', 61], ['EVT-10', 77],
  ['EVT-11', 83], ['EVT-12', 89], ['EVT-13', 95],
];

export type IntroFrame = {
  shot: Shot;
  localTime: number;
  eventId: string | null;
  eventIds: string[];
  timeLabel: string;
  dateLabel: string;
  message: string;
  provenance: string;
  noteVisible: boolean;
  visitLabel: boolean;
};

export function shotAt(time: number): Shot {
  const clamped = Math.max(0, Math.min(canon.presentation.openingTargetSeconds, time));
  return shots.find((shot) => clamped >= shot.start && clamped < shot.end) ?? shots[shots.length - 1];
}

export function getIntroFrame(time: number): IntroFrame {
  const clamped = Math.max(0, Math.min(canon.presentation.openingTargetSeconds, time));
  const shot = shotAt(clamped);
  const localTime = clamped - shot.start;
  const primaryEvents: Partial<Record<ShotId, string>> = {
    P02: 'EVT-02', P03: 'EVT-03', P04: 'EVT-04', P05: 'EVT-06',
    P06: 'EVT-07', P07: 'EVT-08', P08: 'EVT-09', P09: 'EVT-10',
  };
  let eventId: string | null = primaryEvents[shot.id] ?? null;
  let eventIds = eventId ? [eventId] : [];
  let message = '';
  let visitLabel = false;

  if (shot.id === 'P01') {
    eventId = localTime < 5.5 ? 'EVT-01' : null;
    eventIds = ['EVT-01'];
    message = localTime < 5.5
      ? 'RedNova: servicios de internet y televisión. Una solicitud de acceso seguía pendiente.'
      : '14 de octubre: comienzan los registros preliminares de la madrugada.';
  } else if (shot.id === 'P02') {
    message = 'Se registra una sesión remota sin segundo factor.';
  } else if (shot.id === 'P03') {
    message = 'Identidad registra una elevación de privilegios. La cuenta no está aportada.';
  } else if (shot.id === 'P04') {
    eventId = localTime < 7 ? 'EVT-04' : 'EVT-05';
    eventIds = ['EVT-04', 'EVT-05'];
    message = localTime < 7 ? 'Lectura reportada: 31,840 registros de clientes.' : 'Transferencia externa: contenido sin identificar.';
  } else if (shot.id === 'P05') {
    message = 'Se reportan cambios en 216 órdenes comerciales.';
  } else if (shot.id === 'P06') {
    eventIds = ['EVT-06', 'EVT-07'];
    message = 'El despliegue ocurre después de los cambios de órdenes. La secuencia no demuestra causalidad.';
  } else if (shot.id === 'P07') {
    message = 'Se emite una alerta crítica.';
  } else if (shot.id === 'P08') {
    message = 'Ventas y facturación afectadas. Se sospecha ransomware; el alcance sigue por verificar.';
  } else if (shot.id === 'P09') {
    eventId = localTime < 6 ? 'EVT-10' : localTime < 12 ? 'EVT-11' : 'EVT-12';
    eventIds = ['EVT-10', 'EVT-11', 'EVT-12'];
    message = localTime < 6
      ? 'Recuperación solicitada.'
      : localTime < 12
        ? 'Servicio parcial: CRM en solo consulta.'
        : 'Escritura restablecida; integridad por verificar.';
  } else if (shot.id === 'P10') {
    eventId = localTime < 10 ? 'EVT-13' : null;
    eventIds = ['EVT-13'];
    visitLabel = localTime >= 10;
    message = visitLabel ? 'El servicio volvió. ¿Qué podemos sostener con evidencia?' : 'Finanzas solicita conciliación de órdenes y facturación.';
  }

  const event = eventId ? eventById(eventId) : null;
  const note = canon.presentation.ransomNote;
  const noteVisible = shot.id === note.shotId
    && localTime >= note.showAfterShotStartSeconds
    && localTime < note.showAfterShotStartSeconds + note.visibleForSeconds;

  return {
    shot,
    localTime,
    eventId,
    eventIds,
    dateLabel: visitLabel ? 'Visita de auditoría' : event ? formatIntroDate(event.reportedAt) : shot.id === 'P01' ? '14 oct 2026' : '14 oct 2026',
    timeLabel: visitLabel ? 'SIN HORA ASIGNADA' : event ? event.reportedAt.slice(11, 16) : '—',
    message,
    provenance: event
      ? `${event.id} · Registro preliminar del curso, p. 4 · Hora reportada UTC−6`
      : visitLabel
        ? 'La iluminación es puesta en escena; el caso no asigna una hora a la visita.'
        : 'Reconstrucción del expediente · puesta en escena ilustrativa',
    noteVisible,
    visitLabel,
  };
}

function formatIntroDate(value: string): string {
  const day = value.slice(8, 10);
  return `${day} oct 2026`;
}

export function introHistory(time: number): string[] {
  return eventTimes.filter(([, start]) => start <= time).slice(-6).map(([id]) => id);
}

export function shotIndex(time: number): number {
  return shots.findIndex((shot) => shot.id === shotAt(time).id);
}
