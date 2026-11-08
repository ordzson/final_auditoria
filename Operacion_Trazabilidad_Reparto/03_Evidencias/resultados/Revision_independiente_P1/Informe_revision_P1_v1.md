# Revisión crítica independiente de los entregables de P1 · v1

Fecha de revisión: 2026-11-07T21:52:08.302651+00:00. Proyecto: `Operacion_Trazabilidad_Reparto/`. Corte del caso: 15/10/2026 23:59:59 UTC−6. Revisor técnico: Codex. Esta revisión no acredita validación humana ni aprobación académica.

El paquete documental es íntegro y sus cifras principales son reproducibles. Hay **cuatro problemas confirmados: dos importantes y dos menores; ninguno bloqueante para abrir o consultar los entregables**. Las debilidades principales son un criterio insuficiente para confirmar uso indebido en H-B y una declaración de IA que todavía no cumple íntegramente el requisito de prompts literales. La defensa sigue sin ensayo humano documentado. No procede convertir el cierre técnico I6 en un cierre académico de P1.

Se aplicó la instrucción posterior del usuario: **el juego queda excluido por completo de la revisión funcional y de código**. Se revisaron el WebM y la libreta únicamente como archivos entregables; no se contrastaron con una ejecución actual del juego. El registro I5 se abrió solo para comprobar lo que acredita históricamente. La extracción/hash del ZIP abarca mecánicamente todos sus miembros y no cambia esta exclusión. No se modificaron documentos, datos, SQL, juego, audios, registros de IA ni cierres. Se identificaron 449 entradas fuera del árbol del juego y ninguna cambió durante el trabajo. Los cambios ajenos preexistentes no se restauraron.

## Objeto, método y jerarquía

Se reabrieron ESTADO_P1.md, el plan por instancias, la revisión histórica del 6 de noviembre, ambos PDFs oficiales y la guía interna P1; los cinco comprobantes I6 exigidos y su README; registros I2/I3, PT y derivados I4; plantilla v2, sección e informe parcial; XLSX/CSV, presentación/guion, fuentes/IA, LEEME e índice HTML; además del contenido extraído del ZIP. Se leyeron las fuentes SQL y los scripts documentales/portátiles necesarios. La revisión histórica se trató como histórica: sus archivos ausentes y sus siete fallos E2E no se trasladaron a los entregables actuales.

Los requisitos oficiales prevalecen: Proyecto pp. 5–7 y Guía pp. 3–5 permiten registros sintéticos y resultados exportados; exigen interpretación, custodia y razonamiento. No exigen inventar originales ni confirmar un atacante sin sustento. Los estados no concluyentes son admisibles cuando están razonados. La captura gráfica SQL está en la lista interna de P1; **el requisito oficial permite capturas o exportación de resultados**, de modo que su falta no invalida por sí sola los CSV ejecutados. La orientación interna de unas cuatro páginas no convierte las cinco de la sección en un incumplimiento oficial.

Se recalcularon hashes, intervalos, sensibilidad y serializaciones en memoria. No se reconstruyó el laboratorio ni se ejecutó SQL. Writer/Calc abrieron copias temporales y las reexportaron. Los PDF actuales se analizaron y renderizaron de nuevo; los comprobantes visuales están en `comprobantes_v1/render/`. Las herramientas y scripts propios se conservan allí para distinguir estas pruebas de los cierres heredados.

## Qué quedó comprobado y qué significa

