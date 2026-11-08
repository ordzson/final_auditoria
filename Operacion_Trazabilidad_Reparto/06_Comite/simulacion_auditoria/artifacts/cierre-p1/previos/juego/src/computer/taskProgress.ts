import { currentSourceVersion, sameSourceRef } from '../audit/evaluate';
import { reviewRules } from '../audit/rules';
import type { GameState, SourceRef } from '../audit/types';
import type { ComputerDefinition, TaskProgress } from './types';

export function deriveTaskProgress(computer: ComputerDefinition, state: GameState): TaskProgress[] {
  const assessment = state.assessments[computer.reviewId];
  const rule = reviewRules[computer.reviewId];
  const inspected = (ref: SourceRef) => ref.sourceVersion === currentSourceVersion(ref.sourceId)
    && state.inspected.some((item) => sameSourceRef(item, ref));
  const linkedGroup = (groupId: string, refs: SourceRef[]) => {
    const group = rule.sourceGroups.find((item) => item.id === groupId);
    return Boolean(group && refs.some((ref) => group.alternatives.includes(ref.sourceId) && inspected(ref)
      && assessment.sourceRefs.some((item) => sameSourceRef(item, ref))));
  };
  return computer.note.tasks.map((task) => {
    const condition = task.condition;
    let satisfied = false;
    let label: TaskProgress['label'] = 'Por consultar';
    if (condition.kind === 'inspected') {
      const visited = (sourceId: string) => state.inspected.some((ref) => ref.sourceId === sourceId && inspected(ref));
      satisfied = condition.sourceIds.length > 0 && (condition.match === 'all' ? condition.sourceIds.every(visited) : condition.sourceIds.some(visited));
      if (satisfied) label = 'Fuente consultada';
    } else if (condition.kind === 'linked') {
      satisfied = condition.sourceGroupIds.length > 0 && condition.sourceGroupIds.every((id) => linkedGroup(id, assessment.sourceRefs));
      if (satisfied) label = 'Pista vinculada';
    } else {
      const check = rule.checks.find((item) => item.id === condition.checkId);
      const answer = assessment.checkAnswers.find((item) => item.checkId === condition.checkId);
      satisfied = Boolean(check && answer && check.options.some((option) => option.id === answer.answerId)
        && check.sourceGroupIds.every((id) => linkedGroup(id, answer.sourceRefs)));
      if (satisfied) label = 'Contraste registrado';
    }
    return { taskId: task.id, satisfied, label };
  });
}
