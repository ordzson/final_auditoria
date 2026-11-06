import { canon, CONTENT_VERSION } from '../data/canon';
import { reviewRules, RULES_VERSION } from './rules';
import type { SourceGroup } from './rules';
import type { Assessment, Evaluation, ReviewId, SourceRef } from './types';

const sourceIds = new Set([
  ...canon.events.map((event) => event.id),
  ...canon.evidenceSummaries.map((evidence) => evidence.id),
  ...canon.initialStatements.map((statement) => statement.id),
  'META-CUSTODIA',
  'META-TIEMPO',
]);

export function currentSourceVersion(sourceId: string): string | null {
  return sourceIds.has(sourceId) ? CONTENT_VERSION : null;
}

export function sameSourceRef(a: SourceRef, b: SourceRef): boolean {
  return a.sourceId === b.sourceId && a.sourceVersion === b.sourceVersion && a.rowId === b.rowId;
}

function isCurrentAndInspected(ref: SourceRef, inspected: SourceRef[]): boolean {
  return ref.sourceVersion === currentSourceVersion(ref.sourceId)
    && inspected.some((item) => sameSourceRef(item, ref));
}

function refsForGroup(refs: SourceRef[], group: SourceGroup, inspected: SourceRef[]): SourceRef[] {
  return refs.filter((ref) => group.alternatives.includes(ref.sourceId) && isCurrentAndInspected(ref, inspected));
}

function hasLinkedGroup(assessment: Assessment, group: SourceGroup, inspected: SourceRef[]): boolean {
  return refsForGroup(assessment.sourceRefs, group, inspected).length > 0;
}

function checkSourcesAreValid(
  assessment: Assessment,
  checkGroupIds: string[],
  checkRefs: SourceRef[],
  inspected: SourceRef[],
): boolean {
  const groups = reviewRules[assessment.reviewId].sourceGroups.filter((group) => checkGroupIds.includes(group.id));
  return groups.every((group) => refsForGroup(checkRefs, group, inspected).some((checkRef) =>
    assessment.sourceRefs.some((linkedRef) => sameSourceRef(linkedRef, checkRef)),
  ));
}

export function evaluateReview(assessment: Assessment, inspected: SourceRef[]): Evaluation {
  const rule = reviewRules[assessment.reviewId];
  const missingReasons: string[] = [];
  let gatheredGroups = 0;

  if (assessment.rulesVersion !== RULES_VERSION) {
    missingReasons.push('La versión de reglas cambió: revisa nuevamente esta documentación.');
  }

  for (const group of rule.sourceGroups) {
    if (hasLinkedGroup(assessment, group, inspected)) {
      gatheredGroups += 1;
    } else {
      missingReasons.push(`Inspecciona y vincula: ${group.label}.`);
    }
  }

  if (assessment.sourceRefs.some((ref) => ref.sourceVersion !== currentSourceVersion(ref.sourceId))) {
    missingReasons.push('Hay fuentes desactualizadas o no admitidas; vuelve a vincular la versión vigente.');
  }

  for (const check of rule.checks) {
    const answer = assessment.checkAnswers.find((item) => item.checkId === check.id);
    if (!answer) {
      missingReasons.push(`Resuelve la comprobación ${check.id} con las fuentes vinculadas.`);
      continue;
    }
    if (!checkSourcesAreValid(assessment, check.sourceGroupIds, answer.sourceRefs, inspected)) {
      missingReasons.push(`Repite ${check.id}: cambiaron o se retiraron las fuentes con las que se comprobó.`);
    }
    if (answer.answerId !== check.acceptedAnswerId) {
      missingReasons.push(rule.feedback);
    }
  }

  if (!assessment.conclusionId) {
    missingReasons.push('Selecciona qué puedes afirmar con el expediente disponible.');
  } else if (!rule.acceptedConclusionIds.includes(assessment.conclusionId)) {
    missingReasons.push(rule.feedback);
  }

  for (const limitationId of rule.requiredLimitationIds) {
    if (!assessment.limitationIds.includes(limitationId)) {
      const limitation = rule.limitations.find((item) => item.id === limitationId);
      missingReasons.push(`Registra la limitación: ${limitation?.text ?? limitationId}`);
    }
  }

  const admittedRequests = rule.requests.map((request) => request.id);
  if (!assessment.requestIds.some((requestId) => admittedRequests.includes(requestId))) {
    missingReasons.push('Registra al menos una solicitud pertinente; no es necesario recibir el documento para cerrar la actividad.');
  }

  const isDocumented = missingReasons.length === 0;
  const attempted = assessment.conclusionId !== null || assessment.checkAnswers.length > 0;
  const status = isDocumented
    ? 'Documentado'
    : attempted
      ? 'Por contrastar'
      : gatheredGroups === rule.sourceGroups.length
        ? 'Fuentes reunidas'
        : 'Pendiente';

  return {
    status,
    isDocumented,
    missingReasons: [...new Set(missingReasons)],
    gatheredGroups,
    totalGroups: rule.sourceGroups.length,
  };
}

export function createAssessment(reviewId: ReviewId): Assessment {
  return {
    reviewId,
    rulesVersion: RULES_VERSION,
    sourceRefs: [],
    checkAnswers: [],
    conclusionId: null,
    limitationIds: [],
    requestIds: [],
    freeNote: '',
  };
}

export function documentedCount(assessments: Record<ReviewId, Assessment>, inspected: SourceRef[]): number {
  return Object.values(assessments).filter((assessment) => evaluateReview(assessment, inspected).isDocumented).length;
}
