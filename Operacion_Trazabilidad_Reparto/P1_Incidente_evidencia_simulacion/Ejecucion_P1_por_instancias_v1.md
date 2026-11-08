# Ejecución de P1 en seis sesiones

Este es el orden de ejecución para conversaciones nuevas de Codex. Una sesión trabaja a la vez sobre el mismo proyecto. Cada una recibe archivos comprobados, hace un bloque y deja el estado para la siguiente. No hacen falta un coordinador automático, otra aplicación ni un sistema de agentes permanente.

**Punto de partida de este plan:** planificación y fuentes iniciales preparadas; base, consultas y entregas finales pendientes. Se empieza en **I1**. El avance posterior y la próxima sesión se consultan únicamente en `ESTADO_P1.md`.

## 1. Cómo iniciar una instancia

Abrir el repositorio y pegar este mensaje, sustituyendo `I1` por la sesión que corresponda:

```text
Ejecuta la sesión I1 del archivo
Operacion_Trazabilidad_Reparto/P1_Incidente_evidencia_simulacion/Ejecucion_P1_por_instancias_v1.md.
Primero lee ESTADO_P1.md, en esa misma carpeta, y el método
Operacion_Trazabilidad_Reparto/03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md.
Comprueba los archivos de entrada y los requisitos pertinentes de los dos PDFs de
Operacion_Trazabilidad_Reparto/00_Material_del_curso/ antes de trabajar.
Respeta las instrucciones AGENTS.md aplicables y usa exclusivamente pnpm para JavaScript.
Completa el bloque solicitado, verifica sus salidas y actualiza ESTADO_P1.md.
Conserva los cambios ajenos y las versiones de evidencia. No marques una prueba como
ejecutada ni un supuesto como aprobado si no consta. Deja una muestra explicable para P1.
Si falta un dato necesario, plantea la decisión concreta y continúa lo que no dependa de ella.
```

Si la conversación termina a mitad del bloque, otra instancia continúa el mismo identificador desde el estado escrito. No empieza de cero ni trata el resumen de una conversación como comprobante de ejecución.

### Qué leer y qué actualizar

- **Verdad del caso y requisitos:** PDFs oficiales. El proyecto, p. 5–6, permite registros sintéticos verificables; la guía, pasos 6–8 y 10–12, fija custodia, consultas, análisis y entregas.
- **Procedencia y límites:** [método de evidencia y laboratorio](../03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md).
- **Orden y alcance:** este plan. [Plan_cierre_P1_v1.md](Plan_cierre_P1_v1.md) conserva el panorama general; la Tarea 9 de la guía interna fija el juego vigente, sin segunda corrida obligatoria.
- **Avance y decisiones reales:** [ESTADO_P1.md](ESTADO_P1.md). Cada sesión lo actualiza al terminar o interrumpirse; no modifica el método versionado que ya tiene hash para llevar un diario.

Al comenzar, revisar `git status`, confirmar qué está creado y comprobar las entradas necesarias. Al cerrar, registrar archivos y versiones, comandos realmente ejecutados y resultado, decisiones pendientes y siguiente acción. Los estados son `pendiente`, `en curso` y `comprobado`; un documento redactado sin ejecutar su comprobación sigue `en curso`.

Las consultas, datos y documentos se guardan en las carpetas del curso. Se conserva el código fuente de cada PDF/XLSX. Los scripts solo se añaden cuando permiten repetir una tarea necesaria; primero se usan Python estándar, SQL Server, LibreOffice, Chrome y las dependencias existentes. Los permisos para instalar, descargar o ejecutar fuera del aislamiento se resuelven mediante los controles normales de la herramienta.

## 2. I1 — Cerrar el diseño y los supuestos

**Entrada:** PDFs, método, índice inicial E-01–E-10 y estado. Leer las tareas 1–4 de la guía interna de P1 para respetar códigos y reparto.

**Trabajo:**

