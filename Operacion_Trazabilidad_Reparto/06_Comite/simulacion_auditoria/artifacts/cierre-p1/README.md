# I5 · corrección y validación del juego de P1

Sesión: 7 de noviembre de 2026 UTC. Operador: Codex. P1: Anthony Samuel Ordoñez Son, 2401002033. Este cierre comprueba software y archivos; revisión humana, captura gráfica SQL, integración y traspasos P2/P3 y ensayo físico con proyector permanecen pendientes.

## Entradas y preservación

Antes de modificar entradas se cotejaron **306 referencias del registro SHA-256 y cinco documentales: 311/311 coincidentes**, sin discrepancias. No son 311 fuentes independientes. Resultado por ruta/hash en `entradas-verificadas.json`. `juego-antes.json` identifica los bytes iniciales del juego, incluidos recursos y audios que no estaban en el registro académico; es identificación de entrada, no autenticación independiente. `previos/` conserva los fuentes/documentos anteriores a I5 y las versiones de estado, registro IA y registro SHA que se actualizan al cerrar.

Se leyeron ESTADO_P1, el plan por instancias (I5), la revisión inicial, Tarea 9, diseño y reglas v2, PRODUCT/DESIGN y ambas fichas de superficie; PT-20–PT-25, sección forense, cronología, borradores B1-1/B1-2, acciones y comprobantes I4. Se extrajeron localmente con `pdftotext -layout` los PDFs oficiales del proyecto, de entregables y la guía interna de P1. Proyecto pp. 4–5 conserva 13 eventos, 31,840, ~1.6 GB y 216; misión C/entregables exigen SQL y análisis por separado. Guía de entregables, pasos 6/7/12, distingue custodia, base/SELECT y defensa/IA. La propuesta antigua de dos corridas de la guía interna está sustituida por Tarea 9 y el diseño v2.

Las trazas anteriores seguían disponibles: siete ZIP y sus contextos se preservaron en `historico-test-results/`. Las de la batería inicial de esta sesión están en `baseline-test-results/`. Son archivos de pruebas del juego, sin extracción de sistemas de RedNova.

## Estado inicial realmente comprobado

- `pnpm verify` dentro del sandbox: 116 unitarias y compilación aprobadas; E2E no iniciadas porque el acceso al servidor local se denegó con `EPERM`. Es un fallo del entorno, separado del producto.
- `pnpm verify` con acceso permitido a Vite/Chrome local: 116 unitarias, TypeScript/Vite y **31/38 E2E aprobadas, siete fallidas**, código 1, 9.0 min. Ver `verify-baseline.log`.
- Se reprodujeron los seis bloqueos de clic en pausa/omisión (1280, 1920, audio/movimiento, puntero, navegación y transporte) y la expectativa desactualizada de cinco GLB frente a once. No se presentaron los resultados históricos como certificación actual.

## Contraste con I4

| Asunto | Criterio conservado en el juego |
| --- | --- |
| Expediente frente a laboratorio | El navegador conserva los resúmenes v2.1; I2/I3 ejecutaron SQL con datos sintéticos v2, documentados en anexos. Los resultados no se incorporan como originales ni nuevas fuentes evaluables. |
| Lectura y transferencia · PT-21/22 | 31,840 y ~1.6 GB son reportados; faltan contenido y vínculo técnico. El modelo de volumen de I4 no identifica el contenido transferido. |
| Órdenes · PT-23 | 216 reportadas; 144/72 de Q-07 son diseño sintético sin cuenta/sesión/vía. Diez pares candidatos de Q-08 no prueban doble cobro ni pérdida monetaria. |
| Respuesta · PT-24/25 | 61/24/315/355 min son diferencias de horas reportadas, sin desfase verificado; no prueban inacción, borrado ni cumplimiento de objetivos. AU-06 no ejecuta PT-25. |
| Recuperación | El registro de julio es ficticio; no se ejecutó restore. Regreso del servicio no acredita integridad o RPO. Falta informe de respaldo utilizado y validación del incidente. |
| Hallazgos y acciones | B1-1/B1-2 siguen no concluyentes, con revisión humana y de P3 pendientes. Once acciones son propuestas para decisión/ejecución de administración, no hechos realizados. |
| «Documentado» | Cumplimiento de requisitos estructurados de una actividad educativa; admite conclusión no concluyente y no concede aprobación académica. |

