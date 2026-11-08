# Estado de ejecución de P1

Fecha de esta actualización: 7 de noviembre de 2026 (registro UTC).

**Próxima acción: I6 — integrar archivos finales y preparar la defensa con los aportes efectivamente recibidos.** I5 implementada y comprobada: 121 unitarias, TypeScript/Vite y 42 E2E aprobadas con `pnpm verify` completo tras el último cambio de comportamiento. Se conservaron las 29 frases/audios, la oficina y los 151 recursos públicos, el expediente y las reglas evaluables v2.1. I2/I3/I4 conservan su alcance; no se ejecutó SQL nuevo ni se reconstruyó el laboratorio. Revisión humana, captura gráfica SQL, ensayo físico y aportes/traspasos P2/P3 siguen pendientes.

Plan de ejecución: [Ejecucion_P1_por_instancias_v1.md](Ejecucion_P1_por_instancias_v1.md). Método: [expediente y laboratorio](../03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md).

## Avance

| Sesión | Estado | Comprobante |
| --- | --- | --- |
| I1 · Diseño y supuestos | comprobado | Nueve supuestos registrados con sus respuestas; diseño Q-01–Q-12, T-20–T-33, plantilla adaptada y contrato SQL comprobado. La revisión humana de archivos sigue pendiente. |
| I2 · Laboratorio | comprobado | v1/v2 preservados; hashes v2 verificados; carga, comparación integral de celdas, restricciones, fechas y nulos en SQL. Auditor real con lectura y rechazos de escritura/administración. |
| I3 · Consultas y evidencia | comprobado | Q-01–12 y Q-S01 reales; CSV completos, ejecución/hash, diccionario DOT/PNG, índice y custodia. Captura gráfica pendiente explícita; revisión humana no realizada. |
| I4 · Análisis y papeles | comprobado | Seis PT plantilla C, cronología 13 eventos, sección ~1,960 palabras, mapa DOT/SVG, dos borradores D no concluyentes y 11 acciones. 305 cotejos de entrada y 30 comprobaciones de archivos/entregables; revisión humana y cruzada pendientes. |
| I5 · Juego | comprobado | Coherencia con I4, ayudas escritas, metadatos, impresión y plazo opcional; diagnóstico de apertura/modelos; `pnpm verify`: 121 unitarias, compilación y 42 E2E. Cierre y límites en `06_Comite/simulacion_auditoria/artifacts/cierre-p1/README.md`. |
| I6 · Integración y defensa | pendiente | No hay paquete final de P1 ni integración del equipo. |

## Archivos existentes que debe conservar la siguiente instancia

- PDFs oficiales en `00_Material_del_curso/`.
- `03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md`, `Fuentes_curso_v1.csv`, `Indice_evidencias_inicial_v1.csv` y `hashes_documentales_v1.csv`.
- Guía interna de P1, documentos de diseño del juego, `Plan_cierre_P1_v1.md` y `Revision_P1_coherencia_y_entregables_v1.md`.
- Juego en `06_Comite/simulacion_auditoria/`, con código, recursos y pruebas previos a este plan.
- `04_SQL/Instrucciones_generacion_datos_P1_v1.md`, `Diseno_laboratorio_v1.md`, `01_esquema.sql`, `compose.yaml`, `.env.example` y `README.md`.
- Datos recibidos: `04_SQL/datos/v1/` y `datos/v2/`; versión seleccionada v2, con `02_generar_datos_v2.py` y `validar_datos_v2.py`. Informe propio: `03_Evidencias/resultados/Revision_recepcion_datos_v2.json`.
- `03_Evidencias/Supuestos_P1_v1.csv`, `Programa_pruebas_P1_v1.csv`, `Responsables_equipo_v1.csv` y comprobantes de I1 en `resultados/`.
- Plantilla vigente: `01_Informe/Plantilla_UdeO_v2.docx` y su PDF, con integrantes confirmados. Se conservan `Plantilla_UdeO_v1.docx`, su PDF y el script de preparación como versión anterior. La fuente aportada está preservada en `03_Evidencias/originales/documentos/` con su hash en `07_Referencias/Fuentes_adicionales_P1_v1.csv`.
- `07_Referencias/Registro_uso_IA_v1.csv` y `Fuentes_P1_v1.md`.

