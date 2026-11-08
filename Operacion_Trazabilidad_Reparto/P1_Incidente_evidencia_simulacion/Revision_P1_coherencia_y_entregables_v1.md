# Revisión de P1: entregables, coherencia y lenguaje

Fecha: 6 de noviembre de 2026. Alcance: archivos de este repositorio, documentos del curso y comportamiento definido por el código del juego.

**P1 todavía no está listo para entregar con lo disponible aquí.** El juego representa las señales del expediente y conserva sus límites, pero faltan productos académicos que la simulación no sustituye. También hay términos sin explicación, acciones con nombres imprecisos y una impresión que muestra códigos de respuesta sin su significado.

Esta revisión identifica pendientes; los ejemplos de redacción siguientes son propuestas. La ausencia de un archivo en este repositorio no demuestra que el integrante no lo tenga en otra ubicación.

## Qué documentos mandan

- Los PDFs oficiales de `00_Material_del_curso/` fijan hechos y entregables. La guía de entregables exige custodia y papeles de trabajo en el paso 6, base relacionada y seis o más SELECT reproducibles en el paso 7, y presentación y declaración de IA en el paso 12.
- La guía PDF interna de P1, páginas 2–3, distribuye su base SQL, custodia, sección forense, simulación, presentación y dos borradores de hallazgos.
- La Tarea 9 de [Agente_IA_P1_Incidente_evidencia_simulacion_v1.md](Agente_IA_P1_Incidente_evidencia_simulacion_v1.md) y [Diseno_auditoria_oficina_v2.md](Diseno_Simulacion_3D/Diseno_auditoria_oficina_v2.md) reemplazan la propuesta antigua de dos corridas por reconstrucción y visita de auditoría. La falta de segunda corrida o de HTML único no es un pendiente del alcance vigente.
- [Reglas_evaluacion_auditoria_v2.md](Diseno_Simulacion_3D/Reglas_evaluacion_auditoria_v2.md) permite completar una actividad con una conclusión no concluyente sustentada. Esa marca no aprueba los entregables del curso.

## 1. Pendientes que impiden cerrar P1

| Producto | Qué hay aquí | Qué falta para considerarlo entregado |
| --- | --- | --- |
| Base sintética y análisis SQL | Un intérprete local que consulta 13 eventos y 10 resúmenes empaquetados. | `04_SQL/Analisis_Auditoria.sql`, esquema relacionado, datos ficticios reproducibles, diccionario y al menos seis SELECT con resultados. La propuesta de P1 prevé Q-01–Q-12; el mínimo oficial es seis. |
| Resultados de consultas | Referencias Q-xx y consultas de ejemplo del juego. | Sentencias académicas, ejecución documentada y archivos de resultados. Las tablas del juego no cubren bajas, duplicidades, líneas base por cuenta ni variaciones de respaldos. |
| Índice y cadena de custodia | Inventario didáctico con archivo y SHA-256 ausentes. | Índice, fecha, método, custodio, originales/copia de trabajo, hashes de archivos efectivamente obtenidos o generados y registro de traspasos. |
| Papeles de trabajo | Seis revisiones AU-01–AU-06 y una libreta de ejemplo. | PT-20–PT-25 con objetivo, vínculos, procedimiento reproducible, resultado y conclusión según plantilla C; integración en `03_Evidencias/Papeles_Trabajo.pdf`. |
| Cronología investigada | Los 13 eventos preliminares y diferencias de tiempo correctas. | Tabla entregable con fuente, hora original/zona, hora reportada o normalizada, fiabilidad, certeza y método; análisis de sensibilidad al desfase. Los valores desconocidos deben seguir identificados como tales. |
| Hipótesis y causa raíz | Preguntas y conclusiones que evitan atribuir sin prueba. | Al menos dos hipótesis comparadas, evidencia a favor/en contra, prueba que las confirmaría o descartaría y mapa causal con grados de certeza. Una causa no demostrada debe conservar ese estado. |
| Transferencia y órdenes | Cifras y limitaciones conservadas. | Comparación de tamaño estimado de 31,840 registros con ~1.6 GB; análisis de cuenta, vía, campos, montos y diferencias de las 216 órdenes cuando el laboratorio los aporte. Lo que el expediente no permite resolver debe quedar explícito. |
| Respuesta de esa noche | Alerta, retorno del servicio y límites sobre restauración. | Evaluación de contención, revocación de accesos, preservación antes de restaurar y decisiones registradas; acciones propuestas de 0–24 h y 24–72 h para P3. |
| Borradores B1-1 y B1-2 | Temas sugeridos en la guía. | Dos documentos con condición, criterio verificable, causa/hipótesis, efecto, evidencia, recomendación y prioridad; si falta sustento, declararlos no concluyentes. |
| Sección forense y defensa | Documentos de diseño, vídeo WebM y PDF/JSON de una partida de ejemplo. | Sección del informe, diapositivas, respuestas de P1 a preguntas 01/02/03/06/07 y registro de uso de IA con validación humana pendiente. El PDF de la libreta no es la presentación ni el informe forense. |

