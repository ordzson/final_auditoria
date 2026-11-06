import { describe, expect, it } from 'vitest';
import { isFree, movementDelta, nearestFreePoint, resolveMovement, WALK_SPEED } from '../src/scene/collision';

describe('movimiento y colisiones', () => {
  it('normaliza la diagonal y limita saltos de tiempo', () => {
    const straight = movementDelta(1, 0, 0, 0.05);
    const diagonal = movementDelta(1, 1, 0, 0.05);
    expect(Math.hypot(straight.x, straight.z)).toBeCloseTo(WALK_SPEED * 0.05);
    expect(Math.hypot(diagonal.x, diagonal.z)).toBeCloseTo(Math.hypot(straight.x, straight.z));
    const longFrame = movementDelta(1, 0, 0, 2);
    expect(Math.hypot(longFrame.x, longFrame.z)).toBeCloseTo(Math.hypot(straight.x, straight.z));
  });

  it('impide atravesar muebles y permite deslizarse por sus bordes', () => {
    const colliders = [{ minX: -1, maxX: 1, minZ: -1, maxZ: 1 }];
    const result = resolveMovement({ x: 0, z: 1.5 }, { x: 0.5, z: -1 }, colliders);
    expect(isFree(result, colliders)).toBe(true);
    expect(result.x).toBeGreaterThan(0);
    expect(result.z).toBeGreaterThanOrEqual(1.27);
  });

  it('no permite salir de la habitación y recupera una posición libre', () => {
    const colliders = [{ minX: -1, maxX: 1, minZ: -1, maxZ: 1 }];
    expect(isFree({ x: 20, z: 0 }, colliders)).toBe(false);
    expect(isFree(nearestFreePoint({ x: 0, z: 0 }, colliders), colliders)).toBe(true);
  });
});