| Asunto | Comprobación efectiva de esta revisión | Límite |
| --- | --- | --- |
| Integridad de entradas | 442 referencias del registro SHA y 5 documentales recalculadas: 447 coincidentes; 438 entradas del manifiesto I6 en alcance, también coincidentes. | El registro tiene 1,046 filas; 604 corresponden al juego excluido. No se afirma haber repetido íntegramente los 1,051 cotejos del cierre. Los conteos declarados 1,046+5=1,051 sí cuadran. |
| ZIP | SHA `a7230e9280582a8e07555fec18c74e5e8d6bfc03acd6454b21943c83c950aab9`, igual al externo y al cierre; CRC correcto; 1,044 miembros, 1,043 archivos listados con tamaño/hash coincidentes. Extracción nueva en `/tmp/revision_p1/extraido/P1`. Verificador incluido: código 0. | El miembro adicional es el propio manifest-paquete.json, excluido de su lista para evitar autorreferencia. No es un archivo faltante. Ningún documento del alcance difiere de su copia vigente. |
| I2/I3 | 13 ejecuciones reabiertas; filas, hashes de CSV, SQL, sentencia parametrizada y manifiesto de datos coincidentes. Resultados vigentes e históricos de repetición coinciden. Registros identifican motor 16.0.4305.5, v2 y auditor_lectura, salvo los contextos explícitos de Q-S01. Se recontaron 16 CSV/91,800 filas y 18 FK declaradas en el esquema; las dos corridas finales registran 95/95 comprobaciones. | Evidencia documental de ejecución histórica; no se comprobó la presencia actual de las bases ni se ejecutó SQL de nuevo. |
| I5 histórico | Log real con 121 pruebas unitarias, compilación y 42 E2E; SHA del log coincide con ejecuciones.json. | No se ejecutaron esas pruebas ni se examinó el juego actual. No se usa ese log como certificación del estado actual. |
| I6 98/98 | JSON y script reabiertos; conteo y estados consistentes. Las cifras/celdas/documentos se contrastaron con comprobaciones independientes propias. | No se ejecutó verificar_I6.py porque escribe en el cierre I6. Sus 98 casillas no constituyen 98 juicios de calidad académica. RI-P1-01 y RI-P1-02 no se resuelven por contar hashes, palabras o etiquetas. |
| XLSX | Datos de índice 188×25, programa 14×15 y cronología 13×25 iguales a CSV, incluyendo vacíos. 396 hipervínculos locales existentes. Reapertura Calc: todas las celdas de Datos/Lectura/Procedencia conservadas. | Las celdas están como texto por diseño; no se confunde una hoja de datos con fórmulas de cálculo. Las muestras de Lectura se reexportaron con Calc y se inspeccionaron digitalmente: encabezados y filas legibles. La exportación total también incluye Datos reducido; no es la vista de impresión recomendada por el propio libro. No hubo uso humano de Excel. |
| DOCX/PDF | Tres DOCX abiertos con Writer, incluida plantilla v2. Reexportaciones temporales conservan texto y paginación 5/7/2. Los 62 fragmentos de párrafos/celdas MD están en ambos DOCX/PDF de sección y parcial. | La plantilla y el parcial tienen marcadores pendientes previstos. El parcial no se presentó como informe final. |
| PDF actuales | Nueve archivos, 53 páginas renderizadas: sección 5, parcial 7, plantilla 2, PT 8, cronología 2, diapositivas 6, referencias 3, IA 8, libreta 12. Sin palabras fuera de página detectadas. Los seis enlaces de índice PT llevan a PT-20–PT-25 en pp. 3–8. | Inspección digital, sin impresión/proyector físicos. Hay fragmentación editorial de la libreta, RI-P1-E03. |
| Enlaces | 18 anotaciones PDF entre enlaces internos, locales y externos; ningún destino local ausente. La sección conserva cuatro enlaces y Fuentes otros cuatro, incluidos los NIST. El índice extraído sirvió 19 enlaces documentales con HTTP 200. | Se omitió el enlace al juego. Un destino existente no acredita la verdad del contenido ni compatibilidad con cada visor. La sospecha inicial de pérdida de enlaces se descartó al revisar todas las páginas. |
| WebM | VP8, 1280×720, 25 fps, duración 32.68 s, sin pista de audio. FFmpeg decodificó 817 fotogramas. Chrome reprodujo hasta ended, sin error; reportó 817 fotogramas y 7 descartados. | Es un recorrido rápido y mudo de la simulación, no una explicación forense narrada ni una demostración SQL/PT. No se comprobó correspondencia con el juego actual ni con hardware de defensa. |
| Libreta | PDF de 12 páginas y JSON final abiertos; seis actividades rotuladas Documentado, fuentes/solicitudes y límites educativos presentes. | Documentado no equivale a revisión humana, cierre académico ni ejecución de PT-25. No se evaluó si el juego acepta o rechaza respuestas. |

La lectura visual del WebM confirma que abre la reconstrucción, muestra entrevista/puestos y termina en la libreta; no sigue el recorrido documental diapositiva → PT → sentencia → CSV → origen. No se declara un defecto por ello: LEEME identifica su función como respaldo de la simulación y ofrece los documentos por separado. Los 7 fotogramas descartados por Chrome no impidieron ended; no prueban un fallo del archivo.

## Coherencia del razonamiento y recorrido de fuentes

Se siguió la afirmación de la diapositiva 4 hasta PT-22 (PDF p. 5), T-24/T-25, Q-05/Q-06, sus CSV, BitacoraSQL.csv/TransferenciasRed.csv v2 y el Proyecto pp. 4–5. Q-05 deja la lectura de 31,840 sin usuario y sin evaluación habitual; Q-06 conserva ~1.6 GB como texto, con bytes exactos, IP, puerto, protocolo e inicio/fin desconocidos. La fuente del hecho sigue siendo el PDF oficial. El control de 1,200,000,000 bytes no se usa como cuantificación del flujo del incidente.

El modelo de siete campos produce exactamente 2,058,909 bytes CSV y 5,115,483 bytes JSONL; ambos hashes coinciden. Los cocientes decimales 777.1106 y 312.7759, los 50,251 bytes aproximados por fila y la alternativa de 53,957 bytes si se supusiera GiB son correctos. La última unidad está rotulada como alternativa hipotética. La comparación ilustra sensibilidad al ancho de fila; no permite inferir una probabilidad de fuga ni descartar una exportación con otros contenidos. El informe conserva ese límite y evita calcular velocidad con los cuatro minutos entre dos hitos.

