import * as THREE from 'three';
import { expect, it, vi } from 'vitest';
import { placeModel } from '../src/scene/models';

const { loadAsync, setMeshoptDecoder } = vi.hoisted(() => ({ loadAsync: vi.fn(), setMeshoptDecoder: vi.fn() }));
vi.mock('three/addons/loaders/GLTFLoader.js', () => ({
  GLTFLoader: class { loadAsync = loadAsync; setMeshoptDecoder = setMeshoptDecoder; },
}));

it('coloca personajes a escala con esqueletos independientes, incluso desde caché', async () => {
  expect(setMeshoptDecoder).toHaveBeenCalledWith(expect.objectContaining({ decodeGltfBuffer: expect.any(Function) }));
  const source = new THREE.Group();
  source.scale.setScalar(0.0254);
  source.rotation.x = -Math.PI / 2;
  const bone = new THREE.Bone();
  bone.position.set(0, 10, 0);
  const geometry = new THREE.BoxGeometry(20, 20, 80);
  const count = geometry.attributes.position.count;
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(count * 4), 4));
  const weights = new Float32Array(count * 4);
  for (let index = 0; index < count; index += 1) weights[index * 4] = 1;
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4));
  const mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshStandardMaterial());
  source.add(bone, mesh);
  source.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton([bone]));
  loadAsync.mockResolvedValue({ scene: source });

  const parent = new THREE.Group();
  const place = (x: number) => new Promise<THREE.Group>((resolve, reject) => placeModel(parent, {
    path: '/skeletal-character.gltf', size: { x: 2, y: 1.8, z: 1 }, position: { x, z: -0.7 },
    onLoaded: resolve, onError: () => reject(new Error('No se pudo colocar el personaje')),
  }));
  const first = await place(0.8);
  const second = await place(3);

  for (const [model, x] of [[first, 0.8], [second, 3]] as const) {
    model.updateMatrixWorld(true);
    // Medir la geometría deformada, sin reutilizar la caja calculada al cargar.
    const bounds = new THREE.Box3().setFromObject(model, true);
    expect(bounds.getSize(new THREE.Vector3()).y).toBeCloseTo(1.8);
    expect(bounds.min.y).toBeCloseTo(0);
    expect(bounds.getCenter(new THREE.Vector3()).x).toBeCloseTo(x);
    expect(bounds.getCenter(new THREE.Vector3()).z).toBeCloseTo(-0.7);
    const skin = model.getObjectsByProperty('isSkinnedMesh', true)[0] as THREE.SkinnedMesh;
    expect(model.getObjectById(skin.skeleton.bones[0].id)).toBe(skin.skeleton.bones[0]);
    expect(skin.skeleton.bones[0]).not.toBe(bone);
  }
  const firstSkin = first.getObjectsByProperty('isSkinnedMesh', true)[0] as THREE.SkinnedMesh;
  const secondSkin = second.getObjectsByProperty('isSkinnedMesh', true)[0] as THREE.SkinnedMesh;
  expect(firstSkin.skeleton.bones[0]).not.toBe(secondSkin.skeleton.bones[0]);
  expect(loadAsync).toHaveBeenCalledTimes(1);
});
