# Evaluación de las seis revisiones de auditoría

Especificación vigente del 4 de noviembre de 2026. Versión de reglas: `auditoria_reglas_v2.1`. Define comportamiento para implementar; no es un motor ya construido ni una validación humana del trabajo académico.

## 1. Qué se evalúa

La evaluación usa opciones con identificadores estables y referencias a fuentes. El jugador elige una conclusión, hace la comprobación de la ficha, vincula fuentes y registra límites y solicitudes. El texto visible puede ajustarse editorialmente sin cambiar los identificadores ni exigir una frase escrita literalmente por el jugador.

Un comentario libre se guarda como `freeNote`, bajo «Anotación personal: sin evaluación automática». Nunca sustituye una fuente, una respuesta estructurada o una limitación. Exportarlo en un bloque separado impide que parezca una afirmación revisada por el motor. Tampoco se califican por significado las recomendaciones libres del cierre.

La configuración contiene las claves admitidas, pero la UI presenta opciones sin señalar cuáles completan la revisión, sin seleccionarlas previamente y sin revelar toda la ficha de evaluación. Las respuestas no se deducen de palabras del comentario ni se envían a una IA. El primer intento recibe una explicación concreta; las pistas completas son opcionales.

## 2. Referencias y procedencia

La fuente de contenido es `Caso_RedNova_base_v2.json`:

| Referencia interna | Contenido y localización | Cómo se presenta |
| --- | --- | --- |
| `E-01`…`E-10` | Entrada con ese `id` en `evidenceSummaries`. | «Resumen del expediente», con su página; no extracción autenticada. |
| `EVT-01`…`EVT-13` | Entrada con ese `id` en `events`. | Registro preliminar y hora reportada del curso. |
| `DECL-01`…`DECL-07` | Entrada con ese `id` en `initialStatements`. | Declaración atribuida; no conclusión corroborada. |
| `META-CUSTODIA` | Vista calculada de `scope` y de `evidenceSummaries[*].provenance`, `artifactPath` y `sha256`. | Tabla de procedencia, archivo y hash, conservando los nulos como «No aportado». |
| `META-TIEMPO` | Vista calculada de `time.basis` y `events[*].reportedAt`, `originalTime`, `clockOffsetSeconds` y `clockOffsetVerified`. | Hora reportada frente a original/desfase/verificación. No convertir `false` o `null` en un reloj verificado. |

Las dos vistas META se construyen con los campos existentes, no introducen evidencia ni códigos E nuevos. Los datos de `presentation`, incluida la nota ilustrativa, no son sustento válido de las conclusiones.

Una referencia guarda `sourceId`, `sourceVersion` y, si existe una fila real, `rowId` o localizador. La versión inicial es el `contentVersion` del canon. Incorporar o sustituir un documento exige actualizar su versión; cambiar la política o el alcance de una respuesta exige revisar también la versión de reglas. No crear identificadores de filas supuestamente extraídas si solo existe un resumen.

`E-03` y `EVT-04`, por ejemplo, son representaciones del mismo dato del curso. Pueden sustituirse donde la ficha lo permita; vincular ambos no aporta corroboración independiente. Que una fuente esté vinculada no basta: debe haber sido inspeccionada por el jugador y seguir disponible en la versión vigente. Reproducir la apertura no cuenta como inspección de todos sus documentos.

## 3. Estado y algoritmo común

```typescript
type SourceRef = {
  sourceId: string;
  sourceVersion: string;
  rowId?: string;
};

type Assessment = {
  reviewId: string;
  rulesVersion: string;
  sourceRefs: SourceRef[];
  checkAnswers: {
    checkId: string;
    answerId: string;
    sourceRefs: SourceRef[];
  }[];
  conclusionId: string | null;
  limitationIds: string[];
  requestIds: string[];
  freeNote: string;
};
```

La revisión se marca automáticamente solo si se cumplen **todas** estas condiciones:

