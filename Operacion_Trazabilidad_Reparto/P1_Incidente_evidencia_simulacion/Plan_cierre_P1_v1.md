# Plan para completar P1

Fecha: 6 de noviembre de 2026. Estado del documento: plan de trabajo inicial. La ejecución comenzó en I1; los acuerdos vigentes y sus comprobantes se consultan en [ESTADO_P1.md](ESTADO_P1.md). Las propuestas de este documento conservan el contexto inicial y no sustituyen los valores aprobados después.

P1 eligió el laboratorio pequeño (85,000 clientes, 3,000 órdenes, 120 cuentas, 3,000 sesiones, semilla 1410) y pidió que los datos los genere otro modelo. Se preparó [el instructivo específico](../04_SQL/Instrucciones_generacion_datos_P1_v1.md), junto con el esquema comprobado y el registro de supuestos aprobados. No se generaron datos ni resultados de consultas.

Método de referencia: [expediente y laboratorio sintético](../03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md), contrastado con los dos PDFs oficiales. Ya se abrió el índice de resúmenes E-01–E-10 y se calcularon hashes de los documentos recibidos; esto no equivale a recibir extracciones de los sistemas ni a ejecutar consultas.

Para continuar entre conversaciones, usar [el plan por instancias](Ejecucion_P1_por_instancias_v1.md) y actualizar [ESTADO_P1.md](ESTADO_P1.md). El plan presente es el panorama general; el estado concentra decisiones y avance reales.

El trabajo empieza por los datos y termina en la defensa. Cada bloque deja una muestra para revisión de P1; los supuestos que determinan los datos se acuerdan antes de usarlos. El objetivo es poder abrir el archivo que sustenta una afirmación y repetir la comprobación que produjo su resultado.

## 1. Orden de trabajo y criterio de cierre

| Bloque | Trabajo y archivos | Cuándo lo damos por terminado |
| --- | --- | --- |
| 1. Base de laboratorio | Supuestos, esquema SQL Server, generador con semilla fija, carga, usuario de lectura, diccionario y diagrama de tablas. Archivos en `04_SQL/` y `03_Evidencias/`. | Se crea desde cero, sus relaciones son válidas, reproduce las cifras del caso y distingue registros del expediente de datos agregados por el equipo. |
| 2. Consultas y evidencia | Q-01–Q-12, resultados completos en CSV, explicación de cada resultado, índice, hashes y registro de custodia. | Se ejecutan como auditor de solo lectura; cada CSV corresponde a una consulta, una versión de los datos y una ejecución registrada. |
| 3. Análisis forense | PT-20–PT-25, cronología, tabla de hipótesis, análisis de transferencia y órdenes, mapa causal y evaluación de la respuesta. | Cada conclusión tiene fuente y límite; cualquier prueba que no pueda ejecutarse queda identificada. Los tiempos y conteos coinciden con los archivos del bloque 2. |
| 4. Entregas al equipo | Dos borradores B1-1/B1-2, propuestas de 0–24 h y 24–72 h, sección forense del informe y registro de IA. | Se usa el formato del curso; P2 recibe la sección y P3 recibe los borradores y acciones, con dependencias pendientes identificadas. La consolidación y los códigos finales corresponden a sus responsables. |
| 5. Juego y defensa | Correcciones de lenguaje, impresión legible, diagnóstico de la apertura, diapositivas, respuestas a preguntas 01/02/03/06/07 y respaldo actualizado. | Las herramientas describen lo que hacen, los términos se explican en su contexto, las interacciones corregidas pasan sus pruebas y la demostración cabe dentro de la defensa de 12 minutos del equipo. |

Primera entrega de trabajo: el bloque 1 completo y una lectura conjunta de sus tablas y supuestos. El informe final se redacta después de ejecutar las consultas, para no escribir conclusiones anticipadas.

## 2. Una misma historia en todos los archivos

Se conservarán tres orígenes identificados:

- **Expediente del curso:** los 13 eventos, sus horas reportadas, 31,840 registros leídos, ~1.6 GB y 216 órdenes. Cada dato conserva su referencia al PDF y al código E-xx cuando corresponda.
- **Laboratorio del equipo:** cuentas, sesiones, operaciones normales y casos de prueba que generemos para ejecutar SQL. Cada añadido lleva su supuesto, semilla y versión. Sus resultados describen el laboratorio, sin convertirlos en extracciones de RedNova.
- **Análisis del auditor:** cálculos, hipótesis y conclusiones que citan las fuentes y resultados anteriores. Un dato calculado conserva la fórmula y las horas o cantidades de entrada.

La persona que usó `ext_ops_04`, el contenido de la transferencia, la atribución de los cambios de órdenes y la relación causal del despliegue seguirán como desconocidos mientras no haya sustento. Tampoco se completarán relojes desconocidos con un desfase cero ni se convertirán ~1.6 GB en una cifra exacta de bytes del caso.

Por ejemplo: la fila E-04 describe una transferencia aproximada; Q-06 puede caracterizar el tráfico sintético y compararlo con su actividad habitual; PT-22 documenta ese resultado y aclara que no identifica el contenido transferido en el caso. El informe y el juego conservarán ese mismo límite.

## 3. Propuesta inicial de supuestos

La guía de P1 pide aprobar los supuestos antes de usarlos. Estas filas son propuestas, no acuerdos del equipo ni hechos del incidente.

