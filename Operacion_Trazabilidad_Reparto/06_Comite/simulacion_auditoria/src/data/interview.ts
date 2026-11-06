import type { ReviewId } from '../audit/types';

export type InterviewTopic = { id: ReviewId; question: string; answer: string };
export type InterviewQuestion = {
  id: string;
  question: string;
  answer: string;
  sourceId?: string;
  reviewId: ReviewId;
  parentId?: string;
  requires?: string[];
};

/** Conserva la conversación al consultar una fuente o volver desde un PC. */
export type InterviewSession = {
  topicId: ReviewId | null;
  questionId: string | null;
  discussed: Set<string>;
  started: boolean;
  voiceMuted?: boolean;
};

export function createInterviewSession(): InterviewSession {
  return { topicId: null, questionId: null, discussed: new Set(), started: false };
}

export const interviewTopics: InterviewTopic[] = [
  { id: 'AU-01', question: 'Hablemos de la cuenta externa.', answer: 'Claro. ¿Te interesa quién la usó o qué acceso tenía permitido?' },
  { id: 'AU-02', question: 'Quiero entender lo del tráfico de red.', answer: 'Sí, lo que Seguridad llamó una fuga. ¿Qué quieres revisar?' },
  { id: 'AU-03', question: 'Sobre las órdenes y el despliegue…', answer: 'Hay dos cosas que conviene mirar por separado: las órdenes y la autorización del cambio. ¿Por dónde empezamos?' },
  { id: 'AU-04', question: '¿Qué pasó con la alerta?', answer: 'Podemos revisar lo que quedó registrado de esa alerta. Dime.' },
  { id: 'AU-05', question: 'Hablemos de la recuperación.', answer: 'El CRM volvió a estar disponible, sí. ¿Quieres ver qué quedó documentado de la restauración?' },
  { id: 'AU-06', question: 'Necesito revisar las horas y los originales.', answer: 'Bien. Aquí tenemos resúmenes del caso; hay cosas que tendremos que pedir. ¿Qué necesitas primero?' },
];

export const baseQuestions: InterviewQuestion[] = [
  { id: 'P-IDENTIDAD', question: '¿Sabemos quién usó ext_ops_04?', answer: 'No puedo darte un nombre. Tenemos la cuenta y una sesión sin MFA, pero eso no nos dice quién estaba detrás. Mira el registro de la sesión.', sourceId: 'E-02', reviewId: 'AU-01' },
  { id: 'P-POLITICA', question: '¿Qué acceso tenía permitido?', answer: 'Para responderte necesitaría la política de acceso y su alcance aprobado. No están entre los documentos que tenemos. El registro de la cuenta sí lo puedes consultar.', sourceId: 'E-01', reviewId: 'AU-01' },
  { id: 'P-FUJO', question: 'Seguridad habló de una fuga. ¿Qué salió?', answer: 'Eso todavía no lo sabemos. Seguridad lo llamó una fuga en su declaración inicial, pero también dijo que no había identificado los datos transferidos. Te puedo mostrar esa declaración.', sourceId: 'DECL-05', reviewId: 'AU-02' },
  { id: 'P-INTEGRIDAD', question: '¿Las órdenes quedaron intactas?', answer: 'El administrador de la base de datos dice que sí. El problema es que la conciliación aún no ha terminado. Por ahora tenemos su declaración; falta el soporte para comprobarla.', sourceId: 'DECL-04', reviewId: 'AU-03' },
  { id: 'P-APROBACION', question: '¿Quién autorizó el despliegue?', answer: 'Desarrollo dice que recibió una autorización verbal. En el ticket no aparece una aprobación final documentada. Te enseño lo que declararon, y luego podemos mirar el ticket.', sourceId: 'DECL-03', reviewId: 'AU-03' },
  { id: 'P-ALERTA', question: '¿Quién atendió la alerta y cuándo?', answer: 'No te lo puedo confirmar con este resumen. La alerta figura como crítica y no tiene un cierre documentado, pero tampoco aparecen la asignación ni la primera acción. Eso no significa que nadie la atendiera.', sourceId: 'E-07', reviewId: 'AU-04' },
  { id: 'P-RESTAURACION', question: '¿Hay una prueba de restauración documentada?', answer: 'Continuidad dice que la última restauración documentada fue varios meses antes. No tenemos una ejecución exacta para este incidente. Te paso su declaración.', sourceId: 'DECL-07', reviewId: 'AU-05' },
  { id: 'P-RELOJ', question: '¿Podemos fiarnos de todas las horas?', answer: 'Hay que tomarlas con cuidado. Nos faltan las horas originales y los desfases verificados. La vista de tiempos deja esos campos sin aportar; todavía no podemos dar los relojes por sincronizados.', sourceId: 'META-TIEMPO', reviewId: 'AU-06' },
  { id: 'P-CUSTODIA', question: '¿Y los archivos originales y sus hashes?', answer: 'No los tenemos aquí. Son resúmenes académicos del caso, y los campos de archivo y hash están sin aportar. Podemos dejar la solicitud en la libreta, pero no sustituirlos por estos resúmenes.', sourceId: 'META-CUSTODIA', reviewId: 'AU-06' },
];