1. Coinciden la versión de reglas y las versiones actuales de las fuentes.
2. Para cada grupo obligatorio de la ficha hay al menos una referencia alternativa inspeccionada y vinculada. «X o Y» significa una alternativa; «X + Y» significa ambas.
3. Se han resuelto todas las comprobaciones obligatorias con una respuesta admitida y con sus fuentes requeridas. Las fuentes usadas por la comprobación también deben seguir vinculadas a la revisión. Abrir la comparación sin responder no basta.
4. `conclusionId` es una conclusión admitida para el expediente actual.
5. Están seleccionadas **todas** las limitaciones obligatorias de la ficha.
6. Hay **al menos una** solicitud pertinente entre las admitidas. Registrar qué se pide basta; recibir un documento ausente no es una condición de cierre.

Cada comprobación usa los grupos de fuentes de su propia descripción; si no especifica un subconjunto, usa todos los grupos de la ficha. Registrar referencias reales, no un booleano como `comparado: true`. Los cálculos usan los `reportedAt` con su desplazamiento UTC−6; los minutos no se introducen como una respuesta numérica escrita libremente ni dependen de la zona del ordenador.

La función devuelve `status`, `isDocumented` y `missingReasons[]`; es una evaluación derivada, sin campo editable `completed`. Se ejecuta al inspeccionar/vincular/retirar una fuente, responder, guardar/cambiar conclusión, límites o solicitudes, y al cargar la partida. No acumula puntos por visitas, tiempo o clics.

| Estado | Condición |
| --- | --- |
| Pendiente | No se ha intentado una comprobación/conclusión y faltan grupos de fuentes; mostrar además cuántos se reunieron. |
| Fuentes reunidas | Todos los grupos están disponibles, inspeccionados y vinculados; todavía no se intenta documentar la conclusión. |
| Por contrastar | Ya se intentó documentar o comprobar y falta alguna condición, hay respuesta incompatible o referencias desactualizadas. Incluye revisiones antes completas que perdieron sustento. |
| Documentado | Todas las condiciones de la ficha están satisfechas. Puede ser una observación o un resultado no concluyente. |

Si se retira una referencia usada por una comparación, esta deja de ser válida. No sustituirla silenciosamente por una alternativa equivalente: conservar el trabajo y pedir repetir esa comprobación sobre la nueva referencia. Cambiar solo la conclusión conserva comprobaciones vigentes, pero vuelve a evaluar su compatibilidad. Un cambio de versión conserva las anotaciones y exige revisar las referencias/respuestas afectadas; no conserva una marca antigua como prueba de validez.

## 4. Fichas obligatorias

Los textos siguientes son contenido evaluable de diseño, no nuevos hechos. Las salidas admitidas describen lo que permite el expediente actual. Las opciones incompatibles se muestran como alternativas plausibles, sin etiquetas de «correcta» o «incorrecta» antes de responder.

### AU-01 · Acceso y MFA

- **Fuentes:** `E-01` + (`E-02` o `EVT-02`).
- **Comprobación `C01-ALCANCE`:** comparar el resumen de cuentas con la sesión. Pregunta: «¿Estos datos identifican a la persona que entró y bastan para declarar un incumplimiento de política?». Opciones: `BASTA_PARA_AMBOS`, `PERSONA_IDENTIFICADA`, `FALTAN_IDENTIDAD_Y_CRITERIO`. Admitida: `FALTAN_IDENTIDAD_Y_CRITERIO`.
- **Conclusión admitida `A01-OBSERVACION`:** «Se reporta una sesión sin MFA y cuentas sin recertificación reciente; faltan criterio aplicable y atribución personal». Resultado: observación.
- **Otras conclusiones disponibles, sin sustento:** `A01-AUTOR_IDENTIFICADO` («El nombre de cuenta identifica al responsable») y `A01-CUMPLIMIENTO_RESUELTO` («La política de acceso ya fue evaluada»).
- **Límites obligatorios:** `L01-ATRIBUCION` — cuenta no equivale a persona; `L01-CRITERIO` — no se aportó política aplicable ni su alcance.
- **Solicitudes admitidas:** `S01-POLITICA` — política de acceso y alcance aprobado; `S01-TRAZABILIDAD` — titularidad autorizada y trazabilidad de la sesión.
- **Respuesta específica:** «El registro permite observar acceso sin MFA; no permite atribuirlo a una persona ni evaluar una política no aportada».

La incorporación de una política aprobada requiere una nueva configuración versionada y revisada por el equipo. El motor no inventa su aplicabilidad ni transforma automáticamente esta observación en un hallazgo.

