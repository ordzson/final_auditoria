import { describe, expect, it } from 'vitest';
import { restoreState } from '../src/audit/store';
import { CONTENT_VERSION } from '../src/data/canon';
import { availableComputerSources, computers, getComputer } from '../src/data/computers';
import { deriveTaskProgress } from '../src/computer/taskProgress';

describe('definiciones y marcas derivadas', () => {
  it('declara seis computadoras y las herramientas comunes sin saltar el enlace', () => {
    const state = restoreState(null);
    expect(computers).toHaveLength(6);
    for (const computer of computers) {
      expect(computer.installedApps).toContain('station-report');
      expect(computer.installedApps).toContain('local-dossier');
      expect(computer.shortcuts).toEqual(computer.installedApps);
      expect(computer.note.tasks.length).toBeGreaterThan(1);
    }
    expect(availableComputerSources('respaldos', state)).not.toContain('DECL-07');
    state.inspected.push({ sourceId: 'DECL-07', sourceVersion: CONTENT_VERSION });
    expect(availableComputerSources('respaldos', state)).toContain('DECL-07');
    expect(availableComputerSources('sql_red', state)).not.toContain('DECL-07');
  });

  it('leer la nota no muta el expediente y exige inspección vigente', () => {
    const state = restoreState(null); const computer = getComputer('sql_red');
    const before = JSON.stringify(state);
    expect(deriveTaskProgress(computer, state).every((task) => !task.satisfied)).toBe(true);
    expect(JSON.stringify(state)).toBe(before);
    state.inspected.push({ sourceId: 'EVT-04', sourceVersion: 'old' });
    expect(deriveTaskProgress(computer, state)[0].satisfied).toBe(false);
    state.inspected.push({ sourceId: 'EVT-04', sourceVersion: CONTENT_VERSION });
    expect(deriveTaskProgress(computer, state)[0]).toMatchObject({ satisfied: true, label: 'Fuente consultada' });
  });

  it('marca un contraste registrado con cualquier opción válida, y lo retira al perder el sustento', () => {
    const state = restoreState(null); const computer = getComputer('sql_red');
    const refs = ['EVT-04', 'EVT-05', 'DECL-05'].map((sourceId) => ({ sourceId, sourceVersion: CONTENT_VERSION }));
    state.inspected = refs;
    state.assessments['AU-02'].sourceRefs = [...refs];
    state.assessments['AU-02'].checkAnswers = [{ checkId: 'C02-CONTENIDO', answerId: 'VOLUMEN_DEMUESTRA_EXFILTRACION', sourceRefs: refs }];
    expect(deriveTaskProgress(computer, state)[1]).toMatchObject({ satisfied: true, label: 'Contraste registrado' });
    state.assessments['AU-02'].sourceRefs.pop();
    expect(deriveTaskProgress(computer, state)[1].satisfied).toBe(false);
    expect(state.assessments['AU-02'].checkAnswers).toHaveLength(1);
  });
});