No se encontraron archivos `.sql`, `.csv`, `.xlsx`, `.docx`, `.pptx` o `.py` de esos entregables mediante la búsqueda del repositorio, excluyendo dependencias y compilados. Tampoco existen aquí las carpetas académicas `03_Evidencias/` y `04_SQL/`.

### La diferencia decisiva de SQL

En [query.ts](../06_Comite/simulacion_auditoria/src/investigation/query.ts), `registros` se construye desde los eventos del JSON y `soportes` desde sus resúmenes. El SELECT sí filtra datos locales; no ejecuta las consultas Q-xx de P1 contra una base SQL Server. Por ejemplo, una fila que dice «31,840 registros» representa el resumen de la lectura: no son 31,840 filas de clientes disponibles para análisis.

La advertencia existe en la ayuda de Query Studio y en la procedencia de las fuentes. Es correcta. Para la defensa conviene explicar esta diferencia al mostrar la herramienta, sin presentar la exploración del juego como cumplimiento del paso 7 del curso.

### La alerta 08 sigue sin una prueba de permisos

AU-06 revisa originales, hashes ausentes y relojes; no inspecciona permisos de administradores para alterar bitácoras ni busca lagunas en registros sintéticos. Por eso documentar AU-06 no equivale a ejecutar PT-25 ni a probar la alerta 08, asignada a P1. Esa prueba necesita registros y permisos del laboratorio identificados, o una conclusión expresa sobre la falta de información.

### Registrar una limitación no sustituye el análisis

Es correcto no confirmar exfiltración, culpabilidad o causa raíz con el expediente disponible. Aun así, P1 debe entregar el razonamiento: alternativas, datos que las distinguen, pruebas posibles y resultado actual. Las seis conclusiones del juego no constituyen por sí mismas ese documento.

## 2. Lenguaje que necesita corrección o contexto

No se encontró un patrón de relleno como «holístico», «sinergia» o «de vanguardia» en los textos revisados de la aplicación. El problema principal es el vocabulario asumido y la distancia entre algunas etiquetas y lo que realmente hace su control.

| Localización | Problema concreto | Ajuste propuesto |
| --- | --- | --- |
| [interview.ts](../06_Comite/simulacion_auditoria/src/data/interview.ts), `P-IDENTIDAD`; reglas AU-01 | MFA aparece sin desarrollar. «Segundo factor» en la apertura ayuda, pero puede omitirse la reconstrucción. | Al primer uso en la visita: «MFA exige factores de autenticación distintos, por ejemplo contraseña y un código de una aplicación». Después usar la sigla. |
| [stations.ts](../06_Comite/simulacion_auditoria/src/data/stations.ts), estación D | SIEM forma parte del título sin explicar su función. | «SIEM: sistema que reúne registros y genera alertas de seguridad». Relacionarlo con la alerta de las 03:18 y su seguimiento. |
| [rules.ts](../06_Comite/simulacion_auditoria/src/audit/rules.ts), AU-05; entrevista `R-RECUPERACION` | RTO, RPO y BIA aparecen juntos sin explicar qué mide cada uno. | «RTO: tiempo objetivo para restablecer el servicio. RPO: pérdida de datos tolerable expresada en tiempo. BIA: análisis del impacto de la interrupción en el negocio». Ubicar la explicación en la recuperación, accesible aunque se omita la apertura. |
| [rules.ts](../06_Comite/simulacion_auditoria/src/audit/rules.ts), `L06-HASH` | «Un hash verifica bytes» es demasiado absoluto y deja implícita la referencia de comparación. | «Comparar el SHA-256 de un archivo con una referencia previamente registrada permite detectar cambios; no demuestra que el contenido sea verdadero o esté completo». Debe quedar claro de dónde salió la referencia. |
| [FileExplorer.ts](../06_Comite/simulacion_auditoria/src/ui/apps/FileExplorer.ts), botón «Comprobar archivo» | El control consulta metadatos del inventario; no lee un archivo ni calcula o compara hashes. El texto posterior lo reconoce, pero el botón promete más. | «Revisar archivo y hash aportados» o «Ver datos del archivo». Reservar «Verificar integridad» para una comparación real de bytes con una referencia. |
| [documents.ts](../06_Comite/simulacion_auditoria/src/data/documents.ts), vistas META; [report.ts](../06_Comite/simulacion_auditoria/src/export/report.ts), cabecera | «Canon», nombres de campos en inglés y expresiones como `scope, provenance, artifactPath` llegan a documentos visibles sin explicación. | En lectura principal usar «expediente de referencia» y «versión del contenido». Conservar los nombres internos en detalles de procedencia para quien necesite revisar el código. |
| [Notebook.ts](../06_Comite/simulacion_auditoria/src/ui/Notebook.ts), sugerencia AU-02 | «Correlación verificable» no dice qué dato conectaría lectura, proceso y salida de red. | «Preservar registros de lectura y transferencia y comprobar si comparten sesión, equipo y proceso; identificar el contenido antes de afirmar exfiltración». Una coincidencia aislada, como la IP o la hora, no basta por sí sola. |
| [rules.ts](../06_Comite/simulacion_auditoria/src/audit/rules.ts), `L03-CAUSA` | «Inocuidad» es preciso pero poco natural en este recorrido. | «El orden de las horas no demuestra que el despliegue causara el incidente ni que fuera ajeno a él». |
| [interview.ts](../06_Comite/simulacion_auditoria/src/data/interview.ts), `P-RESTAURACION` | «No tenemos una ejecución exacta» no distingue fecha, respaldo o informe de restauración. | «No tenemos el informe que indique qué respaldo se usó y cómo se validaron los datos recuperados en este incidente». Si cambia el diálogo, actualizar también guion y grabación de la toma 23. |
| [report.ts](../06_Comite/simulacion_auditoria/src/export/report.ts), sección «Comprobaciones» | La impresión muestra `C02-CONTENIDO · SIN_VINCULO_NI_CONTENIDO`, pero omite la pregunta y la respuesta legibles. | Imprimir pregunta, texto elegido y referencias; mantener los códigos como localizadores secundarios. El lector debe entender la comprobación sin abrir el código fuente. |