La afirmación de diapositiva 5 se siguió hasta PT-23 (PDF p. 6), Q-07 y el historial v2: 216 cambios de 216 órdenes distintas, 144 de monto y 72 de estado. Se cotejaron todos los campos comunes de las 216 filas; UsuarioID/SesionID/Via están desconocidos en las 216. Q-08 presenta diez grupos de dos, IDs 1001–1020, sin intersección con esas 216. No hay facturación que permita convertirlos en doble cobro o sumar una pérdida real. Q-09 documenta nueve programaciones, ocho ejecuciones de octubre y un registro histórico de junio; 3.2 frente a 8.2 GiB da −60.976 %. El 1 de julio es un registro ficticio, no una restauración ejecutada.

La cronología conserva 13 hitos, con una sola cuenta identificada en EVT-02. No se rellenaron originales/desfases desconocidos. Se recalcularon los nueve intervalos I4: 61, 24, 23, 315, 355, 40, 453, 20 y 4 min; todos coinciden. Además, 12/10 16:15 → 14/10 02:17 son 2,042 min. Las fechas y el huso UTC−6 concuerdan con el caso; los momentos UTC de ejecución en noviembre no se confunden con sucesos de octubre.

Las quince filas de sensibilidad son matemáticamente correctas. Con reportada = real + offset, delta real = delta reportada − (offset final − offset inicial). La lectura→flujo de 4 min con ±5 independientes da −6 a 14; órdenes→despliegue de 20 min da 10–30, 0–40 y −10–50 con ±5/10/15. CRM atrasado 15 y despliegue adelantado 15 producen 02:57 y 02:47; el caso inverso produce 02:27 y 03:17. Un offset común constante se cancela; esa cancelación no demuestra que dos etiquetas CRM compartan reloj ni cubre una deriva variable. Los tres escenarios de defensa A/B/C están rotulados hipotéticos y no se trataron como evidencia nueva.

PT-25 (PDF p. 8) se contrastó con Q-S01, concesiones y cinco rechazos: el administrador ficticio tiene SELECT/UPDATE/DELETE; control y auditor no tienen los dos últimos. El contexto sa/EXECUTE AS está declarado. Se documenta capacidad, sin modificación ejecutada. No se extrapola esa capacidad a administradores de RedNova ni se usa un intervalo entre hitos como prueba de borrado. La distinción AU-06/PT-25 está escrita en los entregables; aquí no se revisó AU-06 en el juego.

Las hipótesis H-A/H-B/H-C tienen evidencia compatible, tensiones y pruebas propuestas, todas con certeza causal baja. H-A necesita la cadena técnica y el contenido; H-C exige justificar la actividad legítima y buscar la otra vía. No se detectó una conclusión actual que confirme fuga, fraude, autoría o causa raíz sin evidencia. **H-B sí necesita corregir su criterio de confirmación**, RI-P1-01. Las hipótesis no son probabilidades ni opciones exhaustivas/mutuamente excluyentes: partes de actividades legítimas y abuso pueden coexistir. Esto debe explicarse si el docente pide elegir una sola.

B1-1 y B1-2 mantienen causas distintas: seguimiento organizativo de alertas y protección técnica de registros. Ambos delimitan como demostrado el límite del análisis y como no concluyente la falla empresarial. Las once acciones son propuestas con T0 futuro, roles, dependencias, KPI y prueba de cierre; costo y riesgo residual siguen pendientes, sin Q0 implícito ni aceptación inventada. No constituyen por sí solas el plan de 90 días/Q350,000 del equipo.

Los criterios externos citados corresponden a fuentes primarias y localizadores correctos: [CSF 2.0 de NIST](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf), pp. impresas 20, 22–23, y [SP 800-61 Rev. 3, final de abril de 2025](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf), tabla 3, pp. 27–29 y 34. Respaldan las aplicaciones descritas a seguimiento, registros y recuperación; no prescriben por sí solos la arquitectura independiente propuesta ni acreditan adopción empresarial. La [página exacta de Microsoft citada](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-docker?view=sql-server-ver16) es multiversión; debe leerse su sección 2022, y no sustituye el registro del motor histórico. No se descargaron nuevas copias ni se atribuyó normativa jurídica.

## Problemas confirmados

### RI-P1-01 · importante · La prueba propuesta para H-B acredita uso, pero no su carácter indebido

