# Menús integrados en la oficina

Implementación: `src/overlays.css`, importada al final de `src/main.ts`. Tipografía Roboto Mono servida localmente con licencia OFL. No se generan imágenes ni se añaden dependencias.

Capturas de los flujos reales en modo plano, con datos iniciales y movimiento reducido, a 1440 × 900 y 390 × 900: `notebook-*.png`, `source-*.png`, `settings-*.png`, `interview-*.png` y `review-*.png`. El modo plano permite inspeccionar los documentos sin depender de la cámara; no pretende documentar la oficina 3D.

Comprobación: Roboto Mono cargada, sin desbordamiento horizontal del panel de revisión en ambos tamaños. Pruebas funcionales existentes de conversación por teclado, ida/vuelta a documentos y reinicio con cancelación. Compilación TypeScript/Vite y 116 pruebas unitarias correctas. La comprobación mecánica señaló ampliaciones intencionadas de paleta y radios, documentadas en DESIGN.md.
