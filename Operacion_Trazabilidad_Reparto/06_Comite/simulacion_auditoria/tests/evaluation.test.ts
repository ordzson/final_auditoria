import { describe, expect, it } from 'vitest';
import { canon, CONTENT_VERSION, minutesBetween } from '../src/data/canon';
import { createAssessment, evaluateReview } from '../src/audit/evaluate';
import { reviewRules, reviewIds } from '../src/audit/rules';
import type { ReviewId, SourceRef } from '../src/audit/types';

function ref(sourceId: string, sourceVersion = CONTENT_VERSION): SourceRef {
  return { sourceId, sourceVersion };
}

function completeAssessment(reviewId: ReviewId) {
  const rule = reviewRules[reviewId];
  const assessment = createAssessment(reviewId);
  assessment.sourceRefs = rule.sourceGroups.map((group) => ref(group.alternatives[0]));
  assessment.checkAnswers = rule.checks.map((check) => ({
    checkId: check.id,
    answerId: check.acceptedAnswerId,
    sourceRefs: rule.sourceGroups
      .filter((group) => check.sourceGroupIds.includes(group.id))
      .map((group) => ref(group.alternatives[0])),
  }));
  assessment.conclusionId = rule.acceptedConclusionIds[0];
  assessment.limitationIds = [...rule.requiredLimitationIds];
  assessment.requestIds = [rule.requests[0].id];
  return assessment;
}

describe('contrato común de evaluación', () => {
  it('documenta las seis fichas únicamente con todos sus requisitos', () => {
    for (const reviewId of reviewIds) {
      const assessment = completeAssessment(reviewId);
      const result = evaluateReview(assessment, assessment.sourceRefs);
      expect(result.isDocumented, reviewId).toBe(true);
      expect(result.status, reviewId).toBe('Documentado');
    }
  });

  it('no documenta por inspeccionar o vincular fuentes sin comprobar ni concluir', () => {
    for (const reviewId of reviewIds) {
      const assessment = createAssessment(reviewId);
      const allSources = reviewRules[reviewId].sourceGroups.map((group) => ref(group.alternatives[0]));
      expect(evaluateReview(assessment, allSources).isDocumented).toBe(false);
      assessment.sourceRefs = allSources;
      const result = evaluateReview(assessment, allSources);
      expect(result.status).toBe('Fuentes reunidas');
      expect(result.isDocumented).toBe(false);
    }
  });

  it('no interpreta el comentario libre ni acepta contenido de presentation como fuente', () => {
    const assessment = createAssessment('AU-02');
    assessment.freeNote = 'Exfiltración confirmada por la nota ILUST-NOTA-01';
    assessment.sourceRefs = [ref('ILUST-NOTA-01')];
    const result = evaluateReview(assessment, assessment.sourceRefs);
    expect(result.isDocumented).toBe(false);
    expect(result.missingReasons.join(' ')).toContain('no admitidas');
  });

  it('requiere versiones vigentes de reglas y fuentes al cargar', () => {
    const assessment = completeAssessment('AU-02');
    assessment.rulesVersion = 'auditoria_reglas_v1';
    assessment.sourceRefs[0].sourceVersion = 'version_anterior';
    const result = evaluateReview(assessment, completeAssessment('AU-02').sourceRefs);
    expect(result.isDocumented).toBe(false);
    expect(result.status).toBe('Por contrastar');
    expect(result.missingReasons.join(' ')).toContain('versión de reglas');
  });

  it.each(reviewIds)('%s: rechaza todas las conclusiones no admitidas', (reviewId) => {
    const rule = reviewRules[reviewId];
    for (const conclusion of rule.conclusions.filter((item) => !rule.acceptedConclusionIds.includes(item.id))) {
      const assessment = completeAssessment(reviewId);
      assessment.conclusionId = conclusion.id;
      expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented, conclusion.id).toBe(false);
    }
  });

  it.each(reviewIds)('%s: rechaza toda respuesta incorrecta', (reviewId) => {
    for (const check of reviewRules[reviewId].checks) {
      for (const option of check.options.filter((item) => item.id !== check.acceptedAnswerId)) {
        const assessment = completeAssessment(reviewId);
        const answer = assessment.checkAnswers.find((item) => item.checkId === check.id);
        expect(answer).toBeDefined();
        answer!.answerId = option.id;
        expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented, `${check.id}: ${option.id}`).toBe(false);
      }
    }
  });

  it.each(reviewIds)('%s: exige cada límite y al menos una solicitud', (reviewId) => {
    for (const limitationId of reviewRules[reviewId].requiredLimitationIds) {
      const assessment = completeAssessment(reviewId);
      assessment.limitationIds = assessment.limitationIds.filter((id) => id !== limitationId);
      expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented, limitationId).toBe(false);
    }
    const withoutRequests = completeAssessment(reviewId);
    withoutRequests.requestIds = [];
    expect(evaluateReview(withoutRequests, withoutRequests.sourceRefs).isDocumented).toBe(false);
  });
});

