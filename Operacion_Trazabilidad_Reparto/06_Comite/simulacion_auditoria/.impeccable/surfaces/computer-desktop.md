---
version: 1
slug: "computer-desktop"
primary_target: "src/ui/desktop/ComputerDesktop.ts"
related_targets: ["src/desktop.css", "src/ui/apps/", "src/data/computerAssets.ts", "src/data/computers.ts", "src/computer/types.ts"]
---

# Superficie: escritorios de las seis computadoras

Modo: Operate. Dirección fijada por las decisiones confirmadas del usuario en [el plan](../../docs/plan-escritorios-pc.md). Estado al 5 de noviembre de 2026: **etapas 0–3 completadas; etapas 4 y 5 pendientes**. Las seis estaciones abren ComputerDesktop desde E y el acceso plano, con libreta/TI y retorno al trabajo. La etapa 3 añade diez aplicaciones específicas de A/C/D/E/F y el monitor físico Server junto al rack. `pnpm verify` aprobó 99 unitarias, TypeScript/Vite y 30 E2E; las ocho capturas están en [desktop-stage3](../../artifacts/desktop-stage3/). La evidencia y revisión independiente de [etapa 2](../../artifacts/desktop-b/README.md) se conservan con su alcance B; no sustituyen la revisión independiente final de etapa 4.

## Dirección confirmada

THESIS: Investigar desde programas independientes de una PC de época. La nota orienta; las aplicaciones contienen el trabajo; la libreta conserva automáticamente lo que el jugador registra.

OWN-WORLD: Windows XP Luna azul muy fiel en A/B/C/D/F, con Tahoma local, iconos XP auténticos seleccionados del paquete, Inicio verde, barras azules, controles compactos y marfil de sistema. E usa Server clásico inspirado en 2003, con controles grises y familia de iconos w2k, compartiendo geometría y motor. Los seis fondos personalizados están fijados por estación. La oficina conserva madera/grafito, visita cálida, tablita y reconstrucción previa; no se recolorea para adoptar XP.

STORY: Entrar en B, ver el monitor y dos programas abiertos, consultar la nota sin obtener respuestas, investigar SQL y tráfico, pedir Seguridad al enlace, registrar contraste y conclusión dentro de las aplicaciones y comprobar en el HUD que la libreta se guardó. Volver a la oficina conserva el trabajo.

FIRST VIEWPORT: Un monitor grande con bisel fino ocupa el centro; una franja real de oficina permanece reconocible detrás, con cámara quieta y atenuación suave. Query Studio está al frente y Monitor de red detrás, con su tarea visible. La nota queda libre junto a los accesos. Salida, libreta y guardado pertenecen al juego, fuera de la pantalla del monitor y dentro de la misma capa superior.

FORM: HTML/CSS para escritorio, ventanas, nota, menús y controles. Fondo como imagen independiente con proporción preservada, `cover` centrado. Una instancia por AppId y StationId. Barra de tareas real y «Mostrar escritorio» recuperan ventanas/nota. Maximizar se limita al monitor. Los programas muestran registros y herramientas de época con tablas/editor/inspector; las conclusiones viven en «Informe del puesto» y en el Assessment compartido con la libreta.

SIGNATURE INTERACTION: Mantener una consulta abierta y contrastarla con el registro de otra ventana sin perder editor, selección, comparación o posición; salir y volver recupera ese entorno. La confirmación exterior da continuidad al trabajo del auditor sin introducir un segundo guardado manual.

## Referencias inspeccionadas y jerarquía

Se inspeccionaron `Windows_XP_Luna.png` (640×480) y `WindowsXP-RTM-Desktop.png` (1024×768) de los originales, y la captura previa `.impeccable/review/investigation/sql-desktop.png`. Las primeras fijan barras, densidad, Inicio y proporciones; la última documenta la composición anterior, aún utilizada por el juego. `buttonsreference.webp` es referencia ampliada de controles, no un spritesheet funcional. No se distribuyen capturas como escritorio plano.

La evidencia aportada no contiene captura Server. Su variante se fija como controles clásicos grises, título azul oscuro y tipografía/iconos de administración de época. No se presenta como una reproducción certificada de una edición concreta de Windows. El fondo otoñal de E se conserva, sin marca textual XP Professional.

## Implementación observada · etapa 1