- **Archivo y ubicación:** `01_Informe/Seccion_forense_P1_v1.md`, L39, tabla 2, H-B; PDF p. 3; informe parcial PDF p. 5.
- **Fragmento observado:** H-B: una persona con acceso legítimo a la cuenta la utilizó indebidamente. […] Confirmar: asignación histórica, acceso al dispositivo, tokens y acciones concordantes.
- **Defecto o duda:** Los elementos listados pueden apoyar la atribución técnica de uso a un titular. También serían compatibles con una operación autorizada. Falta contrastar qué estaba autorizado y cuál acción excedió ese alcance. La propia fila reconoce que no existe prueba de intención. El defecto está en el criterio futuro de confirmación; el informe actual no declara culpabilidad.
- **Evidencia:** Comparación de las columnas Hipótesis y Confirmaría de la misma fila. Un titular que ejecuta un trabajo autorizado satisface asignación/dispositivo/tokens/acciones, sin satisfacer utilización indebida. Cobertura textual comprobada: el mismo contenido está en ambos DOCX y PDF.
- **Consecuencia:** Ante la pregunta «¿y si esa persona ejecutó una tarea autorizada?», la prueba anunciada no discrimina H-B de una explicación legítima. Una identificación técnica podría acabar presentada como confirmación de abuso.
- **Corrección mínima:** Cambiar a: «Apoyaría la atribución del uso: asignación histórica, dispositivo, tokens y acciones concordantes. Para sostener uso indebido: contrastar esas acciones con autorizaciones vigentes y demostrar qué excedió su alcance; la intención se evalúa por separado».
- **Dependientes:** Sección MD/DOCX/PDF; sección insertada en Informe_equipo_parcial_P1_v1.docx/.pdf. Revisar correspondencia con diapositiva 3 y mapa; no es necesario cambiar sus conclusiones limitadas si conservan ese alcance.
- **Verificación si se aplica:** Comprobar que una actividad autorizada ya no cumple el criterio de abuso; mantener certeza baja. Reexportar los documentos afectados y cotejar su texto. Sin SQL nuevo por esta corrección.
- **Tipo de comprobación realizada:** Lectura y contraste argumental; no se ejecutó una prueba de identidad ni se obtuvo evidencia empresarial.

### RI-P1-02 · importante · La declaración de IA conserva resúmenes donde el curso pide prompts literales

- **Archivo y ubicación:** `07_Referencias/Registro_uso_IA_v1.csv`, L2–6, L9 y L11–13; especialmente IA-010/IA-011; Uso_IA.pdf pp. 1–5.
- **Fragmento observado:** «Resumen heredado, no prompt literal»; IA-010: «Resumen del encargo»; IA-011: «Resumen del encargo, no prompt literal».
- **Defecto o duda:** La guía oficial, p. 5, pide «Preguntas relevantes tal como se formularon». Nueve de trece entradas se identifican como resúmenes, incluidos encargos técnicos relevantes I2/I3 e I4. Su rotulación es honesta, pero no aporta el texto literal. Prompt_I6_v1.md sí resuelve el encargo I6; no subsana los otros. La validación y el aprendizaje humanos pendientes son un requisito distinto.
- **Evidencia:** CSV abierto y contado por tipo_prompt; lectura de Uso_IA.pdf, del Prompt_I6_v1.md y de la tabla oficial de IA en Guia_Entregables_Operacion_Trazabilidad.pdf p. 5. El registro de generación v2 existe por separado y declara Codex; no se ha supuesto ocultación de esa procedencia.
- **Consecuencia:** El docente puede verificar que existe declaración de IA y aun así objetar su completitud frente al requisito literal. El cierre técnico no resuelve esa objeción.
- **Corrección mínima:** Recuperar los mensajes originales relevantes de conversaciones conservadas y adjuntarlos con su procedencia, enlazándolos desde las filas. Mantener los resúmenes como tales. Si un original no se conserva, indicar «texto literal no disponible» y someter esa limitación al docente; no reconstruirlo ni etiquetar una paráfrasis como cita.
- **Dependientes:** Registro CSV; Uso_IA.pdf y anexo de IA del informe que integre P2. Mantener los registros de generación como anexos identificables.
- **Verificación si se aplica:** Cotejar cada transcripción con el mensaje original accesible. Después completar validación y aprendizaje reales de P1 y reexportar el PDF. Esta revisión no modifica el registro histórico ni finge disponer de las conversaciones.
- **Tipo de comprobación realizada:** Lectura de entregables y contraste directo con requisito oficial; no acceso a conversaciones originales fuera del proyecto.

### RI-P1-03 · menor · B1-1 cita una fila inexistente del resultado Q-11

- **Archivo y ubicación:** `03_Evidencias/Borradores_hallazgos_P1_v1.md`, L15, B1-1, fila Evidencia.
- **Fragmento observado:** E-22/Q-11 fila 6 con marcas ausentes
- **Defecto o duda:** Q-11.csv contiene cuatro registros de datos, con AlertaID 3, 4, 5 y 6. El caso está en el cuarto registro, línea física 5 contando cabecera. «Fila 6» confunde la clave AlertaID=6 con una posición que no existe en ese CSV. PT-24 sí usa correctamente AlertaID=6.
- **Evidencia:** Apertura completa de resultados/Q-11.csv y cotejo con PT-24 en Papeles_P1_v1.md, sección Resultado y límites. Los resultados históricos correspondientes conservan las mismas cuatro filas.
- **Consecuencia:** Rompe un localizador concreto durante el recorrido de defensa, aunque no altera el resultado ni su conclusión no concluyente.
- **Corrección mínima:** Sustituir por «E-22/Q-11, AlertaID=6 (cuarto registro de datos)». Usar siempre la clave estable como localizador principal.
- **Dependientes:** Borrador B1-1; futura integración por P3. PT-24 no necesita cambiar su clave correcta.
- **Verificación si se aplica:** Buscar AlertaID=6 en el CSV y comprobar que solo existe una coincidencia; revisar citas al consolidar el hallazgo. No repetir SQL.
- **Tipo de comprobación realizada:** Lectura de CSV y contraste de localizadores; sin ejecutar SQL.

