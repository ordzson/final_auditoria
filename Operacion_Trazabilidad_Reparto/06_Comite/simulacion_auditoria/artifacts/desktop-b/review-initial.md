disposition: fix

Sin comp aprobado ni tarjeta QUALITY BAR independiente: integración de la superficie XP existente con dirección fijada. Revisión independiente con el contrato degradado, sin navegador; se inspeccionaron mediante `view_image` las siete capturas requeridas. Código muestreado, sin volver a ejecutar pruebas ni detector.

## persistence

Pass en el alcance de fase 2. Existen PRODUCT.md, DESIGN.md y la dirección de superficie. El contrato global conserva `brief-v2-pinned`; no corresponde exigir ronda de concepto, comp, placas o diffs de reproducción para esta integración. DESIGN y el sidecar describen todavía la etapa anterior y declaran su actualización global para etapa 5; no se certifican aquí como documentación final de fase 2. La aceptación B también sigue redactada como pendiente: este informe registra la revisión actual, sin convertirla en aceptación.

Evidencia: las siete capturas existen, tienen contenido válido y dimensiones coherentes: office-1280, two-programs-saved, flat-no-webgl y session-only a 1280×720; office-1920 a 1920×1080; mobile-390 y mobile-note a 390×844. La presencia de una oficina poco reconocible es un defecto de fidelidad, no evidencia ausente. Se toma como resultado comunicado por el coordinador el paso de 99 unitarias, build y E2E B; la batería final permanece pendiente.

## fidelity

| Elemento / promesa | Estado | Evidencia y criterio |
| --- | --- | --- |
| TYPE / OWN-WORLD | match | Títulos, menús, tablas y accesos conservan la densidad XP y Tahoma local 400/700; el SELECT usa monoespaciada como código. No aparece una voz tipográfica nueva. |
| MATERIAL / OWN-WORLD | match | Iconos locales, fondo raster Professional, barras Luna, controles compactos y marfil de sistema. Los relieves y gradientes CSS están autorizados explícitamente por el brief histórico; no constituyen una imitación material introducida sin aprobación. |
| GROUND / OWN-WORLD | match | Fondo azul Professional y superficies marfil/azul; el HUD exterior permanece grafito. No se extiende XP a la oficina ni se inventa una nueva paleta. |
| Monitor, programas y nota / THESIS | match | Bisel completo, Query Studio al frente, Monitor de red detrás, tareas reales y tres asuntos de la nota a la izquierda. La vista se entiende como una computadora y sus aplicaciones independientes. |
| Oficina detrás / FIRST VIEWPORT | contradicted | office-1280, office-1920 y two-programs-saved solo muestran fragmentos demasiado cercanos de monitores físicos, rótulos y superficies planas detrás del marco. No se reconoce la habitación ni su mobiliario. Incumple la franja real de oficina reconocible exigida por la superficie y la aceptación B. |
| HUD exterior / STORY | match | Salida, libreta, enlace y estado quedan fuera de la pantalla simulada. two-programs-saved muestra dos programas y «Libreta actualizada»; session-only muestra «Solo en esta sesión», sin afirmar guardado persistente. |
| Consulta inicial / STORY | contradicted | office-1280 muestra `;ew` y office-1920 `;e` al final del SELECT inicial, antes de ejecutar. El coordinador informa la corrección de KeyE y de la prueba que insertaba W; las capturas actuales todavía no acreditan el resultado corregido. |
| Nota y móvil / FORM | adaptation | mobile-390 usa una sola ventana maximizada y controles ampliados; mobile-note recupera nota, los cuatro accesos y barra. Adaptación exigida expresamente por la dirección de superficie y el recorrido B a 390×844. |
| Alternativa sin WebGL / FORM | adaptation | flat-no-webgl conserva marco, programas, nota, tareas y controles sobre el acceso plano. Es la alternativa de accesibilidad fijada por PRODUCT y la aceptación B. |
| Trabajo y fuentes / STORY | match | two-programs-saved conserva los inspectores de lectura y transferencia, sus referencias y campos «No aportado»; la transferencia mantiene contenido no clasificado. session-only mantiene la conclusión como elección explícita y no convierte el informe en aprobación académica. |
| Entrada, foco y continuidad / FORM | match | El código muestreado integra ComputerDesktop solo para B, navega a libreta/TI desde el coordinador y conserva el estado de escritorio. Los E2E aportados verifican foco, inmovilidad, retorno, autosave y restauración; su ejecución se toma del resultado comunicado, no de esta revisión visual. |