CRM, VPN, API, recertificación y conciliación también necesitan una explicación breve cuando se introducen. Por ejemplo, en C «conciliar» debe significar comparar historial de órdenes y facturación para identificar y explicar diferencias; no basta con afirmar que se hará una conciliación.

No hace falta convertir cada pantalla en un glosario. Una frase situada junto a la primera tarea que requiere el concepto, con ayuda que se pueda volver a abrir, mantiene el lenguaje técnico y permite usarlo con sentido.

### RTO y RPO deben quedar separados en la defensa

Los intervalos de 315 y 355 minutos describen el retorno reportado del servicio. Para evaluar un RTO haría falta el objetivo aprobado y el criterio sobre qué capacidad de servicio se debía recuperar. Para evaluar un RPO hace falta identificar hasta qué momento se recuperaron los datos y contrastarlo con la pérdida tolerada. Los tiempos de caída y retorno no calculan por sí solos el RPO.

### Recomendaciones: falta completar su comprobación

Las sugerencias de la tablita son un punto de partida. Antes de incorporarlas al informe, cada una debe indicar quién actúa, sobre qué registros o sistemas, en qué plazo y qué resultado se acepta para cerrar la acción. «Recertificar» debe traducirse en revisar con el responsable qué cuentas y permisos siguen justificados. «Verificar integridad» debe indicar si se comprobarán bytes de un archivo, diferencias de órdenes o completitud de datos restaurados: son pruebas distintas.

## 3. Coherencia que sí está resuelta

- Los 13 eventos, las 31,840 filas leídas, ~1.6 GB y 216 órdenes coinciden con las páginas 4–5 del caso oficial.
- Las diferencias sobre horas reportadas son correctas: acceso–alerta, 61 min; cambios–despliegue, 20 min; caída–solicitud de recuperación, 23 min; caída–solo consulta, 315 min; caída–escritura, 355 min; caída–solicitud de conciliación, 453 min.
- No se equipara la cuenta `ext_ops_04` con una persona ni se atribuyen automáticamente a ella la elevación, lectura o modificación de órdenes.
- Se contrasta la declaración de Seguridad con la falta de contenido identificado y la del administrador de BD con la conciliación pendiente.
- No se da por probada la aprobación formal por una declaración verbal, ni se interpreta su ausencia documental como prueba de que nunca hubo autorización.
- La nota de extorsión está separada de los eventos y de las fuentes admitidas; se presenta como recreación ilustrativa.
- E-03 y EVT-04 son alternativas del mismo dato, no corroboraciones independientes. La evaluación las trata de esa forma.
- Retirar una fuente o cambiar su versión invalida su sustento; una visita o un comentario libre no completan la revisión.
- Las respuestas equivocadas que aparecen como opciones —por ejemplo, afirmar que el volumen demuestra exfiltración— no son afirmaciones aprobadas del juego. Las pruebas comprueban que se rechacen.

## 4. Documentación y respaldo de la defensa

