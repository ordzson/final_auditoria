import { PLAYER_RADIUS, ROOM_BOUNDS, WALK_SPEED, type Collider, type Point2 } from './collision';

export const CHAIR_RADIUS = 0.36;
export type ChairBody = Point2 & { velocity: Point2 };
type Axis = 'x' | 'z';
const EPSILON = 1e-8;

export function chairCollider(point: Point2, radius = CHAIR_RADIUS): Collider {
  return { minX: point.x - radius, maxX: point.x + radius, minZ: point.z - radius, maxZ: point.z + radius };
}

// Sweep each axis to the first contact, including every chair in a push chain.
// Clamping travel to the available gap prevents tunnelling even on long frames.
function moveAxis(body: Point2, radius: number, axis: Axis, distance: number,
  obstacles: Collider[], chairs: ChairBody[], speed: number, visited = new Set<Point2>()): number {
  if (Math.abs(distance) < EPSILON) return 0;
  visited.add(body);
  const other = axis === 'x' ? 'z' : 'x';
  const min = axis === 'x' ? 'minX' : 'minZ';
  const max = axis === 'x' ? 'maxX' : 'maxZ';
  const otherMin = axis === 'x' ? 'minZ' : 'minX';
  const otherMax = axis === 'x' ? 'maxZ' : 'maxX';
  const sign = Math.sign(distance);
  let travel = Math.min(Math.abs(distance), Math.max(0, sign > 0
    ? ROOM_BOUNDS[max] - body[axis] - radius
    : body[axis] - radius - ROOM_BOUNDS[min]));
  const gapTo = (box: Collider): number | null => {
    if (body[other] + radius <= box[otherMin] + EPSILON
      || body[other] - radius >= box[otherMax] - EPSILON) return null;
    if (sign > 0 && box[max] <= body[axis] - radius + EPSILON) return null;
    if (sign < 0 && box[min] >= body[axis] + radius - EPSILON) return null;
    return Math.max(0, sign > 0 ? box[min] - body[axis] - radius : body[axis] - radius - box[max]);
  };
  for (const box of obstacles) {
    const gap = gapTo(box);
    if (gap !== null) travel = Math.min(travel, gap);
  }
  const contacts = chairs.filter((chair) => chair !== body)
    .map((chair) => ({ chair, gap: gapTo(chairCollider(chair)) }))
    .filter((contact): contact is { chair: ChairBody; gap: number } => contact.gap !== null)
    .sort((a, b) => a.gap - b.gap);
  for (const { chair, gap } of contacts) {
    if (travel <= gap + EPSILON) continue;
    if (visited.has(chair)) {
      travel = Math.min(travel, gap);
      continue;
    }
    const pushed = Math.abs(moveAxis(chair, CHAIR_RADIUS, axis, sign * (travel - gap), obstacles, chairs, speed, visited));
    travel = Math.min(travel, gap + pushed);
    chair.velocity[axis] = pushed > EPSILON ? sign * Math.min(WALK_SPEED, speed) : 0;
  }
  visited.delete(body);
  body[axis] += sign * travel;
  return sign * travel;
}

export function pushChairs(position: Point2, delta: Point2, obstacles: Collider[], chairs: ChairBody[], elapsed: number): Point2 {
  const next = { ...position };
  for (const axis of ['x', 'z'] as const) {
    moveAxis(next, PLAYER_RADIUS, axis, delta[axis], obstacles, chairs,
      Math.min(WALK_SPEED, Math.abs(delta[axis]) / Math.max(elapsed, EPSILON)));
  }
  return next;
}

export function slideChairs(chairs: ChairBody[], obstacles: Collider[], player: Point2, elapsed: number): boolean {
  const duration = Math.min(0.5, Math.max(0, elapsed));
  const steps = Math.max(1, Math.ceil(duration / (1 / 120)));
  const dt = duration / steps;
  const blockers = [...obstacles, chairCollider(player, PLAYER_RADIUS)];
  let moved = false;
  for (let step = 0; step < steps; step += 1) {
    for (const chair of chairs) {
      for (const axis of ['x', 'z'] as const) {
        const distance = chair.velocity[axis] * dt;
        const actual = moveAxis(chair, CHAIR_RADIUS, axis, distance, blockers, chairs, Math.abs(chair.velocity[axis]));
        moved ||= Math.abs(actual) > EPSILON;
        chair.velocity[axis] = Math.abs(actual - distance) > EPSILON ? 0 : chair.velocity[axis] * Math.exp(-3.5 * dt);
        if (Math.abs(chair.velocity[axis]) < 0.01) chair.velocity[axis] = 0;
      }
    }
  }
  return moved;
}
