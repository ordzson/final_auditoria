# Recursos locales de las computadoras · etapa 0

Preparados el 5 de noviembre de 2026 a partir de los archivos aportados por el usuario. No constituyen evidencia del incidente. Las copias están preparadas; su incorporación al juego corresponde a las etapas siguientes.

Origen de preparación: `/home/ordson/final auditoria/assets/`. En ejecución se usan exclusivamente URLs locales. Inventario de referencia: [`docs/inventario-assets.json`](../../docs/inventario-assets.json) y [descripción](../../docs/inventario-assets.md). Cada original y entrada seleccionada se cotejó por SHA-256 con ese inventario antes de copiar o convertir. [`manifest.json`](manifest.json) registra los hashes originales, los de las entradas y los de todas las copias/variantes entregadas.

## Fondos, fuentes y bandera

| Origen | Entrada del ZIP | Destino relativo a este directorio | Uso |
| --- | --- | --- | --- |
| `xp-fondo-bliss-3840x2160.jpg` | — | `wallpapers/xp-bliss.jpg` | A · accesos |
| `xp-fondo-professional-azul-3840x2160.jpg` | — | `wallpapers/xp-professional-azul.jpg` | B · sql_red (dos monitores, una PC) |
| `xp-fondo-isla-tropical-4341x2841.jpg` | — | `wallpapers/xp-isla-tropical.jpg` | C · crm_cambios |
| `fondo-stonehenge-5600x2400.jpg` | — | `wallpapers/stonehenge.jpg` | D · siem |
| `fondo-camino-otonal-4200x2800.jpg` | — | `wallpapers/camino-otonal.jpg` | E · respaldos, Server clásico |
| `fondo-duna-roja-luna-5120x2880.jpg` | — | `wallpapers/duna-roja-luna.jpg` | F · mesa_auditor |
| `Tahoma-4styles-Font.zip` | `Tahoma Regular font.ttf` | `fonts/tahoma-regular.ttf` | Tahoma 2.80, normal 400 |
| `Tahoma-4styles-Font.zip` | `TAHOMAB0.TTF` | `fonts/tahoma-bold.ttf` | Tahoma 2.30, negrita 700 |
| `windows logo.webp` | — | `branding/windows-flag.webp` | Bandera de Inicio XP, alfa original |

Los fondos y la bandera no incluyen autoría o licencia adicional en el material aportado; no se les atribuye una licencia abierta. Los TTF conservan sus metadatos y copyright internos de Microsoft; `sharefonts.net.txt` identifica el distribuidor, no concede una licencia adicional. No se han instalado fuentes en el sistema ni se distribuyen las versiones alternativas.

## Iconos seleccionados visualmente

Paquete: `win95-winxp_icons-master.zip`. Su README describe iconos predeterminados de Windows 95/98/2000/XP y enlaza una captura de trapd00r; no incluye una licencia adicional. No atribuir CC0/CC-BY al paquete. Server usa la familia `w2k` como dirección clásica. Las etiquetas de aplicación dan el significado contextual; los nombres numéricos se conservan en el mapa.

Se extraen fotogramas cuadrados nativos de 16/32/48 px cuando existen a PNG RGBA, sin ampliar ni redimensionar. Query (`wxp_153`), Recovery (`wxp_3`), documento (`wxp_133`) y la consola clásica solo aportan 16/32 px: usar 32 px en sus accesos. No se copia el paquete completo.

