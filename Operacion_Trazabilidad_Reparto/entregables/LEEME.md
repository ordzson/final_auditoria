# Documentos para revisión del docente

Esta carpeta reúne la edición revisada del análisis del incidente de RedNova. Cada documento explica sus resultados y limitaciones sin exigir conocimiento de las claves de organización del equipo. Las cifras y los hechos reportados se distinguen de los datos ficticios del laboratorio.

## Orden sugerido de lectura

1. [Reconstrucción y evaluación del incidente](Seccion_forense_P1_v1.pdf). Explica lo conocido, las tres explicaciones posibles, las pruebas y lo que falta para concluir.
2. [Papeles de trabajo](Papeles_Trabajo_P1_v1.pdf). Seis análisis con índice enlazado: acceso, lectura de clientes, transferencia, órdenes, alerta y protección de registros.
3. [Cronología investigada](Cronologia_investigada_v1.xlsx). Trece sucesos con horas reportadas, fuentes y datos desconocidos.
4. [Índice de evidencia](indice_evidencias.xlsx). Describe qué es cada material y cómo encontrar su soporte.
5. [Programa de pruebas](Programa_pruebas_P1_v1.xlsx). Explica qué se examinó, el método, los resultados ficticios y sus límites.
6. [Observaciones pendientes de confirmar](Borradores_hallazgos_P1_v1.md). Seguimiento de la alerta y protección de registros; ambas siguen sin evidencia suficiente para aprobar un hallazgo.
7. [Acciones propuestas para las primeras 72 horas](Acciones_P1_0_72h_v1.csv). Once medidas con responsable, plazo, dependencias, indicador y prueba de cierre. Los plazos empiezan al activar el plan; no describen acciones ejecutadas.
8. [Presentación de defensa](Presentacion_P1_v1.pdf). Seis diapositivas para la intervención individual sobre el incidente.
9. [Guion de defensa](Guion_defensa_P1_v1.md). Intervención de cuatro minutos, respuestas al docente y ejercicios hipotéticos.
10. [Fuentes y criterios](Fuentes_P1_v1.pdf). Explica qué se tomó de cada documento y dónde comprobarlo.
11. [Declaración de uso de inteligencia artificial](Uso_IA.pdf). Comienza con una explicación de la asistencia y sus límites. Después conserva el registro histórico con sus instrucciones y abreviaturas explicadas.
12. [Informe parcial del equipo](Informe_equipo_parcial_P1_v1.pdf). Incorpora el análisis del incidente; señala las secciones aún pendientes de los otros responsables.

## Cómo revisar las hojas de cálculo

Abrir la pestaña **Lectura**, seleccionada al guardar. **Referencias** permite relacionar los temas con códigos y archivos. **Datos** conserva íntegra la tabla técnica de origen, incluidos sus encabezados y campos vacíos. **Cómo leer** explica las convenciones y **Procedencia** identifica la fuente editable.

Un campo vacío significa dato no aportado o relación pendiente; no significa cero. El nombre de la cuenta remota identifica un acceso, no a una persona. Los códigos de evidencia y consultas sirven para encontrar el soporte y no reemplazan su descripción.

El archivo de acciones es una tabla de texto con encabezados en español. Puede abrirse en una hoja de cálculo, con codificación UTF-8 y separador coma; activar ajuste de texto para leer las celdas largas.

## Correspondencia con la entrega del curso

La [guía oficial](../00_Material_del_curso/Guia_Entregables_Operacion_Trazabilidad.pdf), página 5, y el [proyecto](../00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf), página 7, piden informe, matrices, evidencia, laboratorio, defensa y declaración de uso de IA. Estos documentos corresponden al aporte individual de investigación del incidente. **No constituyen todavía la entrega completa del equipo.**

Siguen pendientes la integración del informe final de 12–18 páginas, las matrices globales de riesgos y controles, la consolidación de al menos cinco hallazgos sustentados, el plan de 90 días con presupuesto y la defensa conjunta. Las once acciones actuales cubren la propuesta inicial de 72 horas y no sustituyen ese plan completo. También falta la revisión del estudiante y del equipo.

## Soporte y versiones

Conservar esta carpeta dentro del proyecto: los enlaces a evidencia necesitan las carpetas vecinas. Para contrastar una muestra están las [consultas de laboratorio](../04_SQL/Analisis_Auditoria.sql), el [resultado de lectura de clientes](../03_Evidencias/resultados/Q-05.csv) y el [resultado de transferencias](../03_Evidencias/resultados/Q-06.csv).

Los archivos de esta carpeta son copias exactas de sus fuentes actuales, identificadas en `manifest_copias.json` mediante ruta, tamaño y huella digital SHA-256. Las versiones anteriores se conservaron en `03_Evidencias/resultados/Revision_legibilidad_docente_v1/previos/`. Los paquetes ZIP anteriores son históricos y no incorporan esta edición de lectura.
