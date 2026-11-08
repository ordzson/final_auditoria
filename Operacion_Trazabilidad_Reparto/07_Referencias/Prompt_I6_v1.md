# Registro literal del encargo I6

Herramienta: Codex. Fecha de ejecución técnica: 7 de noviembre de 2026 UTC. IA-013. El contexto y las instrucciones siguientes proceden del usuario; no acreditan validación humana de las salidas.

## Solicitud

Ejecuta y completa I6 del plan. Produce los archivos, corrige los problemas encontrados y ejecuta las verificaciones; no te limites a proponerlos.

CONTEXTO

- Proyecto: Operacion_Trazabilidad_Reparto/.
- I2/I3 ejecutadas en SQL Server 2022 con datos sintéticos v2.
- I4 implementada: PT-20–PT-25, cronología de 13 eventos, sección forense, mapa causal, B1-1/B1-2 no concluyentes y once acciones propuestas.
- I5 completada: pnpm verify aprobó 121 pruebas unitarias, compilación y 42 E2E.
- Se conservaron las 29 frases grabadas, los 151 recursos públicos, el expediente y las reglas evaluables v2.1.
- El registro de cierre contiene 312 entradas; junto con cinco documentales se comprobaron 317 referencias SHA-256 sin discrepancias.
- Revisión humana, captura gráfica SQL, ensayo físico y aportes/revisiones/traspasos P2/P3 siguen pendientes.

QUÉ LEER

Respeta los AGENTS.md aplicables. Usa exclusivamente pnpm para JavaScript/TypeScript.

Desde Operacion_Trazabilidad_Reparto/, lee:
1. P1_Incidente_evidencia_simulacion/ESTADO_P1.md.
2. Ejecucion_P1_por_instancias_v1.md, especialmente I6.
3. Revision_P1_coherencia_y_entregables_v1.md, distinguiendo sus resultados históricos del estado actual.
4. 06_Comite/simulacion_auditoria/artifacts/cierre-p1/README.md, integridad-cierre.json y manifest.json.
5. Los entregables y comprobantes vigentes de I2/I3/I4 necesarios para la integración.
6. La plantilla vigente, referencias, registro de IA y PDFs oficiales del curso.

Comprueba los hashes de las entradas antes de modificarlas y preserva las versiones anteriores. No reconstruyas el laboratorio, regeneres resultados ni ejecutes SQL innecesariamente.

TRABAJO I6

- Reabre muestras y contrasta cifras, códigos, versiones, fuentes, conclusiones y pendientes.
- Genera los XLSX del índice de evidencias, programa de pruebas y cronología, conservando sus fuentes editables.
- Maqueta y exporta la sección forense de P1 en DOCX y PDF usando la plantilla vigente v2; no sobrescribas versiones anteriores sin preservarlas.
- Genera Papeles_Trabajo_P1_v1.pdf con PT-20–PT-25 e índice. Integra el documento del equipo únicamente con aportes efectivamente recibidos.
- Prepara Presentacion_P1_v1.pdf y Guion_defensa_P1_v1.md, coordinados con los 12 minutos del equipo.
- Incluye respuestas de 30–45 segundos a las preguntas 01/02/03/06/07 y tres escenarios contradictorios rotulados como ejercicios hipotéticos.
- Regenera el vídeo y la libreta de respaldo desde la versión final del juego. Identifica el formato real; no llames MP4 a un WebM.
- Prepara un paquete portátil de P1 con índice, instrucciones de uso y archivos de respaldo.
- Consolida referencias verificadas y registro de IA, con exportación PDF y validación humana pendiente.
- Actualiza ESTADO_P1.md y deja cinco líneas de traspaso para P1.

VERIFICACIÓN Y LÍMITES

- Consulta los PDFs oficiales para requisitos concretos.
- Abre y verifica los PDF/XLSX/DOCX producidos y reproduce el vídeo; no basta comprobar que existan.
- Comprueba enlaces, legibilidad, paginación, contenido y correspondencia con las fuentes.
- Si modificas el comportamiento del juego, ejecuta pruebas específicas, compilación y pnpm verify completo tras el último cambio.
- Conserva la diferencia entre expediente, supuestos, resultados sintéticos, hipótesis y hallazgos aprobados.
- No inventes firmas, revisiones humanas, aportes, traspasos, conciliaciones ni ensayos físicos.
- No envíes mensajes externos.
- Si faltan P2/P3, completa el paquete propio de P1 y documenta qué impide la integración del equipo; no sustituyas sus conclusiones.
- Distingue «paquete técnico de P1 comprobado» de «entrega del equipo integrada» y de aprobación académica.
- Actualiza los hashes afectados y deja un informe breve con comandos, resultados efectivos y limitaciones.
