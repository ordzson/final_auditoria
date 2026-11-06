import * as THREE from 'three';
import { canon } from '../data/canon';
import { getIntroFrame } from '../data/intro';
import { getSimulationFrame } from '../data/simulation';
import { stations, stationForReview } from '../data/stations';
import type { PlayerPose, ReviewId, StationId } from '../audit/types';
import { nearestFreePoint, movementDelta, type Collider } from './collision';
import { chairCollider, pushChairs, slideChairs, type ChairBody } from './chairPhysics';
import { LiaisonAnimator } from './LiaisonAnimator';
import { placeModel } from './models';
import { ScreenPainter } from './screens';
import { OfficeEnvironment } from './OfficeEnvironment';
import { brandTexture } from './branding';

export type InteractionTarget = { kind: 'station'; stationId: StationId } | { kind: 'liaison' };

export type OfficeCallbacks = {
  onInteract: (target: InteractionTarget) => void;
  onJournal: () => void;
  onTargetChange: (target: InteractionTarget | null) => void;
  onPointerLockChange: (locked: boolean) => void;
  onPointerError: () => void;
  onPoseChange: (pose: PlayerPose) => void;
};

type CameraAnchor = { position: [number, number, number]; lookAt: [number, number, number] };

const anchors: Record<string, CameraAnchor> = {
  general: { position: [0, 2.55, 4.65], lookAt: [0, 1.05, -2.2] },
  accesos: { position: [-3.95, 1.52, -1.75], lookAt: [-4.4, 1.4, -3.6] },
  sql_red: { position: [-0.65, 1.52, -2.05], lookAt: [-1.08, 1.4, -3.6] },
  sql_transfer: { position: [0.85, 1.52, -2.05], lookAt: [0.42, 1.4, -3.6] },
  crm_cambios: { position: [-4.08, 1.52, 1.85], lookAt: [-4.5, 1.4, 0] },
  crm_nota: { position: [-2.7, 1.7, 1.7], lookAt: [-4.05, 1.38, 0] },
  siem: { position: [4.25, 1.52, -1.75], lookAt: [3.8, 1.4, -3.6] },
  respaldos: { position: [-1.75, 2.05, 4.15], lookAt: [-4.3, 1.2, 1.15] },
  mesa_auditor: { position: [3.85, 1.52, 4.75], lookAt: [3.4, 1.4, 2.9] },
};

export class OfficeScene {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(50, 1, 0.05, 60);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly canvas: HTMLCanvasElement;
  private readonly colliders: Collider[] = [];
  private readonly chairs: (ChairBody & { group: THREE.Group })[] = [];
  private readonly screens = new Map<string, ScreenPainter>();
  private readonly keys = new Set<string>();
  private readonly raycaster = new THREE.Raycaster();
  private readonly ambient = new THREE.HemisphereLight('#8296a2', '#29383d', 1.25);
  private readonly sun = new THREE.DirectionalLight('#9eb5c4', 1.3);
  private readonly monitorGlow = new THREE.PointLight('#739b9b', 6, 8, 2);
  private readonly hand = new THREE.Group();
  private environment!: OfficeEnvironment;
  private readonly documented = new Set<ReviewId>();
  private mode: 'intro' | 'visit' = 'intro';
  private introTime = 0;
  private lastFrame = 0;
  private lastPoseSave = 0;
  private yaw = 0;
  private pitch = 0;
  private panelOpen = false;
  private computerCamera: { position: THREE.Vector3; quaternion: THREE.Quaternion } | null = null;
  private interviewCamera: { position: THREE.Vector3; quaternion: THREE.Quaternion } | null = null;
  private liaisonLabel: THREE.Object3D | null = null;
  private liaisonAnimator: LiaisonAnimator | null = null;
  private clipboardReceived = false;
  private currentTarget: InteractionTarget | null = null;
  private reducedMotion = false;
  private sensitivity = 1;
  private lastIntroShot = '';
  private lastRenderedIntroTime: number | null = null;
  private needsRender = true;