1. Verificar las referencias y hashes iniciales. Separar lo reportado por el curso, lo desconocido y lo que requiere una decisión del laboratorio.
2. Acordar con P1 S-03, S-04 y S-09 y los demás supuestos imprescindibles: período, volúmenes, actividad normal, casos de prueba, umbrales y reglas de duplicidad. Fijar la fecha de corte de las consultas para que sus resultados no dependan del día en que se repitan. Las fechas de respaldo retiradas siguen retiradas. Registrar valor, motivo, origen, estado y referencia a la aprobación real.
3. Diseñar las tablas y campos necesarios para Q-01–Q-12. Para cada consulta indicar pregunta, campos, origen de las filas, regla de selección y límite. No añadir tablas sin una pregunta o relación que las necesite.
4. Cubrir las seis categorías oficiales: permisos excesivos, bajas pendientes, horarios anómalos, modificaciones, duplicidades y variación de respaldos. Prever las evidencias propias E-02/03/04/05/07 y una comprobación específica de quién puede modificar bitácoras para la alerta 08; una cronología sola no resuelve esa prueba.
5. Decidir el entorno tras comprobar Docker/SQL Server disponibles, espacio y acceso. Definir nombre propio de base y, si se usa contenedor, puerto local y almacenamiento que no interfieran con servicios existentes. Elegir cómo importar/exportar y repetir todo desde una base vacía.

**Salidas:** `03_Evidencias/Supuestos_P1_v1.csv`, `04_SQL/Diseno_laboratorio_v1.md` y `03_Evidencias/Programa_pruebas_P1_v1.csv` con pruebas aún no ejecutadas. Abrir `07_Referencias/Registro_uso_IA_v1.csv`, conservar las entradas anteriores identificables y añadir esta sesión; la validación humana queda pendiente.

Recibir la plantilla UdeO o preparar `01_Informe/Plantilla_UdeO_v1.docx` según el formato escrito en la guía interna, identificando esa procedencia. Dejarla disponible para P2 desde I1; no esperar a la redacción final para resolver el formato.

El diseño fija origen por fila, tratamiento de nulos, claves, períodos, unidades y vínculo E/Q/T/PT. Las referencias T de P1 usan 20–39 y los PT previstos 20–25. P2 conserva la numeración global R/C/S; si un código adicional no está acordado, usar una referencia provisional explícita y registrar el mapeo pendiente. No registrar aprobación de P2 por inferencia.

**Cierre:** las seis categorías SQL oficiales tienen campos y casos normales/anómalos suficientes para consultas ejecutables; no se sustituyen por una nota de ausencia. Q-01–Q-12 tienen diseño y alcance definidos. Las limitaciones corresponden a vacíos del incidente o a análisis adicionales —por ejemplo, facturación no recibida— y no eliminan el mínimo obligatorio. Los supuestos usados para generar filas están acordados y está definido el comando y entorno que I2 debe construir. No se genera el conjunto mientras haya una decisión pendiente que determine sus filas.

**Explicación para P1:** mostrar cinco filas propuestas y explicar cuáles reproducen el expediente, cuáles son actividad sintética y cuáles conservan información desconocida.

## 3. I2 — Construir y ejecutar el laboratorio

**Entrada:** diseño y supuestos acordados de I1. Comprobar sus versiones antes de cargar datos.

**Trabajo:** crear la base, el generador con semilla fija y la carga; usar datos ficticios y direcciones reservadas. Incluir actividad normal y casos que permitan distinguir las condiciones de las consultas. Las filas que representan las cifras del curso conservan ese origen. Las horas originales desconocidas y los bytes exactos no aportados permanecen ausentes.

**Salidas mínimas:** `04_SQL/README.md`, `01_esquema.sql`, `02_generar_datos.py`, `03_carga.sql`, `04_usuario_lectura.sql` y `verificar_laboratorio.sql`; datos generados en `04_SQL/datos/`. Si hace falta preparar motor/base, añadir un único procedimiento en el README y su archivo de configuración necesario. El orden efectivo es preparar base → esquema → generar → cargar → usuario de lectura → comprobar; no intentar asignar permisos sobre una base que aún no existe.

