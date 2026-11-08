# Revisión de legibilidad para el docente

Se revisaron los doce documentos reunidos en entregables contra la lista y las plantillas de los dos PDF oficiales del curso. Se reescribió la explicación para que los resultados puedan comprenderse sin conocer las claves de elaboración del proyecto. Fecha de esta edición: 7 de noviembre de 2026.

## Cambios realizados

- Informe individual e informe parcial: hipótesis con nombres descriptivos, términos técnicos explicados al aparecer y responsables identificados por nombre. Se retiraron del discurso las claves de sesiones y borradores.
- Papeles: objetivo, material, procedimiento, resultado y conclusión en cada análisis. Los códigos quedan como localizadores secundarios. Índice con seis enlaces a los papeles.
- Hojas: Lectura abre por defecto; Referencias relaciona temas y claves; Datos conserva íntegros encabezados, valores y vacíos del CSV de origen. Cómo leer y Procedencia explican convenciones y límites. El índice resume 28 tipos de evidencia, con sus 188 filas técnicas conservadas.
- Observaciones: seguimiento de la alerta y protección de registros se explican por su contenido. Se mantienen no concluyentes y se distingue la advertencia previa número 8 de la evidencia de respaldos E-08.
- Plan: once acciones numeradas, encabezados descriptivos, dependencias expresas, mismos plazos y prioridades, y responsables de verificación identificados. Costos y riesgo restante siguen pendientes.
- Defensa: seis diapositivas e intervención de cuatro minutos, sin cadenas de códigos como explicación principal. Los identificadores se reservan para localizar soporte o una pantalla concreta.
- Fuentes: aplicación, versión y página, usando las consultas externas ya registradas; no se afirma una nueva comprobación web en esta edición.
- Uso de IA: dos páginas iniciales explican asistencia, límites y claves. Después se conservan literalmente las páginas del registro histórico. Se agregó la solicitud editorial como entrada 14 del registro editable, dejando intactas las trece anteriores.

Los cambios se aplicaron a las fuentes editables y a sus exportaciones. Las doce copias de entregables coinciden con las fuentes actuales. Los ZIP anteriores permanecen históricos y no contienen esta edición.

## Verificación realizada

`Verificacion_documental.json` registra 64 comprobaciones aprobadas, sin fallos. Incluyen correspondencia entre fuentes y copias; apertura de PDF; ausencia de páginas vacías y texto fuera de página; contenido completo de los editables exportados; conservación de cifras y límites; igualdad integral de datos en las tres hojas; enlaces locales; índice de papeles; diapositivas; registro histórico de IA; once plazos y prioridades; copias previas y 24 archivos del conjunto ficticio original.

La revisión visual incluyó muestras del informe y su portada, papeles, presentación y vistas impresas de hojas. Se corrigieron una página vacía heredada de la plantilla, nombres repetidos en portada y etiquetas de enlaces que se cortaban al imprimir. Las vistas de lectura impresas se conservan en `vistas_lectura/`, con texto de aproximadamente 11 puntos en papel A3. Son comprobantes de presentación, no nuevas evidencias del incidente.

La sección individual tiene cinco páginas; el informe parcial, siete; los papeles, ocho; la presentación, seis diapositivas. El curso pide un informe final integrado de 12–18 páginas: el parcial conserva expresamente ese pendiente. Las comprobaciones automáticas no equivalen a revisión humana, dominio del estudiante, firma ni aprobación académica.

## Comandos usados

Desde la raíz del repositorio, con las dependencias de `03_Evidencias/requisitos_I6.txt` disponibles; durante esta sesión estaban en `/tmp/i6-python`:

```bash
PYTHONPATH=/tmp/i6-python python3 Operacion_Trazabilidad_Reparto/03_Evidencias/preparar_entrega_docente.py
libreoffice -env:UserInstallation=file:///tmp/docente-legibilidad-export --headless --convert-to pdf --outdir Operacion_Trazabilidad_Reparto/01_Informe Operacion_Trazabilidad_Reparto/01_Informe/Seccion_forense_P1_v1.docx Operacion_Trazabilidad_Reparto/01_Informe/Informe_equipo_parcial_P1_v1.docx
PYTHONPATH=/tmp/i6-python python3 Operacion_Trazabilidad_Reparto/03_Evidencias/preparar_entrega_docente.py --sincronizar
PYTHONPATH=/tmp/i6-python python3 Operacion_Trazabilidad_Reparto/03_Evidencias/verificar_entrega_docente.py
```

Para inspeccionar impresión se crearon copias temporales de las hojas conservando solo Lectura y se exportaron con LibreOffice. Los PDF obtenidos se copiaron a `vistas_lectura/`; una nueva exportación de las hojas requiere renovar esos comprobantes antes de verificarlos.

LibreOffice no inició dentro del aislamiento; la conversión autorizada fuera de ese entorno terminó correctamente. No se ejecutaron consultas nuevas, regeneración de datos ni cambios de la simulación interactiva.

## Conservación e integridad

`Entradas_preservadas.json` identifica los 34 archivos copiados antes de editar. Sus copias están en `previos/`, incluyendo los documentos y el registro anterior de huellas. `Cambios_documentales.json` identifica archivos actuales afectados, y `entregables/manifest_copias.json` identifica las doce copias de revisión. El registro general de huellas se actualiza para los archivos afectados sin modificar cierres históricos ni la evidencia original.

La edición no inventa hallazgos, presupuestos, conciliaciones, firmas o aportes ajenos. La integración del equipo y la revisión del estudiante siguen pendientes.