  constructor(private readonly container: HTMLElement, private readonly callbacks: OfficeCallbacks) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.canvas = this.renderer.domElement;
    this.canvas.id = 'office-canvas';
    this.canvas.setAttribute('aria-label', 'Oficina 3D de revisión del incidente RedNova');
    this.container.appendChild(this.canvas);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);
    this.buildRoom();
    this.buildFurniture();
    this.buildHand();
    this.scene.add(this.ambient);
    this.sun.position.set(6, 4, -0.7);
    this.sun.target.position.set(-3, 0, -1.2);
    this.scene.add(this.sun.target);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.025;
    this.sun.shadow.camera.left = -8;
    this.sun.shadow.camera.right = 8;
    this.sun.shadow.camera.top = 8;
    this.sun.shadow.camera.bottom = -8;
    this.scene.add(this.sun);
    this.monitorGlow.position.set(0, 1.8, -2.5);
    this.scene.add(this.monitorGlow);
    this.setLighting(0);
    this.bindEvents();
    this.resize();
    new ResizeObserver(() => this.resize()).observe(this.container);
    this.renderer.setAnimationLoop((time) => this.frame(time));
  }

  private buildRoom(): void {
    this.environment = new OfficeEnvironment(() => {
      this.renderer.shadowMap.needsUpdate = true;
      this.needsRender = true;
    });
    this.scene.add(this.environment.group);
  }

  private buildFurniture(): void {
    this.createStation('accesos', -4.1, -3.6, 1);
    this.createStation('sql_red', 0, -3.6, 2);
    this.createStation('siem', 4.1, -3.6, 1);
    this.createStation('crm_cambios', -4.2, 0, 1);
    this.createStation('mesa_auditor', 3.7, 2.9, 1);
    this.createRack();
    this.createLiaison();
    this.createCabinet();
    this.colliders.push({ minX: -6.4, maxX: -5.1, minZ: -0.55, maxZ: 0.15 });
    this.addLamp(-5.05, 0.82, -3.65);
    this.addLamp(4.6, 0.82, 2.9);
  }

  private createStation(stationId: StationId, x: number, z: number, monitorCount: number): void {
    const definition = stations.find((station) => station.id === stationId)!;
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.userData.interaction = { kind: 'station', stationId } satisfies InteractionTarget;
    const wood = new THREE.MeshStandardMaterial({ color: '#cfb486', roughness: 0.72 });
    const metal = new THREE.MeshStandardMaterial({ color: '#445256', roughness: 0.65, metalness: 0.25 });
    const width = monitorCount === 2 ? 3 : 2.6;
    this.box(width, 0.12, 1.15, wood, 0, 0.78, 0, group);
    for (const legX of [-width / 2 + 0.16, width / 2 - 0.16]) {
      this.box(0.1, 0.75, 0.1, metal, legX, 0.38, -0.4, group);
      this.box(0.1, 0.75, 0.1, metal, legX, 0.38, 0.4, group);
    }
    for (let index = 0; index < monitorCount; index += 1) {
      const offset = monitorCount === 2 ? (index === 0 ? -0.75 : 0.75) : 0;
      this.createMonitor(group, `${stationId}:${index}`, offset, 1.38, 0, monitorCount === 2 ? 1.25 : 1.45);
    }
    const label = this.textPlane(`${definition.short} · ${definition.title.toUpperCase()}`, '#29383d', '#f4f0e6');
    label.position.set(0, 0.68, 0.59);
    label.scale.set(0.82, 0.62, 1);
    group.add(label);
    this.environment.dressStation(group, width, monitorCount);
    this.scene.add(group);
    this.colliders.push({ minX: x - width / 2, maxX: x + width / 2, minZ: z - 0.64, maxZ: z + 0.64 });
    this.addChair(x, z + 1.08);
  }

  private createMonitor(parent: THREE.Group, key: string, x: number, y: number, z: number, width: number): void {
    const frame = new THREE.MeshStandardMaterial({ color: '#29383d', roughness: 0.55 });
    const stand = new THREE.MeshStandardMaterial({ color: '#46565a', metalness: 0.35, roughness: 0.5 });
    this.box(width + 0.1, 0.86, 0.11, frame, x, y, z, parent);
    this.box(0.09, 0.42, 0.08, stand, x, y - 0.56, z, parent);
    this.box(0.5, 0.04, 0.28, stand, x, y - 0.77, z + 0.03, parent);
    const painter = new ScreenPainter();
    const material = new THREE.MeshBasicMaterial({ map: painter.texture, toneMapped: false });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.75), material);
    screen.position.set(x, y, z + 0.058);
    parent.add(screen);
    this.screens.set(key, painter);
    painter.update('COPIA DE REVISIÓN', ['Registros del expediente disponibles para inspección.'], 'normal', 'initial');
  }

  private createRack(): void {
    const group = new THREE.Group();
    group.position.set(-4.4, 0, 2.8);
    const fallback = new THREE.Group();
    const graphite = new THREE.MeshStandardMaterial({ color: '#29383d', metalness: 0.35, roughness: 0.55 });
    this.box(1.05, 1.8, 0.8, graphite, 0, 0.9, 0, fallback);
    for (let index = 0; index < 6; index += 1) {
      this.box(0.82, 0.06, 0.03, new THREE.MeshStandardMaterial({ color: '#718b88' }), 0, 0.35 + index * 0.23, 0.415, fallback);
    }
    group.add(fallback);
    const label = this.textPlane('E · RESPALDO Y RECUPERACIÓN', '#29383d', '#f4f0e6');
    label.position.set(0, 1.64, 0.48);
    label.scale.set(0.52, 0.55, 1);
    group.add(label);
    this.scene.add(group);
    this.colliders.push({ minX: -4.95, maxX: -3.85, minZ: 2.35, maxZ: 3.25 });
    placeModel(group, {
      path: '/models/rack.glb', size: { x: 1.05, y: 1.85, z: 0.85 }, position: { x: 0, z: 0 },
      onLoaded: () => { fallback.visible = false; this.renderer.shadowMap.needsUpdate = true; },
    });

    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(-3.02, 0, 2.8);
    consoleGroup.userData.interaction = { kind: 'station', stationId: 'respaldos' } satisfies InteractionTarget;
    this.box(1.02, 0.08, 0.68, new THREE.MeshStandardMaterial({ color: '#cfb486', roughness: 0.72 }), 0, 0.78, 0, consoleGroup);
    for (const legX of [-0.42, 0.42]) {
      this.box(0.07, 0.76, 0.07, graphite, legX, 0.38, -0.24, consoleGroup);
      this.box(0.07, 0.76, 0.07, graphite, legX, 0.38, 0.24, consoleGroup);
    }
    const fallbackMonitor = new THREE.Group();
    consoleGroup.add(fallbackMonitor);
    this.createMonitor(fallbackMonitor, 'respaldos:fallback', 0, 1.25, 0, 0.85);
    this.scene.add(consoleGroup);
    this.colliders.push({ minX: -3.56, maxX: -2.48, minZ: 2.42, maxZ: 3.18 });
    placeModel(consoleGroup, {
      path: '/models/rack-monitor/scene.gltf', size: { x: 0.95, y: 0.75, z: 0.4 }, position: { x: 0, y: 0.82, z: 0 },
      onLoaded: (model) => {
        fallbackMonitor.visible = false;
        const screen = model.getObjectByName('Cube_RenderMonitor_0');
        if (screen instanceof THREE.Mesh) {
          const painter = new ScreenPainter();
          screen.material = new THREE.MeshBasicMaterial({ map: painter.texture, toneMapped: false });
          this.screens.set('respaldos:rack', painter);
          painter.update('COPIA DE REVISIÓN', ['Respaldo y recuperación', this.documented.has('AU-05') ? 'Revisión documentada · límites conservados' : 'E · Inspeccionar fuentes'], 'normal', 'rack-monitor');
        }
        this.renderer.shadowMap.needsUpdate = true;
        this.needsRender = true;
      },
    });
  }

  private createCabinet(): void {
    const fallback = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: '#56676a', metalness: 0.3, roughness: 0.6 });
    this.box(0.9, 1.25, 0.55, metal, 0, 0.625, 0, fallback);
    this.scene.add(fallback);
    fallback.position.set(5.65, 0, 1.25);
    this.colliders.push({ minX: 5.15, maxX: 6.15, minZ: 0.9, maxZ: 1.6 });
    placeModel(this.scene, {
      path: '/models/filing-cabinet.glb', size: { x: 0.9, y: 1.3, z: 0.6 }, position: { x: 5.65, z: 1.25 },
      onLoaded: () => { fallback.visible = false; this.renderer.shadowMap.needsUpdate = true; },
    });
  }

  private createLiaison(): void {
    const group = new THREE.Group();
    group.position.set(0.8, 0, 0.75);
    group.userData.interaction = { kind: 'liaison' } satisfies InteractionTarget;
    const fallbackDesk = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: '#cfb486', roughness: 0.72 });
    const metal = new THREE.MeshStandardMaterial({ color: '#445256', roughness: 0.7 });
    this.box(2.2, 0.12, 1.05, wood, 0, 0.78, 0, fallbackDesk);
    this.box(0.1, 0.75, 0.1, metal, -0.95, 0.38, 0, fallbackDesk);
    this.box(0.1, 0.75, 0.1, metal, 0.95, 0.38, 0, fallbackDesk);
    group.add(fallbackDesk);
    const fallbackPerson = new THREE.Group();
    group.add(fallbackPerson);
    const skin = new THREE.MeshStandardMaterial({ color: '#b98768', roughness: 0.9 });
    const shirt = new THREE.MeshStandardMaterial({ color: '#517c78', roughness: 0.85 });
    const hair = new THREE.MeshStandardMaterial({ color: '#343332', roughness: 0.95 });
    this.box(0.55, 0.68, 0.3, shirt, 0, 1.04, -0.7, fallbackPerson);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 16), skin);
    head.position.set(0, 1.56, -0.7);
    head.castShadow = true;
    fallbackPerson.add(head);
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.195, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), hair);
    hairCap.position.set(0, 1.62, -0.7);
    fallbackPerson.add(hairCap);
    const label = this.textPlane('ENLACE DE TI · ENTREVISTA Y TABLITA', '#517c78', '#ffffff');
    this.liaisonLabel = label;
    label.position.set(0, 0.68, 0.57);
    label.scale.set(0.85, 0.65, 1);
    group.add(label);
    this.scene.add(group);
    this.colliders.push({ minX: -0.35, maxX: 1.95, minZ: 0.15, maxZ: 1.35 });
    placeModel(group, {
      path: '/models/fbi-agent/scene.gltf', size: { x: 2, y: 1.8, z: 1 }, position: { x: 0, z: -0.7 },
      onLoaded: (model) => {
        fallbackPerson.visible = false;
        this.liaisonAnimator = new LiaisonAnimator(model);
        this.renderer.shadowMap.needsUpdate = true;
        this.needsRender = true;
      },
    });
    placeModel(group, {
      path: '/models/desk.glb', size: { x: 2.2, y: 1.25, z: 1.1 }, position: { x: 0, z: 0 },
      onLoaded: () => { fallbackDesk.visible = false; this.renderer.shadowMap.needsUpdate = true; },
    });
  }

  private addChair(x: number, z: number): void {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = Math.PI;
    this.scene.add(group);
    this.chairs.push({ x, z, velocity: { x: 0, z: 0 }, group });
    const fallback = new THREE.Group();
    const fabric = new THREE.MeshStandardMaterial({ color: '#4a5c5f', roughness: 0.85 });
    this.box(0.55, 0.12, 0.55, fabric, 0, 0.48, 0, fallback);
    this.box(0.55, 0.65, 0.12, fabric, 0, 0.82, -0.24, fallback);
    group.add(fallback);
    placeModel(group, {
      path: '/models/chair.glb', size: { x: 0.65, y: 1.05, z: 0.65 }, position: { x: 0, z: 0 },
      onLoaded: () => { fallback.visible = false; this.renderer.shadowMap.needsUpdate = true; this.needsRender = true; },
    });
  }

  private addLamp(x: number, y: number, z: number): void {
    if (x > 0) {
      const light = new THREE.PointLight('#ffcf91', 2.4, 2.8, 2);
      light.position.set(x, y + 0.48, z);
      this.scene.add(light);
    }
    const fallback = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: '#536467', metalness: 0.4 });
    this.box(0.3, 0.04, 0.3, metal, 0, 0.02, 0, fallback);
    this.box(0.04, 0.5, 0.04, metal, 0, 0.27, 0, fallback);
    fallback.position.set(x, y, z);
    this.scene.add(fallback);
    placeModel(this.scene, {
      path: '/models/lamp.glb', size: { x: 0.45, y: 0.65, z: 0.45 }, position: { x, y, z },
      onLoaded: () => { fallback.visible = false; this.renderer.shadowMap.needsUpdate = true; },
    });
  }

  private buildHand(): void {
    const board = new THREE.MeshStandardMaterial({ color: '#a8895d', roughness: 0.85, depthTest: false });
    const paper = new THREE.MeshStandardMaterial({ color: '#f4f0e6', roughness: 1, depthTest: false });
    const clip = new THREE.MeshStandardMaterial({ color: '#71817f', metalness: 0.5, depthTest: false });
    const skin = new THREE.MeshStandardMaterial({ color: '#b98768', roughness: 0.9, depthTest: false });
    const sleeve = new THREE.MeshStandardMaterial({ color: '#395a60', roughness: 0.9, depthTest: false });
    this.box(0.36, 0.46, 0.025, board, 0, 0, 0, this.hand);
    this.box(0.32, 0.4, 0.012, paper, 0, -0.012, 0.02, this.hand);
    this.box(0.15, 0.05, 0.035, clip, 0, 0.225, 0.025, this.hand);
    for (let index = 0; index < 5; index += 1) {
      this.box(0.22, 0.012, 0.008, clip, 0.015, 0.12 - index * 0.062, 0.03, this.hand);
    }
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 12), skin);
    palm.scale.set(1, 1.35, 0.7);
    palm.position.set(-0.13, -0.25, 0.02);
    this.hand.add(palm);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.36, 16), sleeve);
    arm.rotation.z = -0.5;
    arm.position.set(-0.24, -0.42, -0.02);
    this.hand.add(arm);
    this.hand.position.set(0.43, -0.37, -0.75);
    this.hand.rotation.set(-0.25, -0.2, -0.12);
    this.hand.visible = false;
    this.hand.traverse((object) => {
      object.userData.ignoreRaycast = true;
      object.renderOrder = 100;
    });
    this.camera.add(this.hand);
  }

  private textPlane(text: string, _background: string, _foreground: string): THREE.Mesh {
    const texture = brandTexture(text, 'OPERACIONES / REVISIÓN', () => { this.needsRender = true; });
    return new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.396), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  }

  private box(width: number, height: number, depth: number, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  private setLighting(visitBlend: number): void {
    const nightTop = new THREE.Color('#8296a2');
    const dayTop = new THREE.Color('#eaf0f5');
    const nightGround = new THREE.Color('#29383d');
    const dayGround = new THREE.Color('#a69b89');
    this.ambient.color.copy(nightTop.lerp(dayTop, visitBlend));
    this.ambient.groundColor.copy(nightGround.lerp(dayGround, visitBlend));
    this.ambient.intensity = 0.65 + visitBlend * 0.8;
    this.sun.color.copy(new THREE.Color('#9eb5c4').lerp(new THREE.Color('#fff0d8'), visitBlend));
    this.sun.intensity = 0.75 + visitBlend * 1.35;
    this.monitorGlow.intensity = 3 - visitBlend * 1.5;
    this.scene.background = new THREE.Color('#17262e').lerp(new THREE.Color('#68756c'), visitBlend);
    this.renderer.toneMappingExposure = 0.95 + visitBlend * 0.13;
  }

  setIntroTime(time: number): void {
    this.introTime = time;
  }

  setMode(mode: 'intro' | 'visit', pose?: PlayerPose): void {
    this.mode = mode;
    this.lastRenderedIntroTime = null;
    this.needsRender = true;
    this.clearKeys();
    if (mode === 'intro') {
      this.lastIntroShot = '';
      this.hand.visible = false;
      if (document.pointerLockElement === this.canvas) document.exitPointerLock();
      return;
    }
    const restored = nearestFreePoint(pose ?? { x: 0, z: 4.4 }, this.movementColliders());
    this.camera.position.set(restored.x, 1.65, restored.z);
    this.yaw = pose?.yaw ?? 0;
    this.pitch = pose?.pitch ?? 0;
    this.camera.rotation.set(this.pitch, this.yaw, 0);
    this.setLighting(1);
    this.hand.visible = this.clipboardReceived && !this.panelOpen;
    this.showVisitScreens();
  }

  setClipboardReceived(received: boolean): void {
    this.clipboardReceived = received;
    this.hand.visible = received && this.mode === 'visit' && !this.panelOpen;
    this.needsRender = true;
  }

  setDocumented(reviewIds: ReviewId[]): void {
    this.documented.clear();
    reviewIds.forEach((id) => this.documented.add(id));
    if (this.mode === 'visit') this.showVisitScreens();
    this.needsRender = true;
  }

  setPreferences(reducedMotion: boolean, sensitivity: number): void {
    const motionChanged = this.reducedMotion !== reducedMotion;
    if (motionChanged) {
      this.lastRenderedIntroTime = null;
      this.needsRender = true;
    }
    this.reducedMotion = reducedMotion;
    this.sensitivity = sensitivity;
    if (motionChanged) this.liaisonAnimator?.update(0, this.camera, this.interviewCamera !== null, reducedMotion);
  }

  playLiaisonResponse(): void {
    if (this.mode !== 'visit' || this.reducedMotion || document.hidden || this.container.classList.contains('is-flat')) return;
    this.liaisonAnimator?.respond();
    this.needsRender = true;
  }

  setPanelOpen(open: boolean): void {
    this.panelOpen = open;
    this.needsRender = true;
    this.clearKeys();
    this.hand.visible = this.clipboardReceived && this.mode === 'visit' && !open;
    if (open && document.pointerLockElement === this.canvas) document.exitPointerLock();
  }

  /** Encuadre de lectura: no cambia ni guarda la pose del jugador. */
  setComputerView(open: boolean): void {
    if (this.mode !== 'visit') return;
    if (open && !this.computerCamera) {
      this.computerCamera = { position: this.camera.position.clone(), quaternion: this.camera.quaternion.clone() };
      this.camera.position.set(...anchors.general.position);
      this.camera.lookAt(new THREE.Vector3(...anchors.general.lookAt));
    } else if (!open && this.computerCamera) {
      this.camera.position.copy(this.computerCamera.position);
      this.camera.quaternion.copy(this.computerCamera.quaternion);
      this.computerCamera = null;
    }
    this.needsRender = true;
  }

  /** Primer plano del interlocutor; al salir recupera la pose de exploración. */
  setInterviewView(open: boolean): void {
    if (this.mode !== 'visit') return;
    if (open && !this.interviewCamera) {
      this.interviewCamera = { position: this.camera.position.clone(), quaternion: this.camera.quaternion.clone() };
      this.camera.position.set(1.4, 1.62, 2.5);
      this.camera.lookAt(new THREE.Vector3(1.4, 1.4, 0.05));
    } else if (!open && this.interviewCamera) {
      this.camera.position.copy(this.interviewCamera.position);
      this.camera.quaternion.copy(this.interviewCamera.quaternion);
      this.interviewCamera = null;
    }
    if (this.liaisonLabel) this.liaisonLabel.visible = !open;
    this.needsRender = true;
  }

  requestControl(): void {
    if (this.mode !== 'visit' || this.panelOpen) return;
    try {
      Promise.resolve(this.canvas.requestPointerLock()).catch(() => this.callbacks.onPointerError());
    } catch {
      this.callbacks.onPointerError();
    }
  }

  moveToStation(stationId: StationId): void {
    const points: Record<StationId, PlayerPose> = {
      accesos: { x: -4.1, z: -2.2, yaw: 0, pitch: 0 },
      sql_red: { x: 0, z: -2.15, yaw: 0, pitch: 0 },
      crm_cambios: { x: -4.2, z: 1.35, yaw: 0, pitch: 0 },
      siem: { x: 4.1, z: -2.15, yaw: 0, pitch: 0 },
      respaldos: { x: -3.02, z: 3.85, yaw: 0, pitch: 0 },
      mesa_auditor: { x: 3.7, z: 4.15, yaw: 0, pitch: 0 },
    };
    const requested = points[stationId];
    const free = nearestFreePoint(requested, this.movementColliders());
    this.camera.position.set(free.x, 1.65, free.z);
    this.yaw = requested.yaw;
    this.pitch = 0;
    this.camera.rotation.set(0, 0, 0);
    this.emitPose();
  }

  private frame(time: number): void {
    if (document.hidden || this.container.classList.contains('is-flat')) {
      this.lastFrame = 0;
      return;
    }
    if (this.lastFrame && time - this.lastFrame < 1000 / 30) return;
    const elapsed = this.lastFrame ? Math.min(0.5, Math.max(0, (time - this.lastFrame) / 1000)) : 0;
    this.lastFrame = time;
    if (this.mode === 'intro') {
      if (this.lastRenderedIntroTime === this.introTime && !this.needsRender && !this.renderer.shadowMap.needsUpdate) return;
      this.lastRenderedIntroTime = this.introTime;
      this.applyIntro(this.introTime);
    } else {
      this.lastRenderedIntroTime = null;
      const liaisonActive = !this.panelOpen || this.interviewCamera !== null;
      const liaisonAnimating = liaisonActive && (this.liaisonAnimator?.update(elapsed, this.camera, this.interviewCamera !== null, this.reducedMotion) ?? false);
      const controlled = !this.panelOpen && document.pointerLockElement === this.canvas;
      const chairsMoving = !this.panelOpen && slideChairs(this.chairs, this.colliders, this.camera.position, elapsed);
      if (chairsMoving) this.syncChairs();
      if (!controlled) this.changeTarget(null);
      if (!controlled && !chairsMoving && !liaisonAnimating && !this.needsRender && !this.renderer.shadowMap.needsUpdate) return;
      if (controlled) {
        this.updateMovement(elapsed);
        this.updateTarget();
        if (time - this.lastPoseSave > 2500) {
          this.emitPose();
          this.lastPoseSave = time;
        }
      }
    }
    this.needsRender = false;
    this.renderer.render(this.scene, this.camera);
  }

  private applyIntro(time: number): void {
    const frame = getIntroFrame(time);
    let anchorName = frame.shot.anchor;
    if (frame.shot.id === 'P04' && frame.localTime >= 7) anchorName = 'sql_transfer';
    if (frame.shot.id === 'P09') anchorName = 'crm_cambios';
    if (frame.shot.id === 'P08') anchorName = 'crm_nota';
    if (frame.shot.id === 'P10' && frame.localTime >= 12) anchorName = 'general';
    const anchor = anchors[anchorName];
    this.camera.position.set(...anchor.position);
    this.camera.lookAt(new THREE.Vector3(...anchor.lookAt));
    const visitBlend = frame.shot.id === 'P10' ? Math.max(0, Math.min(1, (frame.localTime - 10) / 2)) : 0;
    this.setLighting(visitBlend);
    if (this.lastIntroShot !== frame.shot.id) {
      this.lastIntroShot = frame.shot.id;
      for (const [key, painter] of this.screens) {
        const stationId = key.split(':')[0] as StationId;
        painter.update('REGISTROS DEL EXPEDIENTE', [stations.find((station) => station.id === stationId)?.title ?? 'Revisión'], 'normal', `${frame.shot.id}-base`);
      }
    }
    this.updateIntroScreens(time);
  }

  private updateIntroScreens(time: number): void {
    const frame = getIntroFrame(time);
    const simulation = getSimulationFrame(time, this.reducedMotion);
    // Rebuild both SQL monitors from time, including when scrubbing backwards.
    if (frame.shot.id === 'P04') {
      this.screens.get('sql_red:0')?.animate(getSimulationFrame(Math.min(time, 29.99), this.reducedMotion));
      if (frame.localTime < 7) this.screens.get('sql_red:1')?.animate(getSimulationFrame(30, this.reducedMotion));
    }
    if (frame.noteVisible) {
      const note = canon.presentation.ransomNote;
      this.screens.get(simulation.screen)?.update(note.title, [...note.body.split('\n'), note.visibleLabel], 'critical', 'intro-ransom-note');
    } else {
      this.screens.get(simulation.screen)?.animate(simulation);
    }
  }

  private showVisitScreens(): void {
    for (const [key, painter] of this.screens) {
      const stationId = key.split(':')[0] as StationId;
      const station = stations.find((item) => item.id === stationId);
      if (!station) continue;
      const documented = this.documented.has(station.reviewId);
      painter.update('COPIA DE REVISIÓN', [station.title, documented ? 'Revisión documentada · límites conservados' : 'E · Inspeccionar fuentes'], 'normal', `visit-${documented}`);
    }
  }

  private movementColliders(): Collider[] {
    return [...this.colliders, ...this.chairs.map((chair) => chairCollider(chair))];
  }

  private syncChairs(): void {
    for (const chair of this.chairs) chair.group.position.set(chair.x, 0, chair.z);
    this.renderer.shadowMap.needsUpdate = true;
    this.needsRender = true;
  }

  private updateMovement(elapsed: number): void {
    const forward = Number(this.keys.has('KeyW') || this.keys.has('ArrowUp')) - Number(this.keys.has('KeyS') || this.keys.has('ArrowDown'));
    const right = Number(this.keys.has('KeyD') || this.keys.has('ArrowRight')) - Number(this.keys.has('KeyA') || this.keys.has('ArrowLeft'));
    const steps = Math.max(1, Math.ceil(elapsed / 0.05));
    for (let step = 0; step < steps; step += 1) {
      const delta = movementDelta(forward, right, this.yaw, elapsed / steps);
      const current = { x: this.camera.position.x, z: this.camera.position.z };
      const next = pushChairs(current, delta, this.colliders, this.chairs, elapsed / steps);
      this.camera.position.x = next.x;
      this.camera.position.z = next.z;
    }
    if (forward || right) this.syncChairs();
  }

  private updateTarget(): void {
    if (this.panelOpen || document.pointerLockElement !== this.canvas) {
      this.changeTarget(null);
      return;
    }
    this.camera.updateMatrixWorld();
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    this.raycaster.far = 3;
    const hits = this.raycaster.intersectObjects(this.scene.children, true);
    let target: InteractionTarget | null = null;
    for (const hit of hits) {
      if (hit.object.userData.ignoreRaycast) continue;
      let object: THREE.Object3D | null = hit.object;
      while (object && !object.userData.interaction) object = object.parent;
      if (object?.userData.interaction) target = object.userData.interaction as InteractionTarget;
      break;
    }
    this.changeTarget(target);
  }

  private changeTarget(target: InteractionTarget | null): void {
    const previous = JSON.stringify(this.currentTarget);
    if (previous === JSON.stringify(target)) return;
    this.currentTarget = target;
    this.callbacks.onTargetChange(target);
  }

  private bindEvents(): void {
    window.addEventListener('keydown', (event) => {
      const element = event.target as HTMLElement | null;
      if (element?.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (this.mode !== 'visit' || this.panelOpen) return;
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        if (document.pointerLockElement === this.canvas) event.preventDefault();
        this.keys.add(event.code);
      }
      if (event.code === 'KeyE' && !event.repeat && this.currentTarget) {
        event.preventDefault();
        this.callbacks.onInteract(this.currentTarget);
      }
      if (event.code === 'KeyJ' && !event.repeat) this.callbacks.onJournal();
    });
    window.addEventListener('keyup', (event) => this.keys.delete(event.code));
    window.addEventListener('blur', () => this.clearKeys());
    document.addEventListener('visibilitychange', () => {
      this.clearKeys();
      this.lastFrame = performance.now();
    });
    document.addEventListener('mousemove', (event) => {
      if (this.mode !== 'visit' || this.panelOpen || document.pointerLockElement !== this.canvas) return;
      const scale = 0.0018 * this.sensitivity;
      this.yaw -= event.movementX * scale;
      this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch - event.movementY * scale));
      this.camera.rotation.set(this.pitch, this.yaw, 0);
    });
    document.addEventListener('pointerlockchange', () => {
      this.clearKeys();
      this.callbacks.onPointerLockChange(document.pointerLockElement === this.canvas);
    });
    document.addEventListener('pointerlockerror', () => this.callbacks.onPointerError());
    this.canvas.addEventListener('click', () => {
      if (this.mode === 'visit' && !this.panelOpen && document.pointerLockElement !== this.canvas) this.requestControl();
    });
  }

  private clearKeys(): void {
    this.keys.clear();
  }

  private emitPose(): void {
    this.callbacks.onPoseChange({ x: this.camera.position.x, z: this.camera.position.z, yaw: this.yaw, pitch: this.pitch });
  }

  private resize(): void {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.lastRenderedIntroTime = null;
    this.needsRender = true;
  }

  dispose(): void {
    this.renderer.setAnimationLoop(null);
    this.environment.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }

  get isReducedMotion(): boolean {
    return this.reducedMotion;
  }

  stationFor(reviewId: ReviewId): StationId {
    return stationForReview(reviewId).id;
  }
}
