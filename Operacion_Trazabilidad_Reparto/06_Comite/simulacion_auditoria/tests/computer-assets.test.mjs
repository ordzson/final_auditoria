import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { computerAssets, computerIcons } from '../src/data/computerAssets';
import { stations } from '../src/data/stations';

const manifest = JSON.parse(readFileSync(new URL('../public/computers/manifest.json', import.meta.url), 'utf8'));
const inventory = JSON.parse(readFileSync(new URL('../docs/inventario-assets.json', import.meta.url), 'utf8'));
const readAsset = (url) => readFileSync(new URL(`../public${url}`, import.meta.url));

describe('recursos locales de las computadoras · etapa 0', () => {
  it('mantiene las seis asignaciones fijadas y Server solo en respaldos', () => {
    expect(Object.keys(computerAssets.stations).sort()).toEqual(stations.map((station) => station.id).sort());
    expect(Object.values(computerAssets.stations).map((station) => station.wallpaper)).toEqual([
      '/computers/wallpapers/xp-bliss.jpg',
      '/computers/wallpapers/xp-professional-azul.jpg',
      '/computers/wallpapers/xp-isla-tropical.jpg',
      '/computers/wallpapers/stonehenge.jpg',
      '/computers/wallpapers/camino-otonal.jpg',
      '/computers/wallpapers/duna-roja-luna.jpg',
    ]);
    expect(Object.entries(computerAssets.stations).filter(([, station]) => station.theme === 'server-classic')
      .map(([id]) => id)).toEqual(['respaldos']);
    expect(new Set(Object.values(computerAssets.stations).map((station) => station.wallpaper)).size).toBe(6);
  });

  it('coteja todas las copias/variantes y su procedencia contra el inventario', () => {
    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.files.length).toBeGreaterThan(13);
    expect(new Set(manifest.files.map((file) => file.url)).size).toBe(manifest.files.length);
    for (const file of manifest.files) {
      expect(file.url).toMatch(/^\/(computers|models\/rack-monitor)\//);
      expect(file.url).not.toContain('..');
      const data = readAsset(file.url);
      expect(data.byteLength, file.url).toBe(file.bytes);
      expect(createHash('sha256').update(data).digest('hex'), file.url).toBe(file.sha256);
      const original = inventory.assets.find((asset) => asset.name === file.source);
      expect(original?.sha256, file.source).toBe(file.sourceSha256);
      if (file.archiveMember) {
        const member = original?.archive?.members.find((entry) => entry.path === file.archiveMember);
        expect(member?.sha256, file.archiveMember).toBe(file.memberSha256);
      }
      if (file.transform === 'copia exacta') {
        expect(file.sha256, file.url).toBe(file.memberSha256 ?? file.sourceSha256);
      }
    }
  });

  it('publica las dos fuentes, la bandera y los recursos de todos los puestos', () => {
    const urls = new Set(manifest.files.map((file) => file.url));
    const expected = [
      computerAssets.fonts.regular, computerAssets.fonts.bold, computerAssets.branding.windowsFlag,
      computerAssets.rackMonitor.model, computerAssets.rackMonitor.license,
      ...Object.values(computerAssets.stations).map((station) => station.wallpaper),
    ];
    for (const url of expected) expect(urls.has(url), url).toBe(true);
    expect(manifest.files.find((file) => file.url === computerAssets.fonts.regular)?.archiveMember)
      .toBe('Tahoma Regular font.ttf');
    expect(manifest.files.find((file) => file.url === computerAssets.fonts.bold)?.archiveMember).toBe('TAHOMAB0.TTF');
  });

  it('ofrece iconos nativos transparentes y registra el ICO exacto de cada rol', () => {
    expect(Object.keys(computerIcons.xp).sort()).toEqual([
      'sessions', 'directory', 'query', 'network', 'orders', 'changes', 'events', 'time',
      'recovery', 'backup', 'explorer', 'report', 'folder', 'document', 'search', 'help',
    ].sort());
    expect(Object.keys(computerIcons.classic).sort()).toEqual([
      'recovery', 'backup', 'explorer', 'report', 'folder', 'document', 'search', 'help',
    ].sort());
    for (const [family, icons] of Object.entries(computerIcons)) {
      for (const icon of Object.values(icons)) {
        expect(icon.source.startsWith(family === 'xp' ? 'wxp_' : 'w2k_')).toBe(true);
        expect(icon.sizes[16]).toBeTruthy();
        expect(icon.sizes[32]).toBeTruthy();
        for (const [size, url] of Object.entries(icon.sizes)) {
          const png = readAsset(url);
          expect(png.subarray(1, 4).toString()).toBe('PNG');
          expect(png.readUInt32BE(16), url).toBe(Number(size));
          expect(png.readUInt32BE(20), url).toBe(Number(size));
          expect(png[25], url).toBe(6); // PNG RGBA: conserva canal alfa.
          const prepared = manifest.files.find((file) => file.url === url);
          expect(prepared?.archiveMember).toBe(`win95-winxp_icons-master/icons/${icon.source}`);
          expect(prepared?.transform).toContain('sin redimensionar');
        }
      }
    }
  });

  it('mantiene las dependencias locales del monitor, la pantalla y la atribución', () => {
    const model = JSON.parse(readAsset(computerAssets.rackMonitor.model).toString());
    for (const dependency of [...model.buffers, ...model.images]) {
      expect(dependency.uri).not.toMatch(/^[a-z]+:|^\/|\.\./i);
      expect(readAsset(`/models/rack-monitor/${dependency.uri}`).byteLength).toBeGreaterThan(0);
    }
    const screen = model.nodes.find((node) => node.name === computerAssets.rackMonitor.screenNode);
    expect(screen?.mesh).toBeDefined();
    const materialIndex = model.meshes[screen.mesh].primitives[0].material;
    expect(model.materials[materialIndex].name).toBe(computerAssets.rackMonitor.screenMaterial);
    const license = readAsset(computerAssets.rackMonitor.license).toString();
    expect(license).toContain('portgl16');
    expect(license).toContain('CC-BY-4.0');
    expect(readAsset('/computers/CREDITS.md').toString()).toContain('portgl16');
  });
});
