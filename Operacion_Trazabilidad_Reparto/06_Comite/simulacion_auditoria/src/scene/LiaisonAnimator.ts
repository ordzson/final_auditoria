import * as THREE from 'three';

const boneNames = [
  'spine_2_70', 'spine_3_65', 'neck_0_3', 'head_0_0',
  'clavicle_l_33', 'clavicle_r_63',
  'arm_upper_l_30', 'arm_upper_r_60',
  'arm_lower_l_27', 'arm_lower_r_57',
  'hand_l_24', 'hand_r_54',
] as const;

type BoneName = typeof boneNames[number];
type Offset = [number, number, number];
type Binding = { bone: THREE.Bone; rest: THREE.Quaternion };

const restOffsets: Partial<Record<BoneName, Offset>> = {
  arm_upper_l_30: [0, 0, -0.32],
  arm_upper_r_60: [0, 0, -0.32],
  arm_lower_l_27: [0.08, 0, -0.16],
  arm_lower_r_57: [-0.08, 0, -0.16],
};

const gestures = [
  { duration: 2.35, yaw: 0.11, tilt: -0.035, shoulder: -0.025, upper: 0.025, lower: 1.2, open: 0.85, hand: 1.1, left: false },
  { duration: 2.65, yaw: -0.1, tilt: 0.045, shoulder: 0.022, upper: 0.02, lower: 1.15, open: 0.65, hand: -1, left: true },
  { duration: 2.85, yaw: 0.075, tilt: 0.05, shoulder: 0.025, upper: 0.025, lower: 1.05, open: 0.7, hand: 0.95, left: false },
];

