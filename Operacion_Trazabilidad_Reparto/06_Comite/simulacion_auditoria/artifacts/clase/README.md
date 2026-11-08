# Actualización para presentar en clase

Juego orientado a computadora: **1280×720 y 1920×1080**, teclado y mouse, modo proyector y acceso plano. No se prevé jugarlo en móvil. La compatibilidad preexistente se conserva y sus pruebas heredadas se ejecutaron dentro de la batería completa.

Se actualizó únicamente el juego. Las fuentes académicas conservan su contenido; se identifican con rutas y huellas en [fuentes consultadas](fuentes-consultadas.json). Las huellas identifican copias, sin convertir los resúmenes en originales del incidente.

## Qué cambió

- Nombres de actividad antes que claves internas, términos explicados junto a su uso y contexto para quien no conoce el reparto del proyecto.
- Seis revisiones coherentes con los entregables: cuenta remota sin identidad personal; lectura y tráfico sin contenido vinculado; 216 órdenes del caso separadas de los 144/72 cambios ficticios; alertas sin seguimiento acreditado; retorno de consulta/escritura sin integridad demostrada; originales y relojes pendientes.
- Tres hipótesis por su contenido, con pruebas que las distinguirían; comparación ficticia de siete campos de 31,840 clientes, de 2.06 o 5.12 MB, separada de los ~1.6 GB reportados.
- Dos observaciones aún no concluyentes y once acciones propuestas, vinculadas a las seis revisiones. La administración ejecuta; el auditor recomienda y evalúa.
- Misma explicación en documentos, programas, ayuda, conversación escrita, libreta, PDF y JSON. Los identificadores, respuestas admitidas y claves de guardado se conservaron. El JSON mantiene sus campos anteriores y añade nombres y textos.
- Espacio de lectura ajustado para proyector. Elegir una etapa de recuperación mantiene accesible su deslizador. Las acciones de fuente aparecen junto al título y la voz se pausa al pulsar salir. Se conservan la oficina, las seis estaciones, la inspección de fuentes, el contraste y la justificación.

## Resultados actuales

**`pnpm verify`: código 0; 124 pruebas unitarias en 17 archivos, TypeScript/Vite y 44 pruebas de navegador aprobadas.** Véase [registro completo](verify.log). Este resultado corresponde al código final de esta actualización, después del último cambio funcional.

Las comprobaciones cubren acceso físico, fuentes, evaluación, persistencia, libreta y exportación; teclado, vista plana, funcionamiento sin audio y recuperación ante almacenamiento bloqueado. La partida anterior de prueba conserva las seis revisiones documentadas, con sus fuentes, respuestas y anotaciones. No fue necesario borrar partidas. El almacenamiento pertenece al navegador y a la dirección con su puerto; cambiar de 4173 a 4174 no transfiere ni borra la partida anterior. Las aserciones de títulos se actualizaron para los nombres nuevos; los requisitos de evaluación y los presupuestos de tiempo se conservaron.

La [comprobación adicional de medios](media.json) revisó **56 estados de la reconstrucción**: catorce momentos por resolución, con y sin proyector. Ninguno recortó texto ni se superpuso con los controles. El navegador fue Chrome 147.0.7727.137. La revisión de capturas y del PDF es digital.

La compilación conserva el aviso no bloqueante por JavaScript mayor de 500 kB (862.43 kB; 233.16 kB comprimido en esta construcción). No es una medición del rendimiento en el equipo del aula.

El detector de diseño se ejecutó una vez: 163 avisos informativos y seis advertencias sobre rasgos anteriores de Roboto Mono, bordes y el sidecar visual. No se sustituyó la identidad de la oficina ni de XP/Server. El contexto detectó el sidecar anterior a DESIGN y configuración sin `buildPath`; se mantienen como estado histórico. Puede refrescarse el sidecar mediante `impeccable document`, sin ampliar esta actualización.

## Archivos para presentar