### AU-02 · Lectura y transferencia

- **Fuentes:** (`E-03` o `EVT-04`) + (`E-04` o `EVT-05`) + `DECL-05`.
- **Comprobación `C02-CONTENIDO`:** colocar lectura, flujo y declaración lado a lado. Pregunta: «¿Estos registros identifican el contenido transferido y lo conectan con la lectura SQL?». Opciones: `VOLUMEN_DEMUESTRA_EXFILTRACION`, `SIN_VINCULO_NI_CONTENIDO`, `TRAFICO_LEGITIMO_DEMOSTRADO`. Admitida: `SIN_VINCULO_NI_CONTENIDO`.
- **Conclusiones admitidas:** `A02-TRANSFERENCIA` — «Se reportan lectura de 31,840 registros y transferencia de ~1.6 GB; contenido y vínculo no identificados»; `A02-NO_CONCLUYENTE` — «La exfiltración no puede confirmarse ni descartarse con estas fuentes». Resultado: observación o no concluyente, respectivamente.
- **Otras conclusiones disponibles, sin sustento:** `A02-EXFILTRACION_CONFIRMADA` y `A02-TRAFICO_LEGITIMO_CONFIRMADO`.
- **Límites obligatorios:** `L02-CONTENIDO` — contenido sin identificar; `L02-VINCULO` — no se demuestra que lo leído sea lo transferido; `L02-ATRIBUCION` — la sesión conocida no atribuye todas las operaciones a la misma persona/cuenta.
- **Solicitudes admitidas:** `S02-FLUJO` — registros de flujo, destino y proceso de origen correlacionables; `S02-CONTENIDO` — evidencia preservada que permita identificar el contenido y su relación con SQL.
- **Respuesta específica:** «El volumen y la cercanía temporal no identifican el contenido. Revisa la conclusión o registra las limitaciones y qué soporte solicitarías». Una vez registrados, no pedir que llegue ese soporte para marcar la revisión.

### AU-03 · Órdenes, integridad y despliegue

- **Fuentes:** `EVT-06` + `EVT-07` + `E-06` + `DECL-03` + `DECL-04`. `E-05` puede añadirse como resumen, sin sustituir las horas necesarias.
- **Comprobación `C03-ORDEN`:** colocar los registros de cambios y despliegue en una línea temporal. Usa `EVT-06` + `EVT-07`. Opciones: `DESPLIEGUE_ANTES`, `ORDENES_ANTES`, `MISMA_HORA`. Admitida: `ORDENES_ANTES`; el sistema calcula 20 minutos entre 02:42 y 03:02.
- **Comprobación `C03-SOPORTES`:** contrastar las declaraciones con el ticket y los cambios reportados. Usa `EVT-06` + `E-06` + `DECL-03` + `DECL-04`. Pregunta: «¿Las declaraciones bastan para dar por verificadas la integridad y la aprobación formal?». Opciones: `AMBAS_VERIFICADAS`, `FALTAN_CONCILIACION_Y_APROBACION`, `CAMBIOS_PRUEBAN_FRAUDE`. Admitida: `FALTAN_CONCILIACION_Y_APROBACION`.
- **Conclusión admitida `A03-PENDIENTES`:** «Los cambios reportados preceden al despliegue; integridad, aprobación formal, autoría y relación causal siguen sin demostrarse». Resultado: no concluyente sobre esos extremos.
- **Otras conclusiones disponibles, sin sustento:** `A03-DESPLIEGUE_CAUSA_PROBADA`, `A03-DATOS_INTACTOS`, `A03-FRAUDE_CONFIRMADO`.
- **Límites obligatorios:** `L03-CAUSA` — orden temporal no demuestra causalidad ni inocuidad; `L03-INTEGRIDAD` — conciliación no concluida; `L03-ATRIBUCION` — cambios sin atribución probada; `L03-APROBACION` — falta de aprobación documentada no prueba que jamás se autorizó.
- **Solicitudes admitidas:** `S03-CONCILIACION` — historial y conciliación reproducible de órdenes/facturación; `S03-CAMBIO` — aprobación formal, pruebas y trazabilidad técnica del despliegue.
- **Respuesta específica:** «Los cambios aparecen 20 minutos antes. Ese orden no prueba fraude ni explica por sí solo el incidente; las declaraciones no sustituyen los soportes pendientes».

