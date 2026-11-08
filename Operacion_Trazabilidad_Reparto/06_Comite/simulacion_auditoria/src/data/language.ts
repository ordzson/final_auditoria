import { eventById, evidenceById, statementById } from './canon';

// Capa de lectura: conserva los identificadores y los hechos del expediente.
const names: Record<string, string> = {
  'EVT-01': 'Solicitud de renovación del acceso del proveedor',
  'EVT-02': 'Sesión remota sin verificación adicional',
  'EVT-03': 'Aumento de permisos',
  'EVT-04': 'Lectura de 31,840 registros de clientes',
  'EVT-05': 'Transferencia hacia el exterior',
  'EVT-06': 'Modificación de órdenes',
  'EVT-07': 'Instalación de una nueva versión de integración',
  'EVT-08': 'Alerta crítica de seguridad',
  'EVT-09': 'Caída del sistema comercial',
  'EVT-10': 'Solicitud de recuperación',
  'EVT-11': 'Sistema comercial disponible para consulta',
  'EVT-12': 'Escritura restablecida',
  'EVT-13': 'Comparación de órdenes y facturas solicitada por Finanzas',
  'E-01': 'Usuarios y permisos',
  'E-02': 'Acceso remoto',
  'E-03': 'Lectura masiva de clientes',
  'E-04': 'Transferencia externa',
  'E-05': 'Cambios de órdenes comerciales',
  'E-06': 'Autorización de instalación de software',
  'E-07': 'Alerta crítica de seguridad',
  'E-08': 'Respaldos',
  'E-09': 'Contrato del proveedor',
  'E-10': 'Clasificación de una sesión por inteligencia artificial',
  'META-CUSTODIA': 'Inventario de archivos y custodia',
  'META-TIEMPO': 'Relojes y horas originales',
};

export function sourceName(id: string): string {
  return names[id] ?? (statementById(id) ? `Declaración de ${classroomText(statementById(id)!.speakerRole)}` : id);
}

/** Expansiones locales de términos; el texto literal del curso sigue en el canon. */
export function classroomText(text: string): string {
  return text
    .replace(/ext_ops_04/g, 'ext_ops_04 (nombre de la cuenta remota; persona desconocida)')
    .replace(/sin MFA/g, 'sin verificación adicional a la contraseña (MFA)')
    .replace(/recertificación/g, 'revisión de permisos')
    .replace(/\bVPN\b/g, 'conexión privada de acceso remoto (VPN)')
    .replace(/\bAPI\b/g, 'interfaz de integración entre sistemas (API)')
    .replace(/\bCRM\b/g, 'sistema comercial y de clientes (CRM)')
    .replace(/\bERP\b/g, 'sistema de facturación y finanzas (ERP)')
    .replace(/\bSLA\b/g, 'acuerdo de nivel de servicio (SLA)')
    .replace(/\bSOC 2\b/g, 'informe de controles del proveedor (SOC 2)')
    .replace(/\bBD\b/g, 'base de datos')
    .replace(/bitácora/gi, 'registro de actividad')
    .replace(/\blogs\b/g, 'registros de actividad')
    .replace(/conciliación/gi, 'comparación de órdenes y facturas')
    .replace(/despliegue/g, 'instalación de software')
    .replace(/hashes/g, 'huellas digitales')
    .replace(/\bhash\b/g, 'huella digital')
    .replace(/RTO y RPO/g, 'tiempo de recuperación y pérdida temporal de datos tolerable');
}

export function sourceSummary(id: string): string {
  return classroomText(eventById(id)?.description ?? evidenceById(id)?.summary ?? statementById(id)?.summary ?? '');
}
