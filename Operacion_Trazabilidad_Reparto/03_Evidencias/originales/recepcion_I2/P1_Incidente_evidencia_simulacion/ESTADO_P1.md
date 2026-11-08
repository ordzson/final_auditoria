# Estado de ejecución de P1

Fecha de esta actualización: 6 de noviembre de 2026.

**Próxima acción: cargar los datos v2 en SQL Server y comprobar auditor_lectura.** Se recibieron los conjuntos v1 y v2. La revisión rápida de v2 aprobó 54 comprobaciones de archivos, 24 hashes y contrastes independientes; 16 tablas y 91,800 filas. La carga y las consultas académicas siguen pendientes.

Plan de ejecución: [Ejecucion_P1_por_instancias_v1.md](Ejecucion_P1_por_instancias_v1.md). Método: [expediente y laboratorio](../03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md).

## Avance

| Sesión | Estado | Comprobante |
| --- | --- | --- |
| I1 · Diseño y supuestos | comprobado | Nueve supuestos registrados con sus respuestas; diseño Q-01–Q-12, T-20–T-33, plantilla adaptada y contrato SQL comprobado. La revisión humana de archivos sigue pendiente. |
| I2 · Laboratorio | en curso | Datos v2 recibidos: 54 comprobaciones aprobadas y 24 hashes coincidentes; 16 tablas, 91,800 filas. Motor/esquema preparados anteriormente; faltan carga y prueba real de auditor_lectura. |
| I3 · Consultas y evidencia | pendiente | No hay consultas académicas ejecutadas ni resultados exportados. |
| I4 · Análisis y papeles | pendiente | No hay PT ni sección forense elaborados desde resultados. |
| I5 · Juego | pendiente | Existe el juego; revisión de cierre pendiente, con fallos previos registrados abajo. |
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
| Generación de datos | Otro modelo entregó v1 y v2 con scripts e informes. Se revisó v2, que corrige la distribución de 1,457 sesiones en los 23 días adicionales; v1 se conserva. | Usar 04_SQL/datos/v2/. Informe de recepción: 03_Evidencias/resultados/Revision_recepcion_datos_v2.json. Preservar originales y preparar carga. |
| Entorno | SQL Server 2022 Developer 16.0.4305.5 iniciado; contrato comprobado: 16 tablas, 18 claves foráneas, cero filas. | Continuar con carga solo tras recibir y validar los archivos; auditor_lectura todavía no creado. |

El registro conserva las respuestas textuales de aprobación. El momento de registro se identifica como tal; no se inventó una hora exacta de respuesta que la conversación no expone. Aprobar parámetros no equivale a revisar los archivos ni a validar los resultados posteriores.

## Estado concreto del motor

Contenedor propio: `p1-trazabilidad-sql2022`; puerto `127.0.0.1:14331`; volumen `p1_trazabilidad_sql2022_v1`. Se conserva iniciado al cerrar I1. Imagen fijada por digest en `04_SQL/compose.yaml`. Credencial local aleatoria en `.env`, excluida de Git y de los registros de evidencia.

La base `P1_Diseno_Contrato_v1` contiene solo el esquema vacío para validar el contrato. La base prevista `RedNova_P1_Lab_v1` no se creó ni cargó. La comprobación del DDL no es una ejecución de Q-01–Q-12. Los comandos y el resultado final están en `03_Evidencias/resultados/Validacion_contrato_I1_v1.txt` y su JSON.

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

## Traspaso de la última sesión

- **Qué produjo:** registro de recepción y revisión rápida de los datos v2; estado y registro de IA actualizados. Los conjuntos y comprobantes del generador se conservaron sin modificar.
- **Qué comprobó:** 54 comprobaciones reejecutadas de archivos, 24 hashes coincidentes, 16 tablas y 91,800 filas. Contraste independiente: 216 órdenes/216 cambios, diez grupos candidatos a duplicidad, 13 eventos y valores desconocidos de E-03/E-04 conservados.
- **Qué debe revisar P1:** muestra de datos y archivos recibidos; validación humana pendiente. Se eligió v2 por la corrección documentada de distribución de sesiones.
- **Pregunta de defensa:** ¿por qué validar CSV y contar 216 órdenes no acredita todavía la carga SQL ni confirma hechos de RedNova?
- **Siguiente acción concreta:** preservar el conjunto recibido, preparar la carga en base vacía propia y comprobar claves/conteos/permisos en el motor. Después se ejecutarán Q-01–Q-12 como auditor_lectura.

Cada nueva sesión reemplaza este traspaso con su resultado real, conserva las decisiones vigentes y actualiza la tabla de avance. Añade comandos/resultados y rutas a los comprobantes; no copies una expectativa de prueba en lugar de su ejecución.

## Registro de IA de la planificación

| Fecha | Herramienta | Prompt resumido | Uso | Validación humana | Ajustes y aprendizaje |
| --- | --- | --- | --- | --- | --- |
| 2026-11-06 | Codex | Planificar la ejecución de P1 entre instancias nuevas, sin huecos, con una solución simple que el equipo pueda explicar. | Plan de sesiones y estado de traspaso; incorporar esta fila al registro consolidado al abrirlo en I1. | Pendiente de P1. | Pendiente de P1. |
| 2026-11-06 | Codex | Ejecutar el plan, aclarar parámetros y dejar instrucciones específicas para que otro modelo genere los datos. | Diseño, supuestos, esquema comprobado, instructivo y plantilla; registro consolidado en 07_Referencias/Registro_uso_IA_v1.csv. | Parámetros aprobados por P1; revisión de archivos y resultados pendiente. | Se eligió laboratorio pequeño y se dejó la generación a otro modelo por instrucción expresa. |
