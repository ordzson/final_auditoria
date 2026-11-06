import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { LiaisonAnimator } from '../src/scene/LiaisonAnimator';

function rig() {
  const model = new THREE.Group();
  const names = [
    'spine_2_70', 'spine_3_65', 'neck_0_3', 'head_0_0',
    'clavicle_l_33', 'clavicle_r_63', 'arm_upper_l_30', 'arm_upper_r_60',
    'arm_lower_l_27', 'arm_lower_r_57', 'hand_l_24', 'hand_r_54', 'leg_upper_l_78',
  ];
  for (const name of names) {
    const bone = new THREE.Bone();
    bone.name = name;
    model.add(bone);
  }
  model.getObjectByName('head_0_0')!.position.y = 1.6;
  model.updateMatrixWorld(true);
  return model;
}

const cameraBehind = new THREE.PerspectiveCamera();
cameraBehind.position.set(0, 1.6, -3);

describe('animación procedural del enlace de TI', () => {
  it('mantiene una pose natural estática con movimiento reducido sin mover las piernas', () => {
    const model = rig();
    const animator = new LiaisonAnimator(model);
    const arm = model.getObjectByName('arm_upper_l_30')!;
    const head = model.getObjectByName('head_0_0')!;
    const leg = model.getObjectByName('leg_upper_l_78')!;
    const originalArm = new THREE.Quaternion();
    const originalLeg = leg.quaternion.clone();
    arm.quaternion.copy(originalArm);

    animator.update(0.1, cameraBehind, false, true);
    expect(arm.quaternion.angleTo(originalArm)).toBeGreaterThan(0.1);
    expect(head.quaternion.angleTo(new THREE.Quaternion())).toBe(0);
    expect(leg.quaternion.equals(originalLeg)).toBe(true);

    const staticPose = model.children.map((bone) => bone.quaternion.clone());
    animator.respond();
    animator.update(1, cameraBehind, true, true);
    model.children.forEach((bone, index) => expect(bone.quaternion.equals(staticPose[index])).toBe(true));
  });

  it('mueve un brazo y la cabeza, interrumpe sin saltos y regresa a la escucha', () => {
    const model = rig();
    const animator = new LiaisonAnimator(model);
    const head = model.getObjectByName('head_0_0')!;
    const arm = model.getObjectByName('arm_lower_r_57')!;
    const restingArm = arm.quaternion.clone();
    animator.respond();
    animator.update(0.35, cameraBehind, true, false);
    expect(head.quaternion.angleTo(new THREE.Quaternion())).toBeGreaterThan(0.01);
    expect(arm.quaternion.angleTo(restingArm)).toBeGreaterThan(0.05);

    const before = head.quaternion.clone();
    animator.respond();
    animator.update(1 / 60, cameraBehind, true, false);
    expect(head.quaternion.angleTo(before)).toBeLessThan(0.02);

    for (let frame = 0; frame < 180; frame += 1) animator.update(1 / 60, cameraBehind, true, false);
    expect(head.quaternion.angleTo(new THREE.Quaternion())).toBeLessThan(0.005);
    expect(arm.quaternion.angleTo(restingArm)).toBeLessThan(0.005);
  });

  it('presenta la palma en las tres variantes sin mover la otra mano', () => {
    const model = rig();
    const animator = new LiaisonAnimator(model);
    const left = model.getObjectByName('hand_l_24')!;
    const right = model.getObjectByName('hand_r_54')!;

    for (const active of [right, left, right]) {
      animator.respond();
      animator.update(1, cameraBehind, true, false);
      const inactive = active === right ? left : right;
      expect(Math.abs(active.rotation.y)).toBeGreaterThan(0.8);
      expect(inactive.quaternion.angleTo(new THREE.Quaternion())).toBeLessThan(0.001);
    }
  });

  it('calcula los brazos desde la misma base sin acumular rotaciones', () => {
    const model = rig();
    const animator = new LiaisonAnimator(model);
    const arm = model.getObjectByName('arm_upper_l_30')!;
    animator.update(1, cameraBehind, false, false);
    const settled = arm.quaternion.clone();
    for (let frame = 0; frame < 120; frame += 1) animator.update(1 / 60, cameraBehind, false, false);
    expect(arm.quaternion.angleTo(settled)).toBeLessThan(0.0001);
  });
});