Entregar además `03_Evidencias/Diccionario_datos_v1.md`, diagrama de relaciones editable y PNG, y `03_Evidencias/Laboratorio_v1.json`: semilla, supuestos, versiones, motor realmente usado, comandos, conteos y rutas/hashes de entrada. Guardar la salida de comprobación en `03_Evidencias/resultados/Validacion_laboratorio_v1.txt`. El documento de diseño puede servir de fuente del diagrama; no crear documentación paralela sin necesidad.

Al generar datos y comprobantes, calcular sus hashes e iniciar `03_Evidencias/hashes_sha256_v1.csv`. Preservar su primera versión en `03_Evidencias/originales/` y trabajar sobre copias desde este bloque. No esperar a I3 para registrar el archivo inicial. Dejar base, instrucciones, diccionario y supuestos disponibles para P2 y los datos de respaldos para P3; anotar «preparado para entregar» hasta que se produzca el traspaso real.

**Cierre:** reconstruir desde cero en una base vacía propia y comprobar claves, conteos, nulos, períodos y los 13 eventos. Probar que `auditor_lectura` puede consultar y carece de permisos de escritura/administración; la prueba no altera datos de terceros. Una carga fallida o un motor no disponible deja el bloque en curso, sin CSV de resultados simulados. Un registro histórico de restauración generado como supuesto no se rotula como restauración ejecutada durante este trabajo.

**Explicación para P1:** enseñar las relaciones de tablas, regenerar una muestra y explicar por qué obtener la misma cantidad con la misma semilla no verifica por sí solo el incidente.

## 4. I3 — Ejecutar consultas y registrar sus resultados

**Entrada:** laboratorio comprobado, usuario de lectura y programa de pruebas. Verificar que no cambió el conjunto de I2.

**Trabajo:** implementar Q-01–Q-12 en `04_SQL/Analisis_Auditoria.sql`, comentadas y de solo lectura, con la fecha de corte acordada. Probar condiciones normales y anómalas y campos desconocidos. En especial: contar órdenes distintas frente a cambios, comparar actividad por cuenta y no solo por hora, distinguir programación/ejecución/restauración y comprobar permisos de bitácora con una consulta de soporte identificada para PT-25. Si se afirma un permiso efectivo, comprobarlo en el motor; una fila que declara un rol solo demuestra lo registrado en esa fila.

**Salidas:** doce CSV completos `03_Evidencias/resultados/Q-01.csv`…`Q-12.csv`; resultado de la comprobación de permisos de bitácora; `03_Evidencias/Consultas_resultados_v1.md` con objetivo, regla/umbral, conteo y qué sugiere/prueba/no prueba cada consulta. Conservar una captura real de la conexión como `auditor_lectura` con una consulta, o registrar que la captura está pendiente; nunca fabricarla. Registrar ejecución, versión y comandos en `03_Evidencias/resultados/Ejecuciones_v1.csv` y actualizar el programa de pruebas.

Completar `03_Evidencias/Indice_evidencias_v1.csv` desde el índice inicial, ampliar `03_Evidencias/hashes_sha256_v1.csv` iniciado en I2 y abrir `03_Evidencias/formulario_custodia.md`. E-01–E-10 conservan su origen de resumen; artefactos de P1 usan E-11–E-29, según el índice, sin invadir rangos de P2/P3. Versiones o archivos de una misma evidencia se individualizan por ruta y hash. Los PT y documentos de planificación mantienen sus propios códigos; no se convierten automáticamente en nuevas extracciones.

Preservar originales recibidos y primeras versiones de artefactos en `03_Evidencias/originales/`, con trabajo sobre copias. El índice distingue hash del PDF, hash del CSV y hash de una extracción original si algún día se aporta. La custodia registra personas, fechas y traspasos reales; los campos desconocidos siguen pendientes. No se incluye el propio registro de hashes dentro de sus entradas.

