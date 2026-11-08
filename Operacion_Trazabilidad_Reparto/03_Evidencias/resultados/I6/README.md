# I6 · paquete técnico propio de P1 comprobado

Ejecución técnica: Codex, 7 de noviembre de 2026 UTC. P1: Anthony Samuel Ordoñez Son, 2401002033. Corte analítico: 15/10/2026 23:59:59 UTC−6. **Paquete técnico de P1 comprobado; entrega del equipo integrada pendiente; aprobación académica no concedida.** No se ejecutó SQL, regeneraron datos/resultados SQL ni reconstruyó el laboratorio.

## Entradas, preservación y contraste

Se reabrieron ESTADO, plan I6, revisión inicial, cierres I2–I5, plantilla v2, PT, fuentes, registro IA y PDFs del curso. Antes de modificar: **317/317 referencias** (312 del registro y cinco documentales) y **492/492 archivos del manifiesto I5** coincidentes, sin discrepancias; detalle en Entradas_verificadas_I6.json. No son 809 fuentes independientes. Se preservaron entradas modificadas en `../../originales/previos_I6/`, incluidos medios anteriores, fuentes, scripts, README, registro IA, estado y registro SHA; también se conservaron primeras exportaciones corregidas. Las plantillas v1/v2 quedaron intactas.

La revisión del 6 de noviembre (31/38 E2E) se trató como histórica. El cierre I5 posterior acredita 121 unitarias + compilación + 42 E2E. I6 no vuelve a presentar esa batería como ejecutada ahora. Se cotejaron los archivos actuales contra I5; código de comportamiento, reglas, expediente y 151 recursos públicos (con 29 voces) se conservaron. Cambiaron los dos scripts del grabador, su README y documentos académicos. El manifiesto I5 permanece histórico; las versiones iniciales modificadas están preservadas y el manifiesto I6 identifica las actuales.

Se reabrieron las 13 ejecuciones históricas Q-01–Q-12/Q-S01 y los 15 CSV entre bases; se comprobaron consulta, motor 16.0.4305.5, conjunto v2, filas y hashes. Se contrastaron las 216 filas con historial v2, reparto 144/72, tres campos de atribución desconocidos y diez grupos de duplicidad. Se recalcularon nueve intervalos y los dos tamaños (2,058,909 y 5,115,483 bytes) en memoria, sin escribir de nuevo resultados de I4. PT-25 conserva contexto de administrador ficticio con permiso de modificación, sin modificación ejecutada. Veintiocho códigos E ocupan 188 filas del índice; E-29 sigue pendiente. B1-1/B1-2 no concluyentes y once acciones propuestas no se convierten en hallazgos o acciones ejecutadas.

## Entregables y apertura efectiva

| Archivo desde la raíz del proyecto | Resultado comprobado |
| --- | --- |
| 03_Evidencias/indice_evidencias.xlsx | 188 registros, 25 columnas, correspondencia exacta con CSV; Datos/Lectura/Procedencia. |
| 03_Evidencias/Programa_pruebas_P1_v1.xlsx | 14 pruebas, 15 columnas, correspondencia exacta con CSV. |
| 03_Evidencias/Cronologia_investigada_v1.xlsx | 13 eventos, 25 columnas; originales/desfases no imputados. |
| 01_Informe/Seccion_forense_P1_v1.docx y .pdf | Estilos/geometría de plantilla v2: carta, márgenes 1 pulgada, Times New Roman 12 e interlineado 1.15; títulos 13 y tablas 10.5. Cinco páginas efectivas, frente a la orientación de unas cuatro de la guía interna; contenido íntegro y legible. |
| 01_Informe/Informe_equipo_parcial_P1_v1.docx y .pdf | Siete páginas: portada y plantilla vigente más aporte P1; pendientes del resto explícitos. No es informe integrado de 12–18 páginas. |
| 03_Evidencias/Papeles_Trabajo_P1_v1.pdf | Ocho páginas: índice con seis enlaces internos, método y PT-20–PT-25 completos; marcadores PDF. Fuente Papeles_P1_v1.md. |
| 03_Evidencias/Cronologia_investigada_v1.pdf | Dos páginas imprimibles con los 13 eventos y sus fuentes. Fuente CSV conservada. |
| 06_Comite/Presentacion_P1_v1.pdf | Seis diapositivas; fuente editable Presentacion_P1_v1.json. Cuatro minutos propios dentro de distribución propuesta 3+4+4+1=12, sin coordinación real con P2/P3. |
| 06_Comite/Guion_defensa_P1_v1.md | Respuestas 01/02/03/06/07 de 88–93 palabras: 35.2–42.9 s previstos a 130–150 ppm. Tres ejercicios hipotéticos contradictorios rotulados. No es ensayo humano cronometrado. |
| 07_Referencias/Fuentes_P1_v1.pdf y Uso_IA.pdf | Tres y ocho páginas, respectivamente. Fuentes MD/CSV y prompt I6 conservados; IA-013 añadido, revisión y aprendizaje humanos pendientes. |
| 06_Comite/simulacion_auditoria/artifacts/entrega/ | WebM VP8 de 32.68 s, 1280×720, sin audio; PDF libreta de 12 páginas y JSON de ejemplo, seis revisiones documentadas con v2.1. No es MP4 ni revisión humana. |
| 06_Comite/Paquete_portatil_P1_v1.zip | Índice HTML, LEEME, servidor Python estándar, bundle final, fuentes/editables, respaldos y manifiesto por archivo. SHA externo y Verificacion_paquete_I6.json documentan el ZIP final. |

