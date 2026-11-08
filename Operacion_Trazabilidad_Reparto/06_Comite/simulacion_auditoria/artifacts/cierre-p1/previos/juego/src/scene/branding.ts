import * as THREE from 'three';

export const redNova = { ink: '#193f46', paper: '#f4f0e6', copper: '#b67a50' };

/** Identidad escenográfica: no constituye documentación del incidente. */
export function brandTexture(title: string, subtitle: string, invalidate: () => void, master = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = master ? 512 : 320;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const artwork = new Image();
  const paint = () => {
    ctx.fillStyle = redNova.paper;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (master && artwork.complete && artwork.naturalWidth) {
      ctx.drawImage(artwork, 0, 0, canvas.width, canvas.height);
    } else {
      if (artwork.complete && artwork.naturalWidth) ctx.drawImage(artwork, 18, 60, 540, 180);
      else {
        ctx.fillStyle = redNova.ink;
        ctx.font = '700 58px sans-serif';
        ctx.fillText('RED NOVA', 55, 170);
      }
      ctx.fillStyle = redNova.copper;
      ctx.fillRect(590, 64, 3, 192);
      ctx.fillStyle = redNova.ink;
      ctx.textBaseline = 'middle';
      ctx.font = '700 60px sans-serif';
      ctx.fillText(title, 640, 132, 840);
      ctx.font = '400 30px sans-serif';
      ctx.fillText(subtitle, 640, 209, 840);
    }
    texture.needsUpdate = true;
    invalidate();
  };
  artwork.onload = paint;
  artwork.src = '/brand/red-nova-master.png';
  paint();
  return texture;
}
