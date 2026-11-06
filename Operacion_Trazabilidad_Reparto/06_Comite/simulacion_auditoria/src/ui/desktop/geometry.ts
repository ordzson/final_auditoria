import type { Bounds, Point } from '../../computer/types';

export type DesktopArea = { width: number; height: number };

// También se usa durante un gesto: ningún botón del título sale del monitor.
export function fitWindow(bounds: Bounds, area: DesktopArea, minSize = { width: 240, height: 160 }): Bounds {
  const available = { width: Math.max(1, area.width), height: Math.max(1, area.height) };
  const width = Math.min(available.width, Math.max(Math.min(minSize.width, available.width), bounds.width));
  const height = Math.min(available.height, Math.max(Math.min(minSize.height, available.height), bounds.height));
  return { x: Math.max(0, Math.min(bounds.x, available.width - width)), y: Math.max(0, Math.min(bounds.y, available.height - height)), width, height };
}

export function moveWindow(bounds: Bounds, delta: Point, area: DesktopArea, minSize?: DesktopArea): Bounds {
  return fitWindow({ ...bounds, x: bounds.x + delta.x, y: bounds.y + delta.y }, area, minSize);
}

export function resizeWindow(bounds: Bounds, delta: Point, area: DesktopArea, minSize: DesktopArea): Bounds {
  return fitWindow({ ...bounds, width: Math.min(area.width - bounds.x, bounds.width + delta.x), height: Math.min(area.height - bounds.y, bounds.height + delta.y) }, area, minSize);
}

export function fitNote(position: Point, area: DesktopArea, size: DesktopArea): Point {
  return { x: Math.max(0, Math.min(position.x, area.width - Math.min(area.width, size.width))), y: Math.max(0, Math.min(position.y, area.height - Math.min(area.height, size.height))) };
}

export function usesSingleWindow(area: DesktopArea, projector: boolean): boolean {
  return area.width < (projector ? 1040 : 760) || area.height < 360;
}
