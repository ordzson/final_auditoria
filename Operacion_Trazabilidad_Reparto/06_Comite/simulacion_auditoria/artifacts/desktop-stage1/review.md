# Revisión inicial

disposition: fix

Entradas no aportadas: tarjeta QUALITY BAR independiente y petición original completa; se usaron el encargo del coordinador, el plan, el contrato y la dirección fijada. Revisión de código por muestreo; sin navegador propio ni repetición del detector. Construcción code-led, sin comp de decisión ni ronda de concepto; la dirección histórica confirmada prevalece.

## persistence

Pass en el alcance de etapa 1: existe `PRODUCT.md`; `DESIGN.md` y el brief identifican la nueva superficie y sus límites. La documentación final y la integración corresponden a etapas posteriores. El contrato global conserva `brief-v2-pinned`; no se exige generar un comp para esta dirección fijada. Las nueve capturas requeridas existen, son válidas y corresponden a sus estados: `xp-1280`, `xp-1920`, `xp-mobile`, `xp-mobile-note`, `server-1280`, `session-only`, `projector-1280`, `flat-1280` y `xp-touch`. La evidencia es un montaje de componentes sobre el juego real; no acredita integración de etapa 2. `browser-results.json` comunica ejecución satisfactoria, sin errores de página ni recursos fallidos.

## fidelity

| Elemento / promesa | Estado | Evidencia |
| --- | --- | --- |
| TYPE | match | TahomaXP local normal/negrita, títulos compactos y SQL monoespaciado; lectura ampliada en móvil/proyector. |
| MATERIAL | match | Fondos e iconos locales auténticos; relieve Luna y controles Server hechos con HTML/CSS, expresamente autorizados por el brief histórico. |
| GROUND | match | Azul XP Professional en B; camino otoñal y controles grises clásicos en E. La oficina conserva sus materiales propios. |
| THESIS | match | Programas independientes, nota orientadora e informe académico compartido. |
| OWN-WORLD | match | Inicio verde, barra azul, ventanas Luna, iconos de época; E utiliza su variante clásica. |
| STORY | match | Dos aplicaciones B coexistentes; SQL, comparación, contraste y conclusión automáticos cubiertos por la evidencia funcional aportada. |
| FIRST VIEWPORT | match | Monitor con bisel y oficina reconocible; Query Studio delante, red detrás y nota lateral. HUD exterior legible. |
| FORM / firma | contradicted | El DOM principal se conserva entre ventanas, pero la selección y el vínculo sustituyen nodos enfocados dentro de los programas; falta continuidad de teclado en el inspector y la lista. |
| Adaptación estrecha | adaptation | Una ventana maximizada, nota recuperable y controles de ventana de 44 px; exigencia explícita del brief. |
| Guardado académico | match | Assessment único; `saved` tras escritura real y captura de fallo con «Solo en esta sesión». Geometría no anuncia avance. |
| Verdad del expediente | match | Consultas identificadas como locales, NULL y procedencia conservados, declaraciones condicionadas y sin artefactos ausentes inventados. |

## ceiling

No se recibió una tarjeta QUALITY BAR independiente. En la dirección histórica fijada no se identifica un recurso visual nativo omitido que requiera rehacer o pulir la superficie. Se mantienen los controles compactos, gradientes/biseles de época y tipografía autorizada; los avisos mecánicos comunicados no justifican modernizarlos. El único incumplimiento material es funcional y de foco.

## material_fixes

1. **FORM / teclado — `src/ui/apps/RecordBrowser.ts:33-34` y `src/ui/apps/RecordViewer.ts:66-75`:** abrir una fila con Tab/Enter cambia la selección y sustituye `tbody`; «Usar como sustento» y «Comparar registro» también sustituyen el inspector completo, eliminando el botón enfocado sin restauración. Reproducir en Monitor de red/Expediente local abriendo EVT-04, vinculándolo y comparándolo mediante teclado; comprobar que `document.activeElement` nunca queda en `body`. Actualizar selección/estado sin sustituir controles existentes, o conservar un identificador del control activo y enfocar su equivalente tras el cambio; al abrir/cerrar detalle, dar un destino de foco explícito y útil. Confirmar el recorrido con teclado en el harness de etapa 1.

## keep

Conservar la fidelidad XP/Server, los recursos locales fijados, el monitor con oficina visible, las ventanas y borradores independientes y el Assessment único con confirmación real de persistencia; mantener fuera la integración de etapa 2.

---

# Veredicto final · corrección de foco

## verdict

1. **resolved — FORM / continuidad por teclado:** `RecordBrowser.refresh()` conserva las filas cuando solo cambia la selección y recupera el botón fuente si sustituye contenido; `RecordViewer.refresh()` restituye la acción equivalente, dirige «Usar como sustento» a «Comparar registro» cuando queda deshabilitada y devuelve el foco a la fila al cerrar. La comparación conserva un destino operable al retirar fuentes. El harness ejercita SQL y red con `focus()` + Enter y verifica mediante `toBeFocused()` la fila, comparación, vínculo y cierre. `browser-results.json` registra el recorrido satisfactorio, recarga real y navegación a libreta, sin errores de página ni recursos fallidos. Las mismas nueve capturas fueron reabiertas y son válidas; no muestran regresiones visuales de la corrección. El ship cubre exclusivamente la corrección de foco evaluada.

## remaining

clear. Sin regresiones identificadas en la corrección. El coordinador aclaró la petición original exacta («completa la fase 1 de 06_Comite/simulacion_auditoria/docs/plan-escritorios-pc.md») y confirmó que plan, contratos y brief fijan el QUALITY BAR; no corresponde generar una tarjeta ni un comp alternativos.

disposition: ship