LibreOffice Writer abrió ambos DOCX y exportó los PDF. Calc abrió los tres XLSX y produjo copias de reapertura cuyas celdas se cotejaron contra el CSV; no son sustitutos de los XLSX finales. Se renderizaron muestras de Lectura en `vistas-xlsx/`. Todas las páginas de los ocho PDF entregados se abrieron y renderizaron, sin palabras fuera de página ni páginas vacías; se comprobaron destinos locales, marcadores e índice. `render/` contiene las planchas inspeccionadas visualmente; no acredita revisión de P1. Se cotejaron todos los párrafos/celdas del DOCX y PDF de sección con su MD, eliminando solo pies de página de la comparación textual.

**Resultado de contenido: 98/98 comprobaciones**, `Revision_contenido_I6.json`. `Reproduccion_video_I6.json` acredita reproducción completa a 4× hasta `ended`, sin error, tres muestras visibles y arranque del bundle desde el servidor portátil. La captura es muda; las voces siguen en el juego. FFmpeg de Playwright identificó WebM/VP8 y decodificó **817 fotogramas** hasta 32.68 s (`decodificacion-video.log`). Los enlaces del índice se probaron por HTTP local. El ZIP se abrió, pasó CRC, se extrajo y se verificaron los hashes de sus miembros con el comprobador estándar; detalle separado para evitar autorreferencia. No hubo prueba de USB/proyector físicos.

## Correcciones e intentos conservados

El grabador anterior suponía cinco segundos de movimiento y la interfaz antigua de fuentes; falló al acercarse al enlace y luego al buscar `.source-link`. `grabacion-intento-01.log` y `grabacion-intento-02.log` conservan esos fallos. Se adaptaron closePanel/pinSource/completeReview a ComputerDesktop y se usó la alternativa plana del producto para la navegación grabada. No cambió la aplicación. La exportación definitiva usa impresión sin fondos, eliminando el bloque oscuro al final de la primera libreta generada; esa versión está preservada.

Se precisó el sentido de los offsets del ejercicio hipotético B: CRM atrasado y despliegue adelantado sí invierten el orden en ese ejemplo; no son offsets reales. Se corrigieron títulos de tabla separados del contenido y justificación espaciada en celdas antes de reexportar DOCX/PDF. La primera comprobación de contenido pasó 96/98: el verificador apuntaba Q-S01 al SQL de análisis general en vez de Permisos_bitacora.sql y no excluía pies intercalados al contrastar párrafos entre páginas. Se corrigió el verificador; las fuentes no se alteraron para aprobarlo. También se corrigió un error inicial de sintaxis del verificador y la resolución del nombre de estilo Heading1 de la plantilla al generar DOCX.

