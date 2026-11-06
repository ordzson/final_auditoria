import { expect, test } from '@playwright/test';

test('las sillas cargadas conservan su hitbox, orientación y posición al deslizarse', async ({ page }) => {
  await page.route('**/chairs-physics-harness', (route) => route.fulfill({
    contentType: 'text/html', body: '<!doctype html><html><body style="margin:0"></body></html>',
  }));
  await page.goto('/chairs-physics-harness');
  const result = await page.evaluate(async () => {
    const scenePath = '/src/scene/OfficeScene.ts';
    const physicsPath = '/src/scene/chairPhysics.ts';
    const threePath = '/node_modules/three/build/three.module.js';
    const { OfficeScene } = await import(scenePath);
    const { pushChairs, slideChairs, CHAIR_RADIUS } = await import(physicsPath);
    const THREE = await import(threePath);
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;z-index:9999';
    document.body.append(container);
    const noop = () => undefined;
    const office = new OfficeScene(container, {
      onInteract: noop, onJournal: noop, onTargetChange: noop,
      onPointerLockChange: noop, onPointerError: noop, onPoseChange: noop,
    });
    office.renderer.setAnimationLoop(null);
    office.setMode('visit');
    const deadline = performance.now() + 15000;
    while (office.chairs.some((body: { group: { children: unknown[] } }) => body.group.children.length < 2)) {
      if (performance.now() > deadline) throw new Error('No se cargaron los modelos de las sillas');
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    const initial = office.chairs.map((body: { x: number; z: number; group: { rotation: { y: number } } }) => ({
      x: body.x, z: body.z, rotation: body.group.rotation.y,
    }));
    const body = office.chairs[0];
    // Push sideways in the aisle, then render the same moving group that owns the GLB.
    const player = pushChairs({ x: body.x - 0.7, z: body.z }, { x: 0.1175, z: 0 }, office.colliders, office.chairs, 0.05);
    slideChairs(office.chairs, office.colliders, player, 0.2);
    office.syncChairs();
    office.camera.position.set(-2, 2.55, 2);
    office.camera.lookAt(-1, 0.7, -2);
    office.renderer.render(office.scene, office.camera);
    const bounds = new THREE.Box3().setFromObject(body.group);
    return {
      initial,
      moved: body.x > initial[0].x + 0.1,
      visualMatchesBody: Math.abs(bounds.getCenter(new THREE.Vector3()).x - body.x) < 1e-5,
      contained: bounds.min.x >= body.x - CHAIR_RADIUS && bounds.max.x <= body.x + CHAIR_RADIUS
        && bounds.min.z >= body.z - CHAIR_RADIUS && bounds.max.z <= body.z + CHAIR_RADIUS,
      fallbackHidden: !body.group.children[0].visible,
    };
  });
  expect(result.initial.map((body: { z: number }) => body.z)).toEqual([-2.52, -2.52, -2.52, 1.08, 3.98]);
  expect(result.initial.every((body: { rotation: number }) => body.rotation === Math.PI)).toBe(true);
  expect(result.moved).toBe(true);
  expect(result.visualMatchesBody).toBe(true);
  expect(result.contained).toBe(true);
  expect(result.fallbackHidden).toBe(true);
  await page.screenshot({ path: test.info().outputPath('sillas-oficina.png') });
});
