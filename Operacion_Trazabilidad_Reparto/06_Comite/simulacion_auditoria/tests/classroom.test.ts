import { describe, expect, it } from 'vitest';
import previous from './fixtures/libreta-anterior.json';
import { restoreState } from '../src/audit/store';
import { evaluateReview } from '../src/audit/evaluate';
import type { GameState } from '../src/audit/types';
import { buildNotebookExport, reportMarkup } from '../src/export/report';
import { getSourceDocument } from '../src/data/documents';
import { actionsByReview, proposedActions } from '../src/data/guidance';

function previousSave(): GameState {
  return restoreState(JSON.stringify({
    schemaVersion: 2, contentVersion: previous.contentVersion, rulesVersion: previous.rulesVersion,
    clipboardReceived: true, introSeen: true,
    inspected: previous.reviews.flatMap((review) => review.sourceRefs),
    assessments: Object.fromEntries(previous.reviews.map((review) => [review.reviewId, { ...review, rulesVersion: previous.rulesVersion }])),
    recommendations: Object.fromEntries(previous.reviews.map((review) => [review.reviewId, review.recommendation])),
  }));
}

describe('lectura para clase y compatibilidad', () => {
  it('restaura las seis revisiones anteriores sin borrar fuentes, respuestas ni recomendaciones', () => {
    const state = previousSave();
    for (const saved of previous.reviews) {
      const assessment = state.assessments[saved.reviewId as keyof typeof state.assessments];
      expect(assessment.sourceRefs).toEqual(saved.sourceRefs);
      expect(assessment.checkAnswers).toEqual(saved.checkAnswers);
      expect(assessment.conclusionId).toBe(saved.conclusionId);
      expect(assessment.freeNote).toBe(saved.freeNote);
      expect(evaluateReview(assessment, state.inspected).isDocumented).toBe(true);
    }
    expect(buildNotebookExport(state).reviews.map((review) => review.reviewId)).toEqual(previous.reviews.map((review) => review.reviewId));
  });

  it('exporta explicaciones, hipótesis y propuestas, sin claves internas en la lectura impresa', () => {
    const state = previousSave();
    const markup = reportMarkup({ state } as never);
    expect(markup).not.toMatch(/\b(?:P[123]|I[1-6]|CR-I4|B1-[12]|H-[ABC])\b/);
    for (const text of ['Posible robo de credenciales', 'Posible uso indebido de un acceso legítimo', 'ataque por otra vía', 'Seguimiento de la alerta pendiente de comprobar', 'Protección de los registros pendiente de comprobar', '2,058,909', '5,115,483', '144 cambios de monto y 72 de estado', 'no aprueba hallazgos']) expect(markup).toContain(text);
    const exported = buildNotebookExport(state);
    expect(exported.readingGuide.proposedActions).toHaveLength(11);
    expect(exported.reviews.every((review) => review.checks.every((check) => check.question && check.selectedAnswer))).toBe(true);
    expect(Object.values(actionsByReview).flat()).toEqual(expect.arrayContaining(proposedActions.map((action) => action.number)));
  });

  it('describe las fuentes sin alterar identificadores ni rellenar originales ausentes', () => {
    expect(getSourceDocument('E-07')?.title).toBe('Alerta crítica de seguridad');
    const access = getSourceDocument('EVT-02')!;
    expect(access.summary).toContain('nombre de la cuenta remota; persona desconocida');
    expect(access.summary).toContain('verificación adicional a la contraseña');
    expect(access.rows.find((row) => row.values[0] === 'Hora original')?.values[1]).toBeNull();
    expect(getSourceDocument('META-CUSTODIA')?.readingNote).toContain('sin leer archivos ni calcular huellas digitales ni comprobar permisos efectivos');
  });
});
