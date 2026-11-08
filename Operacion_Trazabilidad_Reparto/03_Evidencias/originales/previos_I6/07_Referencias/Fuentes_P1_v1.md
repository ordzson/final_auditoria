# Fuentes de P1

Los dos documentos oficiales recibidos están identificados en `03_Evidencias/Fuentes_curso_v1.csv`. Sus hashes se comprobaron de nuevo en I1 y coinciden con el registro inicial. Este documento no añade criterios jurídicos ni afirma políticas de RedNova.

| Fuente | Uso concreto | Comprobación |
| --- | --- | --- |
| Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf, p. 4–6 y 8 | Cronología reportada; E-01–E-10; laboratorio sintético y consultas; integridad académica. | Copia local y SHA-256 verificados. |
| Guia_Entregables_Operacion_Trazabilidad.pdf, pasos 6–8, 10 y 12 | Custodia, datos relacionados, seis categorías SQL, hipótesis, hallazgos y entregas. | Copia local y SHA-256 verificados. |
| Agente_IA_P1_Incidente_evidencia_simulacion_v1.md, tareas 1–4 y reglas de equipo | Distribución Q-01–Q-12, PT-20–PT-25, rangos T/E y formato de informe. | Lectura local; es una guía de reparto, no una fuente adicional de hechos. |
| Guías locales de P2 y P3 | Identificar los responsables de S-02, R/C, BIA/RTO/RPO y consolidación de hallazgos. | Existen las guías; no se recibieron sus productos terminados en las ubicaciones revisadas. |
| Preguntas_basicas_CNN_v2 (2).docx, aportado como plantilla por el usuario | Portada, imagen y formato del documento derivado. | Copia original preservada; hash y ruta en Fuentes_adicionales_P1_v1.csv. |
| Microsoft. Quickstart: Run SQL Server Linux container images with Docker. [Documento oficial](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-docker?view=sql-server-ver16). Consultado el 6 de noviembre de 2026. | Imagen de SQL Server 2022 y ruta de sqlcmd en mssql-tools18; configuración de un contenedor local. | Consulta web oficial. La disponibilidad y versión utilizadas se comprobaron además en el motor local. |

Las reglas de 180 días, 3× y 25 % son criterios de selección del laboratorio aprobados por P1. No se citan como requisitos normativos ni políticas empresariales. Los criterios aplicables de P2/P3 siguen pendientes de recibir.

## Verificación y aplicación en I4 · 7 de noviembre de 2026 UTC

Se consultaron directamente los dos PDFs del curso con `pdftotext -layout`. Se cotejaron sus hashes con el registro inicial: cinco entradas documentales coinciden; también las 276 del registro previo I2/I3. Cotejo ampliado y rutas exactas: `03_Evidencias/resultados/I4/Verificacion_entradas_I4_v1.json` (305 comprobaciones, con registros repetidos entre manifiestos). Se verificó el formato carta, márgenes 1440 twips, estilo Normal Times New Roman 12, interlineado 276/240=1.15 y justificado en el XML de `Plantilla_UdeO_v2.docx`.

Los criterios externos siguientes se comprobaron leyendo los PDFs oficiales mediante herramienta web, no mediante un resumen de terceros. Estaban publicados antes del corte del caso. Se usan como buena práctica voluntaria para el encargo académico; no se aportó política, contrato ni decisión que acredite su adopción en RedNova. No se afirma certificación, obligatoriedad legal ni incumplimiento de una norma ISO cuyo texto no se consultó. La revisión jurídica corresponde a P3.

| Identificador / fuente | Ubicación exacta verificada | Aplicación concreta |
| --- | --- | --- |
| CR-I4-01 · National Institute of Standards and Technology. (2024). *The NIST Cybersecurity Framework (CSF) 2.0* (CSWP 29). [PDF oficial](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf). Publicado 26 de febrero de 2024. | Apéndice A, p. impresa 22 (página PDF 27), RS.MA-02 y RS.MA-04. | Revisar clasificación inicial y escalamiento de E-07 en PT-24/B1-1; sin objetivo numérico de respuesta inventado. |
| CR-I4-01 · Nelson, A., Rekhi, S., Souppaya, M., & Scarfone, K. (2025). *Incident response recommendations and considerations for cybersecurity risk management: A CSF 2.0 community profile* (SP 800-61 Rev. 3). [PDF oficial](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf); [ficha oficial](https://csrc.nist.gov/pubs/sp/800/61/r3/final). | Final de abril de 2025; sustituye Rev. 2. Tabla 3: p. 27 (PDF 35), RS.MA.R3 y RS.MA-02.R1; p. 28 (PDF 36), RS.MA-04.R1. | Pedir seguimiento del estado, acciones/plazos, revisión inicial y escalamiento. Falta el ticket original para juzgar operación real (B1-1). |
| CR-I4-02 · CSWP 29 y SP 800-61r3 anteriores. | CSF p. 22 (PDF 27), RS.AN-06/07; SP tabla 3 p. 29 (PDF 37), RS.AN-06.R1 y RS.AN-07.R1. CSF PR.PS-04, p. 20 (PDF 25), para disponibilidad de logs. | Evaluar integridad/procedencia, acceso autorizado y conservación de registros/datos de respuesta; formular la prueba de copia protegida para PT-25/B1-2. La arquitectura concreta se propone, no se atribuye literalmente a NIST. |
| CR-I4-03 · Recuperación, CSWP 29 y SP 800-61r3. | CSF p. 23 (PDF 28), RC.RP-03/05/06; SP tabla 3 p. 34 (PDF 42), mismos IDs y recomendaciones R1/R2 cuando corresponden. SP RS.MA-03.R3, p. 28 (PDF 36), sobre estrategias de respuesta. | Preguntar por respaldo/activos recuperados, criterios de cierre y decisión preservación–servicio en la sección forense y acciones; no se probó recuperación real ni se evaluó RTO/RPO sin BIA. |

Los números de página PDF son de base 1 e incluyen portada; los impresos son los del documento. El portal oficial confirmó el carácter final y la sustitución de Rev. 2 por Rev. 3; no se citó como vigente una edición retirada. Este alcance de P1 no sustituye la investigación de todos los marcos que el proyecto asigna al equipo.

La herramienta web permitió leer los dos PDFs de NIST. El intento de guardar copias mediante Python `urllib.request` falló por resolución DNS restringida; no existe PDF local de NIST ni hash de descarga que afirmar. Las referencias mantienen URL oficial, versión, páginas y alcance consultados. Esto no impidió verificar el contenido en web ni los PDFs del curso locales. La copia local de consulta externa puede añadirse en I6 si se necesita un paquete sin conexión.
