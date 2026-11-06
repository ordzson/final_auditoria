# Inventario de assets

Recursos aportados para la oficina y los escritorios XP/Server. Revisión del 5 de noviembre de 2026.

- **Originales:** [/home/ordson/final auditoria/assets](</home/ordson/final auditoria/assets>).
- **Índice completo:** [inventario-assets.json](inventario-assets.json), con rutas, contenido de cada ZIP, tamaños, metadatos y SHA-256.
- **Plan de uso:** [plan-escritorios-pc.md](plan-escritorios-pc.md).
- **Selección para implementar las PCs:** [assets-pcs.md](assets-pcs.md), con fondos por equipo, archivos exactos y rutas de destino.
- **Alcance:** 28 archivos originales, de los cuales 8 son ZIP con 2,819 archivos internos; además, se cotejaron los 5 modelos presentes en `public/models/`.

Se renombraron únicamente siete fondos cuyos nombres eran identificadores numéricos. Se conservan los otros nombres y las rutas internas de los ZIP. Los recursos siguen en su carpeta de origen; este inventario no los incorpora automáticamente a `public/` ni cambia el juego.

## Accesos por necesidad

| Necesito… | Dónde buscar |
| --- | --- |
| Fondo asignado a cada PC | Reparto de los seis fondos en [assets-pcs.md](assets-pcs.md); Bliss corresponde a A |
| Iconos de XP | [win95-winxp_icons-master.zip](</home/ordson/final auditoria/assets/win95-winxp_icons-master.zip>), carpeta `win95-winxp_icons-master/icons/`, archivos **`wxp_*.ico`** |
| Iconos de estilo clásico para Server | El mismo ZIP; carpeta `icons/`, familia `w2k`. Su uso como variante de servidor es una decisión visual, no una identificación de origen Server |
| Fuente del sistema | [Tahoma-4styles-Font.zip](</home/ordson/final auditoria/assets/Tahoma-4styles-Font.zip>) |
| Barra, Inicio y Explorador como referencia | [Windows_XP_Luna.png](</home/ordson/final auditoria/assets/Windows_XP_Luna.png>) |
| Botones de ventana como referencia | [buttonsreference.webp](</home/ordson/final auditoria/assets/buttonsreference.webp>) |
| Bandera Windows transparente | [windows logo.webp](</home/ordson/final auditoria/assets/windows logo.webp>) |
| Sonidos de sistema | [PC _ Computer - Windows XP - Miscellaneous - Sounds.zip](</home/ordson/final auditoria/assets/PC _ Computer - Windows XP - Miscellaneous - Sounds.zip>) |
| Monitor al lado del rack | [monitor.zip](</home/ordson/final auditoria/assets/monitor.zip>), entrada `scene.gltf` |
| Monitor, teclado y mouse sencillos | [kenney_furniture-kit.zip](</home/ordson/final auditoria/assets/kenney_furniture-kit.zip>), carpeta `Models/GLTF format/` |
| Tablita física con clip | [clipboard.zip](</home/ordson/final auditoria/assets/clipboard.zip>), entrada `scene.gltf` |
| Qué modelos ya usa el proyecto | Tabla de correspondencias en «Modelos existentes» |

## Fondos de escritorio

Todos se inspeccionaron visualmente. La descripción identifica su contenido; no certifica que sean archivos oficiales o que su resolución corresponda al original histórico.

