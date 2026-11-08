# Assets que deben usar las computadoras

Instrucciones de implementación para los agentes del [plan de escritorios](plan-escritorios-pc.md). La selección usa los archivos aportados por el usuario y fija un fondo distinto para cada PC. **Etapa 0 completada:** los destinos obligatorios ya están preparados localmente, con [mapa de claves](../src/data/computerAssets.ts), [créditos](../public/computers/CREDITS.md) y [manifiesto de hashes](../public/computers/manifest.json). Su consumo por el escritorio y su integración física en la escena siguen pendientes.

**Origen de todos los archivos:** `/home/ordson/final auditoria/assets/`.

Consultar [inventario-assets.md](inventario-assets.md) para inspección y procedencia, y [inventario-assets.json](inventario-assets.json) para rutas internas, metadatos y hashes. Usar los nombres actuales que constan aquí; los identificadores anteriores `wp…` quedaron registrados en el inventario.

## Fondo asignado a cada PC

| PC / StationId | Tema | Archivo de origen | Destino dentro de `public/computers/wallpapers/` |
| --- | --- | --- | --- |
| A · Accesos · `accesos` | XP Luna azul | `xp-fondo-bliss-3840x2160.jpg` | `xp-bliss.jpg` |
| B · SQL y red · `sql_red` | XP Luna azul | `xp-fondo-professional-azul-3840x2160.jpg` | `xp-professional-azul.jpg` |
| C · CRM y cambios · `crm_cambios` | XP Luna azul | `xp-fondo-isla-tropical-4341x2841.jpg` | `xp-isla-tropical.jpg` |
| D · SIEM y tiempo · `siem` | XP Luna azul | `fondo-stonehenge-5600x2400.jpg` | `stonehenge.jpg` |
| E · Respaldos · `respaldos` | Server clásico | `fondo-camino-otonal-4200x2800.jpg` | `camino-otonal.jpg` |
| F · Custodia y archivo · `mesa_auditor` | XP Luna azul | `fondo-duna-roja-luna-5120x2880.jpg` | `duna-roja-luna.jpg` |

La variante Server también lleva su fondo personalizado; el tema clásico de ventanas y controles identifica el sistema del rack. Los dos monitores físicos de B pertenecen al mismo escritorio y utilizan su misma asignación.

Mantener esta distribución estable al cambiar de programa, salir del equipo y recargar. Mostrar las imágenes con proporción preservada y recorte centrado cuando haga falta; comprobar especialmente Stonehenge, que es panorámico. Las ventanas, los iconos y la nota se superponen como elementos interactivos independientes.

`fondo-bliss-halo-3840x2160.png` queda como recurso de reserva. Los seis fondos elegidos ya cubren todos los puestos. El usuario permite repetir fondos si fuera necesario, pero esta selección inicial utiliza seis diferentes.

## Recursos comunes obligatorios

| Uso | Origen exacto | Preparación / destino |
| --- | --- | --- |
| Tipografía normal de PC | `Tahoma-4styles-Font.zip` → `Tahoma Regular font.ttf` | `public/computers/fonts/tahoma-regular.ttf`, peso 400; versión interna 2.80 |
| Tipografía negrita de PC | El mismo ZIP → `TAHOMAB0.TTF` | `public/computers/fonts/tahoma-bold.ttf`, peso 700; versión interna 2.30 |
| Bandera de Inicio en XP | `windows logo.webp` | Copiar como `public/computers/branding/windows-flag.webp`; conservar transparencia |
| Iconos de equipos XP | `win95-winxp_icons-master.zip` → `win95-winxp_icons-master/icons/wxp_*.ico` | Seleccionar visualmente los necesarios entre los 215 iconos XP; preparar variantes web en `public/computers/icons/xp/` |
| Iconos de consola Server | El mismo ZIP → familia `w2k*` dentro de `icons/` | Seleccionar iconos de administración de aspecto clásico; preparar en `public/computers/icons/classic/`. Son recursos de la familia Windows 2000 usados como dirección visual clásica |

