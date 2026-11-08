# Comprobantes de I4

Preparación y ejecución técnica: 7 de noviembre de 2026 UTC; operador Codex. P1/custodio designado: Anthony Samuel Ordoñez Son, 2401002033. Revisión humana pendiente. Corte del análisis: **2026-10-15T23:59:59-06:00**. Estos comprobantes son análisis de archivos y cálculos, no nuevas extracciones de RedNova.

## Comandos realmente ejecutados

Desde la raíz `Operacion_Trazabilidad_Reparto/` (en la sesión se antepuso esta carpeta al comando al trabajar desde el repositorio):

```bash
pdftotext -layout 00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf /tmp/p1_proyecto.txt
pdftotext -layout 00_Material_del_curso/Guia_Entregables_Operacion_Trazabilidad.pdf /tmp/p1_guia.txt
python3 03_Evidencias/analizar_I4.py
dot -Tsvg 03_Evidencias/Mapa_causal_P1_v1.dot -o 03_Evidencias/Mapa_causal_P1_v1.svg
dot -Tpng 03_Evidencias/Mapa_causal_P1_v1.dot -o /tmp/p1-mapa-I4.png
python3 03_Evidencias/verificar_I4.py
```

Se inspeccionó visualmente el PNG temporal del mapa; el SVG entregado es ampliable y su fuente DOT es editable. Se abrió el XML de `Plantilla_UdeO_v2.docx` con Python zipfile/ElementTree para cotejar formato. La sección tiene aproximadamente 1,960 palabras y usa el formato previsto de la plantilla; no se realizó maquetación/exportación definitiva, que corresponde a I6. No se ejecutó LibreOffice ni se afirmó un conteo real de páginas.

## Resultado efectivo

| Archivo | Qué contiene y alcance |
| --- | --- |
| `Verificacion_entradas_I4_v1.json` | 305 cotejos SHA-256 aprobados: cinco documentales, 276 del registro previo y 24 del manifiesto v2. Hay referencias repetidas entre registros; no son 305 fuentes independientes. Los documentos modificados en I4 se cotejan con sus copias previas. |
| `Entradas_adicionales_I4_v1.json` | Rutas/hashes de nueve entradas de planificación, índice, custodia, referencias, plantilla y registro IA. Los que se editaron tienen copia previa; para archivos sin hash previo es identificación del usado, sin alegar autenticación independiente. |
| `Comprobacion_archivos_I4_v1.json` | Reapertura de Q-01–12 y 13 registros de ejecución; conteos y hashes coincidentes. El hash del SQL y del manifiesto coincide con el registro histórico. Sin conexión al motor. |
| `Intervalos_I4_v1.json` | Nueve intervalos calculados de las horas reportadas, fórmula y desconocidos de la alerta. 315 min hasta consulta y 355 hasta escritura. |
| `Sensibilidad_relojes_I4_v1.csv` | 15 escenarios hipotéticos; offsets independientes ±5/10/15 min, y offset común para dos marcas etiquetadas CRM. No son estimaciones reales de error. |
| `Analisis_ordenes_I4_v1.json` | Cotejo completo de las 216 filas con el historial; 216 órdenes distintas, 144/72 campos, 216 nulos de cada campo de atribución y ningún solapamiento con las 20 candidatas a duplicidad. Sin suma monetaria ni conciliación inventada. |
| `Volumen_31840_I4_v1.json` | Modelo reproducible por formato de siete campos sintéticos: CSV 2,058,909 bytes; JSONL 5,115,483. Unidades decimales/binarias diferenciadas y escenarios de ancho de fila; no estima contenido real del flujo. |
| `Validacion_entregables_I4_v1.json` | 30 comprobaciones automáticas aprobadas de cobertura, estructura, enlaces locales, cifras, conteos y hashes individuales del índice. Reabrió los comprobantes históricos de 95 pruebas y cotejó los 15 CSV de dos bases. No volvió a ejecutar sus sentencias SQL. |
| `Validacion_entregables_I4_intento_01.json` | Intento previo conservado: 29/30. El verificador esperaba E-29 en el índice, aunque el original solo tiene E-01–28 y E-29 está pendiente sin imagen. Se corrigió el verificador para comparar con el índice previo, conservando E-29 pendiente; no se fabricó evidencia para aprobarlo. |

El primer intento de `analizar_I4.py` terminó por `NameError` en la variable `formatos` al guardar el cálculo de volumen. Se corrigió el nombre a `formats` y se ejecutó de nuevo con éxito; no se modificaron entradas ni se registró aquel intento como cierre aprobado. Las salidas parciales se reemplazaron por la primera salida completa, antes de indexar entregables finales.

Se leyeron por web los PDFs oficiales CSWP 29 y SP 800-61r3; URLs, versión y páginas en `07_Referencias/Fuentes_P1_v1.md`. La descarga local con urllib.request falló por DNS restringida: no se presenta copia local ni hash de descarga. No faltó acceso al contenido en la herramienta web. No se necesitó instalar dependencias.

## Integridad y límites de cierre

El registro previo de hashes y otros seis archivos están preservados con cotejo en `03_Evidencias/originales/previos_I4/Preservacion.json`. `hashes_sha256_v1.csv` se amplía después de escribir los archivos; no se incluye a sí mismo. El índice conserva los rangos y hashes de evidencias; la nueva columna de derivados enlaza PT/informe sin convertirlos en evidencia extraída nueva.

**SQL en I4: ninguna ejecución.** Se evaluaron los resultados de I2/I3, incluyendo incidencias y pruebas históricas, con lectura de archivos. No se reconstruyó el laboratorio, no se leyó/imprimió `.env`/`.env.auditor`, no se ejecutó backup/restore ni se modificó el juego. Las 95 comprobaciones son históricas; las 30 de I4 verifican archivos y entregables.

Disponibilidad local: sección para P2; cronología, intervalos, B1-1/B1-2 y acciones para P3. No consta traspaso, aceptación, revisión cruzada ni revisión humana. Políticas/R/C/S de P2, BIA/RTO/RPO de P3, originales del incidente, facturación/ERP y captura gráfica continúan pendientes. Ningún borrador concluye una causa raíz, exfiltración, culpable o incumplimiento por mera reproducción. Próxima sesión: I5, corrección y comprobación del juego; integración y exportaciones en I6.