| Archivo actual | Dimensiones | Contenido y uso |
| --- | --- | --- |
| [xp-fondo-bliss-3840x2160.jpg](</home/ordson/final auditoria/assets/xp-fondo-bliss-3840x2160.jpg>) | 3840×2160 | Colina verde y cielo; asignado a A · Accesos |
| [xp-fondo-professional-azul-3840x2160.jpg](</home/ordson/final auditoria/assets/xp-fondo-professional-azul-3840x2160.jpg>) | 3840×2160 | Fondo azul con marca XP Professional; asignado a B · SQL y red |
| [xp-fondo-isla-tropical-4341x2841.jpg](</home/ordson/final auditoria/assets/xp-fondo-isla-tropical-4341x2841.jpg>) | 4341×2841 | Isla, palmeras y velero; asignado a C · CRM |
| [fondo-stonehenge-5600x2400.jpg](</home/ordson/final auditoria/assets/fondo-stonehenge-5600x2400.jpg>) | 5600×2400 | Stonehenge panorámico; asignado a D · SIEM, con recorte centrado |
| [fondo-camino-otonal-4200x2800.jpg](</home/ordson/final auditoria/assets/fondo-camino-otonal-4200x2800.jpg>) | 4200×2800 | Camino con árboles de otoño; asignado a E · Respaldos/Server |
| [fondo-duna-roja-luna-5120x2880.jpg](</home/ordson/final auditoria/assets/fondo-duna-roja-luna-5120x2880.jpg>) | 5120×2880 | Duna roja y luna; asignado a F · Custodia y archivo |
| [fondo-bliss-halo-3840x2160.png](</home/ordson/final auditoria/assets/fondo-bliss-halo-3840x2160.png>) | 3840×2160 | Colina con anillo Halo añadido; variante temática, apartada de la selección XP fiel |

## Capturas y logotipos

| Archivo | Formato y tamaño | Uso |
| --- | --- | --- |
| [Windows_XP_Luna.png](</home/ordson/final auditoria/assets/Windows_XP_Luna.png>) | PNG · 640×480 | Referencia de Inicio abierto, ventana del Explorador y tema Luna azul |
| [WindowsXP-RTM-Desktop.png](</home/ordson/final auditoria/assets/WindowsXP-RTM-Desktop.png>) | PNG · 1024×768 | Referencia del escritorio, barra de tareas y Papelera; ya contiene controles e iconos |
| [buttonsreference.webp](</home/ordson/final auditoria/assets/buttonsreference.webp>) | WebP · 1600×1200 | Detalle ilustrado de minimizar, maximizar y cerrar; referencia ampliada, no un spritesheet de estados |
| [loginwindows.jpeg](</home/ordson/final auditoria/assets/loginwindows.jpeg>) | JPEG · 639×480 | Referencia de bienvenida e inicio de sesión |
| [windows logo.webp](</home/ordson/final auditoria/assets/windows logo.webp>) | WebP RGBA · 518×457 | Bandera Windows con canal alfa, sin texto |
| [microsoft-windows-xp-professional-1-logo-pack.zip](</home/ordson/final auditoria/assets/microsoft-windows-xp-professional-1-logo-pack.zip>) | ZIP · 4 archivos | Marca completa XP Professional: 2 PNG de 2400×2400 con alfa, 1 SVG y 1 EPS |

Entradas del paquete de logotipos:

- `microsoft-windows-xp-professional-1-logo-png-transparent.png`: versión a color.
- `microsoft-windows-xp-professional-1-logo-black-and-white.png`: versión monocroma.
- `microsoft-windows-xp-professional-1-logo-svg-vector.svg`: vector para inspeccionar al preparar una versión web.
- `microsoft-windows-xp-professional-1-logo.eps`: fuente vectorial alternativa; no se usa directamente en el navegador.

Las capturas sirven para reconstruir controles interactivos en código. No usarlas como fondo de un programa con botones dibujados que no funcionen. No se encontró una captura específica de Windows Server entre las imágenes aportadas.

## Iconos

Paquete: [win95-winxp_icons-master.zip](</home/ordson/final auditoria/assets/win95-winxp_icons-master.zip>).

| Familia por nombre | Archivos ICO | Cómo encontrarlos |
| --- | ---: | --- |
| Windows XP | **215** | `win95-winxp_icons-master/icons/wxp_*.ico` |
| Windows 2000 | 275 | `icons/w2k*` |
| Windows 95 | 72 | `icons/w95*` |
| Windows 98 | 627 | `icons/w98*` |
| Otros | 2 | `brown.ico` y `orange.ico` en la raíz del paquete |
| **Total** | **1,191** | No todos los iconos del paquete pertenecen a XP |