El [README del juego](../06_Comite/simulacion_auditoria/README.md) quedó atrás respecto del código actual: dice que A/C/D/E/F conservan `ComputerPanel`, pero `main.ts` abre `ComputerDesktop` para todas las estaciones y existen sus aplicaciones y pruebas de etapa 3. También conserva una ruta absoluta de otra ubicación. Los resultados de pruebas de entregas anteriores deben leerse como históricos, no como certificación de la versión actual.

Los archivos de `artifacts/entrega/` son ejemplos de una versión anterior y el propio README indica que no fueron regenerados con las extensiones posteriores. Antes de usarlos como respaldo de la defensa hay que grabar y exportar una partida de la versión que se presentará. El vídeo existente es WebM; confirmar su reproducción en el equipo de la defensa, o preparar una conversión si ese equipo requiere otro formato.

El contexto visual auxiliar también tiene mantenimiento pendiente: `DESIGN.md` es posterior a `.impeccable/design.json` y no está registrado `buildPath`. Se puede actualizar esa documentación mediante `impeccable document` y registrar el flujo visual elegido en una tarea de diseño. Esto no modifica el diagnóstico académico de P1.

## 5. Verificación de esta revisión

- `pnpm install --frozen-lockfile`: completado.
- `pnpm test`: 116 pruebas aprobadas en 16 archivos.
- `pnpm build`: TypeScript y Vite completados. Aviso por paquete JavaScript de 841.69 kB antes de compresión; no impidió compilar.
- `pnpm test:e2e`: 31 pruebas aprobadas y 7 fallidas de 38; duración de 8.9 minutos. El comando terminó con código 1.

Seis fallos agotaron el tiempo de espera de 15 segundos al pulsar «Pausar reconstrucción» u «Omitir y entrar a la oficina» en la apertura 3D. Afectaron las pruebas de apertura a 1280×720 y 1920×1080, audio/movimiento reducido, alternativa por bloqueo del puntero, entrada/navegación y transporte de la reconstrucción. Los botones sí aparecían en las capturas de estado; la interacción no se completó. Hay avisos de bloqueo de GPU en las trazas, pero eso no prueba por sí solo la causa. Falta diagnosticar y verificar estas interacciones antes de dar por lista la apertura.

El séptimo fallo está en `tests/e2e/acceptance.spec.ts:195`: la prueba de funcionamiento local espera exactamente cinco cargas `.glb`, pero observó once. Esa expectativa quedó desactualizada frente a los modelos añadidos; el fallo no demuestra que la aplicación necesite internet. Como la prueba se detuvo allí, tampoco verifica su parte posterior de funcionamiento sin conexión en esta ejecución. Debe comprobar los recursos requeridos o el inventario vigente, en lugar de mantener el conteo antiguo.

Sí pasaron las pruebas de los seis escritorios, consultas locales, las seis revisiones completas, entrevista y 29 audios, guardado, reevaluación, exportación e impresión. Los detalles y trazas de los fallos se conservan en `06_Comite/simulacion_auditoria/artifacts/test-results/` —carpeta generada y excluida de Git—.

Las pruebas de la aplicación comprueban su funcionamiento y sus reglas educativas; no certifican ejecución de consultas académicas, autenticidad de evidencia ni entrega de los documentos ausentes.

## 6. Orden para cerrar P1

1. Reunir los entregables que existan fuera del repositorio e identificar versiones. Para lo que falte, aprobar primero los supuestos de laboratorio S-03/S-04/S-09; no fabricar aprobación, contenido transferido o responsables.
2. Completar base, consultas y resultados, conservando su origen sintético; registrar sus archivos y hashes.
3. Elaborar PT-20–PT-25, cronología, hipótesis y evaluación de la respuesta, con conclusiones limitadas cuando corresponda.
4. Entregar B1-1/B1-2 y las propuestas de 0–24 h y 24–72 h a P3; P2 y P3 conservan sus responsabilidades y numeración.
5. Aplicar las correcciones de lenguaje anteriores y hacer legible la impresión; sincronizar cualquier diálogo cambiado con su audio.
6. Integrar la sección forense y la presentación, regenerar el respaldo y ensayar las preguntas 01/02/03/06/07 con cronómetro.

## Registro de uso de IA de esta sesión

| Fecha | Herramienta | Prompt resumido | Qué se usó y dónde | Validación humana | Cambios y aprendizaje |
| --- | --- | --- | --- | --- | --- |
| 2026-11-06 | Codex | Revisar si P1 está completo y si el juego tiene coherencia, términos técnicos explicados y redacción sin relleno. | Contraste de PDFs, guía vigente, código y pruebas; este documento de revisión. | Pendiente de P1. | Pendiente de P1. |