### RI-P1-04 · menor · Q-06 puede etiquetar como supera 3x una selección por clasificación ausente

- **Archivo y ubicación:** `04_SQL/Analisis_Auditoria.sql`, L27–28, Q-06, CASE Evaluacion y WHERE.
- **Fragmento observado:** CASE WHEN s.BytesEnviados IS NULL OR COALESCE(b.dias,0)<5 THEN 'no evaluable' ELSE 'supera 3x' END […] (s.ClasificacionDestino IS NULL OR […] s.BytesEnviados>3*b.maximo)
- **Defecto o duda:** El WHERE permite seleccionar un flujo únicamente porque no tiene clasificación. Si ese flujo tiene bytes y cinco días de referencia, el CASE lo llama «supera 3x» sin comparar su volumen. Ejemplo lógico admisible: clasificación NULL, siete días, máximo 100 y bytes 100; se selecciona y se rotula supera 3x aunque la razón sea 1. Es una limitación confirmada del texto de la consulta, no un resultado incorrecto observado en los CSV actuales.
- **Evidencia:** Lectura estática de ambas expresiones. Q-06 vigente tiene FlujoID 71 (sí supera), 72 (sin bytes/base) y 73 (sin base); por eso sus tres etiquetas actuales son coherentes. No se insertó un caso nuevo ni se ejecutó la consulta.
- **Consecuencia:** Una futura fila válida o ampliación de muestra puede convertir falta de clasificación en una falsa anomalía de volumen. Los cotejos de hashes y la repetición de la misma muestra no cubren esa combinación.
- **Corrección mínima:** Distinguir los motivos: «no evaluable» cuando faltan bytes/base; «supera 3x» solo si se cumple la comparación; «sin clasificación; volumen dentro del umbral» para el caso restante. Otra opción es registrar los motivos en columnas separadas.
- **Dependientes:** Q-06 y su hash de sentencia/archivo; resultados y metadatos afectados; Consultas_resultados, T-25/PT-22 si cambia el significado de las etiquetas. Los documentos actuales no necesitan atribuir un error a sus tres filas.
- **Verificación si se aplica:** En una corrección posterior, probar la combinación clasificación ausente + base suficiente + volumen normal y repetir únicamente Q-06 y sus comprobaciones dependientes con versión nueva. No hace falta reconstruir el laboratorio.
- **Tipo de comprobación realizada:** Lectura de SQL y evaluación lógica de un contraejemplo hipotético; no prueba SQL ejecutada.

## Duda que necesita evidencia de ejecución humana

La severidad siguiente expresa su importancia para la defensa; no se suma al conteo de defectos confirmados.

### RI-P1-D01 · importante · Las duraciones de defensa siguen sin evidencia de ensayo y el conteo escrito subestima números y siglas

- **Archivo y ubicación:** `06_Comite/Guion_defensa_P1_v1.md`, L15–35 y L61–69; respuesta 01 L35; Revision_contenido_I6.json, respuestas.
- **Fragmento observado:** «Duración prevista a 130–150 palabras/minuto»; «Recorrido de trazabilidad para practicar: dos minutos»; «Tiempo observado: No medido».
- **Defecto o duda:** El guion sí reserva cuatro minutos y separa los dos minutos de práctica; no hay contradicción aritmética en la distribución. Lo no demostrado es poder ejecutarlo con cambios de documento y explicar las respuestas en 30–45 s. La respuesta 01 tiene 88 unidades separadas por espacios; una pronunciación desarrollada de números y siglas da 111 en una variante reproducible: 44.4–51.2 s a las mismas tasas. No es una medición humana ni prueba de que P1 exceda el tiempo.
- **Evidencia:** Recuento reejecutado y variante en comprobantes/estimacion_oral.json. Los cinco recuentos escritos (88/89/92/91/93) coinciden con I6. El registro del guion deja todos los ensayos humanos sin medir.
- **Consecuencia:** Leer el conteo automático como garantía puede dejar sin tiempo la trazabilidad o forzar respuestas ininteligibles. La ruta de dos minutos es plausible con archivos preparados, pero no está demostrada en condiciones de defensa.
- **Corrección mínima:** Cronometrar cuatro minutos propios, la ruta documental de dos minutos y las cinco respuestas pronunciando cifras y siglas. Si 01 excede 45 s, decir «el modelo sintético da entre dos y cinco megabytes» y dejar los bytes exactos visibles en PT-22. Registrar solo tiempos realmente observados.
- **Dependientes:** Guion y diapositivas propias; futuro reparto conjunto. La parte de navegación del juego no se ha revisado y queda expresamente fuera de este juicio.
- **Verificación si se aplica:** Ensayo humano con los archivos vigentes y, después, equipo/proyector de defensa. No rellenar tiempos ni acuerdos de P2/P3 por estimación.
- **Tipo de comprobación realizada:** Cálculo escrito ejecutado; exposición, pronunciación y ensayo físico no comprobados.

