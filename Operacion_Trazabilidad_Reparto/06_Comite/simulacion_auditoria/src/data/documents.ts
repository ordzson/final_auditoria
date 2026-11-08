import { canon, CONTENT_VERSION, eventById, evidenceById, statementById } from './canon';
import { classroomText, sourceName, sourceSummary } from './language';
import { reviewGuidance } from './guidance';

export type CellValue = string | number | boolean | null;
export type DocumentRow = { values: CellValue[] };
export type SourceDocument = {
  id: string;
  title: string;
  kindLabel: string;
  summary: string;
  provenanceText: string;
  version: string;
  columns: string[];
  rows: DocumentRow[];
  notes: string[];
  queryIds: string[];
  readingNote?: string;
};

function readingNote(id: string): string | undefined {
  if (['E-01', 'E-02', 'EVT-02', 'EVT-03'].includes(id)) return reviewGuidance['AU-01'].limit;
  if (['E-03', 'E-04', 'EVT-04', 'EVT-05', 'DECL-05'].includes(id)) return reviewGuidance['AU-02'].limit;
  if (['E-05', 'E-06', 'EVT-06', 'EVT-07', 'EVT-13', 'DECL-03', 'DECL-04'].includes(id)) return reviewGuidance['AU-03'].limit;
  if (['E-07', 'EVT-08'].includes(id)) return `Faltan asignación, primera acción y cierre documentados. ${reviewGuidance['AU-04'].limit}`;
  if (['E-08', 'EVT-09', 'EVT-10', 'EVT-11', 'EVT-12', 'DECL-07'].includes(id)) return reviewGuidance['AU-05'].limit;
  if (id === 'E-09') return 'El caso resume un acuerdo de nivel de servicio: disponibilidad del 99.9 %, con exclusiones por interpretar. No basta para evaluar el contrato completo ni las necesidades de recuperación del negocio.';
  if (id === 'E-10') return 'El puntaje de riesgo 0.08 no tiene escala, umbral ni calibración aportados: no se sabe cómo se relaciona con el riesgo observado. No demuestra seguridad ni sustituye la revisión humana.';
  return undefined;
}

