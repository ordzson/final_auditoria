import type { StationId } from '../audit/types';
import { canon, eventById, evidenceById, statementById } from './canon';
import { stationById } from './stations';

const eventNames: Record<string, string> = {
  'EVT-01': 'Renovación del acceso del proveedor',
  'EVT-02': 'Sesión remota sin MFA',
  'EVT-03': 'Elevación de privilegios',
  'EVT-04': 'Lectura masiva de clientes',
  'EVT-05': 'Transferencia hacia el exterior',
  'EVT-06': 'Modificación de órdenes',
  'EVT-07': 'Despliegue de integración',
  'EVT-08': 'Alerta crítica de seguridad',
  'EVT-09': 'Caída del CRM',
  'EVT-10': 'Solicitud de recuperación',
  'EVT-11': 'CRM disponible para consulta',
  'EVT-12': 'Escritura restablecida',
  'EVT-13': 'Conciliación solicitada por Finanzas',
};

export function sourceName(id: string): string {
  if (id === 'META-CUSTODIA') return 'Inventario de archivos y custodia';
  if (id === 'META-TIEMPO') return 'Relojes y horas originales';
  return eventNames[id] ?? evidenceById(id)?.type
    ?? (statementById(id) ? `Declaración de ${statementById(id)!.speakerRole}` : id);
}

export function sourceContext(id: string): string {
  const event = eventById(id);
  if (event) return `${event.reportedAt.slice(8, 10)}/${event.reportedAt.slice(5, 7)} · ${event.reportedAt.slice(11, 16)} · ${event.systemLabel}`;
  if (statementById(id)) return 'Entrevista · declaración atribuida';
  return id.startsWith('META-') ? 'Vista de revisión' : 'Soporte resumido';
}

export function readableReferences(text: string): string {
  return text.replace(/EVT-\d{2}|DECL-\d{2}|E-\d{2}|META-CUSTODIA|META-TIEMPO/g, sourceName);
}

export type WorkView = { id: string; label: string; sourceIds: string[] };
export type Workstation = { app: string; context: string; question: string; prompt: string; views: WorkView[] };

export const workstations: Record<StationId, Workstation> = {
  accesos: {
    app: 'Identity Manager', context: 'Accesos / copia de revisión',
    question: 'Alguien entró. ¿Qué sabemos de esa sesión?',
    prompt: 'Abre la sesión remota y sigue la cuenta. Después contrasta sus permisos con el directorio.',
    views: [
      { id: 'sessions', label: 'Sesiones y permisos', sourceIds: ['EVT-02', 'EVT-03', 'EVT-04'] },
      { id: 'directory', label: 'Directorio y solicitudes', sourceIds: ['E-01', 'E-02', 'EVT-01'] },
    ],
  },
  sql_red: {
    app: 'Query Studio', context: 'Expediente local / solo lectura',
    question: '¿Salieron los datos que se leyeron en SQL?',
    prompt: 'Ejecuta la consulta, abre la lectura y busca qué pasó en la red. Puedes editar el SQL.',
    views: [
      { id: 'query', label: 'Editor SQL', sourceIds: [] },
      { id: 'network', label: 'Monitor de red', sourceIds: ['EVT-04', 'EVT-05', 'E-03', 'E-04'] },
    ],
  },
  crm_cambios: {
    app: 'CRM · Control de cambios', context: 'Órdenes / historial de revisión',
    question: '¿El despliegue explica los cambios en las órdenes?',
    prompt: 'Compara la modificación de órdenes con el despliegue. Abre el ticket para revisar su aprobación.',
    views: [
      { id: 'orders', label: 'Historial de órdenes', sourceIds: ['EVT-06', 'EVT-07', 'EVT-13', 'E-05'] },
      { id: 'releases', label: 'Versiones y ticket', sourceIds: ['EVT-07', 'E-06', 'EVT-08', 'EVT-05'] },
    ],
  },
  siem: {
    app: 'Event Desk', context: 'Seguridad / revisión de incidentes',
    question: 'La alerta llegó. ¿Podemos reconstruir la respuesta?',
    prompt: 'Busca la alerta y abre su seguimiento. Compara su hora con la de la sesión remota.',
    views: [
      { id: 'timeline', label: 'Cronología del incidente', sourceIds: ['EVT-02', 'EVT-03', 'EVT-08', 'EVT-09'] },
      { id: 'response', label: 'Atención y relojes', sourceIds: ['E-07', 'META-TIEMPO'] },
    ],
  },
  respaldos: {
    app: 'Recovery Console', context: 'Continuidad / estados reportados',
    question: 'El CRM volvió. ¿Eso prueba que el respaldo funcionó?',
    prompt: 'Recorre los estados del servicio y revisa qué prueba de restauración acompaña al respaldo.',
    views: [
      { id: 'recovery', label: 'Recuperación del servicio', sourceIds: ['EVT-09', 'EVT-10', 'EVT-11', 'EVT-12', 'EVT-13'] },
      { id: 'backup', label: 'Respaldos y pruebas', sourceIds: ['E-08', 'DECL-07'] },
    ],
  },
  mesa_auditor: {
    app: 'Archivo de investigación', context: 'Copias / procedencia y tiempo',
    question: '¿Tenemos originales o solo resúmenes?',
    prompt: 'Inspecciona el inventario. Comprueba qué archivos y hashes están disponibles y revisa los relojes.',
    views: [
      { id: 'custody', label: 'Inventario de archivos', sourceIds: ['META-CUSTODIA', 'E-09', 'E-10'] },
      { id: 'clocks', label: 'Relojes y procedencia', sourceIds: ['META-TIEMPO', 'EVT-01', 'EVT-02'] },
    ],
  },
};

export function stationSources(stationId: StationId, inspectedIds: string[]): string[] {
  const station = stationById(stationId);
  // Add statements obtained at the liaison to the desk's existing material.
  return [...station.sourceIds,
    ...canon.initialStatements.filter((statement) => inspectedIds.includes(statement.id)
      && statementReview(statement.id) === station.reviewId).map((statement) => statement.id)];
}

function statementReview(id: string): string {
  return ({ 'DECL-03': 'AU-03', 'DECL-04': 'AU-03', 'DECL-05': 'AU-02', 'DECL-07': 'AU-05' } as Record<string, string>)[id] ?? '';
}