**Cierre:** repetir consultas sobre el mismo conjunto y comprobar resultados por contenido, con orden determinista. Contrastar al menos un conteo con los datos base por un método distinto. Los CSV son legibles, conservan encabezados, unidades y el tratamiento documentado de nulos. Las salidas tienen origen, versiones y hashes verificables. Las seis categorías oficiales están cubiertas; una restricción adicional, como no disponer de facturación para conciliar, figura en el alcance y no se oculta con datos inventados.

Dejar Q-01–Q-04 y Q-10 con sus resultados e interpretación disponibles para P2; Q-09 y S-04 para P3. Registrar su versión y situación de entrega en el estado; estos avances no esperan a I6 ni requieren que se hayan escrito los hallazgos finales.

**Explicación para P1:** ejecutar una consulta, abrir su CSV y localizar un registro en la base. Explicar por qué una anomalía introducida para probar la consulta no demuestra una infracción real de RedNova.

## 5. I4 — Elaborar análisis y entregas académicas de P1

**Entrada:** resultados comprobados y programa de pruebas; criterios y aportes disponibles de P2/P3. Consultar fuentes oficiales antes de citar normas o versiones y registrar referencia y aplicación concreta en `07_Referencias/Fuentes_P1_v1.md`.

**Salidas y contenido:**

- `03_Evidencias/Papeles_P1_v1.md`: PT-20/E-02, PT-21/E-03, PT-22/E-04, PT-23/E-05, PT-24/E-07 y PT-25/alerta 08. Plantilla C: objetivo, R/T/E, fuente/fecha/custodio, procedimiento/muestra, resultado y conclusión. Un resultado del laboratorio conserva ese alcance.
- `03_Evidencias/Cronologia_investigada_v1.csv`: fuente, hora reportada, original/zona, normalización cuando proceda, fiabilidad y motivo, certeza, cuenta/activo, E/Q y límites. Verificar los 13 eventos e intervalos; analizar lagunas y sensibilidad al posible desfase, rotulando los escenarios hipotéticos.
- `01_Informe/Seccion_forense_P1_v1.md`: unas cuatro páginas al maquetar, con al menos dos hipótesis, evidencia a favor/en contra, qué las confirmaría/descartaría, mapa causal con grados de certeza y evaluación de respuesta. Comparar el tamaño estimado de 31,840 registros con ~1.6 GB declarando formato/unidades del cálculo; revisar las 216 órdenes sin inventar cuentas, montos o conciliaciones. Explicar aislamiento, revocación, preservación y recuperación como preguntas evaluadas o recomendaciones, según los datos.
- `03_Evidencias/Borradores_hallazgos_P1_v1.md`: B1-1 y B1-2 con plantilla D y causas distintas; dentro de detección, registros o preservación. Criterio preciso y verificado; resultado no concluyente cuando corresponda. P3 asigna H definitivos.
- `05_Plan/Acciones_P1_0_72h_v1.csv`: acciones de 0–24 h y 24–72 h para P3, con sustento, responsable propuesto, plazo, comprobación de cierre y dependencias. Preservar y recuperar son decisiones de la administración; el auditor evalúa y recomienda.

**Cierre:** cada cifra puede abrirse en su fuente o cálculo. No se declara exfiltración, causa raíz, culpable, incumplimiento ni restauración validada por mera reproducción sintética. El mapa causal puede terminar con vínculos no demostrados, indicando la prueba necesaria. RTO/RPO solo se evalúan con objetivos y datos aportados por P3; los intervalos reportados se pueden entregar aunque esos objetivos falten.

Usar la plantilla preparada/recibida en I1. Dejar la cronología y sus intervalos disponibles para P3 al producirlos; también B1-1/B1-2 y acciones al cerrar sus documentos, sin esperar a I6. Incorporar dependencias pendientes de P2/P3 al estado y entregar los materiales de P1 por archivos, sin enviar mensajes externos. De los borradores de P2 recibidos, registrar tres objeciones por hallazgo; si no llegaron, dejar esa revisión pendiente. Registrar igualmente la revisión de P3 sobre B1-1/B1-2 cuando llegue.