El ZIP tiene 1,201 archivos en total: 1,191 ICO, 4 ICL, 3 ANI, 2 PNG y 1 README. Muchos ICO guardan varios tamaños de 16, 32 y 48 px y distintas profundidades de color; el JSON registra los tamaños de cada uno.

Conservar nombres como `wxp_17.ico`: identifican los recursos de origen. Durante la implementación, un mapa de aplicación puede asociarlos a nombres funcionales como `sesiones` o `archivo`. La asignación semántica de cada icono numérico requiere seleccionarlo visualmente; no se ha supuesto que un número corresponda a una función concreta.

ICL son bibliotecas de iconos y ANI son cursores animados; se inventariaron, pero no equivalen a imágenes web listas para un acceso directo.

## Fuentes

Paquete: [Tahoma-4styles-Font.zip](</home/ordson/final auditoria/assets/Tahoma-4styles-Font.zip>).

| Archivo dentro del ZIP | Familia y estilo reales | Versión interna |
| --- | --- | --- |
| `Tahoma Regular font.ttf` | Tahoma Regular | 2.80 |
| `TAHOMA_0.TTF` | Tahoma Regular | 2.25 |
| `TAHOMAB0.TTF` | Tahoma Bold | 2.30 |
| `TAHOMABD.TTF` | Tahoma Bold | 6.00 |

El nombre «4styles» no representa cuatro estilos distintos: hay **dos versiones de Regular y dos de Bold**. No hay una variante Italic identificada en los nombres internos. El quinto archivo, `sharefonts.net.txt`, contiene un enlace al sitio de descarga, no una licencia.

Se revisaron las tablas de nombres de las fuentes. No se instalaron ni se eligió todavía qué versiones se cargarán con `@font-face`.

## Sonidos

Paquete: [PC _ Computer - Windows XP - Miscellaneous - Sounds.zip](</home/ordson/final auditoria/assets/PC _ Computer - Windows XP - Miscellaneous - Sounds.zip>).

Contiene **35 WAV**. El inventario JSON permite localizar cada nombre y consultar duración, frecuencia, canales y tamaño. Estos son candidatos por su nombre para las acciones principales; queda pendiente la selección auditiva:

| Archivo | Duración | Uso sugerido por el nombre |
| --- | ---: | --- |
| `xpstartu.wav` | 4.814 s | Inicio del sistema |
| `xplogon.wav` | 2.156 s | Inicio de sesión |
| `xplogoff.wav` | 2.037 s | Cierre de sesión |
| `xpshutdn.wav` | 3.204 s | Apagado |
| `xpnotify.wav` | 1.110 s | Notificación |
| `xperror.wav` | 1.000 s | Error |
| `xpcrtstp.wav` | 0.892 s | Parada crítica |
| `xpmin.wav` | 0.511 s | Minimizar |
| `xprestor.wav` | 0.440 s | Restaurar ventana |
| `xpmenu.wav` | 0.031 s | Acción breve de menú |

Se verificó el formato de audio; no se realizó una escucha completa. Su futura integración respeta el ajuste de audio opcional del juego.

## Modelos nuevos en ZIP