El índice inicial transcribe E-01–E-10 de la página 5 del proyecto; no registra originales de sistemas. Los cinco hashes documentales iniciales se volvieron a calcular en I1 con Python y coinciden. Comprobante: `03_Evidencias/resultados/Verificacion_entradas_I1_v1.json`. Una nueva instancia debe comprobarlos antes de usarlos. Los documentos y nuevos entregables todavía aparecen como archivos no rastreados en Git; no borrarlos ni asumir que están incluidos en un commit.

## Decisiones vigentes

| Asunto | Situación real | Acción necesaria |
| --- | --- | --- |
| S-03 · Horas | Aprobado por P1: Guatemala UTC−6, originales conocidos conservados y desfases desconocidos sin verificar. | Aplicar esa referencia sin afirmar sincronización comprobada. |
| S-04 · Respaldos/restauración | Aprobado solo para laboratorio: 00:30, 7–15 de octubre; ejecuciones 7–14; tamaño habitual 8.0–8.3 GiB y 3.2 GiB el 14; respaldo histórico 30 de junio y restauración ficticia 1 de julio. | Generar registros declarados sintéticos; no afirmar backup ni restauración reales. Las propuestas retiradas siguen retiradas. |
| S-09 · Volumen y semilla | Aprobado el tamaño pequeño: 85,000 clientes, 3,000 órdenes, 120 cuentas, 3,000 sesiones y semilla 1410. | Conservar 13 eventos, 31,840 filas reportadas, ~1.6 GB y 216 órdenes; no reducir clientes. |
| S-P1-* · Casos y reglas | P1 aprobó el conjunto de la tabla de diseño. Incluye bajas, grupos privilegiados, duplicidades, casos nocturnos, umbrales y corte fijo del 15 de octubre de 2026, 23:59:59 UTC−6. | Usar referencias provisionales hasta mapeo de P2. Parámetros y respuestas en Supuestos_P1_v1.csv. |
| Generación de datos | Otro modelo entregó v1 y v2 con scripts e informes. Se revisó v2, que corrige la distribución de 1,457 sesiones en los 23 días adicionales; v1 se conserva. | Usar 04_SQL/datos/v2/. Informe de recepción: 03_Evidencias/resultados/Revision_recepcion_datos_v2.json. Originales preservados en originales/recepcion_I2; v2 cargado y comprobado. |
| Entorno | SQL Server 2022 Developer 16.0.4305.5 iniciado; contrato comprobado: 16 tablas, 18 claves foráneas, cero filas. | Carga completada en RedNova_P1_Lab_v2 y RedNova_P1_Lab_v2_repeticion; auditor_lectura creado y comprobado. |

El registro conserva las respuestas textuales de aprobación. El momento de registro se identifica como tal; no se inventó una hora exacta de respuesta que la conversación no expone. Aprobar parámetros no equivale a revisar los archivos ni a validar los resultados posteriores.

## Estado concreto del motor

Contenedor propio: `p1-trazabilidad-sql2022`; puerto `127.0.0.1:14331`; volumen `p1_trazabilidad_sql2022_v1`. Se conserva iniciado al cerrar I1. Imagen fijada por digest en `04_SQL/compose.yaml`. Credencial local aleatoria en `.env`, excluida de Git y de los registros de evidencia.

La base `P1_Diseno_Contrato_v1` contiene solo el esquema vacío para validar el contrato. La base prevista `RedNova_P1_Lab_v1` no se usó: se eligió `RedNova_P1_Lab_v2` para identificar la versión recibida. Existe también `RedNova_P1_Lab_v2_repeticion`, reconstruida desde cero. Los nombres de intentos previos se conservan y están documentados en `resultados/Incidencias_ejecucion_I2_I3.md`. La comprobación del DDL no es una ejecución de Q-01–Q-12. Los comandos y el resultado final están en `03_Evidencias/resultados/Validacion_contrato_I1_v1.txt` y su JSON.

## Integrantes confirmados por el usuario

| Rol | Integrante | Carné | Función en el equipo |
| --- | --- | --- | --- |
| P1 | Anthony Samuel Ordoñez Son | 2401002033 | Analista técnico y custodio de evidencias. |
| P2 | María José Aldana Culajay | 2301002013 | Coordinación, planeación, riesgos, controles e integración del informe. |
| P3 | Luis Antonio Vicente Zapón | 2301002003 | Terceros, IA, hallazgos, plan y revisión de calidad. |

