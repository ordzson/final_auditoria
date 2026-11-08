import { describe, expect, it } from 'vitest';
import { CHAIR_RADIUS, chairCollider, pushChairs, slideChairs, type ChairBody } from '../src/scene/chairPhysics';
import { isFree, PLAYER_RADIUS, ROOM_BOUNDS, type Collider, type Point2 } from '../src/scene/collision';

const chair = (x: number, z: number): ChairBody => ({ x, z, velocity: { x: 0, z: 0 } });
const desk: Collider = { minX: -1.3, maxX: 1.3, minZ: -0.64, maxZ: 0.64 };
const farPlayer = { x: -6, z: 4 };

function expectClear(chairs: ChairBody[], obstacles: Collider[], player: Point2): void {
  for (const body of chairs) {
    // Tolerance only accounts for arithmetic at exact contact.
    expect(isFree(body, [...obstacles, chairCollider(player, PLAYER_RADIUS),
      ...chairs.filter((other) => other !== body).map((other) => chairCollider(other))], CHAIR_RADIUS - 1e-7)).toBe(true);
  }
  expect(isFree(player, [...obstacles, ...chairs.map((body) => chairCollider(body))], PLAYER_RADIUS - 1e-7)).toBe(true);
}

describe('sillas con colisión y deslizamiento', () => {
  it('nace frente al escritorio sin tocarlo y se detiene al empujar hacia él', () => {
    const chairs = [chair(0, 1.08)];
    const player = pushChairs({ x: 0, z: 2 }, { x: 0, z: -3 }, [desk], chairs, 0.05);
    expect(chairs[0].z).toBeCloseTo(1);
    expect(player.z).toBeCloseTo(1 + CHAIR_RADIUS + PLAYER_RADIUS);
    expectClear(chairs, [desk], player);
  });

  it('continúa deslizándose después del contacto y se frena con fricción', () => {
    const chairs = [chair(0, 0)];
    const player = pushChairs({ x: -0.7, z: 0 }, { x: 0.1175, z: 0 }, [], chairs, 0.05);
    expect(chairs[0].x).toBeGreaterThan(0);
    expect(chairs[0].velocity.x).toBeGreaterThan(0);
    const pushedX = chairs[0].x;
    for (let i = 0; i < 240; i += 1) slideChairs(chairs, [], player, 1 / 60);
    expect(chairs[0].x).toBeGreaterThan(pushedX + 0.3);
    expect(chairs[0].velocity.x).toBe(0);
    expectClear(chairs, [], player);
  });

  it.each(['x', 'z'] as const)('bloquea cadenas contra ambas paredes del eje %s sin atravesarlas', (axis) => {
    for (const sign of [-1, 1]) {
      const chairs = [chair(0, 0), chair(0, 0), chair(0, 0)];
      chairs.forEach((body, index) => { body[axis] = sign * index * 0.8; });
      const start = { x: 0, z: 0 };
      start[axis] = -sign;
      const delta = { x: 0, z: 0 };
      delta[axis] = sign * 30;
      const player = pushChairs(start, delta, [], chairs, 0.05);
      const boundary = axis === 'x' ? (sign > 0 ? ROOM_BOUNDS.maxX : ROOM_BOUNDS.minX)
        : (sign > 0 ? ROOM_BOUNDS.maxZ : ROOM_BOUNDS.minZ);
      expect(chairs[2][axis]).toBeCloseTo(boundary - sign * CHAIR_RADIUS);
      for (let i = 0; i < 30; i += 1) slideChairs(chairs, [], player, 0.5);
      expectClear(chairs, [], player);
    }
  });

  it('permite deslizar por el borde del escritorio y bloquea el eje que choca', () => {
    const chairs = [chair(0, 1)];
    chairs[0].velocity = { x: 2, z: -2 };
    slideChairs(chairs, [desk], farPlayer, 0.2);
    expect(chairs[0].x).toBeGreaterThan(0.2);
    expect(chairs[0].z).toBeCloseTo(1);
    expectClear(chairs, [desk], farPlayer);
  });

  it('no atraviesa al jugador al deslizarse ni con un salto de tiempo', () => {
    const chairs = [chair(0, 0)];
    chairs[0].velocity.x = 20;
    const player = { x: 1, z: 0 };
    slideChairs(chairs, [], player, 10);
    expect(chairs[0].x).toBeCloseTo(1 - CHAIR_RADIUS - PLAYER_RADIUS);
    expect(chairs[0].velocity.x).toBe(0);
    expectClear(chairs, [], player);
  });

  it('mantiene separadas sillas que chocan entre sí y una cadena ramificada', () => {
    const chairs = [chair(0, 0), chair(0.8, -0.4), chair(0.8, 0.4), chair(1.6, 0)];
    const player = pushChairs({ x: -1, z: 0 }, { x: 10, z: 0 }, [], chairs, 0.05);
    for (let i = 0; i < 180; i += 1) {
      slideChairs(chairs, [], player, i % 2 ? 1 / 30 : 1 / 60);
      expectClear(chairs, [], player);
    }
  });

  it('resiste empujes diagonales repetidos con escritorios, esquinas y varias sillas', () => {
    const chairs = [chair(0, 1.08), chair(0.8, 1.08), chair(-0.8, 1.08)];
    let player = { x: 0, z: 2 };
    let seed = 7;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
    for (let i = 0; i < 3000; i += 1) {
      const elapsed = i % 3 ? 1 / 60 : 0.05;
      slideChairs(chairs, [desk], player, elapsed);
      player = pushChairs(player, { x: (random() - 0.5) * 0.25, z: (random() - 0.5) * 0.25 }, [desk], chairs, elapsed);
      expectClear(chairs, [desk], player);
    }
  });
});
