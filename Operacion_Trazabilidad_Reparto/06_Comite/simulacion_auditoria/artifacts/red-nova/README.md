# Red Nova · iluminación e identidad ambiental

Actualización solicitada: luz más clara y equilibrada, materiales marfil/petróleo, listones de madera, vegetación periférica e identidad generada mediante la herramienta integrada imagegen. El recurso final está en `public/brand/red-nova-master.png`; el prompt completo y la procedencia están en `public/brand/README.md`.

Capturas del navegador con Chrome/SwiftShader y movimiento reducido: vista general (`after.png`), área técnica (`technical-area.png`), ventana (`window.png`), formato compacto (`compact.png`) y móvil (`mobile.png`). La captura anterior se conserva en `../office-valve/after.png`.

Verificación: 108 pruebas unitarias aprobadas y compilación TypeScript/Vite correcta. Las cinco pruebas de entrevista pasaron, incluidas 1280×720, 1920×1080 y 390×844 con modo proyector. La ejecución conjunta con `office.spec.ts` terminó con señal 143 antes de completar esa suite: no se certifica una pasada E2E completa. La comprobación visual de las cinco vistas terminó con cero errores de ejecución/carga y 32 recursos locales cargados; detalle en `validation.json`.

El detector de diseño devolvió avisos advisory de colores de materiales 3D fuera de la paleta de interfaz heredada. La nueva paleta de marca está documentada en DESIGN.md. Vite conserva su aviso de tamaño del bundle. Las capturas por software no certifican rendimiento en una GPU ni en un proyector físico.