La confirmación del usuario corresponde al orden P1/P2/P3. El registro estructurado está en `03_Evidencias/Responsables_equipo_v1.csv`. No acredita traspasos de archivos, firmas, validación de resultados ni identidad de quienes custodiaron los sistemas originales del incidente.

## Dependencias del equipo

| Responsable | Material esperado | Estado |
| --- | --- | --- |
| P2 | S-02/período, escala S-06, R/C/T definitivos, criterios/políticas y registro consolidado de supuestos. | Se leyeron sus guías en la carpeta del proyecto; no se encontraron productos terminados. El período técnico de laboratorio tiene supuesto propio provisional y no aprueba S-02 por P2. |
| P3 | BIA/S-05 y RTO/RPO, recomendaciones/pruebas de cierre, revisión de B1-1/B1-2 y hallazgos H definitivos. | No recibido; no asignar sus objetivos ni aprobar sus conclusiones. |
| P2 y P3 | Borradores para revisión cruzada, papeles de trabajo y diapositivas para integración. | No recibidos; paquete propio e integración del equipo se cierran por separado. |
| P1 | Revisión de archivos/resultados y ensayo en el equipo de defensa. | Custodio confirmado: Anthony Samuel Ordoñez Son, carné 2401002033. Identificación completa del equipo registrada y portada actualizada; revisión humana de archivos/resultados pendiente. |

La fuente de plantilla localizada fue `/home/ordson/Escritorio/Operacion_Trazabilidad_Reparto/Preguntas_basicas_CNN_v2 (2).docx`; coincide en bytes con la copia del Escritorio. Las carpetas de P2/P3 de ambas ubicaciones revisadas contienen las guías de reparto, sin matrices/BIA terminados identificados. La plantilla está preparada para entregar a P2; no se registró un traspaso real.

## Verificaciones previas: resultado histórico, no certificación futura

La revisión inicial registró `pnpm test`: 116 aprobadas en 16 archivos; `pnpm build`: completado con aviso de tamaño de JavaScript; `pnpm test:e2e`: 31 aprobadas y 7 fallidas de 38. Seis fallos agotaron la espera al pausar/omitir la apertura; el séptimo esperaba cinco cargas GLB y observó once. Las trazas quedaron en la carpeta generada `artifacts/test-results/`; comprobar si siguen disponibles antes de citarlas. El ensayo físico no está realizado.

Estas pruebas son del juego, no del laboratorio académico. I5 debe diagnosticar y repetir las verificaciones del cierre después de las correcciones; conservar la evidencia de cualquier fallo pendiente.

## Traspaso de I2/I3

- **Qué produjo:** cargador Python estándar y SQL editables en `04_SQL/`; datos recibidos sin modificar, copias v1/v2 y primeras versiones de artefactos preservadas. Diccionario, relaciones DOT/PNG, manifiesto, interpretación, índice E-01–E-28 por ruta/hash, registro SHA-256 y formulario de custodia en `03_Evidencias/`. E-29 captura gráfica pendiente, sin imagen fabricada.
- **Qué comprobó en archivos:** 24 hashes del manifiesto v2 y cotejo de copias; contraste Python independiente de SELECT: 216 cambios/216 órdenes, 144 monto/72 estado y diez grupos candidatos. Hash del PDF no equivale al hash de una extracción original.
- **Qué ejecutó en SQL Server:** dos bases propias con 16 tablas y 91,800 filas; todas las celdas SQL comparadas con CSV, 18 FK confiables, DBCC, fechas, nulos y 13 eventos; contrato P1_Diseno_Contrato_v1 conservado vacío. Login real auditor_lectura con lectura de clientes y cinco rechazos reales (INSERT/UPDATE/DELETE/ALTER/CREATE USER). Admin ficticio de bitácora con UPDATE/DELETE efectivos, control/auditor sin ellos; ninguna modificación de bitácora ejecutada.
- **Resultados:** `03_Evidencias/resultados/I2_I3_cierre/` y `I2_I3_repeticion/`, 95 comprobaciones aprobadas cada una. CSV accesibles además en `resultados/Q-01.csv`…`Q-12.csv`; conteos: 6, 18, 3, 7, 2, 3, 216, 10, 9, 3, 4, 13. Repetición determinista y 15 CSV idénticos entre bases; ver `Comparacion_reconstruccion.json`. Comandos reproducibles en `04_SQL/README.md`; `Ejecuciones_v1.csv` registra login/motor/base/corte/consulta y hashes. Intentos y correcciones conservados en `Incidencias_ejecucion_I2_I3.md`.
- **Qué debe revisar P1:** muestra de Q-07 y su OrdenID en SQL; desconocidos de Q-05/Q-06/Q-12; motivos de Q-02 y rechazos del auditor. Validación humana pendiente, sin firmas ni traspasos inventados.
- **Pregunta de defensa:** ¿por qué reproducir 31,840, ~1.6 GB y 216 no confirma exfiltración, responsables ni daño económico? ¿Qué diferencia hay entre un rol declarado y UPDATE efectivo?
- **Siguiente acción:** I4, PT-20–PT-25, cronología investigada, hipótesis y sección forense usando estos resultados. Mantener límites y solicitar aportes pendientes a través del equipo; no se enviaron mensajes externos.