Cargar ambas fuentes localmente con `@font-face`, bajo una familia propia como `TahomaXP` y limitada a la interfaz de las PCs. Los otros TTF del ZIP son versiones alternativas del mismo estilo: no cargar las cuatro fuentes ni sintetizar la negrita teniendo el archivo disponible.

Preparar los iconos a partir de sus tamaños nativos de 16, 32 y 48 px, conservando transparencia y proporción. Usar 16 px en barras/menús y 32 o 48 px en accesos del escritorio según escala y modo proyector. No suponer el significado de `wxp_17.ico` u otro número: inspeccionar la imagen y registrar el archivo seleccionado para cada función.

Cada acceso debe tener icono del paquete elegido y etiqueta legible. La selección debe cubrir estos roles, reutilizando iconos cuando resulte apropiado:

- A: sesiones y directorio de cuentas.
- B: editor SQL y conexiones de red.
- C: historial de órdenes y gestión de cambios.
- D: alertas/eventos y seguimiento/relojes.
- E: consola de recuperación y respaldos.
- F: explorador de archivos y comparación temporal.
- Comunes: informe del puesto, expediente/carpeta, documento, búsqueda y ayuda cuando se ofrezcan esas acciones.

El coordinador conserva el mapa exacto de archivos seleccionados en `src/data/computerAssets.ts`; las aplicaciones consumen claves de ese mapa. Los iconos numéricos originales mantienen su nombre en el origen y su correspondencia en los créditos, aunque las copias web tengan nombres funcionales.

## Referencias que guían el código

| Referencia | Qué debe reproducirse |
| --- | --- |
| `Windows_XP_Luna.png` | Tema Luna azul, Inicio, barras y composición del Explorador |
| `WindowsXP-RTM-Desktop.png` | Densidad de escritorio, accesos, barra de tareas y área de notificación |
| `buttonsreference.webp` | Forma y tratamiento de minimizar, maximizar y cerrar; ajustar a la escala real observada en las capturas |

Las capturas son material de consulta. Reconstruir ventanas, controles, menús, marco del monitor y sticky note con HTML/CSS para que funcionen y escalen. Evitar insertar la captura completa como escritorio o recortar un botón ampliado para simular un control interactivo.

`loginwindows.jpeg` y `microsoft-windows-xp-professional-1-logo-pack.zip` quedan disponibles para una bienvenida o marca completa si esa superficie llega a necesitarse. No añaden un paso de login al recorrido previsto. La consola Server conserva su identidad clásica y su fondo asignado, sin la marca textual «XP Professional».

## Monitor junto al rack: asset principal

Usar **`monitor.zip`** como primera opción. Es un modelo ligero, con 460 triángulos indexados y la pantalla separada del cuerpo.

Preparar estas rutas conservando las referencias internas:

| Entrada del ZIP | Destino |
| --- | --- |
| `scene.gltf` | `public/models/rack-monitor/scene.gltf` |
| `scene.bin` | `public/models/rack-monitor/scene.bin` |
| `textures/RenderMonitor_baseColor.png` | `public/models/rack-monitor/textures/RenderMonitor_baseColor.png` |
| `license.txt` | `public/models/rack-monitor/license.txt` |

El cargador GLTFLoader existente puede cargar el archivo `.gltf` conservando `.bin` y textura juntos. La pantalla es el nodo **`Cube_RenderMonitor_0`**, material **`RenderMonitor`**: usarlo como superficie de pantalla cuando sea necesario, sin sustituir los materiales de toda la carcasa.

Colocar el monitor junto al rack E y vincularlo a `respaldos`. Al interactuar, abrir el escritorio Server con fondo otoñal dentro del marco grande previsto. Las pantallas lejanas pueden seguir mostrando el texto actual.

Como alternativa acotada si la inspección visual del monitor principal descubre un problema, el kit `kenney_furniture-kit.zip` aporta `Models/GLTF format/computerScreen.glb`. El mismo kit incluye `computerKeyboard.glb` y `computerMouse.glb` para completar ese puesto si hiciera falta. Conservar el estilo de la oficina y evitar importar el kit entero.

