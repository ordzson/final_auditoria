import type { ReviewId } from '../audit/types';

/** Ayuda de lectura: no incorpora fuentes ni cambia las decisiones evaluables v2.1. */
export const reviewGuidance: Record<ReviewId, { terms: string; limit: string }> = {
  'AU-01': {
    terms: 'MFA (autenticación multifactor) exige factores distintos, como contraseña y código de una aplicación. VPN es una conexión privada a la red; API es una interfaz entre programas. Recertificar es revisar con el responsable qué cuentas y permisos siguen justificados.',
    limit: 'La sesión de ext_ops_04 no identifica a una persona ni enlaza por sí sola la elevación o la lectura SQL. La política y sus excepciones siguen pendientes.',
  },
  'AU-02': {
    terms: 'SQL es el lenguaje de consulta de datos; SELECT permite leerlos. Exfiltración significa salida no autorizada de información: el volumen de tráfico no identifica el contenido ni su autorización.',
    limit: 'El caso reporta una lectura de 31,840 registros y aproximadamente 1.6 GB de tráfico. No se demuestra que esos registros fueran enviados ni que la salida careciera de autorización. El editor consulta resúmenes locales; las consultas de los anexos se probaron con datos ficticios y no corroboran el incidente.',
  },
  'AU-03': {
    terms: 'CRM es el sistema de gestión de clientes y órdenes. Conciliar significa comparar historial de órdenes y facturación para identificar y explicar diferencias. BD significa base de datos.',
    limit: 'El caso reporta 216 órdenes. Los 144 cambios de monto y 72 de estado son supuestos del laboratorio, sin cuenta, sesión ni vía conocidas. Los diez pares candidatos a duplicidad son otras veinte órdenes ficticias y no prueban doble cobro. Falta comparar las órdenes con facturas, pagos, autorizaciones y un respaldo validado.',
  },
  'AU-04': {
    terms: 'SIEM es el sistema que reúne registros y genera alertas de seguridad. La alerta reportada de las 03:18 no incluye asignación, primera acción ni cierre documentados.',
    limit: 'Seguimiento de la alerta pendiente de comprobar. Los 61 minutos entre sesión y alerta y los 24 hasta la caída son diferencias de horas reportadas. No prueban tiempo de detección, inacción ni pérdida de registros; los relojes no están verificados.',
  },
  'AU-05': {
    terms: 'RTO es el tiempo objetivo para restablecer el servicio. RPO es la pérdida de datos tolerable expresada en tiempo. BIA es el análisis del impacto de una interrupción en el negocio.',
    limit: 'Los 315 minutos hasta consulta y los 355 hasta escritura describen el retorno reportado. No demuestran integridad ni cumplimiento de los objetivos de recuperación. Faltan objetivos aprobados, el respaldo usado y pruebas de datos recuperados. El registro de julio del laboratorio es ficticio; no se ejecutó una restauración real.',
  },
  'AU-06': {
    terms: 'Metadatos son datos sobre un archivo, como su ruta y procedencia. SHA-256 es una huella calculada de sus bytes. Compararla con una referencia previamente registrada permite detectar cambios; no demuestra verdad ni completitud. Hay que conservar el origen de esa referencia.',
    limit: 'Aquí se consultan metadatos del resumen, sin leer archivos ni calcular huellas digitales ni comprobar permisos efectivos. Los permisos se probaron solo en el laboratorio ficticio. La protección de los registros y el seguimiento de la alerta siguen pendientes de comprobar; faltan originales y relojes verificados. Las huellas de los anexos no autentican el incidente.',
  },
};

export const documentedMeaning = '«Documentado» significa que se reunieron las fuentes y respuestas estructuradas exigidas para esta actividad educativa. Puede conservar una conclusión no concluyente; no aprueba hallazgos académicos, causalidad ni autoría.';

export const caseOverview = 'RedNova es una empresa ficticia de internet y televisión. El caso reporta la caída de su sistema comercial y archivos aparentemente cifrados. Investiga qué puede sostenerse y qué falta comprobar: no hay registros originales de la empresa.';
export const evidenceKinds = 'Distingue cinco clases de información: datos reportados por el caso; declaraciones que deben contrastarse; resultados ficticios del laboratorio; hipótesis por investigar; y datos desconocidos. La oficina y sus animaciones son ilustrativas.';
export const laboratoryComparison = 'Cálculo de laboratorio: siete campos de 31,840 clientes ficticios ocupan 2,058,909 bytes en CSV (tabla de texto), unos 2.06 megabytes; o 5,115,483 bytes en JSON Lines (nombres de campo repetidos), unos 5.12 megabytes. Es mucho menos que los aproximadamente 1.6 GB reportados. No reconstruye el envío ni confirma o descarta una extracción sin autorización: faltan contenido, destino, proceso y autorización. Los cuatro minutos entre lectura y transferencia no indican la duración del envío.';