Ámbito implementado: `.computer-desktop` y sus descendientes en `src/desktop.css`, junto con las aplicaciones de `src/ui/apps/` y `apps.css`. El marco y HUD exterior pertenecen a `.computer-session`. No extender la paleta XP/Server a libreta, entrevista, HUD ni reconstrucción. Este registro describe el código y la evidencia de etapa 1; no reemplaza el sistema global de DESIGN ni regenera `.impeccable/design.json`.

| Material observado | XP Luna | Server clásico |
| --- | --- | --- |
| `--pc-font` | `TahomaXP, Tahoma, sans-serif` | Igual |
| `--pc-face` | `#ece9d8` | `#d4d0c8` |
| `--pc-text` | `#000000` | `#000000` |
| `--pc-window` | `#ffffff` | `#ffffff` |
| `--pc-title` | `#0054e3` con tratamiento Luna | `#0a246a` con título clásico |
| Texto de título | `#ffffff` | `#ffffff` |
| `--pc-selection` | `#316ac5` | `#0a246a` |
| `--pc-inactive` | `#7a96df` | `#808080` |
| `--pc-taskbar` | `#245edb` con relieve Luna | `#d4d0c8` con borde de relieve |
| Inicio | Gradiente verde con bandera local | Botón gris clásico, sin marca textual XP |
| `--pc-note` / texto | `#fff2a6` / `#292512` | Igual |

TahomaXP normal 400 y negrita 700 mediante dos `@font-face` locales; `font-synthesis: none`. Base de escritorio y aplicaciones 12 px; el editor SQL usa monoespaciada de sistema a 13 px. Los títulos de ventana son 14 px en Luna y 12 px en Server, en negrita. Las aplicaciones suben a 13 px en móvil y a 15 px en proyector o puntero táctil; los campos móviles/táctiles usan 16 px. No se reduce toda la PC con `transform: scale()` ni se exige instalar fuentes.

Barras de título de 29 px en Luna y 26 px en Server; barra de tareas de 32 px. Acentos y bordes de 1–3 px reproducen el relieve Luna/clásico con CSS, incluidas esquinas superiores discretas XP. Los gradientes, biseles y glifos de ventana están autorizados en esta superficie por la referencia histórica; no extenderlos a todo el juego. Iconos de 16 px en títulos, tareas y barras de aplicación; 32 px en accesos e Inicio. El mapa conserva variantes de 48 px solo donde existe el fotograma nativo.

En la integración B de etapa 2, la sesión mide `calc(100vw - 192px)` por `calc(100dvh - 128px)`, con ancho máximo de 1600 px; el monitor lleva 9 px de bisel. Esto reserva 96 px por lado y 64 px arriba/abajo a 1280×720; a 1920×1080, el límite de ancho reserva 160 px por lado. En móvil conserva `calc(100vw - 12px)` por `calc(100dvh - 20px)`. Un HUD grafito sólido, con mínimo de 48 px y separación de 10 px, contiene salida, libreta, enlace y estado de guardado fuera de la pantalla simulada. La atenuación exterior, los márgenes y el encuadre temporal amplio conservan la oficina reconocible, confirmada por la revisión independiente a 1280×720 y 1920×1080. La nota mide 204 px de ancho (240 px en proyector y 206 px en móvil). El gestor limita ventanas y nota al área útil; la maximización conserva el monitor y la barra de tareas. Las geometrías iniciales se ajustan al espacio disponible al montar o cambiar el tamaño de la superficie.

Por debajo de 760 px de área útil (1040 px en proyector), o de 360 px de alto, se proyecta una ventana maximizada por vez sin sobrescribir la geometría amplia; barra e Inicio permiten cambiar. «Mostrar escritorio» recupera nota y accesos. En móvil el margen horizontal baja a 6 px y el bisel a 3 px. La adaptación de una ventana y el puntero táctil elevan títulos a 48 px y controles de ventana a 44 px; las aplicaciones también amplían sus acciones a 44 px en móvil, proyector y táctil. Tablas y contenido tienen desplazamiento propio. No se exige doble clic, arrastre ni redimensionado para terminar tareas.

## Estados, foco y lenguaje

Un clic selecciona un acceso, doble clic o Enter abre; en táctil un toque abre. Todos los controles tienen nombre accesible y foco visible. Las ventanas no son diálogos modales independientes: el diálogo del juego contiene el foco exterior, las aplicaciones conservan navegación entre sí. El título de la ventana activa y su tarea reflejan foco/superposición. Esc cierra primero el menú o elemento transitorio, luego vuelve a la oficina.