Los modelos ya copiados en `public/models/` conservan sus rutas actuales. El inventario identifica cuatro que necesitan Meshopt; al comprobarlos, distinguir su renderizado real del respaldo procedural. Si es necesario configurar el decoder para usarlos, servirlo desde la dependencia local de Three.js. Esto no exige reemplazar los modelos por otros del inventario.

## Audio opcional

Usar el ZIP `PC _ Computer - Windows XP - Miscellaneous - Sounds.zip` si se integra sonido en esta entrega. Elegir tras escuchar las muestras:

| Archivo | Acción candidata | Destino bajo `public/computers/sounds/` |
| --- | --- | --- |
| `xpmin.wav` | Minimizar | `xpmin.wav` |
| `xprestor.wav` | Restaurar ventana | `xprestor.wav` |
| `xpnotify.wav` | Aviso dentro del sistema simulado | `xpnotify.wav` |
| `xperror.wav` | Error de programa | `xperror.wav` |

Respetar el ajuste de audio desactivado por defecto. La notificación de guardado en la libreta sigue siendo un elemento visual del juego, fuera del monitor. Los sonidos de arranque y cierre quedan de reserva; no requieren simular un arranque completo ni retrasar la investigación.

## Preparación y reparto para los agentes

1. El coordinador prepara los assets durante la etapa 0, antes del trabajo paralelo. Es propietario de `public/computers/`, `public/models/rack-monitor/` y `src/data/computerAssets.ts`; comparte las rutas y claves definitivas con los otros agentes.
2. Copiar únicamente los seis fondos asignados, las dos fuentes, la bandera, los iconos seleccionados y los archivos del monitor. Añadir sonidos/periféricos solo cuando se integren sus funciones. `clipboard.zip`, el personaje FBI y `Stages.glb` permanecen inventariados para otros trabajos.
3. Mantener el origen intacto y conservar las dependencias al extraer cada ZIP. Las copias pueden usar los nombres de destino de este documento. No mezclar los distintos `scene.gltf` de otros paquetes en un mismo directorio.
4. Preparar `public/computers/CREDITS.md` con correspondencia entre origen, entrada del ZIP, destino y uso; conservar autoría/licencia aportadas y referenciar los hashes del inventario. El monitor mantiene además su `license.txt` junto al modelo.
5. Declarar en `src/data/computerAssets.ts` el fondo y tema por StationId, las URLs de fuentes/branding y el mapa de iconos. `src/data/computers.ts` referencia esas claves al definir programas y escritorios.
6. En ejecución, cargar desde rutas locales como `/computers/wallpapers/xp-bliss.jpg` y `/models/rack-monitor/scene.gltf`. Las rutas `/home/ordson/…` sirven para preparar recursos; no deben aparecer como URLs de carga del navegador ni requerir que exista esa carpeta en el equipo de destino.
7. El agente de escritorio usa las fuentes, iconos, temas y fondos ya preparados. Los agentes de aplicaciones reutilizan el mismo mapa. El agente de escena integra el monitor y revisa sus materiales. Los cambios compartidos de assets se canalizan por el coordinador.

## Aceptación de assets

- Cada una de las seis PCs muestra el fondo y tema de la tabla inicial, también al reabrirla y en acceso plano.
- Las dos Tahoma se cargan correctamente, los iconos seleccionados se identifican en el mapa y las referencias son recursos reales del inventario.
- Las imágenes mantienen su proporción; el fondo panorámico conserva Stonehenge visible en los tamaños revisados.
- El monitor del rack carga con sus archivos auxiliares, muestra su pantalla y permite abrir la estación E; el informe conserva la procedencia del modelo.
- La consola y los programas funcionan con recursos locales; no hay peticiones a fuentes, imágenes o decoders de una CDN ni errores 404 de assets.
- Las capturas de referencia no se presentan como una interfaz funcional. El marco deja visible la oficina y el aviso de libreta sigue fuera de la pantalla simulada.
- Los recursos opcionales no bloquean el recorrido principal. La entrega identifica qué se copió, qué se utilizó y qué quedó como reserva.