## Mejoras editoriales opcionales

No se etiqueta todo tecnicismo o límite como lenguaje artificial. Las cautelas sobre identidad, contenido, relojes y recuperación cumplen funciones diferentes y deben conservarse. Estas propuestas corrigen repetición, referentes o continuidad concreta; no son requisitos nuevos.

### RI-P1-E01 · menor · Los detalles de producción y los pendientes repetidos ocupan el cuerpo forense

- **Archivo y ubicación:** `01_Informe/Seccion_forense_P1_v1.md`, L3 y L64; PDF pp. 1 y 5.
- **Fragmento observado:** «Análisis de I4; edición y exportación técnica de I6 […] carta, márgenes […] interlineado 1.15»; L64 repite que no se recibieron los productos P2/P3.
- **Defecto o duda:** La apertura mezcla configuración de maquetación y nombres de sesiones con el análisis destinado al docente. El párrafo final declara dos veces la ausencia de aportes. Son datos verdaderos y útiles para el registro técnico; su reiteración aquí no añade un límite analítico. Se clasifica como edición opcional, no como incumplimiento ni detección automática de IA.
- **Evidencia:** Lectura del primer y último párrafo; contraste con README I6, que ya conserva formato, sesiones y estado de integración.
- **Consecuencia:** Resta espacio a la explicación del caso y vuelve administrativa la primera lectura. La sección ocupa cinco páginas frente a la orientación interna de unas cuatro; esa diferencia, por sí sola, no viola una exigencia oficial de P1.
- **Corrección mínima:** Apertura: «P1: Anthony Samuel Ordoñez Son, 2401002033. Corte: 15/10/2026 23:59:59 UTC−6. Redacción asistida por Codex; revisión humana pendiente». Dejar maquetación/sesiones en procedencia. Cierre: «P2/P3 deben aportar criterios y revisión cruzada; no consta recepción ni traspaso. Revisión humana y ensayo físico pendientes». Conservar los límites específicos junto a cada conclusión.
- **Dependientes:** Sección MD/DOCX/PDF y aporte insertado en el informe parcial. No eliminar los límites probatorios de PT o cifras.
- **Verificación si se aplica:** Comparar significado y alcance antes/después; revisar paginación y correspondencia de ambas exportaciones. No SQL nuevo.
- **Tipo de comprobación realizada:** Juicio editorial basado en repeticiones localizables; sin atribuir autoría por estilo.

### RI-P1-E02 · menor · Algunos términos dejan implícito qué dato falta

- **Archivo y ubicación:** `03_Evidencias/Papeles_P1_v1.md; 01_Informe/Seccion_forense_P1_v1.md`, PT-21, Resultado y límites, PDF papeles p. 4; sección forense L40/L54, PDF pp. 3–4.
- **Fragmento observado:** «no evaluable por falta de login/base»; «autorización, job, archivos»; «faltan request IDs».
- **Defecto o duda:** «Base» puede entenderse como base de datos o como referencia habitual, mientras Q-05 carece de identidad con la que construir esa referencia. «Job» y «request IDs» se usan sin explicación en el texto final. No se propone eliminar vocabulario necesario como SQL, MFA, hashes o RTO/RPO.
- **Evidencia:** Q-05 usa UsuarioID y días de referencia para evaluar; su fila de 31,840 no identifica usuario. Lectura de los fragmentos citados.
- **Consecuencia:** Un lector puede entender que no existe una base SQL, a pesar de las ejecuciones descritas, o no saber qué registro concreto se está solicitando.
- **Corrección mínima:** «No evaluable: falta identificar al usuario SQL y su referencia habitual»; «autorización y registro de la tarea programada (job)»; «identificadores de petición (request IDs)». Después pueden conservarse los términos técnicos abreviados.
- **Dependientes:** PT-21, sección e informe parcial en sus exportaciones. Mantener nombres de campos exactos en los anexos técnicos.
- **Verificación si se aplica:** Comprobar que se conserva la diferencia entre login, cuenta de aplicación y persona; reexportar únicamente textos afectados.
- **Tipo de comprobación realizada:** Lectura contextual; mejora de precisión para el lector, no error de los valores.

### RI-P1-E03 · menor · La libreta impresa fragmenta campos breves y pierde contexto de actividad en continuaciones

