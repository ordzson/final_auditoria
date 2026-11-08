import * as THREE from 'three';
import { placeModel } from './models';
import { brandTexture, redNova } from './branding';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Arquitectura y utilería ilustrativas: nunca se incorporan al expediente.
export class OfficeEnvironment {
  readonly group = new THREE.Group();
  private readonly steel = new THREE.MeshStandardMaterial({ color: '#596363', roughness: 0.78, metalness: 0.45 });
  private readonly dark = new THREE.MeshStandardMaterial({ color: '#262e2c', roughness: 0.9 });
  private readonly paint = new THREE.MeshStandardMaterial({ color: '#385b60', roughness: 0.95 });
  private readonly warm = new THREE.MeshStandardMaterial({ color: '#b99b59', roughness: 0.9 });

  constructor(private readonly invalidate: () => void) {
    this.group.name = 'Oficina industrial · ambientación ilustrativa';
    this.architecture();
    this.services();
    this.dressing();
    this.batchArchitecture();
  }

  /** La arquitectura es estática: agrupar por material evita cientos de draw calls. */
  private batchArchitecture(): void {
    this.group.updateMatrixWorld(true);
    const batches = new Map<string, { material: THREE.Material; shadows: boolean; receive: boolean; geometries: THREE.BufferGeometry[] }>();
    const meshes: THREE.Mesh[] = [];
    this.group.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || Array.isArray(object.material)) return;
      meshes.push(object);
      const key = `${object.material.uuid}/${object.castShadow}/${object.receiveShadow}`;
      if (!batches.has(key)) batches.set(key, { material: object.material, shadows: object.castShadow, receive: object.receiveShadow, geometries: [] });
      batches.get(key)!.geometries.push(object.geometry.clone().applyMatrix4(object.matrixWorld));
    });
    for (const mesh of meshes) { mesh.removeFromParent(); mesh.geometry.dispose(); }
    for (const batch of batches.values()) {
      const geometry = mergeGeometries(batch.geometries);
      batch.geometries.forEach((part) => part.dispose());
      if (!geometry) continue;
      const mesh = new THREE.Mesh(geometry, batch.material);
      mesh.castShadow = batch.shadows;
      mesh.receiveShadow = batch.receive;
      mesh.userData.environmentGeometry = true;
      this.group.add(mesh);
    }
  }

  private box(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = this.group): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  /** Texturas deterministas de materiales; sin descargas ni imágenes externas. */
  private surface(kind: 'wall' | 'floor' | 'ceiling'): THREE.MeshStandardMaterial {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    let seed = 73;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    ctx.fillStyle = kind === 'floor' ? '#b5ad9d' : kind === 'wall' ? '#e1dcd0' : '#d3d3ca';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 16000; i++) {
      ctx.fillStyle = random() > 0.5 ? `rgba(38,35,26,${random() * 0.07})` : `rgba(241,232,203,${random() * 0.12})`;
      ctx.fillRect(random() * 512, random() * 512, 1 + random() * 5, 1 + random() * 3);
    }
    if (kind !== 'wall') {
      ctx.strokeStyle = '#87877e';
      ctx.lineWidth = kind === 'floor' ? 3 : 5;
      ctx.strokeRect(1, 1, 510, 510);
      if (kind === 'floor') {
        for (let i = 0; i < 65; i++) {
          ctx.strokeStyle = 'rgba(38,41,34,0.12)';
          const x = random() * 512, y = random() * 512;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + random() * 45, y + random() * 8); ctx.stroke();
        }
      }
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(kind === 'wall' ? 4 : 13, kind === 'wall' ? 1 : 10);
    map.anisotropy = 4;
    return new THREE.MeshStandardMaterial({ map, roughness: 0.96 });
  }

  private architecture(): void {
    this.box(13.2, 0.12, 10.2, this.surface('floor'), 0, -0.06, 0);
    const plaster = this.surface('wall');
    this.box(13.2, 3.3, 0.14, plaster, 0, 1.65, -5.05);
    this.box(0.14, 3.3, 10.2, plaster, -6.55, 1.65, 0);
    // Muro derecho dividido alrededor de un hueco real de 3.2 × 1.68 m.
    this.box(0.36, 3.3, 2.8, plaster, 6.55, 1.65, -3.7);
    this.box(0.36, 3.3, 4.2, plaster, 6.55, 1.65, 3.0);
    this.box(0.36, 1.12, 3.2, plaster, 6.55, 0.56, -0.7);
    this.box(0.36, 0.5, 3.2, plaster, 6.55, 3.05, -0.7);
    for (const x of [-4.25, 4.25]) this.box(4.7, 3.3, 0.14, plaster, x, 1.65, 5.05);
    this.box(3.8, 0.6, 0.14, plaster, 0, 3, 5.05);
    this.box(13.2, 0.12, 10.2, this.surface('ceiling'), 0, 3.36, 0);
    // Zócalo de pintura utilitaria y juntas estructurales.
    this.box(13, 1.08, 0.035, this.paint, 0, 0.55, -4.96);
    for (const x of [-6.46, 6.355]) {
      this.box(0.035, 1.08, 10, this.paint, x, 0.55, 0);
      this.box(0.05, 0.055, 10, this.steel, x, 1.12, 0);
      this.box(0.08, 0.13, 10, this.dark, x, 0.07, 0);
    }
    this.box(13, 0.055, 0.045, this.steel, 0, 1.12, -4.93);
    this.box(13, 0.13, 0.08, this.dark, 0, 0.07, -4.93);
    for (const x of [-6.25, -2.05, 2.05, 6.25]) {
      this.box(0.18, 3.3, 0.2, this.steel, x, 1.65, -4.87);
      this.box(0.18, 0.2, 9.9, this.steel, x, 3.2, 0);
    }
    // Vestíbulo cerrado fuera del área transitable existente.
    this.box(3.8, 2.7, 0.08, this.dark, 0, 1.35, 5.15);
    for (const x of [-0.78, 0.78]) {
      this.box(1.48, 2.5, 0.09, this.paint, x, 1.25, 5.07);
      this.box(0.7, 0.65, 0.04, this.dark, x, 1.78, 5);
      this.box(1.15, 0.07, 0.08, this.steel, x, 1.05, 4.97);
    }
    // Hueco profundo: el paisaje queda a seis metros del vidrio, en el exterior.
    const window = new THREE.Group();
    window.position.set(6.38, 1.96, -0.7);
    window.rotation.y = -Math.PI / 2;
    const exterior = new THREE.TextureLoader().load('/environment/city-godzilla-chief-samus.png', () => this.invalidate());
    exterior.colorSpace = THREE.SRGBColorSpace;
    exterior.anisotropy = 4;
    const vista = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 6.2), new THREE.MeshBasicMaterial({ map: exterior, toneMapped: false }));
    vista.position.set(-2.6, 0.1, -6);
    vista.name = 'Exterior distante · ciudad y terraza';
    window.add(vista);
    // Fondo de cielo tras el decorado; nunca deja ver el vacío de la escena.
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(100, 60), new THREE.MeshBasicMaterial({ color: '#b8cede', toneMapped: false }));
    sky.position.set(0, 4, -6.2);
    window.add(sky);
    // Jambas y dintel revelan el espesor del muro al moverse ante la ventana.
    const reveal = new THREE.MeshStandardMaterial({ color: '#d6d7d0', roughness: 0.85 });
    for (const x of [-1.59, 1.59]) this.box(0.08, 1.68, 0.44, reveal, x, 0, -0.15, window);
    this.box(3.2, 0.08, 0.44, reveal, 0, 0.83, -0.15, window);
    this.box(3.4, 0.10, 0.64, reveal, 0, -0.85, 0, window);
    // Alféizar exterior: una referencia próxima con paralaje frente a la ciudad.
    this.box(4.3, 0.14, 0.85, this.steel, 0, -0.94, -0.64, window);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.55), new THREE.MeshPhysicalMaterial({
      color: '#c5dce6', roughness: 0.12, metalness: 0.05, clearcoat: 1,
      transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide,
    }));
    glass.position.z = -0.08;
    glass.castShadow = false;
    glass.receiveShadow = false;
    window.add(glass);
    for (const x of [-1.58, 0, 1.58]) this.box(0.055, 1.68, 0.16, this.steel, x, 0, 0.02, window);
    for (const y of [-0.82, 0.82]) this.box(3.25, 0.065, 0.18, this.steel, 0, y, 0.02, window);
    // Persiana más recogida para que el hueco y el exterior dominen la vista.
    for (let i = 0; i < 4; i++) {
      const slat = this.box(3.1, 0.018, 0.12, this.paint, 0, 0.72 - i * 0.085, 0.16, window);
      slat.rotation.x = -0.35;
    }
    for (const x of [-1.35, 1.35]) this.box(0.012, 0.32, 0.012, this.warm, x, 0.59, 0.2, window);
    this.group.add(window);
    this.sign('RED NOVA', 'OPERACIONES / REVISIÓN', 0, 2.15, -4.91, 3.1, 1.03);
    this.sign('SALIDA', 'ACCESO A OFICINAS', 0, 2.94, 4.93, 1.55, 0.3, Math.PI);
    this.sign('ÁREA TÉCNICA', 'MANTENER EL PASO LIBRE', -6.37, 2.2, 2.5, 1.7, 0.5, Math.PI / 2);
  }

  private pipe(from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material = this.steel): void {
    const delta = to.clone().sub(from);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 10), material);
    mesh.position.copy(from).add(to).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    mesh.castShadow = true; this.group.add(mesh);
  }

  private services(): void {
    // Conductos, acometidas y abrazaderas a escala arquitectónica.
    this.box(12.7, 0.3, 0.46, this.steel, 0, 2.98, -4.55);
    for (const x of [-5.7, -3, 0, 3, 5.7]) {
      this.box(0.045, 0.34, 0.5, this.dark, x, 2.98, -4.55);
      this.box(0.75, 0.2, 0.03, this.dark, x, 2.96, -4.3);
      for (let i = 0; i < 7; i++) this.box(0.025, 0.18, 0.035, this.steel, x - 0.3 + i * 0.1, 2.96, -4.27);
    }
    for (const z of [-4.4, -4.12]) {
      this.pipe(new THREE.Vector3(-6.2, 2.66, z), new THREE.Vector3(6.2, 2.66, z), 0.055);
      for (const x of [-5.6, -2, 2, 5.6]) this.box(0.045, 0.22, 0.15, this.dark, x, 2.66, z);
    }
    this.pipe(new THREE.Vector3(-6.25, 0.12, -1.5), new THREE.Vector3(-6.25, 2.66, -1.5), 0.065);
    this.box(0.12, 0.68, 0.46, this.steel, -6.3, 1.45, -1.5);
    // Luz neutra distribuida bajo cada luminaria; sin parpadeos ni sombras extra.
    const tube = new THREE.MeshStandardMaterial({ color: '#fff4df', emissive: '#fff0d4', emissiveIntensity: 1.8 });
    for (const x of [-3.5, 3.5]) {
      for (const z of [-2.35, 2.05]) {
        this.box(1.8, 0.09, 0.4, this.dark, x, 3.19, z);
        for (const offset of [-0.11, 0.11]) this.box(1.64, 0.035, 0.065, tube, x, 3.13, z + offset);
        const light = new THREE.PointLight('#fff2dc', 17, 7.5, 2);
        light.position.set(x, 2.86, z); this.group.add(light);
      }
    }
    const daylight = new THREE.PointLight('#dcecf7', 24, 10, 2);
    daylight.position.set(5.8, 2.2, -0.7); this.group.add(daylight);
    const amber = new THREE.MeshStandardMaterial({ color: '#e6ba6c', emissive: '#ffb45c', emissiveIntensity: 1.6 });
    this.box(0.24, 0.16, 0.16, amber, -5.7, 2.55, 3.8);
    const lamp = new THREE.PointLight('#ffc17b', 9, 4, 2);
    lamp.position.set(-5.45, 2.35, 3.65); this.group.add(lamp);
    // Canalización eléctrica pegada a la pared, lejos del recorrido.
    this.box(12.5, 0.08, 0.08, this.steel, 0, 0.42, -4.83);
    for (const x of [-4.1, 0, 4.1]) {
      this.box(0.22, 0.16, 0.1, this.dark, x, 0.42, -4.78);
      this.pipe(new THREE.Vector3(x, 0.42, -4.72), new THREE.Vector3(x, 0.55, -4.2), 0.018, this.dark);
    }
  }

  private sign(title: string, subtitle: string, x: number, y: number, z: number, w: number, h: number, rotation = 0): void {
    const map = brandTexture(title, subtitle, this.invalidate, title === 'RED NOVA');
    const material = new THREE.MeshStandardMaterial({ map, roughness: 0.65, emissive: redNova.paper, emissiveMap: map, emissiveIntensity: 0.12 });
    const frame = this.box(w + 0.045, h + 0.045, 0.035, this.dark, x - Math.sin(rotation) * 0.025, y, z - Math.cos(rotation) * 0.025);
    frame.rotation.y = rotation;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
    mesh.position.set(x, y, z); mesh.rotation.y = rotation; this.group.add(mesh);
  }

  private prop(name: string, x: number, y: number, z: number, w: number, h: number, d: number, rotationY = 0, parent: THREE.Object3D = this.group): void {
    placeModel(parent, { path: `/models/office-props/${name}.glb`, size: { x: w, y: h, z: d }, position: { x, y, z }, rotationY, onLoaded: this.invalidate });
  }

  private dressing(): void {
    // Todo el mobiliario nuevo queda en el perímetro, fuera del paso del jugador.
    this.box(1.2, 0.06, 0.6, this.steel, -5.75, 1.5, -0.2);
    this.box(1.2, 0.06, 0.6, this.steel, -5.75, 0.65, -0.2);
    for (const x of [-6.28, -5.22]) this.box(0.05, 1.85, 0.5, this.steel, x, 0.94, -0.2);
    this.prop('cardboardBoxClosed', -5.92, 0.68, -0.2, 0.55, 0.55, 0.48);
    this.prop('cardboardBoxOpen', -5.65, 1.54, -0.2, 0.7, 0.5, 0.48);
    this.prop('books', -5.35, 0.68, -0.2, 0.3, 0.4, 0.35);
    this.prop('radio', -5.8, 1.54, 0.04, 0.38, 0.24, 0.2);
    // Cuadro de corcho con hojas anónimas: ambientación sin resultados ficticios.
    const cork = new THREE.MeshStandardMaterial({ color: '#8e7350', roughness: 1 });
    const paper = new THREE.MeshStandardMaterial({ color: '#cec8af', roughness: 1 });
    this.box(0.08, 1.05, 1.7, this.steel, -6.37, 2.04, -2.85);
    this.box(0.09, 0.96, 1.61, cork, -6.35, 2.04, -2.85);
    for (let i = 0; i < 5; i++) {
      const sheet = this.box(0.01, 0.32, 0.22, paper, -6.29, 2.25 - (i % 2) * 0.39, -3.4 + i * 0.24);
      sheet.rotation.x = (i - 2) * 0.035;
    }
    // Panel acústico y jardineras fuera de las rutas transitables.
    const oak = new THREE.MeshStandardMaterial({ color: '#b89772', roughness: 0.86 });
    for (let i = 0; i < 13; i++) this.box(0.075, 1.45, 0.075, oak, 2.65 + i * 0.22, 1.96, -4.9);
    this.sign('RED NOVA', 'OPERACIONES / REVISIÓN', 6.36, 2.12, 2.9, 2.1, 0.7, -Math.PI / 2);
    const leaves = new THREE.MeshStandardMaterial({ color: '#477361', roughness: 0.95, side: THREE.DoubleSide });
    for (const [x, z] of [[5.95, -4.4], [6.0, 4.45]]) {
      this.box(0.48, 0.48, 0.48, this.paint, x, 0.24, z);
      for (let i = 0; i < 7; i++) {
        const angle = i * Math.PI * 2 / 7;
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), leaves);
        leaf.scale.set(0.32, 2.6, 0.75);
        leaf.position.set(x + Math.cos(angle) * 0.16, 0.85 + (i % 3) * 0.1, z + Math.sin(angle) * 0.16);
        leaf.rotation.set(Math.sin(angle) * 0.35, angle, Math.cos(angle) * 0.35);
        this.group.add(leaf);
      }
    }
    // Marcas de seguridad alrededor del rack, sin obstaculizar la consola.
    for (let i = 0; i < 8; i++) {
      const stripe = this.box(0.12, 0.008, 0.25, i % 2 ? this.dark : this.warm, -5.07 + i * 0.19, 0.006, 3.35);
      stripe.rotation.y = -0.35;
    }
  }

  dressStation(parent: THREE.Group, width: number, index: number): void {
    const mat = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.29), new THREE.MeshStandardMaterial({
      map: brandTexture('RED NOVA', 'OPERACIONES / REVISIÓN', this.invalidate, true), roughness: 0.95,
    }));
    mat.userData.environmentGeometry = true;
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(0.15, 0.844, 0.31);
    parent.add(mat);
    this.prop('computerKeyboard', 0, 0.85, 0.33, 0.6, 0.06, 0.2, 0, parent);
    this.prop('computerMouse', 0.54, 0.85, 0.33, 0.1, 0.06, 0.16, 0.12, parent);
    const tower = this.box(0.29, 0.5, 0.46, this.dark, width / 2 - 0.34, 0.3, 0.02, parent);
    for (let i = 0; i < 5; i++) this.box(0.21, 0.013, 0.015, this.steel, tower.position.x, 0.25 + i * 0.035, 0.26, parent);
    this.box(0.025, 0.025, 0.02, new THREE.MeshBasicMaterial({ color: '#9ebc78' }), tower.position.x + 0.08, 0.48, 0.26, parent);
    const paper = new THREE.MeshStandardMaterial({ color: '#d7d0b9', roughness: 1 });
    for (let i = 0; i < 3; i++) {
      const sheet = this.box(0.23, 0.003, 0.31, paper, -width / 2 + 0.33, 0.845 + i * 0.004, 0.28, parent);
      sheet.rotation.y = -0.15 + i * 0.1;
    }
    this.prop('books', -width / 2 + 0.32, 0.85, -0.25, 0.3, 0.23, 0.25, index * 0.13, parent);
  }

  dispose(): void {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    // Los modelos importados comparten recursos con la caché: pertenecen al cargador.
    this.group.traverse((object) => {
      if (!(object instanceof THREE.Mesh) || !object.userData.environmentGeometry) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        if ((material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) && material.map) textures.add(material.map);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
  }
}
