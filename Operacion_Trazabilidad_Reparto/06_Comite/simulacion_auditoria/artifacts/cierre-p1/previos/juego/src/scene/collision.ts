export type Point2 = { x: number; z: number };
export type Collider = { minX: number; maxX: number; minZ: number; maxZ: number };

export const ROOM_BOUNDS = { minX: -6.35, maxX: 6.35, minZ: -4.55, maxZ: 4.75 };
export const PLAYER_RADIUS = 0.27;
export const WALK_SPEED = 2.35;

export function isFree(point: Point2, colliders: Collider[], radius = PLAYER_RADIUS): boolean {
  if (point.x - radius < ROOM_BOUNDS.minX || point.x + radius > ROOM_BOUNDS.maxX
    || point.z - radius < ROOM_BOUNDS.minZ || point.z + radius > ROOM_BOUNDS.maxZ) return false;
  return !colliders.some((box) => point.x + radius > box.minX && point.x - radius < box.maxX
    && point.z + radius > box.minZ && point.z - radius < box.maxZ);
}

export function movementDelta(forward: number, right: number, yaw: number, elapsed: number): Point2 {
  const length = Math.hypot(forward, right);
  if (length === 0) return { x: 0, z: 0 };
  const normalizedForward = forward / Math.max(1, length);
  const normalizedRight = right / Math.max(1, length);
  const distance = WALK_SPEED * Math.min(0.05, Math.max(0, elapsed));
  return {
    x: (normalizedRight * Math.cos(yaw) - normalizedForward * Math.sin(yaw)) * distance,
    z: (-normalizedRight * Math.sin(yaw) - normalizedForward * Math.cos(yaw)) * distance,
  };
}

export function resolveMovement(position: Point2, delta: Point2, colliders: Collider[]): Point2 {
  const withX = { x: position.x + delta.x, z: position.z };
  if (isFree(withX, colliders)) position = withX;
  const withZ = { x: position.x, z: position.z + delta.z };
  if (isFree(withZ, colliders)) position = withZ;
  return position;
}

export function nearestFreePoint(point: Point2, colliders: Collider[]): Point2 {
  if (isFree(point, colliders)) return point;
  for (let radius = 0.35; radius <= 3; radius += 0.35) {
    for (let step = 0; step < 16; step += 1) {
      const angle = (step / 16) * Math.PI * 2;
      const candidate = { x: point.x + Math.cos(angle) * radius, z: point.z + Math.sin(angle) * radius };
      if (isFree(candidate, colliders)) return candidate;
    }
  }
  return { x: 0, z: 4.4 };
}