- **Archivo y ubicación:** `06_Comite/simulacion_auditoria/artifacts/entrega/libreta-respaldo.pdf`, pp. 3–4, 7–8 y 9–10; especialmente p. 8.
- **Fragmento observado:** P. 8 contiene únicamente «Plazo propuesto: No registrado» y «Verificación: No registrada» de una actividad iniciada en la página anterior.
- **Defecto o duda:** La exportación es completa y no está vacía ni recortada. Sin embargo, separa grupos breves de Recomendación y prueba de cierre y deja continuaciones sin el código de actividad. Es una mejora opcional del entregable impreso; no se está evaluando el juego ni sus reglas.
- **Evidencia:** Render nuevo de las doce páginas y extracción de texto. La página 4 también conserva solo los cuatro campos vacíos de AU-02; la página 10 continúa AU-05.
- **Consecuencia:** Al usar el respaldo en papel se necesitan saltos de página adicionales para asociar campos con AU-02/AU-04/AU-05. No invalida sus conclusiones ni su carácter de ejemplo.
- **Corrección mínima:** Mantener cada grupo breve de campos en una página o repetir el código y título de actividad al continuar. No completar recomendaciones que el ejemplo dejó vacías ni convertir Documentado en aprobación.
- **Dependientes:** PDF de respaldo y su comprobación de paginación; el JSON no necesita cambiar si se mantiene el contenido. No se propone editar código del juego en esta revisión.
- **Verificación si se aplica:** Reexportar o remaquetar por separado y comparar todo el texto con el PDF/JSON preservados; inspeccionar continuaciones. Revisar únicamente medios que efectivamente se vean afectados.
- **Tipo de comprobación realizada:** Inspección del PDF entregado; sin revisar código o comportamiento del juego.

## Efecto de una corrección futura sobre los cierres

Esta revisión no aplica correcciones. Cuando se autoricen, preservar los bytes previos, generar versiones nuevas de los derivados afectados y actualizar su trazabilidad. No basta cambiar una frase en el MD dejando PDF/DOCX/ZIP anteriores. Recalcular los hashes y repetir las comprobaciones afectadas antes de emitir un nuevo cierre técnico; conservar I5/I6 como históricos. Una corrección textual no exige SQL ni reconstrucción. RI-P1-04 sí exigiría volver a ejecutar Q-06 y registrar la versión de sentencia/resultados que se entregue. No procede volver a declarar 98/98 con los registros anteriores después de cambiar entradas.

## Qué impide cerrar P1

No se encontró un impedimento técnico para abrir el paquete de entregables revisado. Sus hashes, tablas y cálculos centrales son consistentes. Para presentar la argumentación propia como terminada, deben corregirse RI-P1-01 y el localizador RI-P1-03, tratarse RI-P1-02 con textos originales o con una limitación expresamente aceptada y resolverse el ensayo/validación humana pendientes. RI-P1-04 es una limitación real de la regla SQL para combinaciones no cubiertas; sus tres filas actuales no necesitan una retractación de resultados. Debe corregirse antes de presentar la consulta como regla general correcta.

No hacen falta originales empresariales inexistentes para cumplir un proyecto que permite laboratorio sintético. Hace falta conservar la incertidumbre donde corresponde y explicar qué comprueba el laboratorio. Tampoco hay que convertir los dos borradores de P1 en hallazgos empresariales confirmados para poder entregarlos. El informe final, los cinco hallazgos completos del equipo, matrices, resumen ejecutivo y plan presupuestado siguen sin integrarse. Ese faltante impide la entrega del equipo; no prueba que falten los productos técnicos propios comprobados de P1. **El juego está excluido: esta revisión no puede cerrar ni cuestionar su estado.**

## Qué corresponde a validación humana

P1 debe revisar y poder explicar una muestra real, por ejemplo CambioID=1 entre PT-23/Q-07/historial v2, y por qué 200→220 GTQ no es pérdida empresarial demostrada. Debe revisar las hipótesis y criterios de confirmación; comprobar fuentes, uso de IA y aprendizaje; practicar cuatro minutos propios, cinco respuestas y el recorrido documental con cronómetro. USB/proyector y compatibilidad de visores requieren prueba física. La captura gráfica SQL es el pendiente interno ya declarado; no se fabricó ni se exigió una ejecución SQL nueva en esta revisión. Solo cuando ocurran pueden registrarse revisión, firmas, recepción y tiempos. La aprobación académica corresponde al docente.

## Qué depende exclusivamente de P2/P3 y qué es compartido

- **P2:** sus productos de planeación, arquitectura/matrices, códigos R/C, políticas/criterios y objeciones/borradores propios. El período global S-02 y la consolidación de referencias/citas también requieren su aporte. Los criterios de política simulada deben identificarse como tales.
- **P3:** sus productos de terceros/IA/privacidad, BIA y objetivos de continuidad, revisión de B1-1/B1-2, hallazgos consolidados, resumen ejecutivo y plan a 90 días con Q350,000, costos, indicadores y riesgo residual. Los objetivos de negocio se justifican para el escenario, no se atribuyen a una empresa sin fuente.
- **Compartido:** enviar y recibir efectivamente los archivos, cuestionar borradores, acordar la exposición, integrar papeles/presentación/informe y registrar traspasos. P1 también debe entregar y participar. No se puede atribuir a P2/P3 una recepción o validación aún no realizada, ni transferirles en exclusiva los ensayos o la declaración de aprendizaje de P1.

No se encontraron productos terminados adicionales en las carpetas P2/P3 revisadas; eso describe este repositorio y no demuestra que no existan en otra ubicación.

## Las cinco preguntas más difíciles del docente

