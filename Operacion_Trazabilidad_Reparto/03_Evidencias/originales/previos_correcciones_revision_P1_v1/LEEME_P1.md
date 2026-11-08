# Paquete portátil propio de P1 · I6

Abrir `index.html` para acceder a documentos y respaldos. Incluye únicamente aportes disponibles de P1; el borrador de equipo está expresamente incompleto. No es Informe_Final.pdf ni Papeles_Trabajo.pdf integrado. Sin aprobación académica. Revisión humana, aportes/revisiones/traspasos P2/P3, captura gráfica SQL y ensayo físico/proyector pendientes.

## Uso desde USB

1. Extraer todo el ZIP conservando carpetas. No ejecutar dentro del compresor. Verificar con `python3 verificar_paquete_P1.py` (Windows: `py verificar_paquete_P1.py`). El manifiesto de paquete verifica archivos; SHA externo verifica el ZIP completo.
2. PDF y vídeo pueden abrirse directamente con el visor del equipo; XLSX con Calc/Excel; DOCX con Writer/Word. Fuentes CSV/MD/JSON/DOT permanecen editables. Los XLSX tienen Datos (todas las celdas como texto), Lectura y Procedencia; filtrar por código y seguir fila_fuente. Vacíos no se sustituyen por cero.
3. Para el juego, instalar previamente Python 3 y usar Chrome/Edge/Firefox actual con WebGL, o la alternativa plana. Desde esta carpeta: `python3 servir_P1.py`; Windows: `py servir_P1.py`. Abrir `http://127.0.0.1:8765/index.html` y elegir juego. Si el puerto está ocupado: `python3 servir_P1.py --puerto 8766`, ajustando URL. No requiere instalar paquetes JavaScript ni SQL Server.
4. El bundle y los 151 recursos, incluidas 29 voces, se sirven localmente; no hace falta internet para usarlos. La primera carga se hace desde el servidor local. Abrir el juego con doble clic como file:// no ejecuta correctamente sus módulos. Para desarrollo, usar exclusivamente pnpm con el lockfile; esa instalación no se necesita para la defensa.
5. El navegador guarda la libreta localmente para ese origen. Una partida nueva comienza vacía; completar seis revisiones usando fuentes, comprobaciones, conclusión limitada y solicitud. Libreta-ejemplo.json es exportación de una partida automática de ejemplo, no revisión humana; no se promete importación por la interfaz. Libreta-respaldo.pdf permite defender sin jugar. Metadatos muestra el inventario; no ejecuta SHA ni SQL real.
6. `recorrido.webm` es WebM (VP8), 1280×720, sin pista de audio de la captura automática. Reproducir en un navegador/visor con soporte WebM; no cambiarle la extensión a MP4. Las voces sí están disponibles en el juego. Reproducción digital local comprobada; compatibilidad física del equipo/proyector de defensa pendiente.
7. Si falla la demostración, abrir Presentacion_P1_v1.pdf, Cronologia_investigada_v1.pdf y libreta-respaldo.pdf; el WebM muestra el recorrido. No dedicar los 12 minutos a reparar el entorno. Guion: cuatro minutos de P1 y reserva propuesta para P2/P3, aún no acordada.

## Trazabilidad y alcance

`03_Evidencias/Papeles_Trabajo_P1_v1.pdf` contiene índice y PT-20–PT-25. Seguir PT-22 a T-24/T-25, Q-05/Q-06, CSV de resultados y fuente v2; el Proyecto pp. 4–5 sigue siendo la fuente de ~1.6 GB. PT-23 conserva 216 órdenes y el supuesto 144/72; no pérdida económica. PT-25 conserva permisos del administrador ficticio, sin alteración real de registros. B1-1/B1-2 son borradores no concluyentes y once acciones son propuestas.

La sección forense se maquetó con estilos y geometría de Plantilla_UdeO_v2.docx; v1 y v2 se conservan. Informe_equipo_parcial_P1_v1 muestra solo la inserción P1 y pendientes del resto; no cumple por sí solo los 12–18 folios del informe de equipo. Los PDFs NIST se consultaron por web; su descarga devolvió 403 y no se incluyen copias locales externas. URLs y páginas están en referencias. Los dos PDFs oficiales del curso sí se incluyen.

El paquete excluye credenciales .env, node_modules, contenedores, bases, cachés y trazas voluminosas. Incluye SQL, datos ficticios y comprobantes para revisión sin reconstruir nada. No ejecutar SQL para presentar el juego. Los originales y versiones preservadas permanecen en el proyecto principal; en el paquete se incluyen los necesarios para resolver referencias locales. `manifest-paquete.json` identifica cada byte incluido, excluyéndose a sí mismo para evitar circularidad.

Los informes históricos I2–I5 conservan su fecha y alcance: 121 unitarias + build + 42 E2E es el cierre histórico I5. I6 no modifica comportamiento ni reglas del juego; corrige los scripts de grabación y verifica el bundle final. El paquete técnico comprobado no equivale a integración del equipo ni a validación del estudiante.
