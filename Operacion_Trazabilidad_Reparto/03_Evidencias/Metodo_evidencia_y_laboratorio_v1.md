# Método de trabajo: expediente y laboratorio sintético

Fecha de preparación: 6 de noviembre de 2026. Estado: método documentado y registro inicial de fuentes; consultas SQL y pruebas de laboratorio todavía no ejecutadas.

## 1. Qué permite y exige el curso

Los dos PDFs de `00_Material_del_curso/` son la referencia principal. Las guías internas de P1 organizan el trabajo, pero no sustituyen sus requisitos.

| Fuente y ubicación | Requisito | Cómo se aplica en P1 |
| --- | --- | --- |
| [Proyecto](../00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf), p. 5, advertencia forense | El expediente es un resumen inicial; se deben solicitar o generar registros sintéticos verificables, anotar supuestos y reconocer preguntas abiertas. | E-01–E-10 se registran como resúmenes del curso. Los archivos del laboratorio llevan su origen sintético. |
| Proyecto, p. 6, «Consultas SQL y analítica» | Base sintética, diseño lógico, datos de prueba, mínimo seis SELECT, resultados, interpretación y limitaciones. | Las consultas se ejecutan sobre la base creada por el equipo y se conservan sus resultados reales de ejecución. |
| [Guía de entregables](../00_Material_del_curso/Guia_Entregables_Operacion_Trazabilidad.pdf), p. 3, paso 6 | Origen, fecha, custodio, integridad, método, copias y hash cuando corresponda. | Se conserva el PDF recibido y se identifica qué archivo se procesó. Los datos desconocidos del registro de sistema original quedan pendientes. |
| Guía de entregables, p. 3, paso 7 | Registros ficticios coherentes, supuestos, relaciones entre tablas y seis o más SELECT; distinguir lo que sugiere el resultado de lo que prueba. | Se documenta el diseño antes de generar los datos; cada resultado declara el conjunto y la versión a los que corresponde. |
| Guía de entregables, p. 3, paso 8 | Cronología por fuente, fiabilidad y tiempo; mínimo dos hipótesis y análisis de información faltante. | Se conservan las horas reportadas y se presentan alternativas sin completar autorías, contenidos o desfases desconocidos. |
| Guía de entregables, p. 4, paso 10 | Condición, criterio, causa, efecto, evidencia y prioridad; declarar no concluyente cuando el sustento sea insuficiente. | Una anomalía generada por diseño no se presenta como descubrimiento del ataque. El alcance sintético aparece también en el borrador de hallazgo. |
| Proyecto, p. 8, integridad académica; guía, p. 5, declaración de IA | Usar datos ficticios, citar fuentes y registrar herramienta, prompts, uso, validación humana y ajustes. | Se conserva la procedencia de los archivos y se deja la revisión humana pendiente hasta que P1 la realice. |

## 2. Origen y alcance de cada afirmación

| Clase | Qué contiene | Redacción válida |
| --- | --- | --- |
| Dato reportado por el curso | Señales, cronología y declaraciones de los PDFs. | «El expediente reporta una lectura de 31,840 registros (E-03; proyecto, p. 5)». |
| Supuesto del equipo | Decisión necesaria para diseñar el laboratorio que no figura en el expediente. | «Para el laboratorio se definió [decisión], según S-xx, aprobado el [fecha real de aprobación]». Antes de aprobarlo queda como propuesta. |
| Artefacto sintético | Base, CSV o bitácora generados por el equipo con un diseño declarado. | «Registros sintéticos generados con la versión [versión] y la semilla [valor]». |
| Resultado de prueba ejecutada | Salida efectivamente producida por una consulta o comprobación, con sus archivos de entrada. | «Al ejecutar Q-xx sobre el conjunto sintético [versión] se obtuvo [resultado verificable]». |
| Hipótesis o límite | Explicación posible o pregunta que las fuentes no resuelven. | «La relación entre la lectura y la transferencia no está demostrada; falta identificar contenido y proceso de origen». |

Los registros construidos para reproducir una señal conocida conservan esa condición. Si se programan 216 órdenes modificadas para representar E-05, obtener 216 en la consulta comprueba que el laboratorio reproduce la cifra; no constituye una segunda fuente que confirme fraude ni autoría en RedNova.

## 3. Qué queda abierto

Se preservan los vacíos del expediente: persona que usó `ext_ops_04`, contenido de los ~1.6 GB, cuenta o persona responsable de operaciones no atribuidas, relación causal del despliegue, datos recuperados, primeras acciones de respuesta y relojes originales verificados.