No se cambian el expediente JSON, sus 13 eventos, reglas decisorias, fuentes admitidas ni versiones v2.1. Las precisiones de redacción y la ayuda escrita no añaden evidencia ni cambian qué respuestas se aceptan. No se ejecutó SQL, se reconstruyó el laboratorio ni se añadieron servidores, corridas obligatorias o recursos escenográficos.

## Correcciones y diagnóstico

La ayuda escrita explica MFA/VPN/API, CRM, SIEM, recertificación, conciliación, RTO/RPO/BIA y SHA-256 junto a la tarea; el contexto adicional de I4 es desplegable. **Ver metadatos** describe la consulta real, sin prometer lectura o hash de un original. En impresión, las ocho comprobaciones incluyen pregunta, respuesta elegida y códigos; una respuesta equivocada se conserva y un código desconocido se señala. El informe permanece disponible hasta `afterprint`, sin retirarse al segundo. El plazo de recomendación es opcional y compatible con guardados v2 anteriores.

El perfil de CPU y los diagnósticos se conservaron en `perfil-apertura.json`, `intro-cpu-profile.json`, `diagnostico-apertura.json` y `diagnostico-resolucion.json`. Los avisos GPU, por sí solos, no se usaron para atribuir la causa. Las variantes sin capturas continuas, con iconos estables, menor cadencia, barrera GPU o menor resolución no resolvieron el clic; **esas reducciones y barreras no se incorporaron al producto**.

La corrección combina: agrupar cargas antes de volver a subir la oficina a WebGL; reutilizar imágenes visualmente idénticas; no invalidar la escena por estado sin cambios; mantener la visita quieta mientras espera entrada con cursor libre; estabilizar controles; conservar tiempo transcurrido de fotogramas lentos y respetar la alternativa plana también en la apertura. La prueba nueva de carga fallida comprueba que un recurso ausente libera la espera y conserva el respaldo. No se sustituyeron modelos ni se redujeron resolución, luces, sombras o recursos.

El test que esperaba cinco GLB ahora exige respuestas satisfactorias de los **once GLB requeridos y ambos GLTF**, permite recursos adicionales, detecta fallos de carga y conserva el bloqueo de solicitudes externas y la inspección de fuentes de seis puestos con el contexto offline tras cargar.

Se conservan los intentos intermedios: `pruebas-especificas-intento-01.log` (18/21), `pruebas-especificas-intento-02.log` (5/7) y `entrada-y-navegacion-intento-01.log` (1/2). Identificaron el coste restante de entrada/visita. Tras las correcciones, el recorrido físico completó unas 88 llamadas sin un nuevo fallo de 15 s por clic, pero agotó 120 s cerca del final; se amplió **solo su presupuesto total a 180 s**, manteniendo sus clics a 15 s. Pasó en unos 2.4 min en la batería posterior. No se presenta esa ampliación como solución de los seis bloqueos del producto.

La primera batería completa corregida acabó 41/42 E2E por un selector antiguo «Comprobar archivo» omitido en una prueba. Está identificada en `verify-final-intento-01.log`, con su traza, y no se cuenta como aprobada. Se actualizó el selector, se comprobó la legibilidad móvil y se repitió **todo** `pnpm verify`. También se conservan una primera aserción unitaria en un límite decimal de fotograma y un error de tipado del test de reloj, corregidos antes del cierre.

## Verificación final efectiva

Comandos principales, desde `06_Comite/simulacion_auditoria/`:

```bash
pnpm exec vitest run tests/models.test.ts tests/intro.test.ts tests/report.test.ts tests/store.test.ts
pnpm build
pnpm exec playwright test tests/e2e/investigation.spec.ts tests/e2e/i5.spec.ts --grep 'metadatos|fotograma retrasado'
pnpm verify
```

