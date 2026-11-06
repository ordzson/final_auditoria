import { canon } from './canon';
import { getIntroFrame } from './intro';

export type SimulationKind = 'ticket' | 'access' | 'identity' | 'sql' | 'transfer' | 'orders' | 'deploy' | 'alert' | 'outage' | 'recovery' | 'reconcile';
export type SimulationFrame = {
  kind: SimulationKind;
  screen: string;
  title: string;
  operation: string;
  localTime: number;
  progress: number;
  tick: number;
  settled: boolean;
  reducedMotion: boolean;
  reportedValue: string;
  detail: string;
};

// Presentation only. Intermediate counts, sample rows and progress are illustrative,
// never sources for the audit evaluator. Everything is derived from the playhead.
export function getSimulationFrame(time: number, reducedMotion = false): SimulationFrame {
  const frame = getIntroFrame(time);
  const eventTime = frame.shot.id === 'P04' ? frame.localTime % 7
    : frame.shot.id === 'P09' ? frame.localTime % 6 : frame.localTime;
  const settleAfter = frame.shot.id === 'P08' ? 2.5 : 3.6;
  const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, eventTime / settleAfter));
  const base = {
    localTime: eventTime, progress, tick: reducedMotion ? 0 : Math.floor(eventTime * 10),
    settled: progress >= 1, reducedMotion,
  };
  let visual: Omit<SimulationFrame, keyof typeof base>;
  switch (frame.shot.id) {
    case 'P01': visual = { kind: 'ticket', screen: 'accesos:0', title: 'Mesa de servicio', operation: 'Solicitud de acceso', reportedValue: 'PENDIENTE', detail: 'Proveedor / API · aprobación pendiente' }; break;
    case 'P02': visual = { kind: 'access', screen: 'accesos:0', title: 'Acceso remoto', operation: 'Estableciendo sesión', reportedValue: 'SIN MFA', detail: 'ext_ops_04 · sesión reportada' }; break;
    case 'P03': visual = { kind: 'identity', screen: 'accesos:0', title: 'Directorio de identidad', operation: 'Cambio de privilegios', reportedValue: 'ELEVACIÓN', detail: 'Cuenta no aportada · registro independiente' }; break;
    case 'P04': visual = frame.localTime < 7
      ? { kind: 'sql', screen: 'sql_red:0', title: 'SQL / Query Studio', operation: 'Leyendo registros', reportedValue: canon.reportedFacts.customerRecordsRead.toLocaleString('en-US'), detail: 'Registros de clientes · lectura reportada' }
      : { kind: 'transfer', screen: 'sql_red:1', title: 'Red / Transfer Monitor', operation: 'Transferencia saliente', reportedValue: `~${canon.reportedFacts.outboundTransfer.reportedValue} GB`, detail: 'Contenido y relación con SQL sin identificar' }; break;
    case 'P05': visual = { kind: 'orders', screen: 'crm_cambios:0', title: 'CRM / Órdenes', operation: 'Actualizando órdenes', reportedValue: String(canon.reportedFacts.ordersModified), detail: 'Cambios reportados · integridad por verificar' }; break;
    case 'P06': visual = { kind: 'deploy', screen: 'crm_cambios:0', title: 'Integración / Releases', operation: 'Despliegue de versión', reportedValue: 'VERSIÓN NUEVA', detail: 'Posterior a los cambios · no demuestra causalidad' }; break;
    case 'P07': visual = { kind: 'alert', screen: 'siem:0', title: 'SIEM / Event Desk', operation: 'Procesando eventos', reportedValue: 'CRÍTICA', detail: 'Atención y cierre no aportados' }; break;
    case 'P08': visual = { kind: 'outage', screen: 'crm_cambios:0', title: 'CRM / Servicio', operation: 'El servicio deja de responder', reportedValue: 'NO DISPONIBLE', detail: 'Ventas y facturación afectadas' }; break;
    case 'P09': visual = { kind: 'recovery', screen: 'crm_cambios:0', title: 'CRM / Recuperación', operation: frame.localTime < 6 ? 'Preparando recuperación' : frame.localTime < 12 ? 'Habilitando consultas' : 'Habilitando escritura', reportedValue: frame.localTime < 6 ? 'SOLICITADA' : frame.localTime < 12 ? 'SOLO CONSULTA' : 'ESCRITURA', detail: 'Integridad, restauración y objetivos por verificar' }; break;
    default: visual = { kind: 'reconcile', screen: 'mesa_auditor:0', title: 'Finanzas / Conciliación', operation: 'Preparando revisión', reportedValue: 'POR CONCILIAR', detail: 'Órdenes y facturación · conciliación pendiente' };
  }
  return { ...base, ...visual };
}
