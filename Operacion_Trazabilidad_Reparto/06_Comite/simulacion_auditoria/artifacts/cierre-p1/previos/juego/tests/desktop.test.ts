import { describe, expect, it } from 'vitest';
import { fitNote, fitWindow, moveWindow, resizeWindow, usesSingleWindow } from '../src/ui/desktop/geometry';

describe('geometría de las ventanas dentro del monitor', () => {
  const area = { width: 1100, height: 600 };
  const initial = { x: 250, y: 30, width: 640, height: 430 };
  const minimum = { width: 320, height: 220 };

  it('limita arrastre y mantiene el título completo dentro del área útil', () => {
    expect(moveWindow(initial, { x: 1000, y: -500 }, area, minimum)).toEqual({ x: 460, y: 0, width: 640, height: 430 });
    expect(moveWindow(initial, { x: -1000, y: 1000 }, area, minimum)).toEqual({ x: 0, y: 170, width: 640, height: 430 });
  });

  it('redimensiona con mínimos efectivos y no invade la barra de tareas', () => {
    expect(resizeWindow(initial, { x: 1000, y: 1000 }, area, minimum)).toEqual({ x: 250, y: 30, width: 850, height: 570 });
    expect(resizeWindow(initial, { x: -1000, y: -1000 }, area, minimum)).toEqual({ x: 250, y: 30, width: 320, height: 220 });
  });

  it('recupera geometrías al pasar de monitor grande a una pantalla pequeña', () => {
    expect(fitWindow(initial, { width: 280, height: 190 }, minimum)).toEqual({ x: 0, y: 0, width: 280, height: 190 });
    expect(fitWindow({ ...initial, x: -200, y: -300 }, area)).toEqual({ ...initial, x: 0, y: 0 });
  });

  it('recupera la nota y activa una única ventana sin modificar la disposición guardada', () => {
    expect(fitNote({ x: 1200, y: 900 }, area, { width: 204, height: 260 })).toEqual({ x: 896, y: 340 });
    expect(fitNote({ x: -50, y: -50 }, { width: 180, height: 100 }, { width: 204, height: 260 })).toEqual({ x: 0, y: 0 });
    expect(usesSingleWindow({ width: 390, height: 650 }, false)).toBe(true);
    expect(usesSingleWindow({ width: 900, height: 600 }, true)).toBe(true);
    expect(usesSingleWindow(area, false)).toBe(false);
    expect(initial).toEqual({ x: 250, y: 30, width: 640, height: 430 });
  });
});