const smoothstep = (from: number, to: number, value: number) => {
  const t = THREE.MathUtils.clamp((value - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
};

export class LiaisonAnimator {
  private readonly bindings = new Map<BoneName, Binding>();
  private readonly offset = new THREE.Quaternion();
  private readonly target = new THREE.Quaternion();
  private readonly euler = new THREE.Euler();
  private readonly headPosition = new THREE.Vector3();
  private readonly cameraPosition = new THREE.Vector3();
  private time = 0;
  private gestureTime = Infinity;
  private gestureIndex = 0;
  private responseCount = 0;
  private glanceTime = Infinity;
  private nextGlance = 4.8;
  private glanceYaw = 0;
  private glancePitch = 0;
  private glanceTilt = 0;
  private glanceShoulder = 0;
  private glanceHand = 0;
  private glanceLeft = false;
  private wasReduced = false;

  constructor(private readonly model: THREE.Group) {
    for (const name of boneNames) {
      const bone = model.getObjectByName(name);
      if (bone instanceof THREE.Bone) this.bindings.set(name, { bone, rest: bone.quaternion.clone() });
    }
    this.applyStaticPose();
  }

  respond(): void {
    this.gestureIndex = this.responseCount % gestures.length;
    this.responseCount += 1;
    this.gestureTime = 0;
  }

  update(elapsed: number, camera: THREE.Camera, interview: boolean, reducedMotion: boolean): boolean {
    if (!this.bindings.size) return false;
    if (reducedMotion) {
      if (!this.wasReduced) this.applyStaticPose();
      this.wasReduced = true;
      return false;
    }
    this.wasReduced = false;
    const delta = Math.max(0, elapsed);
    const blend = 1 - Math.exp(-delta * 9);
    this.time += delta;
    this.gestureTime += delta;
    this.updateGlance(delta);

    const breath = Math.sin(this.time * 1.25) * 0.0065;
    const shoulderBreath = Math.sin(this.time * 1.25 + 0.7) * 0.005;
    const gesture = gestures[this.gestureIndex];
    const progress = Math.min(1, this.gestureTime / gesture.duration);
    const headWeight = smoothstep(0, 0.16, progress) * (1 - smoothstep(0.52, 0.9, progress));
    const armWeight = smoothstep(0.06, 0.28, progress) * (1 - smoothstep(0.6, 1, progress));
    const handWeight = smoothstep(0.14, 0.36, progress) * (1 - smoothstep(0.56, 0.94, progress));
    const glanceWeight = this.glanceTime < 1 ? Math.sin(this.glanceTime * Math.PI) ** 2 : 0;
    const idleShoulder = this.glanceShoulder * glanceWeight;
    const idleHand = this.glanceHand * glanceWeight;
    const gaze = this.gaze(camera, interview);
    const responseUpper = gesture.upper * armWeight;
    const responseLower = gesture.lower * armWeight;
    const responseOpen = gesture.open * armWeight;
    const responseHand = gesture.hand * handWeight;
    const responseHead = (gesture.yaw + Math.sin(progress * Math.PI * 2) * 0.025) * headWeight;

    this.pose('spine_2_70', breath, 0, 0, blend);
    this.pose('spine_3_65', breath * 0.55, 0, 0, blend);
    this.pose('clavicle_l_33', 0, 0, shoulderBreath + (gesture.left ? gesture.shoulder * armWeight : 0) + (this.glanceLeft ? idleShoulder : 0), blend);
    this.pose('clavicle_r_63', 0, 0, -shoulderBreath + (!gesture.left ? gesture.shoulder * armWeight : 0) + (!this.glanceLeft ? idleShoulder : 0), blend);
    this.pose('arm_upper_l_30', 0, 0, restOffsets.arm_upper_l_30![2] + (gesture.left ? responseUpper : 0), blend);
    this.pose('arm_upper_r_60', 0, 0, restOffsets.arm_upper_r_60![2] + (!gesture.left ? responseUpper : 0), blend);
    this.pose('arm_lower_l_27', restOffsets.arm_lower_l_27![0] + (gesture.left ? responseLower : 0), 0, restOffsets.arm_lower_l_27![2] + (gesture.left ? responseUpper * 0.5 + responseOpen : 0), blend);
    this.pose('arm_lower_r_57', restOffsets.arm_lower_r_57![0] - (!gesture.left ? responseLower : 0), 0, restOffsets.arm_lower_r_57![2] - (!gesture.left ? responseUpper * 0.5 + responseOpen : 0), blend);
    this.pose('hand_l_24', 0, (gesture.left ? responseHand : 0) + (this.glanceLeft ? idleHand : 0), 0, blend);
    this.pose('hand_r_54', 0, (!gesture.left ? responseHand : 0) + (!this.glanceLeft ? idleHand : 0), 0, blend);
    this.pose('neck_0_3', gaze.pitch * 0.2, gaze.yaw * 0.22, this.glanceTilt * glanceWeight * 0.2, blend);
    this.pose(
      'head_0_0',
      gaze.yaw * 0.78 + this.glanceYaw * glanceWeight + responseHead,
      gaze.pitch * 0.8 + this.glancePitch * glanceWeight,
      this.glanceTilt * glanceWeight + gesture.tilt * headWeight,
      blend,
    );
    return true;
  }

  private gaze(camera: THREE.Camera, interview: boolean): { yaw: number; pitch: number } {
    const head = this.bindings.get('head_0_0')?.bone;
    if (!head) return { yaw: 0, pitch: 0 };
    head.getWorldPosition(this.headPosition);
    this.model.worldToLocal(this.headPosition);
    camera.getWorldPosition(this.cameraPosition);
    this.model.worldToLocal(this.cameraPosition);
    const offset = this.cameraPosition.sub(this.headPosition);
    if (offset.z < 0.15) return { yaw: 0, pitch: 0 };
    const yawLimit = interview ? 0.42 : 0.3;
    const yaw = Math.atan2(offset.x, offset.z);
    const pitch = Math.atan2(offset.y, Math.hypot(offset.x, offset.z));
    return {
      yaw: Math.tanh(yaw / yawLimit) * yawLimit,
      pitch: Math.tanh(pitch / 0.16) * 0.16,
    };
  }

  private updateGlance(delta: number): void {
    if (this.time >= this.nextGlance) {
      this.glanceTime = 0;
      this.nextGlance = this.time + 6.5 + Math.random() * 6;
      this.glanceYaw = (Math.random() - 0.5) * 0.16;
      this.glancePitch = (Math.random() - 0.5) * 0.03;
      this.glanceTilt = (Math.random() > 0.5 ? 1 : -1) * (0.025 + Math.random() * 0.025);
      this.glanceShoulder = (Math.random() - 0.5) * 0.035;
      this.glanceLeft = Math.random() > 0.5;
      this.glanceHand = Math.random() > 0.55 ? (Math.random() - 0.5) * 0.07 : 0;
    } else {
      this.glanceTime += delta / 3.4;
    }
  }

  private applyStaticPose(): void {
    for (const { bone, rest } of this.bindings.values()) bone.quaternion.copy(rest);
    for (const [name, offset] of Object.entries(restOffsets) as [BoneName, Offset][]) {
      this.pose(name, ...offset, 1);
    }
  }

  private pose(name: BoneName, x: number, y: number, z: number, blend: number): void {
    const binding = this.bindings.get(name);
    if (!binding) return;
    this.offset.setFromEuler(this.euler.set(x, y, z));
    this.target.copy(binding.rest).multiply(this.offset);
    binding.bone.quaternion.slerp(this.target, blend);
  }
}
