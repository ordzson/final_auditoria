import { describe, expect, it } from 'vitest';
import { canon } from '../src/data/canon';
import { getIntroFrame, introHistory, shots } from '../src/data/intro';
import { getSimulationFrame } from '../src/data/simulation';

 describe('reconstrucción determinista', () => {
  it('contiene diez planos, 110 segundos y trece registros sin evento adicional', () => {
    expect(shots).toHaveLength(10);
    expect(shots[shots.length - 1].end).toBe(canon.presentation.openingTargetSeconds);
    const ids = new Set(shots.flatMap((shot) => getIntroFrame(shot.start).eventIds));
    for (let time = 0; time <= 110; time += 0.5) getIntroFrame(time).eventIds.forEach((id) => ids.add(id));
    expect(ids.size).toBe(13);
    expect(ids.has(canon.presentation.ransomNote.id)).toBe(false);
  });

  it('muestra la nota del canon solo de 64 a 74 segundos', () => {
    expect(getIntroFrame(63.99).noteVisible).toBe(false);
    expect(getIntroFrame(64).noteVisible).toBe(true);
    expect(getIntroFrame(73.99).noteVisible).toBe(true);
    expect(getIntroFrame(74).noteVisible).toBe(false);
    expect(getIntroFrame(64).eventId).toBe('EVT-09');
  });

  it('recompone los estados de P04, P09 y P10 al retroceder', () => {
    expect(getIntroFrame(29.9).eventId).toBe('EVT-04');
    expect(getIntroFrame(30).eventId).toBe('EVT-05');
    expect(getIntroFrame(82.9).eventId).toBe('EVT-10');
    expect(getIntroFrame(83).eventId).toBe('EVT-11');
    expect(getIntroFrame(89).eventId).toBe('EVT-12');
    expect(getIntroFrame(104.9).eventId).toBe('EVT-13');
    expect(getIntroFrame(105).visitLabel).toBe(true);
    expect(getIntroFrame(105).timeLabel).toBe('SIN HORA ASIGNADA');
  });

  it('mantiene P02 y P03 como registros separados', () => {
    expect(getIntroFrame(8).eventId).toBe('EVT-02');
    expect(getIntroFrame(16).eventId).toBe('EVT-03');
    expect(canon.events.find((event) => event.id === 'EVT-03')?.account).toBeNull();
  });

  it('el historial contiene como máximo seis eventos reales', () => {
    expect(introHistory(0)).toEqual(['EVT-01']);
    expect(introHistory(110)).toHaveLength(6);
    expect(introHistory(110)).toEqual(['EVT-08', 'EVT-09', 'EVT-10', 'EVT-11', 'EVT-12', 'EVT-13']);
  });

  it('reproduce actividad antes del resultado y restablece la transferencia al retroceder', () => {
    expect(getSimulationFrame(24).kind).toBe('sql');
    expect(getSimulationFrame(24).settled).toBe(false);
    expect(getSimulationFrame(27).reportedValue).toBe('31,840');
    expect(getSimulationFrame(27).settled).toBe(true);
    const transfer = getSimulationFrame(31);
    expect(transfer.kind).toBe('transfer');
    expect(transfer.progress).toBeLessThan(1);
    expect(getSimulationFrame(34).settled).toBe(true);
    expect(getSimulationFrame(31)).toEqual(transfer);
  });

  it('reduce el movimiento conservando los resultados y las etapas de recuperación', () => {
    expect(getSimulationFrame(23, true)).toMatchObject({ kind: 'sql', progress: 1, tick: 0, settled: true });
    expect(getSimulationFrame(77).reportedValue).toBe('SOLICITADA');
    expect(getSimulationFrame(83).reportedValue).toBe('SOLO CONSULTA');
    expect(getSimulationFrame(89).reportedValue).toBe('ESCRITURA');
    expect(getSimulationFrame(16).detail).toContain('Cuenta no aportada');
    expect(getSimulationFrame(30).detail).toContain('sin identificar');
  });
});
