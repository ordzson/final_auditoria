import { describe, expect, it } from 'vitest';
import { buildNotebookExport, reportMarkup } from '../src/export/report';
import { createAssessment } from '../src/audit/evaluate';
import { reviewIds, reviewRules } from '../src/audit/rules';
import type { GameState } from '../src/audit/types';
import { CONTENT_VERSION } from '../src/data/canon';

function state(): GameState {
  return {
    schemaVersion: 2,
    contentVersion: CONTENT_VERSION,
    rulesVersion: 'auditoria_reglas_v2.1',
    assessments: Object.fromEntries(reviewIds.map((id) => [id, createAssessment(id)])) as GameState['assessments'],
    inspected: [],
    clipboardReceived: false,
    pose: { x: 0, z: 4.4, yaw: 0, pitch: 0 },
    settings: { projector: false, reducedMotion: true, audioEnabled: false, sensitivity: 1, flatMode: true },
    recommendations: Object.fromEntries(reviewIds.map((id) => [id, { action: '', owner: '', verification: '' }])) as GameState['recommendations'],
    hintLevels: Object.fromEntries(reviewIds.map((id) => [id, 0])) as GameState['hintLevels'],
    introSeen: true,
  };
}

describe('libreta exportable', () => {
  it('imprime las preguntas, respuestas elegidas y códigos de las seis revisiones', () => {
    const data = state();
    for (const id of reviewIds) {
      const rule = reviewRules[id];
      data.assessments[id].checkAnswers = rule.checks.map((check) => ({
        checkId: check.id, answerId: check.acceptedAnswerId,
        sourceRefs: [{ sourceId: rule.sourceGroups[0].alternatives[0], sourceVersion: CONTENT_VERSION }],
      }));
    }
    data.recommendations['AU-02'].deadline = '24 h desde la activación futura del plan';
    const markup = reportMarkup({ state: data } as never);
    for (const id of reviewIds) for (const check of reviewRules[id].checks) {
      expect(markup).toContain(check.question);
      expect(markup).toContain(check.options.find((option) => option.id === check.acceptedAnswerId)!.text);
      expect(markup).toContain(check.id);
      expect(markup).toContain(check.acceptedAnswerId);
    }
    expect(markup).toContain('24 h desde la activación futura del plan');
    expect(markup).toContain('conclusión no concluyente');
  });

  it('conserva la respuesta incorrecta elegida y señala códigos antiguos sin inventar texto', () => {
    const data = state();
    data.assessments['AU-02'].checkAnswers = [{ checkId: 'C02-CONTENIDO', answerId: 'VOLUMEN_DEMUESTRA_EXFILTRACION', sourceRefs: [] }];
    data.assessments['AU-06'].checkAnswers = [{ checkId: '<check-antiguo>', answerId: '<respuesta-antigua>', sourceRefs: [{ sourceId: '<fuente>', sourceVersion: '<version>' }] }];
    const markup = reportMarkup({ state: data } as never);
    expect(markup).toContain(reviewRules['AU-02'].checks[0].options.find((option) => option.id === 'VOLUMEN_DEMUESTRA_EXFILTRACION')!.text);
    expect(markup).toContain('Respuesta no reconocida en las reglas vigentes');
    expect(markup).toContain('&lt;check-antiguo&gt;');
    expect(markup).not.toContain('<fuente>');
  });

  it('conserva límites, pendientes y texto personal sin aprobar hallazgos', () => {
    const data = state();
    data.assessments['AU-02'].freeNote = 'El contenido sigue sin identificarse.';
    data.assessments['AU-02'].requestIds = ['S02-CONTENIDO'];
    const exported = buildNotebookExport(data);
    const review = exported.reviews.find((item) => item.reviewId === 'AU-02')!;
    expect(review.isDocumented).toBe(false);
    expect(review.pendingReasons.length).toBeGreaterThan(0);
    expect(review.freeNote).toContain('sin identificarse');
    expect(exported.scope).toContain('No es un informe académico aprobado');
  });

  it('escapa anotaciones HTML y conserva el límite del expediente en impresión', () => {
    const data = state();
    data.assessments['AU-01'].freeNote = '<img src=x onerror=alert(1)>';
    data.recommendations['AU-01'].action = '<script>no ejecutar</script>';
    const markup = reportMarkup({ state: data } as never);
    expect(markup).not.toContain('<img src=x');
    expect(markup).not.toContain('<script>no ejecutar');
    expect(markup).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(markup).toContain('No sustituye el informe del curso');
  });
});
