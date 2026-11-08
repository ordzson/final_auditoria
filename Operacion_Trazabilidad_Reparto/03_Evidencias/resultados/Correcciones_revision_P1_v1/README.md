# Correcciones posteriores a la revisión independiente de P1

Operador técnico: Codex. Autorización del usuario: «ok sigue tus recomendaciones». Registro de IA conservado por indicación expresa del usuario; no se añade ni se marca validación humana. Juego excluido de revisión y modificación.

- **RI-P1-01:** se cambió únicamente el criterio futuro de H-B: los registros apoyan atribución del uso; para sostener uso indebido hay que contrastar autorizaciones y demostrar el exceso de alcance. La intención se evalúa por separado. H-B sigue siendo hipótesis de certeza baja. Se actualizaron sección MD/DOCX/PDF y aporte en el informe parcial.
- **RI-P1-03:** B1-1 usa `Q-11, AlertaID=6 (cuarto registro de datos)`. Se incorpora la corrección local anterior al nuevo paquete.
- **RI-P1-04:** Q-06 distingue datos insuficientes, volumen superior a 3x y clasificación ausente con volumen dentro del umbral. Se comprobó también que un máximo de referencia desconocido no es una base suficiente. No se considera exceso el límite exacto de 3x.
- **RI-P1-02:** permanece como limitación documentada. No se modificaron el registro ni el PDF de IA.

## Comprobación SQL efectiva

`SQL_Q06/Comprobacion_Q06.json` registra login propio auditor_lectura, SQL Server 2022 16.0.4305.5, base v2 existente y momentos UTC. Solo Q-06 se ejecutó dos veces sobre esa muestra: sus tres filas y el SHA-256 del CSV son idénticos a los anteriores. Diez escenarios SELECT/CTE de control pasaron; incluyen volumen normal sin clasificación, límite exacto y superior a 3x, bytes/base ausentes y referencia insuficiente. La tabla TransferenciasRed conserva sus 73 filas y todos sus valores antes/después. No se insertaron escenarios ni se reconstruyó, cargó o restauró ninguna base.

Los escenarios son **hipotéticos de prueba de la consulta**, no nuevas evidencias del incidente. SQL y resultados de control están separados de los datos v2. Reproducción: `python3 04_SQL/verificar_Q06_v2.py --salida 03_Evidencias/resultados/Q06_verificacion_nueva01`, usando una salida inexistente. El ejecutor requiere el contenedor y credencial local de lectura existentes, según 04_SQL/README.md.

## Versiones de ejecución y conservación

Ejecuciones_v1.csv mantiene trece entradas. Solo Q-06 tiene ejecución nueva; las otras doce conservan sus fechas/hashes, con `archivo_sql` apuntando al archivo que efectivamente se usó, preservado en originales/previos_correcciones_revision_P1_v1. La columna `archivo_registro_origen` permite seguir cada entrada a su comprobante. No se cambiaron los metadatos históricos para atribuirles una ejecución del SQL nuevo.

Entradas_y_preservacion.json identifica las copias previas de los archivos afectados y los hashes cotejados antes de editar. Los dos lectores de metadatos admiten `archivo_sql`, manteniendo el comportamiento anterior si esa columna no existe; se compilaron y se comprobó su resolución de versiones, sin ejecutar sus rutinas que escriben cierres históricos.

## Documentos y paquete

Se actualizan solo los derivados afectados: dos DOCX/PDF, PT, programa, índice, referencias de ejecución, instrucciones y estado. La cronología, hipótesis H-A/H-C, cifras, presentación, guion, vídeo/libreta, registro de IA y datos v2 conservan sus bytes. La revisión independiente original también conserva su fecha y contenido; este registro informa qué se corrigió después.

El paquete portátil v2 parte del ZIP I6 preservado. Se sustituyen los documentos afectados y se añaden fuentes/comprobantes de estas correcciones; los archivos del juego se copian con los mismos bytes del ZIP v1, sin revisar ni ejecutar la aplicación. El manifiesto interno nuevo identifica el contenido actual completo. Los manifiestos y comprobantes I4/I5/I6 que lo acompañan son históricos y no certifican por sí solos esta versión; las versiones anteriores afectadas están preservadas. El ZIP v1 y su SHA externo permanecen intactos.

Los resultados finales, hashes y verificación del ZIP v2 se registran por separado en esta carpeta. El comprobante externo del ZIP y el cierre terminal quedan fuera del archivo que verifican para evitar autorreferencia. No se repite ni se proclama una nueva batería 98/98; la comprobación presente se limita a los cambios autorizados y sus dependencias. No hay validación humana, ensayo físico, aprobación académica ni nuevos aportes/traspasos P2/P3.