export function formatReportedAt(value: string): string {
  const [date, timeWithOffset] = value.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${day} ${months[month - 1]} ${year} · ${timeWithOffset.slice(0, 5)} UTC−6`;
}

function eventDocument(id: string): SourceDocument | null {
  const event = eventById(id);
  if (!event) return null;
  return {
    id,
    title: sourceName(id),
    kindLabel: 'Dato reportado por el caso · resumen, no registro original',
    summary: sourceSummary(id),
    readingNote: readingNote(id),
    provenanceText: `Curso, p. ${event.provenance.page} · ${event.provenance.kind} · Hora reportada, no corrección forense.`,
    version: CONTENT_VERSION,
    columns: ['Campo', 'Contenido'],
    rows: [
      { values: ['Hora reportada', formatReportedAt(event.reportedAt)] },
      { values: ['Hora original', event.originalTime] },
      { values: ['Sistema', classroomText(event.systemLabel)] },
      { values: ['Cuenta', event.account ? classroomText(event.account) : null] },
      { values: ['Desfase (segundos)', event.clockOffsetSeconds] },
      { values: ['Desfase verificado', event.clockOffsetVerified] },
      { values: ['Evidencias relacionadas', event.evidenceIds.join(', ') || null] },
    ],
    notes: [canon.time.basis, 'La relación temporal no demuestra causalidad ni atribución.', `Texto del curso: ${event.description}`],
    queryIds: event.plannedQueryIds,
  };
}

function evidenceDocument(id: string): SourceDocument | null {
  const evidence = evidenceById(id);
  if (!evidence) return null;
  return {
    id,
    title: sourceName(id),
    kindLabel: 'Resumen del expediente · no autenticado',
    summary: sourceSummary(id),
    readingNote: readingNote(id),
    provenanceText: `Curso, p. ${evidence.provenance.page} · ${evidence.provenance.kind}.`,
    version: CONTENT_VERSION,
    columns: ['Campo', 'Contenido'],
    rows: [
      { values: ['Tipo', sourceName(id)] },
      { values: ['Señal reportada', sourceSummary(id)] },
      { values: ['Archivo', evidence.artifactPath] },
      { values: ['Huella digital SHA-256', evidence.sha256] },
      { values: ['Procedencia', evidence.provenance.sourceId] },
      { values: ['Página', evidence.provenance.page] },
    ],
    notes: ['Resumen del curso; no es una extracción autenticada de la empresa.', 'Los identificadores E-01–E-10 permiten localizar el material en la página 5 del Proyecto del curso.', `Texto del curso: ${evidence.summary}`],
    queryIds: [],
  };
}

function statementDocument(id: string): SourceDocument | null {
  const statement = statementById(id);
  if (!statement) return null;
  return {
    id,
    title: sourceName(id),
    kindLabel: 'Declaración atribuida · no concluyente por sí sola',
    summary: sourceSummary(id),
    readingNote: readingNote(id),
    provenanceText: `Curso, p. ${statement.provenance.page} · ${statement.provenance.kind}.`,
    version: CONTENT_VERSION,
    columns: ['Campo', 'Contenido'],
    rows: [
      { values: ['Rol que declara', classroomText(statement.speakerRole)] },
      { values: ['Declaración resumida', sourceSummary(id)] },
      { values: ['Concluyente por sí sola', statement.conclusiveByItself] },
      { values: ['Fuente', statement.provenance.sourceId] },
      { values: ['Página', statement.provenance.page] },
    ],
    notes: ['Conservar la atribución y contrastar con registros o soportes; la declaración no se convierte en hecho por repetirla.'],
    queryIds: [],
  };
}

function custodyDocument(): SourceDocument {
  return {
    id: 'META-CUSTODIA',
    title: 'Procedencia y archivos disponibles',
    kindLabel: 'Vista calculada del expediente de referencia · no es una nueva evidencia',
    summary: 'El inventario reúne los resúmenes del curso. Los campos de archivo original y huella digital SHA-256 (valor para detectar cambios) no fueron aportados.',
    readingNote: reviewGuidance['AU-06'].limit,
    provenanceText: `Calculada localmente desde la versión ${CONTENT_VERSION}: alcance, procedencia, ruta y SHA-256 del resumen.`,
    version: CONTENT_VERSION,
    columns: ['Referencia', 'Material', 'Procedencia', 'Archivo original', 'Huella SHA-256'],
    rows: canon.evidenceSummaries.map((evidence) => ({
      values: [
        evidence.id,
        sourceName(evidence.id),
        `${evidence.provenance.sourceId} · p. ${evidence.provenance.page} · ${evidence.provenance.kind}`,
        evidence.artifactPath,
        evidence.sha256,
      ],
    })),
    notes: ['«No aportado» conserva un campo ausente; no demuestra manipulación ni convierte el resumen en extracción.'],
    queryIds: [],
  };
}

function timeDocument(): SourceDocument {
  return {
    id: 'META-TIEMPO',
    title: 'Horas reportadas y verificación de relojes',
    kindLabel: 'Vista calculada del expediente de referencia · no es una nueva evidencia',
    summary: canon.time.basis,
    readingNote: 'Faltan horas originales y relojes verificados. Los intervalos entre sucesos seleccionados no demuestran pérdida o borrado de registros. Un desfase es la diferencia entre el reloj de un sistema y una referencia comprobada; no se ha calculado aquí.',
    provenanceText: `Calculada localmente desde la versión ${CONTENT_VERSION}: hora reportada, hora original, desfase y estado de verificación.`,
    version: CONTENT_VERSION,
    columns: ['ID', 'Hora reportada', 'Hora original', 'Desfase (s)', 'Verificado'],
    rows: canon.events.map((event) => ({
      values: [event.id, formatReportedAt(event.reportedAt), event.originalTime, event.clockOffsetSeconds, event.clockOffsetVerified],
    })),
    notes: ['La hora reportada se muestra en UTC−6 sin depender de la zona del equipo. Un desfase ausente no equivale a cero.'],
    queryIds: [],
  };
}

export function getSourceDocument(id: string): SourceDocument | null {
  if (id === 'META-CUSTODIA') return custodyDocument();
  if (id === 'META-TIEMPO') return timeDocument();
  return eventDocument(id) ?? evidenceDocument(id) ?? statementDocument(id);
}

export function sourceTitle(id: string): string {
  return getSourceDocument(id)?.title ?? id;
}

export function displayCell(value: CellValue): string {
  if (value === null || value === '') return 'No aportado';
  if (value === true) return 'Sí';
  if (value === false) return 'No';
  return String(value);
}