| Comprobación | Resultado y comprobante |
| --- | --- |
| Unitarias específicas | 22/22 en cuatro archivos; `unitarias-especificas.log`. |
| Metadatos y reloj | 4/4 E2E, escritorio, móvil, metadatos ausentes y salto temporal; `metadatos-y-reloj.log`. |
| Batería completa tras el último cambio | **Código 0: 121 unitarias en 16 archivos + TypeScript/Vite + 42 E2E**; `verify-final.log` y `ejecuciones.json`. |
| Seis revisiones | Recorrido B de `office.spec.ts`: seis marcas sustentadas en distinto orden; retirada de fuente y respuesta equivocada no completan la revisión. |
| Retorno y persistencia | `i5.spec.ts` recorre las seis PCs con libreta/TI, conserva anotación al volver y recargar. `desktop-b` verifica ventanas, consultas, borradores, fallo de almacenamiento y reinicio. |
| Impresión | PDF A4 de 12 páginas con ocho preguntas/respuestas y códigos, seis revisiones, límites y plazo; extracción de texto y fuentes en `impresion-verificada.json`. Inspección visual de muestra, sin impresión física. |
| Móvil y movimiento reducido | 390×844 y capturas adicionales a 390×900; teclado, tablas con desplazamiento propio, J/Esc, estados reducidos y audio opcional. |
| Alternativa plana | WebGL y puntero denegados conservan acceso a las seis revisiones y entrevista; preferencia plana aplicada durante la apertura. |
| Recursos y voz | 151 recursos públicos y expediente JSON idénticos; 34 cotejos de conservación de voz, 29 MP3 decodificados. Ningún audio pendiente de reemplazo por I5. |
| Reglas | Comparación semántica confirma v2.1 conservada; solo se aclararon los textos L03-CAUSA y L06-HASH (`conservacion-reglas.json`). |

## Capturas y límites de entrega

- [Apertura 1280](apertura-1280.png) y [1920](apertura-1920.png); [oficina/PC 1280](oficina-1280.png) y [1920](oficina-1920.png).
- [Metadatos escritorio](metadatos-1440.png) y [móvil](metadatos-390.png); [ayuda de recuperación móvil](recuperacion-ayuda-390.png).
- [AU-02 documentada](revision-au02.png), [seis revisiones](seis-documentadas.png), [alternativa móvil](movil-plano.png), [muestra de impresión](impresion-muestra.png) y [PDF de prueba](libreta-seis-revisiones.pdf).

Las capturas anteriores regeneradas por las pruebas se restituyeron a sus bytes Git iniciales después de copiar las actuales a esta carpeta; lista en `capturas-historicas-preservadas.json`. Las 102 copias previas coinciden con la identificación inicial (`copias-previas-verificadas.json`). El manifiesto identifica código, pruebas y comprobantes; el registro SHA vigente se amplía sin incluirse a sí mismo. `integridad-cierre.json` es el cotejo terminal, excluido del manifiesto para evitar una referencia circular.

Se aplicó `impeccable` conservando oficina, XP/Server y papel. Revisión visual en escritorio/móvil y PDF, y detector mecánico en `detector-diseno.json`: 192 observaciones advisory y ocho warnings sobre tokens/paleta heredados, forma de la tablita y Roboto Mono. No se presentan como aprobación automática. Roboto Mono está fijada por el diseño vigente y se conserva también al imprimir. El sidecar de diseño sigue anterior a DESIGN y falta `buildPath`; puede refrescarse con `impeccable document` en su tarea de mantenimiento, sin ampliar I5.

Persiste el aviso de Vite por chunk principal >500 kB (847.72 kB, 228.81 kB gzip); compiló correctamente. Las E2E usan Vite local y Chrome 147 headless, no constituyen un ensayo de hardware de defensa. Offline significa contexto desconectado después de cargar; no arranque desde caché ni garantía de audios no cargados. El vídeo y respaldo de `artifacts/entrega/` siguen siendo anteriores; su regeneración corresponde a I6. Captura gráfica SQL, revisión humana, aportes/revisiones/traspasos P2/P3, integración y ensayo físico/proyector siguen pendientes. **I5 no ejecutó SQL, reconstruyó el laboratorio ni aprobó hallazgos.**
