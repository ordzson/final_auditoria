# Fuentes y criterios utilizados

Este documento explica para qué se usó cada fuente y dónde comprobarla. Las consultas de fuentes externas aquí registradas proceden de la revisión técnica anterior, de noviembre de 2026; esta edición aclara su presentación. La revisión del estudiante sigue pendiente.

## Documentos del curso

**Proyecto: Operación Trazabilidad, auditoría integral de sistemas ante un ciberataque.** Universidad de Occidente, octubre de 2026. Documento local: `00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf`. Las páginas 3–5 sustentan las advertencias previas, la cronología y las diez entradas iniciales de evidencia. La página 6 pide datos ficticios y consultas de solo lectura; la página 7 contiene productos y preguntas de defensa; la página 8 define la rúbrica y la integridad académica. El expediente es un resumen: no se presenta como una extracción original de la empresa.

**Guía paso a paso de entregables.** Universidad de Occidente, octubre de 2026. Documento local: `00_Material_del_curso/Guia_Entregables_Operacion_Trazabilidad.pdf`. Los pasos 6–8 orientan custodia, consultas y reconstrucción; el paso 10, la redacción de hallazgos; y el paso 12, el informe y la defensa. La plantilla de papeles de trabajo está en la página 3 y la de hallazgos en la 4. Se pide un informe de equipo de 12–18 páginas sin anexos y una exposición de hasta 12 minutos. La sección individual y el informe parcial actuales no sustituyen esa entrega completa.

Las copias recibidas y sus huellas digitales SHA-256 se identifican en `03_Evidencias/Fuentes_curso_v1.csv`. Las huellas permiten cotejar los archivos locales; no autentican registros del incidente.

## Seguimiento y escalamiento de incidentes

**National Institute of Standards and Technology (NIST). (2024). The NIST Cybersecurity Framework (CSF) 2.0. CSWP 29.** Publicado el 26 de febrero de 2024. [Documento oficial](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf).

Se aplica a la clasificación y al escalamiento de la alerta crítica, examinados en el papel de seguimiento (PT-24) y en la observación del mismo tema. Localización: apéndice A, página impresa 22, página 27 del PDF, apartados RS.MA-02 y RS.MA-04. Estos identificadores son localizadores de la fuente, no nombres de pruebas del proyecto.

**Nelson, A., Rekhi, S., Souppaya, M., y Scarfone, K. (2025). Incident response recommendations and considerations for cybersecurity risk management: A CSF 2.0 community profile. NIST SP 800-61, revisión 3.** Publicación final de abril de 2025. [PDF oficial](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf) y [ficha de la publicación](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

Se usa para pedir seguimiento del estado, acciones y escalamiento. Localización: tabla 3, página impresa 27 —página 35 del PDF—, apartados RS.MA.R3 y RS.MA-02.R1; página impresa 28 —página 36 del PDF—, apartado RS.MA-04.R1. Falta el registro original de atención para evaluar lo sucedido en RedNova. No se inventa un tiempo de respuesta exigible.

## Conservación e integridad de evidencia

Las dos publicaciones NIST anteriores sirven de referencia para preservar procedencia, integridad y acceso autorizado a registros. Se aplican al papel de integridad y horarios (PT-25) y a la observación sobre protección de registros.

Localización precisa: Marco de Ciberseguridad 2.0, página impresa 22 —página 27 del PDF—, apartados RS.AN-06 y RS.AN-07; guía de respuesta, tabla 3, página impresa 29 —página 37 del PDF—, apartados RS.AN-06.R1 y RS.AN-07.R1. Para disponibilidad de registros se utiliza además PR.PS-04, página impresa 20 —página 25 del PDF— del Marco.

La copia independiente protegida y la separación de permisos son propuestas de aplicación. No se afirma que NIST imponga un producto o una arquitectura específicos.

## Recuperación y decisión de restablecer el servicio

Las mismas publicaciones orientan la revisión de respaldos, activos recuperados, criterios de cierre y decisiones entre preservación y continuidad del servicio.

Localización: Marco de Ciberseguridad 2.0, página impresa 23 —página 28 del PDF—, apartados RC.RP-03, RC.RP-05 y RC.RP-06. Guía de respuesta, tabla 3, página impresa 34 —página 42 del PDF—, mismos apartados y recomendaciones R1/R2 cuando correspondan. Para estrategias de respuesta: RS.MA-03.R3, página impresa 28 —página 36 del PDF—.

No se probó una recuperación real. Para evaluarla siguen pendientes el análisis de impacto al negocio y los objetivos aprobados de tiempo máximo de recuperación y pérdida de datos tolerable.

## Herramientas de laboratorio y material de apoyo

**Microsoft. Quickstart: Run SQL Server Linux container images with Docker.** [Documentación oficial para SQL Server 2022](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-docker?view=sql-server-ver16). Consulta registrada el 6 de noviembre de 2026. Se usó para preparar el motor local de base de datos en un contenedor, es decir, un entorno de ejecución separado. La versión utilizada se comprobó en el propio motor; la versión predeterminada de la página no acredita la del laboratorio.

Las guías de reparto del equipo se utilizaron para distribuir tareas, no como fuentes adicionales de hechos. Anthony Samuel Ordoñez Son se ocupa de investigación del incidente; María José Aldana Culajay, de planeación, riesgos y controles; Luis Antonio Vicente Zapón, de terceros, continuidad y consolidación. Sus claves antiguas P1, P2 y P3 son referencias de organización. Las claves I1 a I6 designan sesiones de preparación y no fases del ataque.

La plantilla de presentación del informe deriva del documento aportado por el usuario, conservado en `03_Evidencias/originales/documentos/Plantilla_referencia_UdeO_recibida_v1.docx`. Su procedencia está en `07_Referencias/Fuentes_adicionales_P1_v1.csv`. El formato no aporta evidencia del incidente.

## Alcance de los criterios y posibilidad de consulta

Los umbrales de 180 días para revisión de permisos, tres veces el volumen habitual y 25 % de variación de respaldos son reglas del ejercicio. No son políticas acreditadas de la empresa. Las publicaciones NIST se usan como buenas prácticas voluntarias de evaluación académica: no se demostró su adopción en RedNova ni se concluye un incumplimiento legal, contractual o de certificación.

Los números de página del PDF incluyen portada y empiezan en uno. Los localizadores anteriores proceden de la lectura técnica registrada de las fuentes oficiales. No se guardaron copias locales de los PDF de NIST: los intentos de descarga fallaron. El registro está en `07_Referencias/copias_consulta_I6/procedencia.json`; los enlaces oficiales permiten consultarlos con conexión. No se atribuyen huellas a descargas inexistentes.

En registros previos, los criterios de seguimiento, integridad y recuperación se denominan CR-I4-01, CR-I4-02 y CR-I4-03. Esas claves se conservan aquí solo para relacionar versiones. La investigación de los demás marcos del curso, la revisión jurídica y la integración del equipo siguen pendientes de sus responsables.