La nota muestra asuntos del puesto y una orientación desplegada, sin soluciones ni progreso por clic. Las marcas proceden de fuentes actuales/comprobaciones registradas. «Documentado» procede solo de `evaluateReview()` y nunca significa aprobación académica.

El informe usa aspecto de editor de época con conclusión, límites, solicitudes y nota; guarda automáticamente en el mismo Assessment. Los avisos del juego dicen «Guardado pendiente», «Libreta actualizada», «Conclusión guardada» o «Solo en esta sesión» según el resultado real. No suenan ni conceden respuesta correcta. Audio sigue desactivado por defecto; no se preparó sonido en etapa 0.

## Revisión y límites de evidencia

El [informe de etapa 1](../../artifacts/desktop-stage1/README.md) registra 99 pruebas unitarias, TypeScript/Vite, el recorrido aislado `pnpm test:desktop` y las 18 E2E del juego vigente. Sus nueve capturas específicas muestran XP a 1280×720 y 1920×1080, móvil, nota recuperada, Server, fallo real de almacenamiento, proyector, acceso plano y táctil. La [revisión independiente](../../artifacts/desktop-stage1/review.md) contrasta esas capturas con la dirección aprobada; su veredicto final resuelve la corrección de continuidad de foco y valida las nueve capturas regeneradas sin regresiones, con `ship` limitado a esa corrección. Se conserva la evidencia anterior de `.impeccable/review/`.

Las capturas de etapa 1 montan ComputerDesktop en un diálogo de prueba sobre la oficina real o su acceso plano; Server usa las aplicaciones comunes implementadas. No acreditan la entrada de producción, las aplicaciones específicas A/C/D/E/F ni el monitor físico del rack.

La [etapa 2 integrada](../../artifacts/desktop-b/README.md) conecta B con Query Studio, Monitor de red, Informe del puesto y Expediente local. El workspace vive en App durante la sesión y se limpia junto con la auditoría v2 al reiniciar. Navegar a libreta/TI vacía el texto pendiente; cerrar las vistas auxiliares recupera la PC. El diálogo centrado contiene el foco y separa el CSS anterior mediante `legacy-computer-dialog`. La geometría se aplica antes de montar contenido para restaurar el desplazamiento. El HUD conserva fallos de almacenamiento entre montajes, sin repetir notificaciones académicas anteriores. La cámara utiliza temporalmente `anchors.general`, guarda posición/quaternion y los restaura al salir; la pose del visitante no se sustituye por ese encuadre. E evita insertar caracteres en SQL al abrir desde la oficina. No se modifican textos de monitores, modelos ni reconstrucción.

Las cinco E2E de B y sus siete capturas finales abarcan 1280×720 físico, 1920×1080, 390×844 táctil, acceso plano sin WebGL, almacenamiento bloqueado, libreta/TI, restauración y reinicio. La [revisión independiente B](../../artifacts/desktop-b/review.md) marcó oficina reconocible y SELECT intacto como **resolved**, con disposición **ship** limitada a esas correcciones; el [informe inicial](../../artifacts/desktop-b/review-initial.md) conserva el historial. La [aceptación B](../../docs/aceptacion-pc-b.md) queda completada en etapa 2.

La etapa 3 extiende esa superficie a A/C/D/E/F con diez aplicaciones específicas y añade el monitor físico del rack. La revisión final de `pnpm verify` terminó con código 0: **99 unitarias en 12 archivos, TypeScript/Vite y 30 E2E aprobadas**. Las ocho capturas de [desktop-stage3](../../artifacts/desktop-stage3/) cubren Accesos, CRM, SIEM, Respaldos, Custodia, Recovery móvil, rack y Server; se corrigió y verificó el contraste del paso seleccionado en móvil. Permanece el aviso no bloqueante de chunk principal mayor de 500 kB (789.24 kB en esta entrega). La revisión independiente final y la actualización global corresponden a etapas 4–5. No se acredita un ensayo físico con proyector ni una validación con estudiantes/docente.

El detector reportó avisos advisory sobre paleta/escala heredadas y rasgos XP frente al sidecar anterior; no se cambió la estética aprobada. El contexto detectó dos desajustes previos: sidecar anterior a DESIGN y configuración sin `buildPath`. Se reportan sin reparar; el refresco global está reservado a etapa 5. El aviso de target de superficie inexistente queda resuelto por la creación de `ComputerDesktop.ts`.
