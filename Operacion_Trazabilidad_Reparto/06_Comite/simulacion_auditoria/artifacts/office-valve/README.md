# Oficina industrial

Dirección solicitada: más atmósfera de juego de Valve usando los assets locales.

- `before.png`: oficina anterior, mismo punto de entrada.
- `after.png`: entrada con techo, iluminación práctica, conductos y materiales gastados.
- `technical-area.png`: rincón técnico y utilería.
- `window.png`: ventana industrial.
- `compact.png`: misma escena a 960 × 640.
- `validation.json`: errores de navegador y recursos servidos durante la captura.

Las capturas se regeneran con `node scripts/check-office-environment.mjs`, con el servidor de desarrollo en el puerto 4173. Chrome puede usar renderizado por software y tardar más en cargar el personaje.

Procedencia: modelos existentes aportados por el usuario; periféricos, radio, libros y cajas extraídos del Furniture Kit 2.0 de Kenney en la carpeta fuente local. Licencia incluida en `public/models/office-props/License.txt`. Paredes, suelo, techo y señales generados por geometría y Canvas en `OfficeEnvironment.ts`, sin imágenes externas ni IA. Las hojas y señales son decoración ilustrativa.

Revisión visual: composición industrial legible, puestos accesibles, luz fría/cálida estable, sin parpadeos y sin cambios al contenido académico. El detector mecánico reportó únicamente avisos de paleta, documentada en DESIGN.md.

Rendimiento: arquitectura estática agrupada por material, una única luz con sombras a 1024 px, fluorescentes con iluminación compartida y límite de 30 FPS. Los props nuevos suman aproximadamente 60 KiB; se reutiliza la caché del cargador y no se añaden dependencias.

Validación: `pnpm test` pasó 107 pruebas y `pnpm build` terminó correctamente. La prueba E2E `A · navegación real` agotó sus 15 segundos de espera al pulsar «Omitir y entrar a la oficina» en Chrome/SwiftShader; no se considera aprobada la navegación completa. La carga directa del personaje FBI, monitor y rack sí se verificó con GLTFLoader en Chrome. El build mantiene el aviso de tamaño del bundle JavaScript.