### AU-04 · Alerta y atención

- **Fuentes:** `EVT-02` + `EVT-08` + `E-07`.
- **Comprobación `C04-INTERVALO`:** seleccionar acceso y alerta; el sistema calcula 61 minutos y muestra el resumen E-07. Pregunta: «¿Qué significa ese intervalo?». Opciones: `TIEMPO_DESDE_INICIO_REAL_ATAQUE`, `INTERVALO_ENTRE_REGISTROS`, `61_MINUTOS_SIN_RESPUESTA`. Admitida: `INTERVALO_ENTRE_REGISTROS`.
- **Conclusión admitida `A04-INTERVALO`:** «Entre el acceso reportado y la alerta hay 61 minutos; no se conoce la trazabilidad completa de atención». Resultado: observación.
- **Otras conclusiones disponibles, sin sustento:** `A04-NADIE_ACTUO`, `A04-ATAQUE_COMENZO_0217`, `A04-OBJETIVO_INCUMPLIDO`.
- **Límites obligatorios:** `L04-INICIO` — no se conoce el inicio real del ataque; `L04-ATENCION` — sin cierre documentado no equivale a ausencia de acción; `L04-OBJETIVO` — no hay objetivo aplicable de detección/atención aportado.
- **Solicitudes admitidas:** `S04-ATENCION` — asignación, primera acción, escalamiento y cierre; `S04-OBJETIVO` — procedimiento y objetivos de atención aplicables.
- **Respuesta específica:** «61 minutos separan dos registros. Falta trazabilidad para medir la atención o declarar incumplimiento».

### AU-05 · Respaldo y recuperación

- **Fuentes:** `E-08` + `DECL-07` + `EVT-09` + `EVT-11` + `EVT-12`.
- **Comprobación `C05-RECUPERACION`:** contrastar programación, declaración de última restauración y vuelta del CRM. El sistema calcula 315 minutos hasta solo consulta y 355 hasta escritura. Pregunta: «¿Esto demuestra una restauración validada dentro de los objetivos del negocio?». Opciones: `SI_PORQUE_HAY_PROGRAMACION`, `SI_PORQUE_VOLVIO_ESCRITURA`, `FALTAN_PRUEBA_Y_OBJETIVOS`. Admitida: `FALTAN_PRUEBA_Y_OBJETIVOS`.
- **Conclusión admitida `A05-NO_VERIFICADA`:** «Hay respaldos programados y recuperación por etapas reportada; no se demuestra restauración validada ni cumplimiento de RTO/RPO». Resultado: no concluyente.
- **Otras conclusiones disponibles, sin sustento:** `A05-RESPALDO_EXITOSO_PROBADO`, `A05-RTO_RPO_CUMPLIDOS`, `A05-NO_EXISTEN_RESPALDOS`.
- **Límites obligatorios:** `L05-EJECUCION` — programación no acredita ejecución exitosa; `L05-RESTAURACION` — faltan respaldo usado, punto recuperable e integridad verificada; `L05-OBJETIVOS` — faltan RTO/RPO aplicables.
- **Solicitudes admitidas:** `S05-PRUEBA` — informe de restauración, respaldo utilizado, validación y conciliación; `S05-BIA` — BIA y objetivos RTO/RPO aprobados.
- **Respuesta específica:** «Volver a operar y tener respaldos programados no certifica la restauración. Registra qué prueba u objetivo necesitas».

### AU-06 · Custodia y tiempo

