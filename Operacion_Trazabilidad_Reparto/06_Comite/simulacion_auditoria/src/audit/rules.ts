import { classroomText } from '../data/language';
import type { ReviewId } from './types';

export const RULES_VERSION = 'auditoria_reglas_v2.1';

export type SourceGroup = {
  id: string;
  label: string;
  alternatives: string[];
};

export type CheckRule = {
  id: string;
  question: string;
  sourceGroupIds: string[];
  options: { id: string; text: string }[];
  acceptedAnswerId: string;
};

export type ReviewRule = {
  id: ReviewId;
  title: string;
  question: string;
  sourceGroups: SourceGroup[];
  checks: CheckRule[];
  conclusions: { id: string; text: string }[];
  acceptedConclusionIds: string[];
  limitations: { id: string; text: string }[];
  requiredLimitationIds: string[];
  requests: { id: string; text: string }[];
  feedback: string;
  hints: string[];
};

export const reviewRules: Record<ReviewId, ReviewRule> = {
  'AU-01': {
    id: 'AU-01',
    title: 'Acceso remoto y autorizaciones',
    question: '¿El acceso estaba controlado?',
    sourceGroups: [
      { id: 'cuentas', label: 'Resumen de cuentas y privilegios', alternatives: ['E-01'] },
      { id: 'sesion', label: 'Sesión remota sin MFA', alternatives: ['E-02', 'EVT-02'] },
    ],
    checks: [{
      id: 'C01-ALCANCE',
      question: '¿Estos datos identifican a la persona que entró y bastan para declarar un incumplimiento de política?',
      sourceGroupIds: ['cuentas', 'sesion'],
      options: [
        { id: 'BASTA_PARA_AMBOS', text: 'Sí; los datos bastan para atribución e incumplimiento.' },
        { id: 'PERSONA_IDENTIFICADA', text: 'La persona está identificada, pero falta el criterio.' },
        { id: 'FALTAN_IDENTIDAD_Y_CRITERIO', text: 'No; faltan atribución personal y criterio aplicable.' },
      ],
      acceptedAnswerId: 'FALTAN_IDENTIDAD_Y_CRITERIO',
    }],
    conclusions: [
      { id: 'A01-OBSERVACION', text: 'Se reporta una sesión sin MFA y cuentas sin recertificación reciente; faltan política aplicable, autorizaciones, identidad personal y conexión con las demás acciones.' },
      { id: 'A01-AUTOR_IDENTIFICADO', text: 'El nombre de cuenta identifica al responsable.' },
      { id: 'A01-CUMPLIMIENTO_RESUELTO', text: 'La política de acceso ya fue evaluada.' },
    ],
    acceptedConclusionIds: ['A01-OBSERVACION'],
    limitations: [
      { id: 'L01-ATRIBUCION', text: 'La cuenta no equivale a la persona que la utilizó.' },
      { id: 'L01-CRITERIO', text: 'No se aportó política aplicable ni su alcance.' },
    ],
    requiredLimitationIds: ['L01-ATRIBUCION', 'L01-CRITERIO'],
    requests: [
      { id: 'S01-POLITICA', text: 'Solicitar política de acceso y alcance aprobado.' },
      { id: 'S01-TRAZABILIDAD', text: 'Solicitar titularidad autorizada y trazabilidad de la sesión.' },
    ],
    feedback: 'El registro permite observar acceso sin MFA; no permite atribuirlo a una persona ni evaluar una política no aportada.',
    hints: ['En la estación A, abre el resumen E-01 y la sesión E-02 o EVT-02.', 'Vincula ambos grupos y compara qué identifican realmente. Después registra el criterio ausente y una solicitud.'],
  },
  'AU-02': {
    id: 'AU-02',
    title: 'Lectura y transferencia',
    question: '¿Qué sabemos de los datos que salieron?',
    sourceGroups: [
      { id: 'lectura', label: 'Lectura SQL reportada', alternatives: ['E-03', 'EVT-04'] },
      { id: 'flujo', label: 'Transferencia externa reportada', alternatives: ['E-04', 'EVT-05'] },
      { id: 'seguridad', label: 'Declaración atribuida a Seguridad', alternatives: ['DECL-05'] },
    ],
    checks: [{
      id: 'C02-CONTENIDO',
      question: '¿Estos registros identifican el contenido transferido y lo conectan con la lectura SQL?',
      sourceGroupIds: ['lectura', 'flujo', 'seguridad'],
      options: [
        { id: 'VOLUMEN_DEMUESTRA_EXFILTRACION', text: 'Sí; el volumen demuestra extracción de información sin autorización de la lectura.' },
        { id: 'SIN_VINCULO_NI_CONTENIDO', text: 'No; falta correlación entre los eventos y el contenido.' },
        { id: 'TRAFICO_LEGITIMO_DEMOSTRADO', text: 'No hay extracción de información sin autorización; el tráfico legítimo está demostrado.' },
      ],
      acceptedAnswerId: 'SIN_VINCULO_NI_CONTENIDO',
    }],
    conclusions: [
      { id: 'A02-TRANSFERENCIA', text: 'Se reportan lectura de 31,840 registros y transferencia de ~1.6 GB; contenido y vínculo no identificados.' },
      { id: 'A02-NO_CONCLUYENTE', text: 'La extracción de información sin autorización no puede confirmarse ni descartarse con estas fuentes.' },
      { id: 'A02-EXFILTRACION_CONFIRMADA', text: 'Los 1.6 GB confirman la extracción de información sin autorización de los registros de clientes.' },
      { id: 'A02-TRAFICO_LEGITIMO_CONFIRMADO', text: 'La transferencia fue tráfico legítimo y no requiere más revisión.' },
    ],
    acceptedConclusionIds: ['A02-TRANSFERENCIA', 'A02-NO_CONCLUYENTE'],
    limitations: [
      { id: 'L02-CONTENIDO', text: 'El contenido transferido está sin identificar.' },
      { id: 'L02-VINCULO', text: 'No se demuestra que lo leído sea lo transferido.' },
      { id: 'L02-ATRIBUCION', text: 'La sesión conocida no atribuye todas las operaciones a la misma persona o cuenta.' },
    ],
    requiredLimitationIds: ['L02-CONTENIDO', 'L02-VINCULO', 'L02-ATRIBUCION'],
    requests: [
      { id: 'S02-FLUJO', text: 'Solicitar registros de flujo, destino y proceso de origen correlacionables.' },
      { id: 'S02-CONTENIDO', text: 'Solicitar evidencia preservada que permita identificar el contenido y su relación con SQL.' },
    ],
    feedback: 'El volumen y la cercanía temporal no identifican el contenido. Revisa la conclusión o registra las limitaciones y qué soporte solicitarías.',
    hints: ['En B, abre lectura y flujo. Habla con el enlace para obtener la declaración de Seguridad.', 'Vincula las tres fuentes y haz C02-CONTENIDO con esas referencias. Una conclusión prudente también necesita tres límites y una solicitud.'],
  },
  'AU-03': {
    id: 'AU-03',
    title: 'Órdenes e instalación de software',
    question: '¿Las órdenes estaban intactas y qué relación hay con el cambio?',
    sourceGroups: [
      { id: 'cambios', label: 'Cambios de órdenes con hora reportada', alternatives: ['EVT-06'] },
      { id: 'despliegue', label: 'Despliegue con hora reportada', alternatives: ['EVT-07'] },
      { id: 'ticket', label: 'Ticket de cambios', alternatives: ['E-06'] },
      { id: 'desarrollo', label: 'Declaración de Desarrollo', alternatives: ['DECL-03'] },
      { id: 'bd', label: 'Declaración del administrador de BD', alternatives: ['DECL-04'] },
    ],
    checks: [
      {
        id: 'C03-ORDEN',
        question: '¿Qué orden muestran las horas reportadas de cambios y despliegue?',
        sourceGroupIds: ['cambios', 'despliegue'],
        options: [
          { id: 'DESPLIEGUE_ANTES', text: 'El despliegue ocurrió antes de los cambios.' },
          { id: 'ORDENES_ANTES', text: 'Los cambios ocurrieron antes del despliegue.' },
          { id: 'MISMA_HORA', text: 'Ambos registros tienen la misma hora.' },
        ],
        acceptedAnswerId: 'ORDENES_ANTES',
      },
      {
        id: 'C03-SOPORTES',
        question: '¿Las declaraciones bastan para dar por verificadas la integridad y la aprobación formal?',
        sourceGroupIds: ['cambios', 'ticket', 'desarrollo', 'bd'],
        options: [
          { id: 'AMBAS_VERIFICADAS', text: 'Sí; ambas quedan verificadas por las declaraciones.' },
          { id: 'FALTAN_CONCILIACION_Y_APROBACION', text: 'No; faltan conciliación concluida y aprobación formal.' },
          { id: 'CAMBIOS_PRUEBAN_FRAUDE', text: 'Los cambios prueban fraude, independientemente de esos soportes.' },
        ],
        acceptedAnswerId: 'FALTAN_CONCILIACION_Y_APROBACION',
      },
    ],
    conclusions: [
      { id: 'A03-PENDIENTES', text: 'Los cambios reportados preceden al despliegue; integridad, aprobación formal, autoría y relación causal siguen sin demostrarse.' },
      { id: 'A03-DESPLIEGUE_CAUSA_PROBADA', text: 'La secuencia demuestra que el despliegue causó el incidente.' },
      { id: 'A03-DATOS_INTACTOS', text: 'La declaración de BD demuestra que los datos están intactos.' },
      { id: 'A03-FRAUDE_CONFIRMADO', text: 'Las 216 modificaciones son fraudulentas y su autoría está probada.' },
    ],
    acceptedConclusionIds: ['A03-PENDIENTES'],
    limitations: [
      { id: 'L03-CAUSA', text: 'El orden de las horas no demuestra que el despliegue causara el incidente ni que fuera ajeno a él.' },
      { id: 'L03-INTEGRIDAD', text: 'La conciliación no ha concluido.' },
      { id: 'L03-ATRIBUCION', text: 'Los cambios no tienen atribución probada.' },
      { id: 'L03-APROBACION', text: 'La falta de aprobación documentada no prueba que jamás se autorizó.' },
    ],
    requiredLimitationIds: ['L03-CAUSA', 'L03-INTEGRIDAD', 'L03-ATRIBUCION', 'L03-APROBACION'],
    requests: [
      { id: 'S03-CONCILIACION', text: 'Solicitar historial y conciliación reproducible de órdenes y facturación.' },
      { id: 'S03-CAMBIO', text: 'Solicitar aprobación formal, pruebas y trazabilidad técnica del despliegue.' },
    ],
    feedback: 'Los cambios aparecen 20 minutos antes. Ese orden no prueba fraude ni explica por sí solo el incidente; las declaraciones no sustituyen los soportes pendientes.',
    hints: ['En C necesitas EVT-06, EVT-07 y E-06. El enlace facilita DECL-03 y DECL-04.', 'Resuelve primero la línea temporal; después contrasta ticket y declaraciones. El orden no sustituye conciliación, aprobación ni atribución.'],
  },
  'AU-04': {
    id: 'AU-04',
    title: 'Alerta y atención',
    question: '¿Qué atención de alertas podemos demostrar?',
    sourceGroups: [
      { id: 'acceso', label: 'Acceso reportado', alternatives: ['EVT-02'] },
      { id: 'alerta', label: 'Alerta crítica', alternatives: ['EVT-08'] },
      { id: 'resumen', label: 'Resumen de atención de alertas', alternatives: ['E-07'] },
    ],
    checks: [{
      id: 'C04-INTERVALO',
      question: 'El sistema calcula 61 minutos entre 02:17 y 03:18. ¿Qué significa ese intervalo?',
      sourceGroupIds: ['acceso', 'alerta', 'resumen'],
      options: [
        { id: 'TIEMPO_DESDE_INICIO_REAL_ATAQUE', text: 'Es el tiempo transcurrido desde el inicio real del ataque.' },
        { id: 'INTERVALO_ENTRE_REGISTROS', text: 'Es el intervalo entre dos registros preliminares.' },
        { id: '61_MINUTOS_SIN_RESPUESTA', text: 'Demuestra que nadie respondió durante 61 minutos.' },
      ],
      acceptedAnswerId: 'INTERVALO_ENTRE_REGISTROS',
    }],
    conclusions: [
      { id: 'A04-INTERVALO', text: 'Entre el acceso reportado y la alerta hay 61 minutos; no se conoce la trazabilidad completa de atención.' },
      { id: 'A04-NADIE_ACTUO', text: 'La ausencia de cierre documentado demuestra que nadie actuó.' },
      { id: 'A04-ATAQUE_COMENZO_0217', text: 'El ataque comenzó exactamente a las 02:17.' },
      { id: 'A04-OBJETIVO_INCUMPLIDO', text: 'Los 61 minutos incumplen un objetivo de atención aplicable.' },
    ],
    acceptedConclusionIds: ['A04-INTERVALO'],
    limitations: [
      { id: 'L04-INICIO', text: 'No se conoce el inicio real del ataque.' },
      { id: 'L04-ATENCION', text: 'Sin cierre documentado no equivale a ausencia de acción.' },
      { id: 'L04-OBJETIVO', text: 'No hay objetivo aplicable de detección o atención aportado.' },
    ],
    requiredLimitationIds: ['L04-INICIO', 'L04-ATENCION', 'L04-OBJETIVO'],
    requests: [
      { id: 'S04-ATENCION', text: 'Solicitar asignación, primera acción, escalamiento y cierre.' },
      { id: 'S04-OBJETIVO', text: 'Solicitar procedimiento y objetivos de atención aplicables.' },
    ],
    feedback: '61 minutos separan dos registros. Falta trazabilidad para medir la atención o declarar incumplimiento.',
    hints: ['En D abre EVT-02, EVT-08 y E-07.', 'Vincula los tres y responde sobre el intervalo calculado. Después registra qué no demuestra y qué trazabilidad pedirías.'],
  },
  'AU-05': {
    id: 'AU-05',
    title: 'Respaldo y recuperación',
    question: '¿El respaldo demostraba que se podía recuperar?',
    sourceGroups: [
      { id: 'respaldo', label: 'Resumen de respaldos', alternatives: ['E-08'] },
      { id: 'continuidad', label: 'Declaración de Continuidad', alternatives: ['DECL-07'] },
      { id: 'caida', label: 'Caída del CRM', alternatives: ['EVT-09'] },
      { id: 'consulta', label: 'Retorno en solo consulta', alternatives: ['EVT-11'] },
      { id: 'escritura', label: 'Retorno de escritura', alternatives: ['EVT-12'] },
    ],
    checks: [{
      id: 'C05-RECUPERACION',
      question: 'Los intervalos son 315 minutos hasta solo consulta y 355 hasta escritura. ¿Esto demuestra una restauración validada dentro de los objetivos del negocio?',
      sourceGroupIds: ['respaldo', 'continuidad', 'caida', 'consulta', 'escritura'],
      options: [
        { id: 'SI_PORQUE_HAY_PROGRAMACION', text: 'Sí; la programación de respaldos lo demuestra.' },
        { id: 'SI_PORQUE_VOLVIO_ESCRITURA', text: 'Sí; el retorno de escritura lo demuestra.' },
        { id: 'FALTAN_PRUEBA_Y_OBJETIVOS', text: 'No; faltan prueba de restauración y objetivos aplicables.' },
      ],
      acceptedAnswerId: 'FALTAN_PRUEBA_Y_OBJETIVOS',
    }],
    conclusions: [
      { id: 'A05-NO_VERIFICADA', text: 'Hay respaldos programados y recuperación por etapas reportada; no se demuestra restauración validada ni cumplimiento de objetivos de recuperación del negocio.' },
      { id: 'A05-RESPALDO_EXITOSO_PROBADO', text: 'La programación demuestra que el respaldo usado se ejecutó correctamente.' },
      { id: 'A05-RTO_RPO_CUMPLIDOS', text: 'Los tiempos reportados demuestran el cumplimiento del tiempo objetivo de recuperación y de la pérdida de datos tolerable.' },
      { id: 'A05-NO_EXISTEN_RESPALDOS', text: 'La falta de una prueba reciente demuestra que no existen respaldos.' },
    ],
    acceptedConclusionIds: ['A05-NO_VERIFICADA'],
    limitations: [
      { id: 'L05-EJECUCION', text: 'La programación no acredita una ejecución exitosa.' },
      { id: 'L05-RESTAURACION', text: 'Faltan respaldo usado, punto recuperable e integridad verificada.' },
      { id: 'L05-OBJETIVOS', text: 'Faltan objetivos aprobados de tiempo de recuperación (RTO) y de pérdida temporal de datos tolerable (RPO).' },
    ],
    requiredLimitationIds: ['L05-EJECUCION', 'L05-RESTAURACION', 'L05-OBJETIVOS'],
    requests: [
      { id: 'S05-PRUEBA', text: 'Solicitar informe de restauración, respaldo utilizado, validación y conciliación.' },
      { id: 'S05-BIA', text: 'Solicitar análisis de impacto al negocio (BIA) y objetivos aprobados de tiempo de recuperación (RTO) y pérdida temporal de datos tolerable (RPO).' },
    ],
    feedback: 'Volver a operar y tener respaldos programados no certifica la restauración. Registra qué prueba u objetivo necesitas.',
    hints: ['En E reúne E-08 y los tres estados EVT-09, EVT-11 y EVT-12. Continuidad se consulta con el enlace.', 'Contrastar los cinco grupos permite calcular tiempos, pero todavía debes documentar la prueba y los objetivos ausentes.'],
  },
  'AU-06': {
    id: 'AU-06',
    title: 'Protección de registros y horarios',
    question: '¿Podemos confiar en las copias y en el orden de los registros?',
    sourceGroups: [
      { id: 'custodia', label: 'Vista calculada de custodia', alternatives: ['META-CUSTODIA'] },
      { id: 'tiempo', label: 'Vista calculada de tiempo', alternatives: ['META-TIEMPO'] },
    ],
    checks: [
      {
        id: 'C06-CUSTODIA',
        question: '¿Puede tratarse este resumen como una extracción con custodia acreditada?',
        sourceGroupIds: ['custodia'],
        options: [
          { id: 'SI_POR_TENER_CODIGO_E', text: 'Sí; el código E acredita la extracción y custodia.' },
          { id: 'CUSTODIA_NO_ACREDITADA', text: 'No; faltan originales, método de obtención, responsable de custodia y huellas digitales.' },
          { id: 'NULOS_PRUEBAN_MANIPULACION', text: 'Los campos no aportados demuestran manipulación.' },
        ],
        acceptedAnswerId: 'CUSTODIA_NO_ACREDITADA',
      },
      {
        id: 'C06-RELOJ',
        question: '¿Qué muestra la comparación entre hora reportada, original, desfase y verificación?',
        sourceGroupIds: ['tiempo'],
        options: [
          { id: 'DESFASE_CERO_VERIFICADO', text: 'Todos los relojes tienen desfase cero verificado.' },
          { id: 'SINCRONIZACION_NO_VERIFICADA', text: 'La sincronización de las fuentes no está verificada.' },
          { id: 'ORDEN_TEMPORAL_DEFINITIVO', text: 'Las horas reportadas establecen un orden temporal definitivo.' },
        ],
        acceptedAnswerId: 'SINCRONIZACION_NO_VERIFICADA',
      },
    ],
    conclusions: [
      { id: 'A06-LIMITACION', text: 'La procedencia académica está identificada; custodia de extracciones y sincronización de fuentes no están acreditadas.' },
      { id: 'A06-REGISTROS_AUTENTICADOS', text: 'Los resúmenes son extracciones autenticadas con custodia completa.' },
      { id: 'A06-MANIPULACION_DEMOSTRADA', text: 'Los metadatos ausentes demuestran que los registros fueron manipulados.' },
      { id: 'A06-RELOJES_VERIFICADOS', text: 'La hora reportada demuestra que todos los relojes estaban sincronizados.' },
    ],
    acceptedConclusionIds: ['A06-LIMITACION'],
    limitations: [
      { id: 'L06-RESUMEN', text: 'Un resumen no equivale a una extracción.' },
      { id: 'L06-HASH', text: 'Comparar la huella digital SHA-256 de un archivo con una referencia previamente registrada permite detectar cambios; no demuestra verdad ni completitud. Debe conservarse el origen de la referencia.' },
      { id: 'L06-TIEMPO', text: 'Un desfase desconocido no es cero verificado.' },
    ],
    requiredLimitationIds: ['L06-RESUMEN', 'L06-HASH', 'L06-TIEMPO'],
    requests: [
      { id: 'S06-EXTRACCIONES', text: 'Solicitar originales preservados, método de obtención, responsable de custodia y huellas digitales.' },
      { id: 'S06-TIEMPO', text: 'Solicitar horas originales y evidencia de zona y sincronización por fuente.' },
    ],
    feedback: 'La ausencia de metadatos limita la revisión; no prueba manipulación. Puedes documentar esa limitación sin fabricar archivos ni un desfase.',
    hints: ['En F abre META-CUSTODIA. META-TIEMPO está en F y también en D.', 'Vincula ambas vistas y responde una comprobación con cada una. Los campos «No aportado» documentan límites, no manipulación.'],
  },
};

// Solo cambia la lectura; claves, respuestas admitidas y requisitos se conservan.
for (const rule of Object.values(reviewRules)) {
  rule.title = classroomText(rule.title);
  rule.question = classroomText(rule.question);
  rule.feedback = classroomText(rule.feedback);
  for (const group of rule.sourceGroups) group.label = classroomText(group.label);
  for (const check of rule.checks) {
    check.question = classroomText(check.question);
    for (const option of check.options) option.text = classroomText(option.text);
  }
  for (const item of [...rule.conclusions, ...rule.limitations, ...rule.requests]) item.text = classroomText(item.text);
}

export const reviewIds = Object.keys(reviewRules) as ReviewId[];
