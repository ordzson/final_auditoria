import { canon, CONTENT_VERSION, eventById, evidenceById, statementById } from './canon';

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
};

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
    title: `${id} · ${event.systemLabel}`,
    kindLabel: 'Registro preliminar del expediente',
    summary: event.description,
    provenanceText: `Curso, p. ${event.provenance.page} · ${event.provenance.kind} · Hora reportada, no corrección forense.`,
    version: CONTENT_VERSION,
    columns: ['Campo', 'Contenido'],
    rows: [
      { values: ['Hora reportada', formatReportedAt(event.reportedAt)] },
      { values: ['Hora original', event.originalTime] },
      { values: ['Sistema', event.systemLabel] },
      { values: ['Cuenta', event.account] },
      { values: ['Desfase (segundos)', event.clockOffsetSeconds] },
      { values: ['Desfase verificado', event.clockOffsetVerified] },
      { values: ['Evidencias relacionadas', event.evidenceIds.join(', ') || null] },
    ],
    notes: [canon.time.basis, 'La relación temporal no demuestra causalidad ni atribución.'],
    queryIds: event.plannedQueryIds,
  };
}

function evidenceDocument(id: string): SourceDocument | null {
  const evidence = evidenceById(id);
  if (!evidence) return null;
  return {
    id,
    title: `${id} · ${evidence.type}`,
    kindLabel: 'Resumen del expediente · no autenticado',
    summary: evidence.summary,
    provenanceText: `Curso, p. ${evidence.provenance.page} · ${evidence.provenance.kind}.`,
    version: CONTENT_VERSION,
    columns: ['Campo', 'Contenido'],
    rows: [
      { values: ['Tipo', evidence.type] },
      { values: ['Señal observada', evidence.summary] },
      { values: ['Archivo', evidence.artifactPath] },
      { values: ['SHA-256', evidence.sha256] },
      { values: ['Procedencia', evidence.provenance.sourceId] },
      { values: ['Página', evidence.provenance.page] },
    ],
    notes: [canon.scope, 'Los identificadores E-01–E-10 pertenecen al resumen inicial del curso.'],
    queryIds: [],
  };
}

function statementDocument(id: string): SourceDocument | null {
  const statement = statementById(id);
  if (!statement) return null;
  return {
    id,
    title: `${id} · ${statement.speakerRole}`,
    kindLabel: 'Declaración atribuida · no concluyente por sí sola',
    summary: statement.summary,
    provenanceText: `Curso, p. ${statement.provenance.page} · ${statement.provenance.kind}.`,
    version: CONTENT_VERSION,
    columns: ['Campo', 'Contenido'],
    rows: [
      { values: ['Rol que declara', statement.speakerRole] },
      { values: ['Declaración resumida', statement.summary] },
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
    title: 'META-CUSTODIA · Procedencia y archivos',
    kindLabel: 'Vista calculada del canon · no es una nueva evidencia',
    summary: 'El inventario reúne los resúmenes recibidos y conserva la procedencia, el archivo y el SHA-256 de cada material, incluidos los campos no aportados.',
    provenanceText: `Calculada localmente desde ${CONTENT_VERSION}: scope, provenance, artifactPath y sha256.`,
    version: CONTENT_VERSION,
    columns: ['ID', 'Tipo', 'Procedencia', 'Archivo', 'SHA-256'],
    rows: canon.evidenceSummaries.map((evidence) => ({
      values: [
        evidence.id,
        evidence.type,
        `${evidence.provenance.sourceId} · p. ${evidence.provenance.page} · ${evidence.provenance.kind}`,
        evidence.artifactPath,
        evidence.sha256,
      ],
    })),
    notes: [canon.scope, '«No aportado» conserva un campo ausente; no demuestra manipulación ni convierte el resumen en extracción.'],
    queryIds: [],
  };
}

function timeDocument(): SourceDocument {
  return {
    id: 'META-TIEMPO',
    title: 'META-TIEMPO · Hora reportada y verificación',
    kindLabel: 'Vista calculada del canon · no es una nueva evidencia',
    summary: canon.time.basis,
    provenanceText: `Calculada localmente desde ${CONTENT_VERSION}: reportedAt, originalTime, clockOffsetSeconds y clockOffsetVerified.`,
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