export const followupQuestions: InterviewQuestion[] = [
  { id: 'R-IDENTIDAD', parentId: 'P-IDENTIDAD', question: 'Entonces, ¿una cuenta no identifica a una persona?', answer: 'Exacto. Podemos hablar de la actividad de esa cuenta. Para atribuírsela a alguien hace falta más evidencia que el nombre de usuario.', reviewId: 'AU-01' },
  { id: 'R-POLITICA', parentId: 'P-POLITICA', question: '¿Podemos decir que incumplió la política?', answer: 'Sin conocer la política y a quién aplicaba, no. Sí podemos señalar lo que muestra la sesión y pedir la política que falta.', reviewId: 'AU-01' },
  { id: 'R-VOLUMEN', parentId: 'P-FUJO', question: '¿Y el volumen de tráfico no basta?', answer: 'Nos da una pista para investigar. No nos dice qué contenía la transferencia ni permite atribuirla por sí sola. Para eso hay que contrastar el flujo y la lectura SQL.', sourceId: 'E-04', reviewId: 'AU-02' },
  { id: 'R-FLUJO', parentId: 'P-FUJO', question: 'Vi el flujo y la declaración. ¿Eso prueba qué salió?', answer: 'No todavía. Nos falta identificar el contenido y enlazar el proceso, la lectura SQL y ese flujo. Que los registros estén ahí no demuestra por sí solo esa conexión.', sourceId: 'E-04', reviewId: 'AU-02', requires: ['DECL-05', 'E-04'] },
  { id: 'R-CONCILIACION', parentId: 'P-INTEGRIDAD', question: 'Ya vi las modificaciones. ¿Me pasas la conciliación?', answer: 'Ojalá pudiera, pero no está en el expediente. Deja solicitado el historial y una conciliación reproducible de las órdenes y la facturación. Esa es la comprobación que nos falta.', reviewId: 'AU-03', requires: ['DECL-04', 'EVT-06'] },
  { id: 'R-TICKET', parentId: 'P-APROBACION', question: 'Enséñame el ticket del cambio.', answer: 'Aquí lo tienes. Revisa qué aprobación quedó documentada y compárala con lo que declaró Desarrollo.', sourceId: 'E-06', reviewId: 'AU-03' },
  { id: 'R-VERBAL', parentId: 'P-APROBACION', question: 'Vi el ticket. ¿La autorización verbal lo resuelve?', answer: 'No deja documentada una aprobación formal. Pero tampoco sería correcto decir que nunca hubo autorización solo porque no aparece ahí. Tenemos que conservar ese límite.', sourceId: 'E-06', reviewId: 'AU-03', requires: ['DECL-03', 'E-06'] },
  { id: 'R-RESPUESTA', parentId: 'P-ALERTA', question: '¿Así que nadie respondió?', answer: 'Eso sería ir más allá de lo que sabemos. Falta el registro de quién la recibió, qué hizo y cuándo. Podemos pedirlo; no dar por hecho que nadie actuó.', reviewId: 'AU-04' },
  { id: 'R-RECUPERACION', parentId: 'P-RESTAURACION', question: 'Pero si el CRM volvió, ¿no estaba todo recuperado?', answer: 'Que el servicio vuelva no demuestra que todos los datos estén completos. Para sostener eso necesitamos las comprobaciones de recuperación. Tampoco tenemos objetivos RTO y RPO aprobados para evaluar su cumplimiento.', reviewId: 'AU-05' },
  { id: 'R-CRONOLOGIA', parentId: 'P-RELOJ', question: 'Entonces, ¿cómo ordenamos lo que pasó?', answer: 'Podemos trabajar con las horas reportadas, dejando claro ese límite. Para confirmar el orden entre sistemas necesitamos sus horas originales y comprobar los desfases.', reviewId: 'AU-06' },
  { id: 'R-ORIGINALES', parentId: 'P-CUSTODIA', question: '¿Qué tendría que pedir para comprobarlo?', answer: 'Los archivos originales, sus hashes y el registro de custodia. Mientras no se aporten, deja constancia de que aquí solo pudiste revisar resúmenes.', reviewId: 'AU-06' },
];

export function availableInterviewQuestions(session: InterviewSession, inspectedSourceIds: ReadonlySet<string>): InterviewQuestion[] {
  return [...baseQuestions, ...followupQuestions].filter((question) => question.reviewId === session.topicId
    && (!question.parentId || session.discussed.has(question.parentId))
    && (!question.requires || question.requires.every((id) => inspectedSourceIds.has(id))));
}