El craft floor no añade otra corrección material en estas capturas. «Asuntos del puesto» funciona como asa de la nota, no como un kicker decorativo. Biseles, símbolos de control, tamaños y gradientes Luna pertenecen al mundo confirmado; los avisos advisory del detector contra el sidecar antiguo no justifican rediseñarlos.

## ceiling

El escritorio utiliza los dispositivos nativos pactados: jerarquía activa/inactiva, controles Luna, Inicio verde, iconos de época, tareas, nota y densidad de herramienta. La integración todavía deja sin cumplir el dispositivo espacial de una PC dentro de una oficina reconocible. A/C/D/E/F y el monitor junto al rack pertenecen a etapa 3 y quedan fuera del veredicto.

## material_fixes

1. FIRST VIEWPORT / aceptación B: dar a la sesión física de B un encuadre temporal suficientemente amplio para que la franja exterior muestre habitación o mobiliario reconocible; mantener la cámara quieta y restaurar exactamente la pose del visitante al salir, sin persistir ese encuadre ni modificar la reconstrucción. Regenerar las capturas físicas en sus mismas rutas y comprobar 1280×720 y 1920×1080.
2. STORY / entrada física: acreditar la corrección de KeyE con SELECT inicial intacto y regenerar office-1280.png y office-1920.png; la prueba de inmovilidad debe mantener su foco fuera del editor. Las capturas con `;e`/`;ew` no prueban el estado corregido.

## keep

Conservar Luna/Tahoma/iconos y fondo Professional, dos aplicaciones independientes, nota recuperable, HUD exterior y la separación entre fuentes, campos ausentes y conclusiones elegidas por el jugador.

## verdict

- Oficina reconocible: **partial**. Se reabrieron con `view_image` office-1280.png, office-1920.png y two-programs-saved.png regeneradas. La cámara amplia sustituye los monitores físicos sobredimensionados por una perspectiva coherente, pero la franja de 24 px lateral y 30 px vertical a 1280 solo deja recortes de pared, zócalo y suelo; no permite reconocer habitación ni mobiliario. El cambio de pose mecánico no termina de resolver la promesa visual.
- SELECT inicial intacto: **resolved**. office-1280.png y office-1920.png muestran el SELECT terminando en `ORDER BY fecha, hora;`, sin `e` ni `w` insertadas. Las dos ventanas y el HUD continúan visibles en two-programs-saved.png.
- Regresiones visibles introducidas por estas correcciones: ninguna en las tres capturas revisadas.

## remaining

Sigue abierta únicamente la oficina reconocible. Punto de partida concreto para escritorio: ancho `min(calc(100vw - 192px), 1600px)` y alto `calc(100dvh - 128px)`, conservando la regla móvil actual. Deja 96 px laterales y 64 px verticales a 1280×720, y 160 px laterales a 1920×1080. La pantalla conserva aproximadamente 1068 px útiles de ancho a 1280, suficiente para el régimen de varias ventanas y la nota; el gestor debe mantener títulos, tareas y acciones dentro del monitor. Volver a capturar las mismas tres rutas y comprobar visualmente que la franja muestra mobiliario o distribución reconocible, sin dar por suficiente el margen solo por su medida. Se conserva la exigencia de restaurar la pose exacta y no persistir el encuadre temporal. La batería final comunicada sigue en ejecución y no se declara pasada aquí.

disposition: fix