Q-01–Q-04/Q-10 preparados localmente para P2; Q-09 y S-04 para P3. Estado de entrega: **preparado para entregar**, sin traspaso real. R/C/S globales, políticas, BIA, RTO/RPO, facturación y revisiones cruzadas continúan pendientes. El registro de restauración de julio es ficticio; no se ejecutó un restore. El juego no se modificó ni se repitieron sus pruebas.

## Registro de IA de la planificación

| Fecha | Herramienta | Prompt resumido | Uso | Validación humana | Ajustes y aprendizaje |
| --- | --- | --- | --- | --- | --- |
| 2026-11-06 | Codex | Planificar la ejecución de P1 entre instancias nuevas, sin huecos, con una solución simple que el equipo pueda explicar. | Plan de sesiones y estado de traspaso; incorporar esta fila al registro consolidado al abrirlo en I1. | Pendiente de P1. | Pendiente de P1. |
| 2026-11-06 | Codex | Ejecutar el plan, aclarar parámetros y dejar instrucciones específicas para que otro modelo genere los datos. | Diseño, supuestos, esquema comprobado, instructivo y plantilla; registro consolidado en 07_Referencias/Registro_uso_IA_v1.csv. | Parámetros aprobados por P1; revisión de archivos y resultados pendiente. | Se eligió laboratorio pequeño y se dejó la generación a otro modelo por instrucción expresa. |


## Cierre de I4 · 7 de noviembre de 2026 UTC

**Estado técnico:** comprobado en archivos. Esta calificación no concede aprobación académica, revisión humana ni integración del equipo. Comprobantes: [resultados/I4/README.md](../03_Evidencias/resultados/I4/README.md) y `Validacion_entregables_I4_v1.json`.

| Producto | Ruta y disponibilidad |
| --- | --- |
| PT-20–PT-25, plantilla C | `03_Evidencias/Papeles_P1_v1.md`; fuentes, procedimientos realmente ejecutados, muestras completas, resultados y límites. |
| Cronología investigada | `03_Evidencias/Cronologia_investigada_v1.csv`; 13 eventos, cuenta solo EVT-02, originales/normalización comprobada vacíos, fiabilidad y desconocidos. Preparada para P3. |
| Intervalos/sensibilidad | `03_Evidencias/resultados/I4/Intervalos_I4_v1.json` y `Sensibilidad_relojes_I4_v1.csv`; 315/355 min de recuperación reportada y 15 escenarios hipotéticos. Disponibles para P3, sin traspaso. |
| Sección forense | `01_Informe/Seccion_forense_P1_v1.md`; unas 1,960 palabras para ~4 páginas, formato cotejado con plantilla v2; tres hipótesis, órdenes, volumen y respuesta. Preparada para P2; paginación/exportaciones en I6. |
| Mapa causal | `03_Evidencias/Mapa_causal_P1_v1.dot` editable y `.svg` ampliable; certeza por color/texto, enlaces causales sin demostrar y laboratorio separado. |
| Borradores plantilla D | `03_Evidencias/Borradores_hallazgos_P1_v1.md`; B1-1 causa organizativa de seguimiento y B1-2 causa técnica de protección independiente, ambas hipotéticas/no concluyentes. Criterios NIST precisos verificados en PDFs oficiales. H definitivos/revisión de P3 pendientes. |
| Acciones 0–72 h | `05_Plan/Acciones_P1_0_72h_v1.csv`; 11 propuestas, responsables por rol, recursos, plazos desde T0 futuro, KPI, evidencia y prueba de cierre; costo pendiente de P3, no Q0. No ejecutadas en empresa. |
| Cálculos reproducibles | `03_Evidencias/analizar_I4.py` y `verificar_I4.py`; Python estándar. Resultados en `03_Evidencias/resultados/I4/`. |

