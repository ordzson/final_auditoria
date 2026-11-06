import { evaluateReview } from '../audit/evaluate';
import { reviewRules, reviewIds } from '../audit/rules';
import type { AuditStore } from '../audit/store';
import type { GameState, ReviewId } from '../audit/types';
import { canon } from '../data/canon';
import { sourceTitle } from '../data/documents';
import { escapeHtml } from '../ui/dom';

export function buildNotebookExport(state: GameState) {
  return {
    schema: 'rednova_libreta_v2',
    exportedAt: new Date().toISOString(),
    contentVersion: state.contentVersion,
    rulesVersion: state.rulesVersion,
    scope: 'Actividad educativa de revisión. No es un informe académico aprobado ni una conexión a SQL Server.',
    reviews: reviewIds.map((reviewId) => {
      const assessment = state.assessments[reviewId];
      const evaluation = evaluateReview(assessment, state.inspected);
      return {
        reviewId,
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
      <header><h1>Operación Trazabilidad · Libreta de auditoría</h1><p>Exportación de actividad educativa · Canon ${escapeHtml(state.contentVersion)} · Reglas ${escapeHtml(state.rulesVersion)}</p></header>
      <p class="print-boundary"><strong>Alcance:</strong> conclusiones estructuradas sobre resúmenes del caso ficticio RedNova. No sustituye el informe del curso, la revisión humana, la base SQL ni los hallazgos académicos.</p>
      ${reviewIds.map((reviewId) => reportReview(store, reviewId)).join('')}
      <section><h2>Límites generales del expediente</h2><ul>${canon.unresolved.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>
      <footer>Generado localmente, sin conexión a SQL Server ni servicios remotos. La hora de exportación no es una hora del incidente.</footer>
    </article>`;
}

function reportReview(store: AuditStore, reviewId: ReviewId): string {
  const rule = reviewRules[reviewId];
  const assessment = store.state.assessments[reviewId];
  const evaluation = evaluateReview(assessment, store.state.inspected);
  const conclusion = rule.conclusions.find((item) => item.id === assessment.conclusionId);
  const recommendation = store.state.recommendations[reviewId];
  return `<section class="print-review">
    <h2>${reviewId} · ${escapeHtml(rule.title)} <span>${evaluation.status}</span></h2>
    <h3>Conclusión estructurada</h3><p>${escapeHtml(conclusion?.text ?? 'No seleccionada')}</p>
    <h3>Fuentes vinculadas</h3>${assessment.sourceRefs.length ? `<ul>${assessment.sourceRefs.map((ref) => `<li>${ref.sourceId} · ${escapeHtml(sourceTitle(ref.sourceId))} · versión ${ref.sourceVersion}${ref.rowId ? ` · fila ${escapeHtml(ref.rowId)}` : ''}</li>`).join('')}</ul>` : '<p>Sin fuentes vinculadas.</p>'}
    <h3>Comprobaciones</h3>${assessment.checkAnswers.length ? `<ul>${assessment.checkAnswers.map((answer) => `<li>${answer.checkId} · ${answer.answerId}<br>Fuentes: ${answer.sourceRefs.map((ref) => `${ref.sourceId}@${ref.sourceVersion}`).join(', ')}</li>`).join('')}</ul>` : '<p>Sin comprobaciones registradas.</p>'}
    <h3>Limitaciones</h3>${assessment.limitationIds.length ? `<ul>${assessment.limitationIds.map((id) => `<li>${id} · ${escapeHtml(rule.limitations.find((item) => item.id === id)?.text ?? id)}</li>`).join('')}</ul>` : '<p>Sin limitaciones registradas.</p>'}
    <h3>Solicitudes y pendientes</h3><ul>${assessment.requestIds.map((id) => `<li>${id} · ${escapeHtml(rule.requests.find((item) => item.id === id)?.text ?? id)}</li>`).join('')}${evaluation.missingReasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('')}</ul>
    <h3>Anotación personal · sin evaluación automática</h3><p>${escapeHtml(assessment.freeNote || 'Sin anotación personal.')}</p>
    <h3>Recomendación y prueba de cierre · sin evaluación automática</h3><p><strong>Acción:</strong> ${escapeHtml(recommendation.action || 'No registrada')}<br><strong>Responsable:</strong> ${escapeHtml(recommendation.owner || 'No asignado')}<br><strong>Verificación:</strong> ${escapeHtml(recommendation.verification || 'No registrada')}</p>
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
  setTimeout(cleanup, 1000);
}