**Explicación para P1:** defender una hipótesis, una conclusión no concluyente y una recomendación con su criterio y evidencia; responder qué dato cambiaría cada conclusión.

## 6. I5 — Corregir el juego y comprobar el recorrido

**Entrada:** análisis de I4 y [revisión inicial](Revision_P1_coherencia_y_entregables_v1.md). Trabajar en `06_Comite/simulacion_auditoria/`, preservando la oficina y el alcance vigente.

**Trabajo:** explicar términos al introducirlos; precisar el botón que consulta metadatos; imprimir preguntas y respuestas legibles, conservando códigos como referencia; revisar recomendaciones y límites. La entrevista grabada tiene 29 frases: conservar el diálogo cuando baste ayuda escrita. Si cambia una frase, actualizar guion y marcar el audio correspondiente para reemplazo real, sin afirmar que ya se grabó.

Diagnosticar los seis fallos de interacción con la apertura y revisar el test que esperaba cinco modelos y observó once. Comprobar los recursos requeridos, sin eliminar la prueba de funcionamiento local. No considerar que aumentar el tiempo de espera demuestra que un defecto esté resuelto.

El editor del juego consulta datos locales; la ejecución SQL académica se demuestra con sus anexos. No se requiere añadir servidor al juego, conectar SQL Server al navegador ni convertir los resultados sintéticos en nuevas fuentes originales del caso. Una nueva fuente o regla evaluable exige su versión y reevaluación correspondiente.

**Salidas:** correcciones necesarias, README actualizado y un informe breve de validación en `06_Comite/simulacion_auditoria/artifacts/cierre-p1/README.md`, con comandos, resultados, capturas y límites. Aplicar las instrucciones de diseño pertinentes antes de editar la interfaz.

**Cierre:** pruebas específicas de las correcciones, compilación y una ejecución completa de `pnpm verify` tras el último cambio de comportamiento. Probar las seis revisiones, retorno entre PC/libreta/TI, persistencia, impresión, móvil, movimiento reducido y alternativa plana. Registrar por separado cualquier fallo del entorno y lo que no se verificó; no presentar la batería fallida como aprobada. Un ensayo con el equipo/proyector de defensa sigue pendiente hasta realizarlo.

**Explicación para P1:** hacer una revisión completa y explicar qué comprueba el juego, qué comprueba SQL y por qué «Documentado» no significa hallazgo aprobado.

## 7. I6 — Integrar archivos finales y revisar desde otra instancia

**Entrada:** entregas I1–I5 y materiales de P2/P3 efectivamente recibidos. Esta sesión reabre los resultados en lugar de confiar solo en los cierres anteriores.

**Trabajo y salidas:**

1. Repetir las comprobaciones afectadas y contrastar cifras, códigos, referencias, versiones y pendientes. Verificar archivos fuente y hashes con los bytes actuales. Si algo cambió, corregir o devolver la tarea concreta al bloque responsable.
2. Exportar `03_Evidencias/indice_evidencias.xlsx`, `Programa_pruebas_P1_v1.xlsx`, `Cronologia_investigada_v1.xlsx` y los documentos finales de P1 con sus fuentes editables. Preparar `01_Informe/Seccion_forense_P1_v1.docx` y `Plantilla_UdeO_v1.docx` para P2. Conservar también PDF de la sección para revisión.
3. Preparar `03_Evidencias/Papeles_Trabajo_P1_v1.pdf`. El `Papeles_Trabajo.pdf` consolidado se integra con los PT realmente recibidos de P2/P3, ordenados por código e índice inicial. Si faltan, el paquete de P1 queda identificado y la consolidación sigue pendiente.
4. Preparar `06_Comite/Presentacion_P1_v1.pdf` y `Guion_defensa_P1_v1.md`: fragmento de reconstrucción, cronología, hipótesis y revisión jugable, coordinados con los 12 minutos del equipo. Incluir respuestas de 30–45 segundos a 01/02/03/06/07 y tres escenarios hipotéticos de evidencia contradictoria rotulados como ejercicios de defensa. Integrar la presentación completa solo cuando se reciban las diapositivas de P2/P3; no escribir sus conclusiones por ellos.
5. Regenerar vídeo y libreta de respaldo desde la versión final del juego. Entregar un formato que se reproduzca en el equipo de defensa y registrar la comprobación real; no confundir WebM con MP4. Conservar la cronología imprimible y el paquete que P1 pueda copiar a USB. No afirmar ensayo físico sin realizarlo.
6. Consolidar referencias y registro de IA en `07_Referencias/`, con fuentes verificadas y exportación PDF. Mantener pendiente la validación humana no realizada. Registrar en `ESTADO_P1.md` qué archivos recibe P2, cuáles P3 y qué integración sigue abierta.