- [Recorrido WebM](../entrega/recorrido.webm): **39.40 segundos**, 1280×720, selección automatizada y muda de la demostración. Se comprobó reproducción completa a 4× y se decodificaron muestras al 20 %, 50 % y 95 %. No es la reproducción completa de los 110 segundos de apertura ni un ensayo humano.
- [Libreta de respaldo PDF](../entrega/libreta-respaldo.pdf): **17 páginas A4**, ejemplo con seis revisiones documentadas y sus límites. Los campos de recomendación libre pueden quedar vacíos; el plan de once propuestas se incluye por separado.
- [Libreta JSON](../entrega/libreta-ejemplo.json): seis revisiones con preguntas, respuestas, fuentes, hipótesis y propuestas. «Documentado» no aprueba un hallazgo ni demuestra culpabilidad.
- [Manifiesto](presentacion-manifest.json): tamaños y huellas de la construcción y de los tres archivos de demostración.

Los tres archivos se regeneraron desde `dist/`, servido mediante `pnpm preview --port 4174`, con el procedimiento existente:

```bash
BASE_URL=http://127.0.0.1:4174 RECORD_SCREENSHOTS=artifacts/clase/recorrido pnpm record
BASE_URL=http://127.0.0.1:4174 CHECK_VIDEO=1 pnpm exec node scripts/check-classroom-media.mjs
```

Arranque e instrucciones: [README del juego](../../README.md). El servidor de presentación debe permanecer activo. El paquete portátil académico anterior es histórico y no se regeneró; para esta versión se usan `dist/` y los archivos enlazados aquí.

## Capturas finales

| Pantalla | 1280×720 | 1920×1080 |
| --- | --- | --- |
| Acceso remoto | [Ver](capturas/accesos-1280.png) | [Ver](capturas/accesos-1920.png) |
| Lectura y transferencia | [Ver](capturas/sql_red-1280.png) | [Ver](capturas/sql_red-1920.png) |
| Órdenes | [Ver](capturas/crm_cambios-1280.png) | [Ver](capturas/crm_cambios-1920.png) |
| Alerta | [Ver](capturas/siem-1280.png) | [Ver](capturas/siem-1920.png) |
| Recuperación | [Ver](capturas/respaldos-1280.png) | [Ver](capturas/respaldos-1920.png) |
| Originales y relojes | [Ver](capturas/mesa_auditor-1280.png) | [Ver](capturas/mesa_auditor-1920.png) |
| Libreta | [Ver](capturas/libreta-1280.png) | [Ver](capturas/libreta-1920.png) |
| Reconstrucción con proyector | [Ver](intro-proyector-1280.png) | [Ver](intro-proyector-1920.png) |

La [carpeta del recorrido](recorrido/) conserva además la oficina, el cálculo de tamaños, la libreta y sus hipótesis. Las regiones de documentos extensos se desplazan; el texto permanece accesible. La reconstrucción cabe sin desplazamiento en las comprobaciones indicadas.

## Historial y respaldos

[README anterior](previos/README-anterior.md) conserva los conteos y las aceptaciones históricas. [juego-antes.tar.gz](previos/juego-antes.tar.gz) conserva fuentes, pruebas, scripts, documentación y los medios antes de reemplazarlos, incluidos cambios previos del usuario. [capturas anteriores](previos/capturas-anteriores.tar.gz) conserva los artefactos gráficos reemplazables, sin duplicar sus carpetas históricas de respaldo. `cambios-previos.patch` registra las diferencias que ya estaban presentes al comenzar.

Los intentos iniciales se guardaron por separado. Detectaron expectativas de texto antiguas, el atributo JSON requerido por Node, un selector de fuente de contexto, el alcance de los controles y recortes en proyector; se corrigieron y la batería completa final pasó. Una ejecución se interrumpió para agrupar estas correcciones; no se presenta como una verificación aprobada.

## Límites pendientes

No se realizó un ensayo físico en clase con proyector, pruebas con estudiantes/docente ni impresión física. Las pruebas de navegador y la grabación automatizada no los sustituyen. Tampoco se obtuvieron originales, identidades personales, autorizaciones, conciliaciones concluidas ni relojes verificados. No se ejecutaron acciones en RedNova ni se repitió el laboratorio académico.

Siguen pendientes la revisión humana y los entregables globales que enumera el índice académico: informe completo, matrices, al menos cinco hallazgos sustentados, plan de 90 días con presupuesto y defensa conjunta. Las once propuestas de 72 horas no sustituyen ese plan.