1. **«Si diseñó 216 cambios para que Q-07 devolviera 216, ¿qué ha probado y qué información nueva obtuvo del ataque?»** Debe distinguir correcta carga/selección/procedencia sintética de corroboración del incidente. Mostrar claves y campos desconocidos; no limitarse a recitar el conteo. Ruta: PT-23 p. 6 → Q-07 → historial v2 → Proyecto p. 4.
2. **«En H-B, si el titular usó su dispositivo y token para una tarea autorizada, ¿por qué eso confirmaría abuso?»** La lista actual no lo confirma: es RI-P1-01. Hay que demostrar el alcance autorizado y la acción que lo excedió, separando atribución técnica, uso indebido e intención. Ruta: sección p. 3, tabla 2.
3. **«Su modelo ocupa 2–5 MB y el caso dice 1.6 GB: ¿por qué esa diferencia no refuta la salida de clientes? ¿Cuánto ocuparía una fila si fueran solo esas 31,840?»** Respuesta sustentada: siete campos inventados no representan esquema, adjuntos ni repeticiones reales; unos 50,251 B/fila con GB decimales. Mostrar convenciones, hashes y escenarios; no usar el cociente como probabilidad. Ruta: PT-22 p. 5 → Volumen_31840_I4_v1.json.
4. **«CRM atrasado 15 minutos y despliegue adelantado 15: calcule las horas reales y diga si eso prueba causalidad. ¿Y si ambas marcas compartieran reloj?»** 02:57 y 02:47; orden invertido, sin causalidad probada. Un offset común constante cancela la diferencia; identidad de reloj y estabilidad requieren evidencia. Ruta: sección p. 2 y ejercicio hipotético B; no presentar offsets como medidos.
5. **«¿Qué permite afirmar sobre recuperación que el CRM vuelva a escribir a las 09:37, y qué original podría retirar B1-1 o B1-2?»** Los 355 min describen retorno reportado, sin demostrar limpieza, conciliación, RTO/RPO ni custodia. Para B1-1, ticket íntegro con acciones/cierre; para B1-2, registros/copia independiente con permisos, cobertura y retención comprobados. Ni la falta de ticket prueba inacción ni el permiso ficticio prueba manipulación. Ruta: PT-23/24/25 y borradores.

## Comandos ejecutados, resultados efectivos y partes no comprobadas

Los comandos sustantivos y sus intentos están en `comprobantes_v1/Comandos_ejecutados.json`; los scripts propios conservan sus argumentos completos. Se usaron `rg`, `cat`, `sed`, `nl`, `head`, `tail`, `ls`, `pwd` y `git status --short` para inventario/lectura, además de Python, pdftotext, LibreOffice, FFmpeg y `pnpm exec node` para las pruebas descritas. No se ejecutaron instalaciones manuales, compilaciones, tests del juego, SQL ni mensajes externos.

```bash
PYTHONPATH=/tmp/i6-python python3 /tmp/revision_p1/checks.py
python3 /tmp/revision_p1/extraido/P1/verificar_paquete_P1.py
python3 /tmp/revision_p1/runtime.py
python3 /tmp/revision_p1/runtime_media.py
python3 /tmp/revision_p1/escribir_informes.py
```

El último comando se ejecutó con Python estándar; no necesita las bibliotecas de extracción. `runtime.py` abrió copias con Writer/Calc y llamó al servidor estándar del ZIP; `runtime_media.py` ejecutó `pnpm exec node /tmp/revision_p1/runtime.mjs`, con el Chrome existente fijado por ruta. **Resultados finales:** ZIP 1,043/1,043 sin discrepancias; 19 enlaces documentales HTTP 200; tres DOCX y tres XLSX reabiertos; 62 fragmentos de la sección presentes en cada DOCX/PDF; 53 páginas renderizadas; nueve intervalos y quince sensibilidades correctos; dos serializaciones coincidentes; WebM decodificado y reproducido hasta ended. Se exportaron además copias temporales de los XLSX con Calc para inspeccionar sus vistas Lectura; esas páginas auxiliares no se cuentan entre las 53 de entregables PDF. No se emitió un nuevo «98/98» ni un «1,051/1,051» fuera de alcance.

Se preservaron y separaron los fallos de entorno: LibreOffice no inició en sandbox; una solicitud de permiso local expiró en el revisor automático y el reintento funcionó; el servidor fue bloqueado dentro del sandbox y funcionó con permiso local. El primer script de navegador apuntó al módulo no exportado directamente, el siguiente esperaba otra versión de Chromium y el final usó @playwright/test y Chrome ya instalados. El FFmpeg incluido no dispone del muxer null; decodificar a PNG sí completó 817 fotogramas. Ninguno se declaró defecto del producto. No quedó una acción pendiente de permiso.

Permanecen **sin comprobar**: juego actual en su totalidad; ejecución SQL nueva o presencia actual de las bases; originales empresariales; tiempos de exposición pronunciados, ensayo con USB/proyector, validación/aprendizaje humanos, aportes/recepción/revisiones/traspasos P2/P3 y aprobación académica. Estos informes son una revisión técnica independiente de los entregables, no un acta de aceptación del estudiante o del equipo.
