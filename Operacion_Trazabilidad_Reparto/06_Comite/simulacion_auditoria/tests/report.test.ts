import { describe, expect, it } from 'vitest';
import { buildNotebookExport, reportMarkup } from '../src/export/report';
import { createAssessment } from '../src/audit/evaluate';
import { reviewIds } from '../src/audit/rules';
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