**Cierre:** revisar el checklist de abajo, abrir PDF/XLSX y reproducir el vídeo. El estado puede decir «paquete técnico de P1 comprobado» con dependencias del equipo explícitas; solo se declara «entrega del equipo integrada» cuando existen los aportes y archivos consolidados. La aprobación académica no la concede el agente.

**Explicación para P1:** recorrer en dos minutos una afirmación desde la diapositiva hasta el PT, la consulta, el CSV y su origen; después ensayar su parte con cronómetro y registrar lo que efectivamente se ensayó.

## 8. Comprobación de cobertura

| Requisito | Responsable de producir | Responsable de comprobar al cierre |
| --- | --- | --- |
| Supuestos acordados, diseño, claves y datos ficticios reproducibles | I1–I2 | I2 e I6 |
| Seis categorías SQL oficiales y Q-01–Q-12 ejecutadas con resultados | I3 | I3 e I6 |
| Alerta 08: permisos de bitácora, no solo tiempo/custodia | I1 diseña, I2 representa, I3 comprueba | I4/PT-25 e I6 |
| Índice, originales/copias, hashes y custodia con fechas reales | I1 registra fuentes, I3 amplía | I6 |
| PT-20–PT-25 según plantilla C | I4 | I6 |
| Cronología, relojes, hipótesis, transferencia, órdenes y causa con certeza | I4 | I6 |
| Respuesta y propuestas de 0–24 h / 24–72 h | I4 | I6 y revisión de P3 pendiente cuando corresponda |
| B1-1/B1-2 según plantilla D y revisión cruzada | I4 | I6; validación de P3 identificada |
| Juego coherente, impresión comprensible y controles utilizables | I5 | I5; muestra reabierta por I6 |
| Sección forense, XLSX/PDF, plantilla y defensa de P1 | I4–I6 | I6 y ensayo humano registrado |
| Referencias, citas y uso de IA | Cada sesión | I6; validación humana pendiente hasta hacerse |
| Integración de PT y diapositivas de P2/P3 | I6 con los materiales recibidos | I6; faltantes expresos en el estado |

## 9. Reanudar y corregir sin repetir todo

Una nueva sesión verifica las entradas y continúa la primera acción pendiente de su bloque. No da por aprobado un supuesto porque una conversación diga «okay» sin concretar a qué decisión responde. Tampoco pide autorización por cada archivo o prueba reversible ya incluidos en el trabajo acordado.

Si cambia un supuesto o el conjunto, repetir carga y consultas afectadas y actualizar sus PT y conclusiones. Si cambia una consulta, repetir esa consulta y revisar sus documentos dependientes. Si solo cambia redacción, regenerar el documento y su hash; no hace falta reconstruir la base. Un cambio de comportamiento del juego exige las pruebas correspondientes. Conservar las versiones previas y registrar por qué cambió la nueva.

Una revisión automática es una comprobación técnica. La explicación y validación de P1 se registran por separado. Cada sesión añade su entrada real al registro de IA y deja cinco líneas para el integrante: qué produjo, qué comprobó, qué debe revisar P1, qué podrían preguntarle y cuál es el siguiente paso.
