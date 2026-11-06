# Personaje FBI como enlace de TI

Se sustituyó el personaje geométrico por el modelo local `FBI | CS2 Agent Model №1`, de 6lucius. Conserva su función, sus diálogos, la entrega de la tablita, la mesa y el encuadre de entrevista. El personaje geométrico permanece como respaldo cuando falla el recurso.

El modelo está en `public/models/fbi-agent/`, junto con su binario, quince texturas y licencia CC-BY-4.0. La atribución también figura en el README del proyecto. La altura de presentación es de 1.8 m. Se conserva la pose del paquete, que incluye esqueleto y no incluye clips de animación.

El cargador clona los esqueletos con SkeletonUtils y actualiza sus matrices antes de calcular la escala. Una prueba de regresión comprueba altura, apoyo sobre el suelo, centrado y huesos independientes entre dos instancias cargadas desde la misma caché.

## Capturas

- `oficina-1920.png` y `oficina-1280.png`: personaje en la oficina.
- `entrevista-1920.png` y `entrevista-1280.png`: conversación con el modelo nuevo.
- `entrevista-390.png`: alternativa plana móvil con el mismo contenido.
- `respaldo-1280.png`: entrevista funcional con la carga del personaje bloqueada.
- `verification.json`: entrega de la tablita, ausencia de errores y recursos fallidos, estilos de lectura y ausencia de desbordamiento horizontal en los tres tamaños; comprobación del respaldo.

Procedencia: aplicación local servida por Vite, capturas de Chrome mediante Playwright. No son imágenes generadas.

## Validación

TypeScript/Vite y 104 pruebas unitarias aprobadas. Cinco pruebas E2E de entrevista aprobadas, incluidos teclado, fuentes, repreguntas, escritorio, móvil y proyector. La prueba E2E de navegación física, entrega y revisión AU-02 aprobó al ejecutarse sola; su primer intento durante capturas simultáneas falló al apuntar después de una caminata de duración fija. No se modificó esa prueba. No se ejecutó el resto de la batería E2E.

La compilación conserva el aviso de tamaño del chunk principal superior a 500 kB. El recurso utiliza las texturas originales del paquete; no se realizó una optimización de su tamaño ni una medición en hardware de usuario.
