# Superficie: experiencia completa de auditoría

Modo: Operate, con una apertura Experience. La tarea es contrastar fuentes y cerrar revisiones con sustento; la oficina y la reconstrucción sirven a ese trabajo.

## Direction contract

THESIS: La misma oficina muestra la actividad de cada sistema y después expone los límites del registro. El usuario autorizó refinar la apertura con interfaces propias, terminal SQL y transferencia animada; las pantallas permanecen dentro del espacio y no imitan las láminas del PDF.

OWN-WORLD: Madera clara, grafito, marfil y acento verde grisáceo; madrugada azul grisácea, visita cálida, rojo solo en el CRM. Modelos GLB locales, geometría sencilla, hoja con clip y herramientas HTML densas pero tranquilas.

STORY: El visitante observa trece registros, recibe la tablita, recorre seis estaciones, contrasta declaraciones y exporta lo que puede sostener sin borrar lo pendiente.

FIRST VIEWPORT: La oficina 3D llena la pantalla. Fecha y hora grandes arriba a la izquierda; mensaje y procedencia en el tercio inferior; controles en una franja discreta. Los monitores dominan los primeros planos y la consola nunca sustituye la habitación. Al visitar, solo retícula, señal de interacción y tablita baja quedan sobre la escena.

FORM: Diez cortes fijos y una sola habitación transitable; libreta y estaciones usan una sola fuente de estado. Dirección y distribución fijadas por el brief v2 y el storyboard; seed key: `brief-v2-pinned` (sin ronda de concepto abierta).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Finish review

Revisión sustituida por una pasada en este hilo, sin revisor independiente, porque no está disponible el agente especializado. Construcción code-led con dirección fijada por el brief; no se generó un comp ni rasters decorativos. Evidencia: `.impeccable/review/desktop.png`, `mobile.png`, `user-1280.png` y `user-1920.png`; capturas finales de `artifacts/screenshots/`; fotogramas del WebM a 7, 14, 26 y 36,42 segundos; PDF digital y texto extraído. Los fotogramas diagnósticos se retiraron después de revisarlos.

disposition: ship

### persistence

Pass en el alcance revisado. Existen `PRODUCT.md`, `DESIGN.md` y `.impeccable/design.json`; el contrato conserva `brief-v2-pinned`. No falta un comp: la dirección estaba fijada y la construcción fue code-led. No se generaron rasters para la interfaz. Los GLB se identifican como material proporcionado por el usuario, no evidencia; autoría/licencia adicional no aportada. El detector local se ejecutó una vez y devolvió una advertencia `overused-font` por Arial en `src/styles.css:316`, exclusivamente para impresión.

### fidelity

- TYPE: match con el contrato; hora monoespaciada como dato, lectura sans funcional y tamaños mínimos comprobados a 1280×720 y 1920×1080.
- MATERIAL: match; mobiliario GLB local, geometría sencilla y papel HTML sin imitaciones de textura o física inexistentes.
- GROUND: match; madera clara y visita cálida frente a madrugada azul grisácea; marfil/verde para lectura y ámbar para alertas.
- COMPOSICIÓN: match; oficina a pantalla completa, hora/procedencia visibles, monitor central y separación entre mensaje, nota y monitor en P08.
- ADAPTACIÓN: lectura HTML y acceso plano móvil exigidos por el brief y la accesibilidad; seis accesos disponibles sin WebGL o puntero.

### ceiling

Alcanzado dentro de las capturas revisadas: una sola habitación, cortes fijos, cambio de iluminación, entrega física de tablita y contraste de fuentes. No hay una tarjeta de calidad independiente ni una comparación contra comp que añadir. No se certifica rendimiento o legibilidad en un proyector físico.

### material_fixes

Ninguna corrección material en las capturas revisadas. La advertencia de Arial en impresión queda registrada, no oculta ni canonizada como una preferencia tipográfica; no se afirma una pasada limpia del detector. El intento de extraer canvas desde un archivo local fue rechazado por Chrome y se sustituyó por capturas directas del vídeo, cuyos fotogramas sí se revisaron.

### keep

Conservar la separación entre horas reportadas, declaraciones, vistas calculadas y contenido ilustrativo; nunca convertir «Documentado» en aprobación de una auditoría.

## Documentación visual

Refinamiento posterior solicitado por el usuario: aplicaciones RN diferenciadas (terminal SQL, transferencia, CRM comercial y SIEM), actividad antes del enunciado, planos más cercanos y reproducción determinista. La revisión y las cifras de pruebas de la entrega base que siguen no certifican esta revisión. Evidencia de esta pasada: `artifacts/refinement/`; pruebas enfocadas de reconstrucción y compilación. Se conservan los límites del canon y la alternativa con movimiento reducido.

Escritos: `DESIGN.md` y `.impeccable/design.json` (esquema 2, siete componentes). Revisados contra `src/styles.css`, `src/ui/` y `src/scene/`.

- Paleta: madera, grafito, marfil y verde grisáceo; noche azulada y alerta ámbar.
- Tipo: hora/datos monoespaciados y lectura funcional sin recursos remotos.
- Regla de alarma: rojo intenso asociado al CRM, no una consola de emergencia.
- Regla de lectura: cámara quieta, fuente y procedencia antes que efectos.
- Regla de espacio: la oficina da contexto; HTML permite leer y contrastar.

Deriva no canonizada: Arial en la hoja de impresión sigue señalado por el detector; la sans funcional no se propone como voz editorial decorativa.

Verificación funcional asociada: 49 pruebas unitarias, 11 E2E y compilación pasaron. Exportación repetida contra `dist`: WebM 36,72 s a 1280×720, PDF de siete páginas A4 y JSON con seis revisiones documentadas y sus pendientes. No es validación humana ni una aprobación académica.