**Qué se comprobó en archivos.** Coincidieron cinco hashes documentales y 276 del registro previo, más 24 del manifiesto v2 (305 referencias, no fuentes independientes). Se cotejaron 13 registros históricos de ejecución, versiones de SQL/manifiesto y CSV. Se reabrieron los comprobantes históricos de 95 verificaciones en tres corridas finales y se compararon realmente los 15 CSV de principal/repetición. La validación propia de I4 aprobó 30 comprobaciones estructurales y de trazabilidad. Un verificador previo esperaba erróneamente E-29 en el índice; se corrigió contra el índice preservado E-01–28 y se conservó el resultado 29/30. E-29 sigue pendiente sin artefacto.

**Cálculos nuevos.** Python cotejó las 216 filas completas de Q-07 con HistorialOrdenes v2: 216 órdenes, 144 cambios de monto y 72 de estado, todos a las 02:42 por diseño y sin cuenta/sesión/vía. Los diez pares de Q-08 no se cruzan con esas 216; no hay prueba de doble cobro. Serializar siete campos de 31,840 clientes ficticios dio CSV UTF-8 de 2,058,909 bytes y JSONL de 5,115,483 bytes; frente a 1.6 GB decimal, factores 777.11 y 312.78, sin inferir contenido del flujo. Se calcularon nueve intervalos y escenarios de reloj ±5/10/15 min; no hay cota real de desfase ni laguna técnica de logs probada.

**SQL realmente ejecutado en I4: ninguno.** Se usaron resultados históricos I2/I3; no se conectó al motor, cargó datos, reconstruyó base ni hizo backup/restore. El registro histórico de julio sigue siendo ficticio. El juego no se modificó ni probó. No se imprimieron ni incorporaron credenciales a evidencia.

**Preservación y referencias.** Siete versiones previas con cotejo en `03_Evidencias/originales/previos_I4/Preservacion.json`; índice amplía vínculos a derivados sin nuevos E, hashes vigentes actualizados al cierre. Custodia y `Registro_uso_IA_v1.csv` registran operaciones reales (IA-011). `Fuentes_P1_v1.md` documenta las páginas oficiales de CSF 2.0 y SP 800-61r3 consultadas por web. La copia local de esos PDFs no se pudo descargar por DNS restringida; no se afirma hash de descarga. Los PDFs locales del curso sí se extrajeron y cotejaron. No se añadieron normas legales o ISO sin verificar su texto.

**Dependencias y revisión.** Falta captura gráfica, revisión humana de P1, R/C/S/políticas y borradores de P2, BIA/RTO/RPO y revisión de P3, originales/relojes/ACL/contenidos del incidente, respaldo de producción, ERP/facturación. Las carpetas locales de P2/P3 solo contienen guías; no se recibieron nuevos productos. Tres objeciones por hallazgo de P2 y revisión cruzada de B1-1/B1-2 quedan pendientes. Material preparado para entregar por archivos: P2 María José Aldana Culajay, 2301002013; P3 Luis Antonio Vicente Zapón, 2301002003. No hubo envío externo ni traspaso real.

### Cinco líneas para P1

1. **Produjo:** seis PT, cronología, sección forense, mapa, dos borradores y once acciones, con fuentes/cálculos editables.
2. **Comprobó:** hashes/CSV y 30 verificaciones locales; el SQL citado corresponde a I2/I3, sin nueva ejecución en I4.
3. **Debe revisar P1:** seguir CambioID=1/OrdenID=1 desde PT-23 al CSV y, al revisar humanamente, localizarlo como auditor en SQL; contrastar los límites de PT-22/PT-25 y causas hipotéticas de ambos borradores.
4. **Pregunta de defensa:** ¿qué original cambiaría la conclusión no concluyente y por qué 216 órdenes o un tamaño compatible no prueban pérdida o exfiltración?
5. **Siguiente paso:** I5: diagnosticar/corregir el juego y ejecutar sus verificaciones prescritas. I6 hará exportaciones, integración y defensa con aportes efectivamente recibidos.