describe('AU-02', () => {
  it('admite ambas conclusiones limitadas sin recibir el soporte solicitado', () => {
    const assessment = completeAssessment('AU-02');
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(true);
    assessment.conclusionId = 'A02-NO_CONCLUYENTE';
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(true);
  });

  it('admite EVT-04/05 como alternativas cuando la comprobación usa esas referencias', () => {
    const assessment = completeAssessment('AU-02');
    assessment.sourceRefs = [ref('EVT-04'), ref('EVT-05'), ref('DECL-05')];
    assessment.checkAnswers[0].sourceRefs = assessment.sourceRefs.map((item) => ({ ...item }));
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(true);
  });

  it('E-03/EVT-04 y E-04/EVT-05 son alternativas, no corroboraciones independientes', () => {
    const assessment = completeAssessment('AU-02');
    assessment.sourceRefs = [ref('E-03'), ref('EVT-04'), ref('E-04'), ref('EVT-05'), ref('DECL-05')];
    assessment.checkAnswers[0].sourceRefs = assessment.sourceRefs.map((item) => ({ ...item }));
    const result = evaluateReview(assessment, assessment.sourceRefs);
    expect(result.isDocumented).toBe(true);
    expect(result.gatheredGroups).toBe(3);
    expect(result.totalGroups).toBe(3);
    expect(assessment.checkAnswers[0].sourceRefs).toEqual(assessment.sourceRefs);
  });

  it('rechaza exfiltración confirmada aunque el volumen esté vinculado', () => {
    const assessment = completeAssessment('AU-02');
    assessment.conclusionId = 'A02-EXFILTRACION_CONFIRMADA';
    const result = evaluateReview(assessment, assessment.sourceRefs);
    expect(result.isDocumented).toBe(false);
    expect(result.missingReasons.join(' ')).toContain('volumen');
  });

  it('retirar una fuente invalida su comprobación sin borrar el resto del trabajo', () => {
    const assessment = completeAssessment('AU-02');
    const note = assessment.freeNote;
    assessment.sourceRefs = assessment.sourceRefs.filter((item) => item.sourceId !== 'DECL-05');
    const inspected = completeAssessment('AU-02').sourceRefs;
    const result = evaluateReview(assessment, inspected);
    expect(result.isDocumented).toBe(false);
    expect(result.missingReasons.join(' ')).toContain(`Repite «${reviewRules['AU-02'].checks[0].question}»`);
    expect(assessment.conclusionId).toBe('A02-TRANSFERENCIA');
    expect(assessment.freeNote).toBe(note);
  });

  it('no sustituye silenciosamente la fuente retirada por una alternativa', () => {
    const assessment = completeAssessment('AU-02');
    assessment.sourceRefs = [ref('EVT-04'), ref('E-04'), ref('DECL-05')];
    const result = evaluateReview(assessment, [ref('E-03'), ref('EVT-04'), ref('E-04'), ref('DECL-05')]);
    expect(result.isDocumented).toBe(false);
    expect(result.missingReasons.join(' ')).toContain(`Repite «${reviewRules['AU-02'].checks[0].question}»`);
  });

  it('retira la marca al cambiar una respuesta o quitar un límite', () => {
    const assessment = completeAssessment('AU-02');
    assessment.checkAnswers[0].answerId = 'VOLUMEN_DEMUESTRA_EXFILTRACION';
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(false);
    assessment.checkAnswers[0].answerId = 'SIN_VINCULO_NI_CONTENIDO';
    assessment.limitationIds = assessment.limitationIds.filter((id) => id !== 'L02-VINCULO');
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(false);
  });
});

describe('reglas específicas e intervalos', () => {
  it('AU-03 conserva el orden y rechaza causalidad o integridad excesiva', () => {
    const assessment = completeAssessment('AU-03');
    expect(minutesBetween('EVT-06', 'EVT-07')).toBe(20);
    assessment.conclusionId = 'A03-DESPLIEGUE_CAUSA_PROBADA';
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(false);
    assessment.conclusionId = 'A03-DATOS_INTACTOS';
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(false);
  });

  it('AU-04 calcula 61 minutos sin probar ausencia de respuesta', () => {
    expect(minutesBetween('EVT-02', 'EVT-08')).toBe(61);
    const assessment = completeAssessment('AU-04');
    assessment.checkAnswers[0].answerId = '61_MINUTOS_SIN_RESPUESTA';
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(false);
  });

  it('AU-05 calcula 315/355 minutos sin declarar RTO/RPO cumplidos', () => {
    expect(minutesBetween('EVT-09', 'EVT-11')).toBe(315);
    expect(minutesBetween('EVT-09', 'EVT-12')).toBe(355);
    const assessment = completeAssessment('AU-05');
    assessment.conclusionId = 'A05-RTO_RPO_CUMPLIDOS';
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(false);
  });

  it('AU-06 puede documentar custodia y relojes ausentes sin archivos originales', () => {
    const assessment = completeAssessment('AU-06');
    expect(assessment.sourceRefs.map((item) => item.sourceId)).toEqual(['META-CUSTODIA', 'META-TIEMPO']);
    expect(evaluateReview(assessment, assessment.sourceRefs).isDocumented).toBe(true);
    expect(canon.evidenceSummaries.every((item) => item.artifactPath === null && item.sha256 === null)).toBe(true);
  });

  it('el canon conserva trece eventos y la nota fuera de ellos', () => {
    expect(canon.events).toHaveLength(13);
    expect(canon.presentation.ransomNote.usableAsAuditEvidence).toBe(false);
    expect(canon.events.some((event) => event.id === canon.presentation.ransomNote.id)).toBe(false);
    expect(canon.reportedFacts.ransomNote.originalText).toBeNull();
    expect(canon.reportedFacts.ransomNote.appearedAt).toBeNull();
  });
});