- **Fuentes:** `META-CUSTODIA` + `META-TIEMPO`.
- **Comprobación `C06-CUSTODIA`:** comparar la procedencia del resumen con los campos de archivo/hash no aportados. Usa `META-CUSTODIA`. Pregunta: «¿Puede tratarse este resumen como una extracción con custodia acreditada?». Opciones: `SI_POR_TENER_CODIGO_E`, `CUSTODIA_NO_ACREDITADA`, `NULOS_PRUEBAN_MANIPULACION`. Admitida: `CUSTODIA_NO_ACREDITADA`.
- **Comprobación `C06-RELOJ`:** colocar hora reportada frente a original/desfase/verificación. Usa `META-TIEMPO`. Opciones: `DESFASE_CERO_VERIFICADO`, `SINCRONIZACION_NO_VERIFICADA`, `ORDEN_TEMPORAL_DEFINITIVO`. Admitida: `SINCRONIZACION_NO_VERIFICADA`.
- **Conclusión admitida `A06-LIMITACION`:** «La procedencia académica está identificada; custodia de extracciones y sincronización de fuentes no están acreditadas». Resultado: no concluyente sobre fiabilidad forense.
- **Otras conclusiones disponibles, sin sustento:** `A06-REGISTROS_AUTENTICADOS`, `A06-MANIPULACION_DEMOSTRADA`, `A06-RELOJES_VERIFICADOS`.
- **Límites obligatorios:** `L06-RESUMEN` — resumen no equivale a extracción; `L06-HASH` — un hash, si se aporta, verifica bytes y no verdad/completitud; `L06-TIEMPO` — desfase desconocido no es cero verificado.
- **Solicitudes admitidas:** `S06-EXTRACCIONES` — originales preservados, método, custodio y hashes; `S06-TIEMPO` — horas originales y evidencia de zona/sincronización por fuente.
- **Respuesta específica:** «La ausencia de metadatos limita la revisión; no prueba manipulación. Puedes documentar esa limitación sin fabricar archivos ni un desfase».

Un ejercicio adicional con bytes reales puede mostrar original/copia y calcular hashes, pero no condiciona el cierre de la actividad base. No mostrar hashes inventados para suplir los nulos.

## 5. Comprobaciones de aceptación para la implementación

Estas son condiciones que debe verificar la futura aplicación; no pruebas de un juego ya ejecutado.

| Caso | Resultado exigido |
| --- | --- |
| Se visitan seis estaciones y se abren todos los documentos sin comparar ni concluir. | Cero revisiones documentadas. |
| En AU-02 se vinculan E-03, E-04 y DECL-05; se resuelve C02; se elige A02-TRANSFERENCIA, los tres límites y S02-FLUJO. | Documentado automáticamente. A02-NO_CONCLUYENTE también se admite con ese mismo sustento. |
| La combinación anterior usa EVT-04/05 en lugar de E-03/04 y la comparación se rehace con esas referencias. | También documentado; no se exige una presentación única de la misma fuente. |
| Se afirma exfiltración con solo 1.6 GB o se la escribe en el comentario libre sin completar los campos estructurados. | No documentado. El comentario no supera ninguna condición. |
| Se retira DECL-05, cambia una respuesta o se quita L02-VINCULO después de completar AU-02. | Se retira la marca y se explica el requisito afectado; el resto del trabajo se conserva. |
| Se documentan desconocimiento de contenido, límites y solicitud; el documento solicitado no está disponible. | AU-02 puede terminar sin recibirlo. Aplica el mismo principio a las otras fichas. |
| AU-03 coloca 02:42 antes de 03:02, pero afirma causa probada o datos íntegros. | No documentado; resolver la secuencia no valida la conclusión excesiva. |
| AU-04 interpreta 61 minutos como ausencia probada de respuesta. | No documentado. |
| AU-05 da por probada una ejecución exitosa a partir de programación, o declara RTO/RPO cumplidos sin objetivos. | No documentado. |
| AU-06 inspecciona las dos vistas META y registra sus límites sin tener archivos originales. | Puede documentarse con las respuestas, conclusión y solicitud pertinentes. |
| Se intenta usar la nota de extorsión de `presentation` como prueba de contenido transferido. | Referencia no admitida; no satisface ningún grupo de sustento. |
| Una partida guardada se abre con otra versión de fuente o reglas. | Se conservan anotaciones y se reevalúa; no se restauran marcas incompatibles. |
| Se salta/repite la apertura o se activa movimiento reducido. | Las conclusiones, comparaciones e inspecciones no cambian. |

La revisión humana del equipo y sus criterios siguen siendo necesarios para el informe. «Documentado» significa que la actividad educativa tiene sustento dentro de este expediente, no que se haya probado una causa, culpable o hallazgo formal.
