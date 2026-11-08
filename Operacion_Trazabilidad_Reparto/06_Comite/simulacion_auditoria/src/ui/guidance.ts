import type { ReviewId } from '../audit/types';
import { actionsByReview, hypotheses, laboratoryComparison, pendingObservations, proposedActions, reviewGuidance } from '../data/guidance';
import { escapeHtml } from './dom';

export function reviewHelpMarkup(reviewId: ReviewId): string {
  const help = reviewGuidance[reviewId];
  return `<aside class="review-help" aria-label="Ayuda escrita de la revisión" data-review-help="${reviewId}"><p>${escapeHtml(help.terms)}</p><p>${escapeHtml(help.limit)}</p>${reviewId === 'AU-02' ? `<details><summary>Comparar tamaños: cálculo de laboratorio</summary><p>${escapeHtml(laboratoryComparison)}</p></details>` : ''}<details><summary>Tres explicaciones que siguen abiertas</summary>${hypothesesMarkup()}</details><details><summary>Acciones propuestas para esta revisión</summary><ul>${actionsByReview[reviewId].map((number) => { const action = proposedActions[number - 1]; return `<li>${escapeHtml(action.title)} (acción ${number}).</li>`; }).join('')}</ul><p>La administración ejecuta; el auditor recomienda y evalúa. Son propuestas, no acciones realizadas.</p></details></aside>`;
}

export function hypothesesMarkup(): string {
  return `<p>Ninguna está demostrada. Para distinguirlas:</p><ul>${hypotheses.map((item) => `<li><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.explanation)}</p><p>${escapeHtml(item.distinguish)}</p></li>`).join('')}</ul>`;
}

export function observationsMarkup(): string {
  return `<p>Ambas observaciones son no concluyentes; las buenas prácticas externas no se acreditaron como obligación de la empresa.</p><ul>${pendingObservations.map((item) => `<li><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></li>`).join('')}</ul>`;
}

export function actionsMarkup(): string {
  return `<ol>${proposedActions.map((action) => `<li><strong>${escapeHtml(action.title)}</strong><p>${escapeHtml(action.owner)} · máximo propuesto: ${action.hours} horas desde la activación.</p><p>Prueba de cierre: ${escapeHtml(action.closure)}</p></li>`).join('')}</ol>`;
}