La cronología distinguirá «hora reportada» de «hora normalizada con un desfase comprobado». Cambiar el formato o mostrar UTC−6 no comprueba la sincronización. Una transferencia aproximada de ~1.6 GB conserva su aproximación; el campo de bytes exactos del caso permanece sin aportar.

Los objetivos de continuidad, criterios de política y responsables que correspondan a P2/P3 se identificarán como pendientes hasta recibirlos. Si el equipo define una política simulada, se registrará como tal, con su criterio y alcance. Una aprobación o un traspaso se registra cuando ocurre; no se reconstruye una firma ni una fecha histórica que no consten.

La fecha exacta de la última restauración y el horario de respaldos propuestos antes de esta revisión no proceden de los PDFs. S-04 queda pendiente. S-09 también conserva el estado de propuesta para los volúmenes agregados del laboratorio.

## 4. Procedimiento para generar y comprobar los datos

1. Registrar los PDFs recibidos, sus rutas y el SHA-256 calculado sobre sus bytes actuales. El hash identifica la copia usada como referencia; no autentica los sistemas descritos por el caso.
2. Abrir el índice E-01–E-10 con su señal y página. Mantener vacíos el archivo de sistema original, su hash, su fecha de obtención y su custodio cuando no fueron aportados. Documentar esta ausencia en las limitaciones.
3. Definir tablas, relaciones y supuestos necesarios antes de generar filas. Registrar la aprobación real y la versión del diseño. Incluir actividad normal y casos de control para que las consultas distingan condiciones, sin atribuirlos al incidente original.
4. Generar datos ficticios mediante un script con semilla fija y registrar versión, cantidades y origen. Cada tabla o conjunto debe permitir reconocer las filas que reproducen el expediente y las agregadas para el laboratorio.
5. Comprobar relaciones, conteos, campos desconocidos y coherencia temporal. Conservar un informe de carga; una carga fallida no se registra como ejecución satisfactoria.
6. Ejecutar las consultas con el usuario de lectura, registrar consulta, versión de datos, fecha de ejecución, motor y resultado. Guardar los CSV producidos y calcular sus hashes. La salida se exporta de la ejecución; no se escribe a mano como resultado previsto.
7. Elaborar los papeles de trabajo desde esos resultados. Separar el resultado observado en el laboratorio de la interpretación del expediente. Contrastar cada posible incumplimiento con su criterio y alcance antes de redactar un hallazgo.
8. Revisar con P1 una muestra, repetir la comprobación que corresponda y registrar la revisión humana cuando se haga. Actualizar la cronología, informe y juego con las mismas referencias y límites.

Los originales digitales recibidos se preservan y los derivados llevan archivo y versión propios. Al modificar un artefacto se conserva la versión anterior y se registra un nuevo hash. Los traspasos entre personas se documentan solo cuando ocurran, con quién entrega, quién recibe, fecha, motivo y comparación de hashes.

## 5. Qué se ha producido en esta sesión

- [Fuentes_curso_v1.csv](Fuentes_curso_v1.csv): identifica los dos PDFs, su ruta y el hash de la copia leída.
- [Indice_evidencias_inicial_v1.csv](Indice_evidencias_inicial_v1.csv): transcripción de las diez entradas de la tabla de la página 5 del proyecto. Los campos de extracciones de sistemas permanecen vacíos y los vínculos T/PT están pendientes de asignación o ejecución.
- [hashes_documentales_v1.csv](hashes_documentales_v1.csv): hashes calculados sobre los dos PDFs, los dos CSV anteriores y este método. Cada fila identifica qué archivo se calculó y cuándo. El registro no incluye su propio hash.

Los identificadores `DOC-CURSO-01/02` sirven para localizar documentos fuente; no reemplazan E-01–E-10 ni representan nuevas extracciones del incidente. Los CSV y este método son documentos de trabajo del equipo. Su preparación no acredita que se haya ejecutado SQL ni completa la cadena de custodia de archivos de sistemas que no se recibieron.

Los hashes pueden verificarse con `sha256sum` desde `Operacion_Trazabilidad_Reparto/`, usando la ruta que aparece en el registro. La fecha de cálculo corresponde a la preparación de estos documentos, no a la obtención de pruebas durante el incidente ficticio.

## Registro de uso de IA

| Fecha | Herramienta | Prompt resumido | Resultado empleado | Validación humana | Ajustes y aprendizaje |
| --- | --- | --- | --- | --- | --- |
| 2026-11-06 | Codex | Acordar un método para completar P1 sin inventar evidencia y conforme a los dos PDFs oficiales. | Este método, índice transcrito de E-01–E-10, registro de fuentes y hashes de archivos existentes; ajuste de S-04 en el plan. | Pendiente de P1. | Pendiente de P1. |