| Familia / clave | Entrada exacta dentro del ZIP | Destinos relativos |
| --- | --- | --- |
| xp · `sessions` | `win95-winxp_icons-master/icons/wxp_16.ico` | `icons/xp/sessions-{16,32,48}.png` |
| xp · `directory` | `win95-winxp_icons-master/icons/wxp_220.ico` | `icons/xp/directory-{16,32,48}.png` |
| xp · `query` | `win95-winxp_icons-master/icons/wxp_153.ico` | `icons/xp/query-{16,32}.png` |
| xp · `network` | `win95-winxp_icons-master/icons/wxp_19.ico` | `icons/xp/network-{16,32,48}.png` |
| xp · `orders` | `win95-winxp_icons-master/icons/wxp_1.ico` | `icons/xp/orders-{16,32,48}.png` |
| xp · `changes` | `win95-winxp_icons-master/icons/wxp_274.ico` | `icons/xp/changes-{16,32,48}.png` |
| xp · `events` | `win95-winxp_icons-master/icons/wxp_151.ico` | `icons/xp/events-{16,32,48}.png` |
| xp · `time` | `win95-winxp_icons-master/icons/wxp_339.ico` | `icons/xp/time-{16,32,48}.png` |
| xp · `recovery` | `win95-winxp_icons-master/icons/wxp_3.ico` | `icons/xp/recovery-{16,32}.png` |
| xp · `backup` | `win95-winxp_icons-master/icons/wxp_7.ico` | `icons/xp/backup-{16,32,48}.png` |
| xp · `explorer` | `win95-winxp_icons-master/icons/wxp_5.ico` | `icons/xp/explorer-{16,32,48}.png` |
| xp · `report` | `win95-winxp_icons-master/icons/wxp_152.ico` | `icons/xp/report-{16,32,48}.png` |
| xp · `folder` | `win95-winxp_icons-master/icons/wxp_4.ico` | `icons/xp/folder-{16,32,48}.png` |
| xp · `document` | `win95-winxp_icons-master/icons/wxp_133.ico` | `icons/xp/document-{16,32}.png` |
| xp · `search` | `win95-winxp_icons-master/icons/wxp_23.ico` | `icons/xp/search-{16,32,48}.png` |
| xp · `help` | `win95-winxp_icons-master/icons/wxp_24.ico` | `icons/xp/help-{16,32,48}.png` |
| classic · `recovery` | `win95-winxp_icons-master/icons/w2k_ms-dos_application.ico` | `icons/classic/recovery-{16,32}.png` |
| classic · `backup` | `win95-winxp_icons-master/icons/w2k_hard_drive.ico` | `icons/classic/backup-{16,32,48}.png` |
| classic · `explorer` | `win95-winxp_icons-master/icons/w2k_folder_open.ico` | `icons/classic/explorer-{16,32,48}.png` |
| classic · `report` | `win95-winxp_icons-master/icons/w2k_text_document.ico` | `icons/classic/report-{16,32,48}.png` |
| classic · `folder` | `win95-winxp_icons-master/icons/w2k_closed_folder.ico` | `icons/classic/folder-{16,32,48}.png` |
| classic · `document` | `win95-winxp_icons-master/icons/w2k_text_file.ico` | `icons/classic/document-{16,32,48}.png` |
| classic · `search` | `win95-winxp_icons-master/icons/w2k_find.ico` | `icons/classic/search-{16,32,48}.png` |
| classic · `help` | `win95-winxp_icons-master/icons/w2k_help.ico` | `icons/classic/help-{16,32,48}.png` |

## Monitor del rack

Paquete `monitor.zip`: `scene.gltf`, `scene.bin`, `textures/RenderMonitor_baseColor.png` y `license.txt` se copian exactamente a `public/models/rack-monitor/`, conservando las URIs internas. Pantalla: nodo `Cube_RenderMonitor_0`, material `RenderMonitor`. Integración física pendiente de la etapa 3.

This work is based on "Monitor" (https://sketchfab.com/3d-models/monitor-9f6f9018f14a4dbea1ad1aea0ce89e7c) by portgl16 (https://sketchfab.com/portgl16) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

Se conserva también la [licencia original del modelo](../models/rack-monitor/license.txt). La alternativa Kenney y sus periféricos no se copiaron.

## Reservas y referencias

No se copian sonidos, fondo Bliss Halo, capturas de referencia, bienvenida, paquete de marca completa, clipboard, personaje FBI ni Stages. Las referencias `Windows_XP_Luna.png`, `WindowsXP-RTM-Desktop.png` y `buttonsreference.webp` guían HTML/CSS; no se usan como escritorio plano. Los modelos existentes permanecen en sus rutas.

Mapa público: `src/data/computerAssets.ts`. Propietario de este directorio y del monitor: coordinador. No hay dependencias remotas nuevas.
