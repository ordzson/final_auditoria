import { evaluateReview } from '../audit/evaluate';
import { reviewRules, reviewIds } from '../audit/rules';
import type { AuditStore } from '../audit/store';
import type { GameState, ReviewId } from '../audit/types';
import { canon } from '../data/canon';
import { actionBoundary, actionsByReview, caseOverview, documentedMeaning, evidenceKinds, hypotheses, laboratoryComparison, pendingObservations, proposedActions, reviewGuidance } from '../data/guidance';
import { sourceName } from '../data/investigation';
import { actionsMarkup, hypothesesMarkup, observationsMarkup } from '../ui/guidance';
import { escapeHtml } from '../ui/dom';

export function buildNotebookExport(state: GameState) {
  return {
    schema: 'rednova_libreta_v2',
    exportedAt: new Date().toISOString(),
    contentVersion: state.contentVersion,
    rulesVersion: state.rulesVersion,
    scope: 'Actividad educativa de revisión. No es un informe académico aprobado ni una conexión a SQL Server.',
    readingGuide: { caseOverview, evidenceKinds, documentedMeaning, hypotheses, laboratoryComparison, pendingObservations, actionBoundary, proposedActions },
    reviews: reviewIds.map((reviewId) => {
      const assessment = state.assessments[reviewId];
      const evaluation = evaluateReview(assessment, state.inspected);
      return {
        reviewId,
        title: reviewRules[reviewId].title,
        guidance: reviewGuidance[reviewId],
        proposedActionNumbers: actionsByReview[reviewId],
        sources: assessment.sourceRefs.map((ref) => ({ ...ref, title: sourceName(ref.sourceId) })),
        checks: assessment.checkAnswers.map((answer) => {
          const check = reviewRules[reviewId].checks.find((item) => item.id === answer.checkId);
          return { ...answer, question: check?.question ?? null, selectedAnswer: check?.options.find((item) => item.id === answer.answerId)?.text ?? null };
        }),
        limitations: assessment.limitationIds.map((id) => ({ id, text: reviewRules[reviewId].limitations.find((item) => item.id === id)?.text ?? null })),
        requests: assessment.requestIds.map((id) => ({ id, text: reviewRules[reviewId].requests.find((item) => item.id === id)?.text ?? null })),
        status: evaluation.status,
        isDocumented: evaluation.isDocumented,
        conclusionId: assessment.conclusionId,
        conclusionText: reviewRules[reviewId].conclusions.find((item) => item.id === assessment.conclusionId)?.text ?? null,
        sourceRefs: assessment.sourceRefs,
        checkAnswers: assessment.checkAnswers,
        limitationIds: assessment.limitationIds,
        requestIds: assessment.requestIds,
        pendingReasons: evaluation.missingReasons,
        freeNote: assessment.freeNote,
        recommendation: state.recommendations[reviewId],
      };
    }),
    unresolvedCanon: canon.unresolved,
  };
}

