# Custodia de artefactos P1

Registro preparado: 2026-11-07T06:13:34.433861+00:00. Custodio designado por el usuario: Anthony Samuel Ordoñez Son, 2401002033. Operador técnico de esta ejecución: Codex, con autorización del encargo; no equivale a firma ni revisión humana del custodio.

Origen: datos sintéticos recibidos de otro modelo en `04_SQL/datos/v1/` y `v2/`. Se usa v2 por corrección de distribución de sesiones. Fecha histórica exacta de recepción y persona que realizó una transferencia: no aportadas. Generación declarada por manifiesto: 2026-11-07T05:52:18Z para v2; no se confunde con obtención de evidencia del incidente.

Acción efectiva de preservación: copia byte a byte mediante shutil.copy2 de v1/v2 y fuentes, antes de cargar SQL; ver momento real y hashes en `originales/recepcion_I2/Preservacion.json`. Trabajo sobre `04_SQL/datos/v2/`, conservados sin modificación. Primeras versiones de artefactos nuevos en `originales/artefactos_I2_I3/`. Intentos fallidos conservados en resultados, con explicación en `Incidencias_ejecucion_I2_I3.md`.

Integridad: Python hashlib SHA-256; registro `hashes_sha256_v1.csv`, que no contiene su propio hash. Índice individualiza archivo, versión y hash; los hashes de PDFs son distintos de los de CSV y no sustituyen hashes de extracciones originales no recibidas. No se incluyen secretos ni .env.

| Momento | Operación real | Origen/destino | Actor/alcance |
| --- | --- | --- | --- |
| Ver Preservacion.json | Copia y cotejo SHA-256 | datos v1/v2 → originales/recepcion_I2 | Codex; custodia designada P1 |
| Ver Ejecuciones_v1.csv | SELECT y exportación CSV | SQL Server propio → resultados | auditor_lectura; operador Codex |
| 2026-11-07T06:13:34.433861+00:00 | Preservación primera versión de entregables | archivos de trabajo → originales/artefactos_I2_I3 | Codex; sin traspaso humano |

Traspasos a P2/P3: no realizados ni registrados. Material preparado para entregar localmente. Firmas de entrega/recepción, comparación humana de hashes y revisión de P1: pendientes. Custodio, extracción original y relojes de los sistemas del caso: desconocidos. E-29 captura de conexión pendiente; no existe artefacto que indexar.

## Operaciones de I4

2026-11-07T14:19:12.186218+00:00 · Codex, bajo autorización del encargo: siete archivos previos preservados byte a byte en `originales/previos_I4/`; comparación SHA-256 en `Preservacion.json`. El índice conserva E-01–E-28; E-29 sigue pendiente sin artefacto. Añade vínculos a derivados analíticos, sin convertir PT/documentos en extracciones nuevas.

Se reabrieron las entradas y se cotejaron 305 referencias de hash (incluidas repeticiones entre registros), los 13 registros históricos de ejecución y CSV Q, con Python estándar. Se prepararon cronología, papeles, análisis, mapa y borradores; los cálculos nuevos están en `resultados/I4/` y su fuente en `analizar_I4.py`. Registro actualizado de hashes: `hashes_sha256_v1.csv`; registro previo conservado. Hashes de entradas adicionales en `resultados/I4/Entradas_adicionales_I4_v1.json`.

Custodio designado: Anthony Samuel Ordoñez Son, 2401002033. Ninguna extracción de producción, conexión SQL nueva, restauración, firma, revisión humana ni transferencia a P2/P3 se realizó en I4. Los tiempos del corte corresponden al caso; los de este registro a preparación real en UTC. Los PDFs NIST se consultaron por web; no hay copias locales descargadas ni hashes de esos PDFs que declarar.