| Código previsto | Propuesta para revisar con P1 | Cómo evita contradicciones |
| --- | --- | --- |
| S-03 | Mostrar la hora de referencia en Guatemala, UTC−6, formato de 24 horas. Conservar hora original y zona cuando se conozcan. | Las horas preliminares del curso no se rotulan como una normalización forense ya verificada. |
| S-04 | Pendiente de definir: horario, tipo y fechas necesarios para probar respaldos y restauraciones en el laboratorio. El expediente reporta respaldos programados y una declaración de Continuidad sobre una restauración documentada varios meses antes. | La propuesta inicial de la 01:00 y el 15 de mayo no está en los PDFs y se retira de la propuesta activa. Si necesitamos fechas sintéticas para una prueba, se acordarán y registrarán como supuesto. Programación, ejecución y restauración seguirán separadas. |
| S-09 | Reproducir los 85,000 clientes indicados por el caso y generar 12,000 órdenes, 600 cuentas y unas 15,000 sesiones; semilla 1410. Actividad de referencia de SQL y red del 7 al 13 de octubre. | La población del laboratorio queda declarada y se puede regenerar. La fila de lectura de 31,840 registros no se confunde con el número total de clientes. |

Los ejemplos de bajas pendientes, cuentas compartidas, privilegios sin MFA y permisos para alterar bitácoras se detallarán en el diseño del bloque 1 antes de generar filas. Sus cantidades, alcance y códigos de supuesto deberán quedar acordados; P2 mantiene el registro consolidado del equipo.

El laboratorio incluirá actividad nocturna legítima. Para buscar actividad anómala se comparará una cuenta con su comportamiento habitual, en vez de usar únicamente que ocurrió de madrugada.

## 4. Entorno propuesto

Usar SQL Server en un contenedor local para ajustarse a la guía y poder repetir la carga. En esta computadora están disponibles Docker y Python, pero todavía no se comprobó el estado del servicio Docker ni la disponibilidad de una imagen de SQL Server. `sqlcmd` no aparece en el PATH del sistema. La instalación y ejecución del laboratorio se resolverán al iniciar el bloque 1; todavía no se afirma que el motor esté listo.

Python generará datos con semilla fija. Las consultas académicas se ejecutarán en SQL Server con `auditor_lectura`; el editor local del juego seguirá identificado como una herramienta distinta. Para documentos finales se pueden usar LibreOffice y el navegador, presentes en el equipo, manteniendo además los archivos fuente editables.

## 5. Consultas previstas

Se proponen las doce consultas de la guía de P1 para cubrir su reparto y alimentar a P2/P3. El mínimo del curso es seis, pero no conviene dejar sin análisis las evidencias propias de P1.

| Consulta | Pregunta que responde |
| --- | --- |
| Q-01 | ¿Qué bajas de personal conservan cuentas activas en el laboratorio? |
| Q-02 | ¿Qué cuentas privilegiadas no tienen MFA, se comparten o no han sido recertificadas? |
| Q-03 | ¿Qué sesiones se apartan del patrón habitual de cada cuenta? |
| Q-04 | ¿Qué asignaciones o elevaciones no tienen ticket o vencimiento documentados? |
| Q-05 | ¿Qué lecturas se apartan del volumen habitual de cada cuenta SQL? |
| Q-06 | ¿Qué transferencias tienen destino sin clasificar o volumen fuera de su actividad habitual? |
| Q-07 | ¿Qué órdenes cambiaron y qué muestran sus campos, cuenta y origen disponibles? |
| Q-08 | ¿Existen duplicidades según una regla documentada de órdenes/facturación? |
| Q-09 | ¿Cómo varían los respaldos y cuándo se documentó una restauración? |
| Q-10 | ¿Qué despliegues carecen de aprobación previa o prueba documentada? |
| Q-11 | ¿Qué alertas carecen de asignación, primera acción o cierre documentados? |
| Q-12 | ¿Cómo se reconstruye la cronología conservando origen, hora y certeza? |

Cada consulta llevará objetivo, sentencia, ejecución, resultado y tres explicaciones: qué sugiere, qué demuestra en el laboratorio y qué no permite concluir sobre el caso. Los umbrales y las reglas de duplicidad se documentarán antes de interpretar resultados.

## 6. Regla de redacción y revisión conjunta

Cada término técnico se introduce con su función concreta. Por ejemplo, al presentar SHA-256 se calculará la huella de un CSV y se explicará qué permite comprobar su comparación con la referencia registrada. Al hablar de conciliación se mostrarán las columnas y diferencias comparadas. RTO y RPO se explicarán por separado, sin deducir pérdida de datos a partir del tiempo de caída.

Una recomendación debe decir qué se hará, quién responde, en qué plazo y con qué comprobación se cerrará. Los responsables, criterios y objetivos que dependen de P2/P3 se dejarán pendientes hasta recibirlos; P1 no asignará sus códigos ni decidirá sus entregas por ellos.

En cada bloque revisaremos una muestra pequeña y legible antes de cerrar el conjunto: algunas filas, una consulta con su salida o un papel de trabajo. La prueba será poder explicar su resultado con palabras propias y abrir el archivo que lo respalda.

## Registro de uso de IA de esta sesión

| Fecha | Herramienta | Prompt resumido | Qué se usó y dónde | Validación humana | Cambios y aprendizaje |
| --- | --- | --- | --- | --- | --- |
| 2026-11-06 | Codex | Proponer cómo completar P1 junto al integrante, con datos, análisis, juego y lenguaje coherentes. | Este plan, orden de entregas y propuesta inicial S-03/S-04/S-09. | Pendiente de P1. | Pendiente de P1. |
| 2026-11-06 | Codex | Alinear el trabajo con los PDFs oficiales y evitar evidencia inventada. | Método en `03_Evidencias/`; retiro de las fechas no aprobadas de S-04 de la propuesta activa. | Pendiente de P1. | Pendiente de P1. |
