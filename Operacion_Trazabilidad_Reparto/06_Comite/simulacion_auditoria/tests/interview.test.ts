import { describe, expect, it } from 'vitest';
import {
  availableInterviewQuestions, baseQuestions, createInterviewSession,
  followupQuestions, interviewTopics,
} from '../src/data/interview';
import { getSourceDocument } from '../src/data/documents';

const noSources = new Set<string>();

describe('conversación con el enlace de TI', () => {
  it('ofrece preguntas del tema elegido y revela las repreguntas después de hablar', () => {
    const session = createInterviewSession();
    expect(availableInterviewQuestions(session, noSources)).toEqual([]);
    session.topicId = 'AU-01';
    expect(availableInterviewQuestions(session, noSources).map((item) => item.id)).toEqual(['P-IDENTIDAD', 'P-POLITICA']);
    session.discussed.add('P-IDENTIDAD');
    expect(availableInterviewQuestions(session, noSources).map((item) => item.id)).toContain('R-IDENTIDAD');
    expect(availableInterviewQuestions(session, noSources).map((item) => item.id)).not.toContain('R-POLITICA');
  });

  it('exige tanto la conversación previa como todas las fuentes para una repregunta contextual', () => {
    for (const question of followupQuestions.filter((item) => item.requires?.length)) {
      const session = createInterviewSession();
      session.topicId = question.reviewId;
      const allSources = new Set(question.requires);
      expect(availableInterviewQuestions(session, allSources)).not.toContain(question);
      session.discussed.add(question.parentId!);
      expect(availableInterviewQuestions(session, noSources)).not.toContain(question);
      for (const missing of question.requires!) {
        expect(availableInterviewQuestions(session, new Set(question.requires!.filter((id) => id !== missing)))).not.toContain(question);
      }
      expect(availableInterviewQuestions(session, allSources)).toContain(question);
    }
  });

  it('mantiene las preguntas previas disponibles sin desbloquear otras ramas', () => {
    const session = createInterviewSession();
    session.topicId = 'AU-02';
    session.discussed.add('P-FUJO');
    expect(availableInterviewQuestions(session, noSources).map((item) => item.id)).toEqual(['P-FUJO', 'R-VOLUMEN']);
    session.topicId = 'AU-03';
    expect(availableInterviewQuestions(session, noSources).map((item) => item.id)).toEqual(['P-INTEGRIDAD', 'P-APROBACION']);
  });

  it('conserva enlaces válidos a documentos y padres dentro de las seis revisiones', () => {
    const questions = [...baseQuestions, ...followupQuestions];
    expect(new Set(questions.map((item) => item.id)).size).toBe(questions.length);
    for (const topic of interviewTopics) expect(baseQuestions.some((item) => item.reviewId === topic.id)).toBe(true);
    for (const question of questions) {
      if (question.sourceId) expect(getSourceDocument(question.sourceId)).toBeDefined();
      if (question.parentId) expect(questions.find((item) => item.id === question.parentId)?.reviewId).toBe(question.reviewId);
    }
  });
});