export const hypotheses = [
  { title: 'Posible robo de credenciales', explanation: 'Una persona no autorizada pudo obtener la contraseña. La sesión sin verificación adicional es compatible con ello, pero no conecta las demás acciones.', distinguish: 'Buscar registros originales que conecten sesión, equipo, proceso y archivos enviados. Una transferencia autorizada o procesos independientes debilitarían esa cadena.' },
  { title: 'Posible uso indebido de un acceso legítimo', explanation: 'Alguien que tenía acceso pudo exceder sus autorizaciones. El nombre de la cuenta no identifica a la persona ni su intención.', distinguish: 'Obtener asignación histórica de la cuenta, dispositivo, autorizaciones y acciones. Un robo de credenciales documentado ajeno al titular debilitaría esa atribución.' },
  { title: 'Posible actividad autorizada coincidente con un ataque por otra vía', explanation: 'La lectura, el envío o la instalación pudieron tener una finalidad legítima. La aprobación verbal y un destino sin clasificar no acreditan autorización.', distinguish: 'Obtener tarea programada, archivos, destino, aprobación y evidencia de la otra vía de ataque. Contenido no autorizado conectado técnicamente al ataque refutaría la legitimidad de esa actividad.' },
];

export const pendingObservations = [
  { title: 'Seguimiento de la alerta pendiente de comprobar', detail: 'Faltan asignación, primera acción, escalamiento y cierre documentados. Un registro íntegro podría retirar o reformular esta observación. No se ha probado inacción.' },
  { title: 'Protección de los registros pendiente de comprobar', detail: 'Faltan permisos históricos, reglas de conservación y copias independientes. Una copia protegida con permisos verificados podría acotar la observación. No se ha probado manipulación.' },
];

export const proposedActions = [
  { number: 1, title: 'Organizar la respuesta y registrar decisiones', owner: 'Administración y Seguridad', hours: 4, closure: 'Decisiones y asignaciones con responsable y hora, contrastadas con comunicaciones.' },
  { number: 2, title: 'Obtener el registro original de atención de la alerta crítica', owner: 'Seguridad y monitoreo', hours: 12, closure: 'Registro original contrastado con acciones, escalamiento y aceptación del cierre.' },
  { number: 3, title: 'Preservar registros, memoria e imágenes de equipos disponibles', owner: 'Equipo forense y custodio designado por la empresa', hours: 6, closure: 'Copias con origen, fecha, huella y acceso registrado; pérdidas justificadas.' },
  { number: 4, title: 'Decidir aislamiento selectivo y revocar accesos en riesgo', owner: 'Seguridad, identidades e Infraestructura, bajo la administración', hours: 6, closure: 'Cambio autorizado y prueba de rechazo del acceso revocado; excepciones registradas.' },
  { number: 5, title: 'Obtener permisos, conservación y configuración de relojes', owner: 'Infraestructura, base de datos y Seguridad', hours: 24, closure: 'Configuración y originales; cobertura y desfases comprobados o desconocidos explícitos.' },
  { number: 6, title: 'Investigar contenido y autorización de la transferencia externa', owner: 'Seguridad, nube y proveedor autorizado', hours: 24, closure: 'Originales que conecten sesión, proceso y objetos; destino y autorización comprobados.' },
  { number: 7, title: 'Restaurar un respaldo validado en un entorno separado', owner: 'Administración, Continuidad y base de datos', hours: 48, closure: 'Prueba real autorizada de restauración, integridad y revisión de señales de compromiso.' },
  { number: 8, title: 'Comparar órdenes afectadas con historial, facturación y respaldo', owner: 'Sistema comercial, Finanzas y base de datos', hours: 72, closure: 'Todas las órdenes identificadas comparadas, con fuentes y diferencias justificadas o excepción expresa.' },
  { number: 9, title: 'Probar seguimiento completo con una alerta controlada', owner: 'Seguridad y monitoreo', hours: 72, closure: 'Alerta de prueba con asignación, acciones, escalamiento y cierre; objetivo aprobado antes del ensayo.' },
  { number: 10, title: 'Probar conservación de registros y rechazo de modificaciones', owner: 'Infraestructura y Seguridad', hours: 72, closure: 'Evento controlado recibido completo y cambios no autorizados rechazados, sin alterar registros del incidente.' },
  { number: 11, title: 'Decidir retorno progresivo del servicio con aceptación del negocio', owner: 'Administración, negocio y Continuidad', hours: 72, closure: 'Pruebas de seguridad, integridad y comparación de órdenes antes de habilitar escritura; excepciones aceptadas con responsable.' },
];
export const actionBoundary = 'Las once acciones siguen siendo propuestas. Los plazos máximos se cuentan desde la futura activación del plan por la administración. La administración decide y ejecuta; el auditor recomienda y evalúa. Preservar y contener se coordinan: una medida urgente ante daño activo no espera una recopilación perfecta; se documenta qué se conserva o pierde. Recuperar y volver a escribir dependen de respaldo limpio, validación, comparación de órdenes y aceptación del negocio. Faltan costos y evaluación del riesgo restante; estas 72 horas no sustituyen el plan completo de 90 días.';
export const actionsByReview: Record<ReviewId, number[]> = {
  'AU-01': [1, 4, 5], 'AU-02': [3, 6], 'AU-03': [7, 8, 11],
  'AU-04': [1, 2, 9], 'AU-05': [7, 8, 11], 'AU-06': [3, 5, 10],
};
