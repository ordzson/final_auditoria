import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
const cache = new Map<string, Promise<THREE.Group>>();
let pendingLoads = 0;

export function modelsLoading(): boolean { return pendingLoads > 0; }

function load(path: string): Promise<THREE.Group> {
  if (!cache.has(path)) {
    pendingLoads++;
    cache.set(path, loader.loadAsync(path).then((gltf) => gltf.scene).finally(() => { pendingLoads--; }));
  }
  return cache.get(path)!;
}

export type ModelPlacement = {
  path: string;
  size: { x: number; y: number; z: number };
  position: { x: number; y?: number; z: number };
  rotationY?: number;
  onLoaded?: (model: THREE.Group) => void;
  onError?: () => void;
};

export function placeModel(parent: THREE.Object3D, placement: ModelPlacement): void {
  void load(placement.path).then((source) => {
    // Los personajes necesitan huesos propios al clonar el modelo almacenado.
    const model = clone(source);
    // Actualizar todos los huesos antes de medir una malla con esqueleto.
    model.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    if (!size.x || !size.y || !size.z) throw new Error('Modelo vacío');
    model.position.set(-center.x, -bounds.min.y, -center.z);
    const wrapper = new THREE.Group();
    wrapper.add(model);
    const scale = Math.min(
      placement.size.x / size.x,
      placement.size.y / size.y,
      placement.size.z / size.z,
    );
    wrapper.scale.setScalar(scale);
    wrapper.position.set(placement.position.x, placement.position.y ?? 0, placement.position.z);
    wrapper.rotation.y = placement.rotationY ?? 0;
    wrapper.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    parent.add(wrapper);
    placement.onLoaded?.(wrapper);
  }).catch((error: unknown) => {
    console.warn(`No se pudo cargar el modelo ${placement.path}; se conserva la geometría de respaldo.`, error);
    placement.onError?.();
  });
}
