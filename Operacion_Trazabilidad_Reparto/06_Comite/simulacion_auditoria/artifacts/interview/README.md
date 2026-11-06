# Entrevista con el enlace de TI

La entrevista usa una conversación de opciones inspirada en Skyrim, con texto original en español y los hechos del expediente RedNova. No utiliza imágenes ni recursos del juego.

- `entrevista-1280.png`: oficina 3D, primer plano del enlace, menú lateral y respuesta inferior a 1280 × 720.
- `entrevista-1920.png`: misma conversación en escritorio a 1920 × 1080.
- `entrevista-390.png`: modo plano móvil a 390 × 844; respuesta antes de las opciones y desplazamiento vertical.

Procedencia: capturas del navegador local con Playwright y Chromium; generadas por `tests/e2e/interview.spec.ts`. La escena y el enlace son los recursos ya presentes en la aplicación. Los textos provienen de `src/data/interview.ts`; los enlaces conservan los documentos del expediente.

Cobertura funcional: selección por teclado, una respuesta por turno, memoria de temas durante la visita, cambio de tema, despedida, lectura y regreso desde fuentes, requisitos de inspección de repreguntas, modo proyector y regreso al punto de exploración.

Verificación final: 103 pruebas unitarias y compilación TypeScript/Vite aprobadas. Las 35 pruebas de navegador aprobaron en dos tandas: 31 de aceptación, escritorios, entrevista e investigación y 4 del recorrido de oficina/exportación. El proceso de la primera tanda se interrumpió después de sus 31 resultados aprobados; las cuatro pendientes se completaron por separado. Revisión visual final de los tres tamaños: sin desbordamiento horizontal, con respuesta y fuente visibles en móvil y cierre funcional también con proyector.