La prueba de vídeo detectó que buscar saltos temporales sobre HTTP básico devolvía el inicio; se usó el archivo completo como Blob del navegador y se esperó un fotograma presentado antes de evaluar la imagen. La reproducción íntegra y la decodificación FFmpeg son comprobaciones adicionales. El arranque portátil reveló recursos absolutos `/assets/` y `/models/`; servir_P1.py resuelve esos bytes desde dist sin modificar el bundle. Intentos en reproduccion-intento-01/02/03.log. No se consideraron aprobados.

## Comandos efectivos

Desde la raíz del repositorio, se antepuso Operacion_Trazabilidad_Reparto/ a las rutas. Desde el proyecto:

```bash
pdftotext -layout 00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf /tmp/i6-proyecto.txt
pdftotext -layout 00_Material_del_curso/Guia_Entregables_Operacion_Trazabilidad.pdf /tmp/i6-guia.txt
PYTHONPATH=/tmp/i6-python python3 03_Evidencias/generar_I6.py
libreoffice -env:UserInstallation=file:///tmp/i6-libreoffice --headless --convert-to pdf --outdir 01_Informe 01_Informe/Seccion_forense_P1_v1.docx 01_Informe/Informe_equipo_parcial_P1_v1.docx
libreoffice -env:UserInstallation=file:///tmp/i6-libreoffice --headless --convert-to xlsx --outdir 03_Evidencias/resultados/I6/reapertura-xlsx 03_Evidencias/indice_evidencias.xlsx 03_Evidencias/Programa_pruebas_P1_v1.xlsx 03_Evidencias/Cronologia_investigada_v1.xlsx
PYTHONPATH=/tmp/i6-python python3 03_Evidencias/verificar_I6.py
python3 servir_P1.py
python3 03_Evidencias/empaquetar_I6.py
python3 03_Evidencias/cerrar_I6.py
```

Desde `06_Comite/simulacion_auditoria/`:

```bash
pnpm build
pnpm preview --port 4173
RECORD_SCREENSHOTS=artifacts/I6/capturas pnpm record
pnpm exec node scripts/verify-i6-media.mjs
```

Resultados: build código 0 (aviso heredado por chunk de 847.72 kB); grabación y reproducción finales código 0; contenido 98/98. Las primeras llamadas de Vite y LibreOffice dentro del sandbox fallaron por permisos de servidor/perfil; se repitieron con acceso local permitido. Una primera redirección de build usó una ruta de log errónea, corregida antes de compilar. Dependencias temporales Python instaladas en /tmp; versiones en requisitos_I6.txt. El paquete de uso no requiere esas dependencias ni instalar JavaScript. I6 no ejecutó `pnpm verify` porque solo cambió herramientas de captura/documentación; los bytes del comportamiento del juego están preservados. Su batería completa I5 se mantiene como evidencia histórica separada.

## Fuentes, integración y límites

Se consultaron los PDFs oficiales: guía pp. 3–5 (plantillas C/D, informe, defensa y IA), proyecto pp. 4–5 y 7 (hechos, evidencia y preguntas), guía interna P1 y plantilla v2. Se reabrieron por web los PDFs oficiales NIST citados y la página Microsoft; URLs/localizadores en Fuentes_P1_v1.md. La descarga local de NIST devolvió HTTP 403, incluso con red permitida; no se inventó PDF/hash ni copia externa en el ZIP. Las referencias son buenas prácticas voluntarias, sin adopción empresarial acreditada. Validación humana pendiente.

No se recibieron productos terminados de P2/P3 en las carpetas revisadas (solo guías). P2 tiene disponibles localmente sección forense, plantilla v2, PT, índice, programa, referencias y registro IA. P3 tiene cronología/intervalos, B1-1/B1-2 y once acciones. No consta traspaso, aceptación ni revisión. Faltan R/C/políticas y objeciones de P2; BIA/RTO/RPO, revisión de borradores, plan y diapositivas de P3. Por eso no se fabrican Informe_Final.pdf, Papeles_Trabajo.pdf ni presentación completa de equipo. Revisión humana, captura gráfica SQL, práctica cronometrada y ensayo físico/proyector quedan pendientes. Todos los hashes nuevos se registran con su procedencia técnica; no autentican originales empresariales inexistentes.