export function downloadNotebook(store: AuditStore): void {
  const data = JSON.stringify(buildNotebookExport(store.state), null, 2);
  const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'rednova_libreta_auditoria.json';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function reportMarkup(store: AuditStore): string {
  const state = store.state;
  return `
    <article class="print-report-content">
      <header><h1>Operación Trazabilidad · Libreta de auditoría</h1><p>Actividad educativa sobre el caso ficticio RedNova</p></header>
      <p class="print-boundary"><strong>Alcance:</strong> conclusiones estructuradas sobre resúmenes del caso ficticio RedNova. No sustituye el informe del curso, la revisión humana, la base SQL ni los hallazgos académicos.</p>
      <p>${escapeHtml(documentedMeaning)}</p>
      <p>${escapeHtml(caseOverview)}</p><p>${escapeHtml(evidenceKinds)}</p>
      <h2>Tres explicaciones abiertas</h2>${hypothesesMarkup()}
      <h2>Observaciones pendientes de comprobar</h2>${observationsMarkup()}
      <h2>Comparación de tamaños · cálculo de laboratorio</h2><p>${escapeHtml(laboratoryComparison)}</p>
      ${reviewIds.map((reviewId) => reportReview(store, reviewId)).join('')}
      <section class="print-plan"><h2>Once acciones propuestas para las primeras 72 horas</h2><p>${escapeHtml(actionBoundary)}</p>${actionsMarkup()}</section>
      <section><h2>Límites generales del expediente de referencia</h2><ul>${canon.unresolved.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
      <footer>Referencias de trazabilidad: contenido ${escapeHtml(state.contentVersion)} · reglas ${escapeHtml(state.rulesVersion)}.<br>Generado localmente, sin conexión a SQL Server ni servicios remotos. La hora de exportación no es una hora del incidente.</footer>
    </article>`;
}

function reportReview(store: AuditStore, reviewId: ReviewId): string {
  const rule = reviewRules[reviewId];
  const assessment = store.state.assessments[reviewId];
  const evaluation = evaluateReview(assessment, store.state.inspected);
  const conclusion = rule.conclusions.find((item) => item.id === assessment.conclusionId);
  const recommendation = store.state.recommendations[reviewId];
  return `<section class="print-review">
    <h2>${escapeHtml(rule.title)} <span>${evaluation.status}</span></h2>
    <small>Referencia de revisión: ${reviewId}</small><p>${escapeHtml(reviewGuidance[reviewId].terms)}</p>
    <p>${escapeHtml(reviewGuidance[reviewId].limit)}</p>
    <h3>Conclusión estructurada</h3><p>${escapeHtml(conclusion?.text ?? 'No seleccionada')}</p>${conclusion ? `<small>Referencia: ${escapeHtml(conclusion.id)}</small>` : ''}
    <h3>Fuentes vinculadas</h3>${assessment.sourceRefs.length ? `<ul>${assessment.sourceRefs.map((ref) => `<li>${escapeHtml(sourceName(ref.sourceId))} (${escapeHtml(ref.sourceId)}) · versión ${escapeHtml(ref.sourceVersion)}${ref.rowId ? ` · fila ${escapeHtml(ref.rowId)}` : ''}</li>`).join('')}</ul>` : '<p>Sin fuentes vinculadas.</p>'}
    <h3>Comprobaciones</h3>${assessment.checkAnswers.length ? `<ul>${assessment.checkAnswers.map((answer) => `<li><p><strong>Pregunta:</strong> ${escapeHtml(rule.checks.find((check) => check.id === answer.checkId)?.question ?? 'Comprobación no reconocida en las reglas vigentes.')}</p><p><strong>Respuesta elegida:</strong> ${escapeHtml(rule.checks.find((check) => check.id === answer.checkId)?.options.find((option) => option.id === answer.answerId)?.text ?? 'Respuesta no reconocida en las reglas vigentes; requiere revisión.')}</p><small>Referencias: ${escapeHtml(answer.checkId)} · ${escapeHtml(answer.answerId)}</small><p>Fuentes: ${answer.sourceRefs.map((ref) => `${escapeHtml(sourceName(ref.sourceId))} (${escapeHtml(ref.sourceId)}) · versión ${escapeHtml(ref.sourceVersion)}`).join('; ') || 'Sin fuentes registradas.'}</p></li>`).join('')}</ul>` : '<p>Sin comprobaciones registradas.</p>'}
    <h3>Limitaciones</h3>${assessment.limitationIds.length ? `<ul>${assessment.limitationIds.map((id) => `<li>${escapeHtml(rule.limitations.find((item) => item.id === id)?.text ?? id)} <small>(${escapeHtml(id)})</small></li>`).join('')}</ul>` : '<p>Sin limitaciones registradas.</p>'}
    <h3>Solicitudes y pendientes</h3><ul>${assessment.requestIds.map((id) => `<li>${escapeHtml(rule.requests.find((item) => item.id === id)?.text ?? id)} <small>(${escapeHtml(id)})</small></li>`).join('')}${evaluation.missingReasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('')}</ul>
    <h3>Acciones propuestas relacionadas</h3><ul>${actionsByReview[reviewId].map((number) => `<li>Acción ${number}: ${escapeHtml(proposedActions[number - 1].title)}. Propuesta; no ejecutada.</li>`).join('')}</ul>
    <h3>Anotación personal · sin evaluación automática</h3><p>${escapeHtml(assessment.freeNote || 'Sin anotación personal.')}</p>
    <h3>Recomendación y prueba de cierre · sin evaluación automática</h3><p><strong>Acción:</strong> ${escapeHtml(recommendation.action || 'No registrada')}<br><strong>Responsable:</strong> ${escapeHtml(recommendation.owner || 'No asignado')}<br><strong>Plazo propuesto:</strong> ${escapeHtml(recommendation.deadline || 'No registrado')}<br><strong>Verificación:</strong> ${escapeHtml(recommendation.verification || 'No registrada')}</p>
  </section>`;
}

export function printNotebook(store: AuditStore): void {
  const root = document.getElementById('print-report');
  if (!root) return;
  root.innerHTML = reportMarkup(store);
  document.body.classList.add('printing-report');
  const cleanup = () => document.body.classList.remove('printing-report');
  window.addEventListener('afterprint', cleanup, { once: true });
  window.print();
  // afterprint conserva el informe durante toda la impresión, sin retirarlo por tiempo.
}