| Paquete | Contenido y entrada | Resultado de la inspección |
| --- | --- | --- |
| [monitor.zip](</home/ordson/final auditoria/assets/monitor.zip>) | `scene.gltf`, `scene.bin`, `textures/RenderMonitor_baseColor.png`, `license.txt` | 6 mallas, 460 triángulos indexados, sin extensiones obligatorias; **pantalla separada como `Cube_RenderMonitor_0`**, material `RenderMonitor`. Candidato principal para el rack |
| [clipboard.zip](</home/ordson/final auditoria/assets/clipboard.zip>) | `scene.gltf`, `scene.bin`, 3 texturas y licencia | 1 malla, 6,176 triángulos indexados; aproximadamente 15.8 MiB descomprimidos, principalmente texturas |
| [fbi__cs2_agent_model_no1.zip](</home/ordson/final auditoria/assets/fbi__cs2_agent_model_no1.zip>) | `scene.gltf`, `scene.bin`, 15 texturas y licencia | 5 mallas, 22,104 triángulos indexados; tiene esqueleto y **0 clips de animación**. Recurso de personaje, separado del trabajo de escritorios |
| [kenney_furniture-kit.zip](</home/ordson/final auditoria/assets/kenney_furniture-kit.zip>) | 1,546 archivos: 140 GLB, otros formatos y vistas isométricas | Kit alternativo de mobiliario y periféricos; preferir las entradas GLB al seleccionar una pieza |

Los paquetes monitor, clipboard y personaje son **glTF con dependencias**, no un GLB único. Al extraerlos, mantener cada `scene.gltf` con su `scene.bin` y carpeta `textures/` en un directorio propio; los tres paquetes repiten los mismos nombres genéricos. No renombrar sus dependencias sin actualizar las referencias del glTF.

Selección localizable dentro del kit Kenney:

| Entrada exacta del ZIP | Tamaño | Pieza |
| --- | ---: | --- |
| `Models/GLTF format/computerScreen.glb` | 6,404 bytes | Monitor alternativo |
| `Models/GLTF format/computerKeyboard.glb` | 3,476 bytes | Teclado |
| `Models/GLTF format/computerMouse.glb` | 5,868 bytes | Mouse |
| `Models/GLTF format/chairDesk.glb` | 39,016 bytes | Silla de escritorio |
| `Models/GLTF format/desk.glb` | 15,048 bytes | Escritorio |
| `Models/GLTF format/deskCorner.glb` | 17,984 bytes | Escritorio esquinero |

Esos seis GLB no declaran extensiones obligatorias ni archivos externos. Se inspeccionó su estructura; no se han renderizado en la escena.

## Modelos existentes

Se compararon por SHA-256 los GLB originales con las copias de `public/models/`. Estas cinco correspondencias son exactas:

| Copia del proyecto | Original en la carpeta de assets |
| --- | --- |
| [public/models/lamp.glb](../public/models/lamp.glb) | `Lamp.glb` |
| [public/models/rack.glb](../public/models/rack.glb) | `aiprintgen_Industrial Server Rack Unit with Perforated Casing-preview.glb` |
| [public/models/filing-cabinet.glb](../public/models/filing-cabinet.glb) | `aiprintgen_Metal Filing Cabinet with Binders and Folders-preview.glb` |
| [public/models/desk.glb](../public/models/desk.glb) | `aiprintgen_Минималистичный офисный стол с монитором, клавиатурой и кружкой-preview.glb` |
| [public/models/chair.glb](../public/models/chair.glb) | `aiprintgen_Современный офисный стул с подлокотниками-preview.glb` |

Los cuatro modelos `aiprintgen_*` declaran `EXT_meshopt_compression`, `EXT_texture_webp` y `KHR_mesh_quantization`. El cargador actual de `src/scene/models.ts` no configura un MeshoptDecoder; esto debe revisarse al integrar o comprobar esos modelos. La existencia de una copia en `public/models/` no demuestra que el modelo se esté renderizando en lugar de su respaldo procedural.

Otros tres GLB originales:

| Archivo | Estructura | Identificación |
| --- | --- | --- |
| [filing-cabinet.glb](</home/ordson/final auditoria/assets/filing-cabinet.glb>) | 75 mallas, 4 imágenes, sin extensiones obligatorias | Archivador alternativo. **No es el mismo archivo** que `public/models/filing-cabinet.glb` |
| [two-drawer-lateral-filing-cabinet.glb](</home/ordson/final auditoria/assets/two-drawer-lateral-filing-cabinet.glb>) | 23 mallas, 3 imágenes, sin extensiones obligatorias | Archivador lateral de dos cajones |
| [Stages.glb](</home/ordson/final auditoria/assets/Stages.glb>) | 1 malla, 1 imagen, sin extensiones obligatorias | Nombre de nodo `Cube.001`; función visual pendiente de revisar en un visor 3D |

Estos archivos conservan su nombre. El inventario distingue los archivadores por ruta, descripción y hash para evitar reemplazar el modelo del juego por el homónimo equivocado.

## Procedencia incluida en los paquetes

Esta tabla transcribe la información de los archivos incluidos; no constituye una validación externa de su procedencia.

| Paquete | Metadatos incluidos |
| --- | --- |
| `monitor.zip` | Autor `portgl16`; declara CC-BY-4.0; origen: https://sketchfab.com/3d-models/monitor-9f6f9018f14a4dbea1ad1aea0ce89e7c |
| `clipboard.zip` | Autor `Console Art Cybernetic`; declara SKETCHFAB Standard; origen: https://sketchfab.com/3d-models/clipboard-4ddbcd71243441499bbc4e124570e736 |
| `fbi__cs2_agent_model_no1.zip` | Autor `6lucius`; declara CC-BY-4.0; origen: https://sketchfab.com/3d-models/fbi-cs2-agent-model-no1-5dbf712384a3450f87ebbe502155df18 |
| `kenney_furniture-kit.zip` | Furniture Kit 2.0 de Kenney; `License.txt` declara CC0 |
| Iconos, fuentes, logos, sonidos e imágenes sueltas | Se conserva el archivo aportado. No se encontró una licencia específica en esos paquetes; los enlaces de README o de descarga se registran sin atribuirles permisos adicionales |

El JSON conserva los textos de licencia/README encontrados, asociados a sus rutas internas.

## Cambios de nombre realizados

Se cambió solo el nombre, conservando extensión y contenido. No se borraron assets ni se modificaron los ZIP.

| Nombre original | Nombre actual |
| --- | --- |
| `wp9324707-4k-windows-xp-wallpapers.jpg` | `xp-fondo-bliss-3840x2160.jpg` |
| `wp13869372-4k-windows-xp-wallpapers.jpg` | `xp-fondo-isla-tropical-4341x2841.jpg` |
| `wp13869353-4k-windows-xp-wallpapers.jpg` | `fondo-duna-roja-luna-5120x2880.jpg` |
| `wp12488220-4k-windows-xp-wallpapers.png` | `fondo-bliss-halo-3840x2160.png` |
| `wp13869593-4k-windows-xp-wallpapers.jpg` | `xp-fondo-professional-azul-3840x2160.jpg` |
| `wp13869429-4k-windows-xp-wallpapers.jpg` | `fondo-stonehenge-5600x2400.jpg` |
| `wp12819523-4k-windows-xp-wallpapers.jpg` | `fondo-camino-otonal-4200x2800.jpg` |

## Alcance de la revisión

- Inspección visual de las 12 imágenes sueltas; dimensiones y formato real verificados.
- CRC de los 8 ZIP e índice de todos sus archivos, sin extraerlos a `public/`.
- Cabeceras de los 8 GLB sueltos, modelos dentro de ZIP y dependencias externas de los glTF.
- Metadatos de fuentes y formato/duración de los 35 sonidos.
- Comparación SHA-256 de las 5 copias de modelos del juego.
- Se registran por separado los errores de inspección en el JSON. La revisión de modelos es estructural: no incluye renderizado ni validación completa de Khronos; la de audio no incluye escucha.

Para buscar un nombre dentro de cualquier ZIP desde el proyecto:

```bash
rg -n 'wxp_17.ico|computerScreen.glb|xpnotify.wav' docs/inventario-assets.json
```
