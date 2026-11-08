import type { GameState, StationId } from '../audit/types';
import { currentSourceVersion } from '../audit/evaluate';
import { reviewRules } from '../audit/rules';
import type { AppId, ComputerDefinition, DesktopTask } from '../computer/types';
import { computerAssets } from './computerAssets';
import { stations, stationById } from './stations';

const installed: Record<StationId, readonly [AppId, AppId]> = {
  accesos: ['session-viewer', 'account-directory'], sql_red: ['query-studio', 'network-monitor'],
  crm_cambios: ['order-history', 'change-manager'], siem: ['event-desk', 'time-tracker'],
  respaldos: ['recovery-console', 'backup-manager'], mesa_auditor: ['file-explorer', 'clock-comparator'],
};
const inspected = (id: string, label: string, hint: string, sourceIds: string[], match: 'any' | 'all' = 'any'): DesktopTask =>
  ({ id, label, hint, condition: { kind: 'inspected', sourceIds, match } });
const checked = (id: string, label: string, hint: string, checkId: string): DesktopTask =>
  ({ id, label, hint, condition: { kind: 'check-recorded', checkId } });
const tasks: Record<StationId, readonly DesktopTask[]> = {
  accesos: [
    inspected('a-sesion', 'Revisar la sesión remota', 'Abre Visor de sesiones y examina la sesión y los permisos registrados.', ['E-02', 'EVT-02']),
    inspected('a-cuentas', 'Consultar cuentas y solicitudes', 'Directorio de cuentas contiene el resumen de cuentas y las solicitudes de acceso.', ['E-01']),
    checked('a-contraste', 'Contrastar el alcance del acceso', 'Compara los registros y responde el contraste de alcance desde Informe del puesto.', 'C01-ALCANCE'),
  ],
  sql_red: [
    inspected('b-lectura', 'Revisar la lectura masiva de clientes', 'Abre Query Studio. Consulta la actividad de SQL Server y examina el registro de lectura.', ['E-03', 'EVT-04']),
    checked('b-contraste', 'Contrastar la lectura con el tráfico saliente', 'El Monitor de red contiene el registro de salida. Compara qué información aporta cada registro y registra tu contraste.', 'C02-CONTENIDO'),
    inspected('b-seguridad', 'Obtener el contexto de Seguridad', 'Solicita la declaración de Seguridad al enlace de TI; después puedes consultarla en Expediente local.', ['DECL-05']),
  ],
  crm_cambios: [
    inspected('c-ordenes', 'Revisar modificaciones de órdenes', 'Abre CRM · Historial de órdenes y examina las modificaciones registradas.', ['EVT-06']),
    inspected('c-cambio', 'Consultar el despliegue y el ticket', 'Gestor de cambios reúne el despliegue y el ticket; examina ambos soportes.', ['EVT-07', 'E-06'], 'all'),
    inspected('c-declaraciones', 'Contrastar BD y Desarrollo', 'Solicita las declaraciones de BD y Desarrollo al enlace de TI y examínalas en Expediente local.', ['DECL-03', 'DECL-04'], 'all'),
  ],
  siem: [
    inspected('d-alerta', 'Revisar la alerta de seguridad', 'Abre Event Desk y examina la alerta crítica.', ['EVT-08']),
    inspected('d-seguimiento', 'Reconstruir el seguimiento', 'Consulta el seguimiento disponible en Visor de seguimiento y relojes.', ['E-07']),
    inspected('d-relojes', 'Comparar las horas disponibles', 'Visor de seguimiento y relojes muestra los campos temporales y su procedencia.', ['META-TIEMPO']),
  ],
  respaldos: [
    inspected('e-recuperacion', 'Recorrer la recuperación', 'Recovery Console permite recorrer los estados reportados del CRM.', ['EVT-09', 'EVT-11', 'EVT-12'], 'all'),
    inspected('e-respaldo', 'Revisar respaldo y pruebas', 'Abre Gestor de respaldos y examina el resumen y los soportes disponibles.', ['E-08']),
    inspected('e-continuidad', 'Contrastar Continuidad', 'Solicita la declaración de Continuidad al enlace de TI y consúltala en Expediente local.', ['DECL-07']),
  ],
  mesa_auditor: [
    inspected('f-custodia', 'Revisar originales y hashes', 'Explorador del expediente muestra el inventario y los campos de custodia disponibles.', ['META-CUSTODIA']),
    inspected('f-procedencia', 'Inspeccionar la procedencia', 'Examina los soportes de contexto del Explorador del expediente y sus referencias.', ['E-09', 'E-10'], 'all'),
    inspected('f-relojes', 'Comprobar los campos temporales', 'Comparador de relojes permite revisar horas originales y verificación por fuente.', ['META-TIEMPO']),
  ],
};

export const computers: readonly ComputerDefinition[] = stations.map((station) => {
  // La asignación visual tiene una sola autoridad, compartida con el escritorio.
  if (!computerAssets.stations[station.id]) throw new Error('Faltan recursos de computadora.');
  const apps = installed[station.id];
  return {
    stationId: station.id, reviewId: station.reviewId, title: `${station.short} · ${station.title}`,
    installedApps: [...apps, 'station-report', 'local-dossier'], shortcuts: [...apps, 'station-report', 'local-dossier'],
    initialWindows: [
      { appId: apps[0], bounds: { x: 330, y: 20, width: 640, height: 430 }, mode: 'normal' },
      ...(station.id === 'sql_red' ? [{ appId: apps[1], bounds: { x: 700, y: 170, width: 470, height: 350 }, mode: 'normal' as const }] : []),
    ],
    initialActiveAppId: apps[0], note: { position: { x: 108, y: 12 }, tasks: tasks[station.id] },
  };
});

export function getComputer(stationId: StationId): ComputerDefinition {
  const computer = computers.find((item) => item.stationId === stationId);
  if (!computer) throw new Error('Computadora no admitida.');
  return computer;
}

export function computerSourceIds(stationId: StationId): string[] {
  const station = stationById(stationId);
  return [...new Set([...station.sourceIds, ...reviewRules[station.reviewId].sourceGroups.flatMap((group) => group.alternatives)])];
}

export function availableComputerSources(stationId: StationId, state: GameState): string[] {
  return computerSourceIds(stationId).filter((sourceId) => !sourceId.startsWith('DECL-')
    || state.inspected.some((ref) => ref.sourceId === sourceId && ref.sourceVersion === currentSourceVersion(sourceId)));
}
