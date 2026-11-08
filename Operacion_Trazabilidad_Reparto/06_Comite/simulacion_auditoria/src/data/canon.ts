import rawCanon from './canon.json' with { type: 'json' };

export type Provenance = {
  sourceId: string;
  page: number;
  kind: string;
};

export type CanonEvent = {
  id: string;
  reportedAt: string;
  systemLabel: string;
  description: string;
  account: string | null;
  originalTime: string | null;
  clockOffsetSeconds: number | null;
  clockOffsetVerified: boolean;
  evidenceIds: string[];
  plannedQueryIds: string[];
  provenance: Provenance;
  causedByEventId: string | null;
};

export type EvidenceSummary = {
  id: string;
  type: string;
  summary: string;
  provenance: Provenance;
  artifactPath: string | null;
  sha256: string | null;
};

export type Statement = {
  id: string;
  speakerRole: string;
  summary: string;
  provenance: Provenance;
  conclusiveByItself: boolean;
};

export type Canon = {
  schemaVersion: number;
  contentVersion: string;
  title: string;
  scope: string;
  time: { zone: string; displayOffset: string; basis: string; auditVisitAt: null };
  reportedFacts: {
    registeredCustomers: number;
    customerRecordsRead: number;
    outboundTransfer: {
      reportedValue: number;
      unit: string;
      approximate: boolean;
      exactBytes: null;
      content: null;
      destinationClassification: string;
    };
    ordersModified: number;
    ordersConfirmedFraudulent: null;
    ransomNote: { reported: boolean; originalText: null; appearedAt: null; provenance: Provenance };
    chatbotRiskScore: { value: number; scale: null; threshold: null; calibration: null };
  };
  events: CanonEvent[];
  evidenceSummaries: EvidenceSummary[];
  initialStatements: Statement[];
  queryReferenceStatus: string;
  derivedIntervals: {
    label: string;
    startEventId: string;
    endEventId: string;
    minutes: number;
    basis: string;
  }[];
  unresolved: string[];
  presentation: {
    scope: string;
    openingTargetSeconds: number;
    ransomNote: {
      id: string;
      title: string;
      body: string;
      visibleLabel: string;
      provenanceText: string;
      shotId: string;
      showDuringEventId: string;
      showAfterShotStartSeconds: number;
      visibleForSeconds: number;
      timingMeaning: string;
      usableAsAuditEvidence: false;
    };
  };
  designBoundary: string;
};

export const canon = rawCanon as Canon;
export const CONTENT_VERSION = canon.contentVersion;
export const eventById = (id: string) => canon.events.find((event) => event.id === id);
export const evidenceById = (id: string) => canon.evidenceSummaries.find((evidence) => evidence.id === id);
export const statementById = (id: string) => canon.initialStatements.find((statement) => statement.id === id);

export function minutesBetween(startEventId: string, endEventId: string): number {
  const start = eventById(startEventId);
  const end = eventById(endEventId);
  if (!start || !end) throw new Error('Evento de cálculo no disponible');
  return Math.round((Date.parse(end.reportedAt) - Date.parse(start.reportedAt)) / 60_000);
}
