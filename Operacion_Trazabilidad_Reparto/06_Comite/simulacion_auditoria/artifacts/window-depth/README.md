# Ventana con profundidad

La imagen deja de estar pegada al muro. Ahora hay una abertura real, jambas de 44 cm, alféizar interior y exterior, vidrio transparente y una persiana más recogida. La ciudad permanece fija a seis metros detrás del vidrio; al cambiar de posición, el marco cercano y el fondo distante se desplazan de forma distinta. Se conserva el raster original de Godzilla conversando en la terraza, con su procedencia en `public/environment/README.md`.

Capturas con Chrome/SwiftShader y movimiento reducido: `window.png` desde la oficina, `window-close.png` junto al vidrio y `window-oblique.png` en ángulo. La compilación TypeScript/Vite pasó. `validation.json` registra la carga de recursos y errores del navegador. El detector emitió solamente avisos advisory de colores de materiales 3D fuera de la paleta de interfaz heredada.

Límite: la ciudad sigue siendo un decorado plano distante; no se han modelado Godzilla ni los edificios en 3D. La profundidad y el paralaje corresponden a la separación física entre ventana, alféizar y fondo.