## Cierre de I5 · 7 de noviembre de 2026 UTC

**Estado técnico:** comprobado en software y archivos, sin aprobación académica. Informe de validación y comprobantes en [cierre-p1](../06_Comite/simulacion_auditoria/artifacts/cierre-p1/README.md). Entradas: 306 referencias SHA-256 y cinco documentales coincidentes; 102 copias previas cotejadas. El registro vigente se actualizó con versiones preservadas y comprobantes I5; cotejo final en `integridad-cierre.json`.

Se corrigieron textos que negaban globalmente el SQL ya ejecutado en I2/I3; el navegador conserva únicamente sus resúmenes locales. Ayuda escrita explica los términos y límites de I4, sin convertir resultados sintéticos, B1-1/B1-2 o propuestas en originales/hallazgos aprobados. «Ver metadatos» consulta el inventario, sin leer archivos ni calcular hashes. La impresión incluye ocho preguntas y respuestas legibles, códigos y fuentes, con seis revisiones; PDF digital de 12 páginas. Recomendaciones opcionales incorporan plazo y resultado de cierre; administración decide y ejecuta. «Documentado» sigue siendo una marca educativa sustentada, compatible con conclusión no concluyente.

Los seis fallos históricos de clic y el conteo GLB se reprodujeron antes de corregir. Se agruparon cargas de modelos, se reutilizan imágenes idénticas, se evitan invalidaciones sin cambios y animación al esperar entrada, y el reloj conserva tiempo de fotogramas retrasados. La alternativa plana también se respeta durante la apertura. No se cambiaron recursos ni calidad gráfica. El test local comprueba los once GLB requeridos y ambos GLTF, acepta recursos adicionales y conserva el contraste sin solicitudes externas y con contexto offline.

**Verificación final real:** `pnpm verify`, código 0, 121 unitarias en 16 archivos, TypeScript/Vite y 42 E2E. Antes: 31/38 E2E y siete fallos reproducidos. Se conservan intentos intermedios, una primera batería 41/42 por selector obsoleto y sus correcciones. Los clics históricos conservan 15 s. Solo el recorrido físico completo usa 180 s globales después de observar que agotaba 120 s cerca del final; pasó en unos 2.4 min. No se afirma que ampliar ese presupuesto resolviera los defectos del producto. Cobertura: seis revisiones, retorno/persistencia de seis PCs con libreta/TI, impresión, móvil, movimiento reducido, WebGL/puntero denegados, audio y offline tras carga.

Se conservaron por hash las 29 frases, guion, mapa de audios y MP3; ningún reemplazo de audio pendiente por I5. Los 151 recursos públicos y el expediente JSON siguen idénticos; comparación semántica confirma reglas v2.1 conservadas salvo dos aclaraciones de redacción. SQL nuevo, reconstrucción, backup/restore y mensajes externos en I5: ninguno. Registro de IA: IA-012; revisión humana y aprendizaje de P1 pendientes.

### Cinco líneas para P1

1. **Produjo:** juego corregido, README vigente, capturas actuales y PDF de prueba, informes de integridad/diagnóstico/verificación en `cierre-p1/`.
2. **Comprobó:** ejecución final completa 121 + compilación + 42; los ensayos fallidos permanecen identificados y no se cuentan como aprobados.
3. **Debe revisar P1:** recorrer AU-02 de E-03/E-04 y declaración de Seguridad a la comprobación C02-CONTENIDO y su respuesta impresa; abrir la ayuda de recuperación y distinguir RTO de RPO. No se registra esa revisión humana como hecha.
4. **Pregunta de defensa:** ¿por qué completar una revisión no concluyente como «Documentado» no aprueba un hallazgo, autentica originales ni ejecuta Q-xx en el navegador?
5. **Siguiente paso:** I6: reabrir muestras, exportar/integrar entregables y regenerar vídeo/libreta de defensa; ensayo físico, captura gráfica SQL y aportes/revisión/traspasos reales P2/P3 siguen pendientes.
