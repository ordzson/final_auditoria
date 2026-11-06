# Primera PC integrada · B: SQL y red

Entrega del 5 de noviembre de 2026 según [el plan](../../docs/plan-escritorios-pc.md), [el recorrido de aceptación B](../../docs/aceptacion-pc-b.md) y [la dirección de superficie](../../.impeccable/surfaces/computer-desktop.md). **Etapa 2 completada y aceptada dentro del alcance B.** `pnpm verify` terminó con código 0: 99 unitarias, TypeScript/Vite y 23 E2E aprobadas. La [revisión independiente](review.md) confirmó las dos correcciones materiales con disposición `ship`, limitada a esas correcciones.

Este informe documenta la entrada de producción de B. El [informe de etapa 1](../desktop-stage1/README.md) conserva las pruebas y capturas históricas del montaje aislado; la cobertura de las seis PCs y la actualización global del sistema siguen pendientes.

## Alcance conectado

- **Entrada y programas.** Solo B (`sql_red`, AU-02) abre `ComputerDesktop`, tanto al pulsar E ante el equipo como desde el acceso plano. El [registro de producción](../../src/computer/registry.ts) ofrece Query Studio, Monitor de red, Informe del puesto y Expediente local. Query Studio arranca activo con Monitor de red abierto detrás. A/C/D/E/F conservan `ComputerPanel`.
- **Continuidad de la investigación.** [App](../../src/main.ts) conserva un único `WorkspaceStore` durante la sesión. Los borradores, consulta, selección, comparación, ventanas, nota y desplazamiento utilizan `rednova.computers.workspace.v1`, separado de `rednova.auditoria.oficina.v2`. Volver de la libreta/TI, salir y reabrir o recargar recupera el trabajo válido. Reiniciar desde la tablita limpia ambos almacenes.
- **Libreta, enlace y fuentes.** «Libreta» en el HUD abre la ficha de B en `ReviewPanel`, que comparte el Assessment con Informe del puesto. «Enlace de TI» pasa por la interacción del juego y entrega la tablita si aún corresponde. Cerrar o pulsar Esc en las superficies auxiliares regresa al escritorio; el acceso de contraste desde un documento abre la PC correspondiente. La navegación vacía el texto pendiente antes de desmontar.
- **Diálogo y foco.** Al reutilizar el diálogo se limpian las propiedades de eventos heredadas; un evento `close` asíncrono de la vista anterior no destruye el nuevo panel. Tab y Shift+Tab quedan contenidos en el diálogo. E consume su acción física antes de enfocar el editor, evitando añadir una `e` a la consulta.
- **Presentación y persistencia.** El CSS anterior queda bajo `legacy-computer-dialog`; el escritorio usa un diálogo centrado de tamaño `fit-content`. La sesión reserva 192 px horizontales y 128 px verticales respecto al viewport, con ancho máximo de 1600 px; en móvil conserva márgenes totales de 12 px y 20 px. El HUD mantiene el fallo real de almacenamiento entre montajes y muestra «Solo en esta sesión», sin repetir avisos académicos antiguos. La geometría de la ventana se aplica antes de montar su aplicación para restaurar el desplazamiento con dimensiones reales.
- **Oficina.** [OfficeScene](../../src/scene/OfficeScene.ts) utiliza temporalmente el encuadre amplio `anchors.general` al abrir B, conserva posición y quaternion de la cámara y los restaura al salir. Ese encuadre no se guarda como pose del visitante. Se conservan los textos de los monitores, los modelos y la reconstrucción.

No cambia el canon, el intérprete SELECT ni las reglas de evaluación. La nota orienta sin inspeccionar fuentes ni conceder progreso; ejecutar una consulta no inspecciona todas sus filas. Un contraste sin los grupos de fuentes exigidos queda como borrador. Aportar sustento registra la elección del jugador, sin corregirla automáticamente. Retirarlo desde la libreta actualiza contraste, nota y evaluación. «Documentado» conserva su significado educativo y sus límites.

## Reproducción y verificación

Desde `06_Comite/simulacion_auditoria/`, con Node.js y pnpm según el README del proyecto:

```sh
pnpm test
pnpm build
pnpm test:e2e tests/e2e/desktop-b.spec.ts
pnpm verify
```

`pnpm verify` ejecuta unitarias, TypeScript/Vite y toda la batería E2E en ese orden. Playwright inicia o reutiliza Vite en `http://127.0.0.1:4173`; usa Chrome local o `CHROME_PATH`. La suite B prepara una partida académica v2, entra mediante los controles reales y genera las siete capturas de este directorio. El estado previo se conserva dentro de cada recorrido para comprobar recarga y navegación. No hacen falta servicios remotos nuevos.

| Validación | Estado registrado |
| --- | --- |
| Pruebas unitarias | **99/99 aprobadas**, en 12 archivos |
| TypeScript y Vite | **Aprobados**; aviso no bloqueante de chunk principal mayor de 500 kB: 793.85 kB, 213.81 kB gzip |
| Recorrido B | **5/5 E2E aprobadas**, incluidas en la batería completa |
| Batería completa | **`pnpm verify` aprobado**, código 0; **23/23 E2E**, en 2.6 minutos |
| Revisión visual independiente | Oficina reconocible y SELECT intacto: **resolved**; disposición **ship**, limitada a ambas correcciones |

La batería final se ejecutó después de las correcciones y regeneró las siete capturas. Tras el veredicto visual no hubo cambios de producto; el último ajuste afectó únicamente al cierre explícito de A en la automatización. La pasada documental no ejecutó navegador ni nuevas pruebas: registra el cierre comunicado por el coordinador.

## Cobertura de los recorridos

[desktop-b.spec.ts](../../tests/e2e/desktop-b.spec.ts) contiene cinco pruebas con los [helpers de escritorio](../../tests/e2e/desktop-helpers.ts):

1. **Físico 1280×720:** E, consulta inicial intacta, movimiento detenido, nota sin progreso, SELECT local con `NULL`, EVT-04/EVT-05, comparación, borrador de contraste, entrega de tablita/TI, DECL-05 como sustento, contraste, conclusión/límites/solicitud y última frase sin desenfocar antes de abrir la libreta. Comprueba la retirada de sustento, instancia única, minimizar/maximizar, Esc sobre Inicio, reapertura, pose conservada, recarga sin nuevas inspecciones y cambio a otra PC. Registra errores JavaScript y recursos HTTP fallidos.
2. **Físico 1920×1080:** marco y oficina en captura, retorno desde TI y foco contenido al recorrer controles con Tab.
3. **Táctil 390×844:** una ventana maximizada, «Mostrar escritorio», nota y apertura con un toque; última frase compartida con libreta, restauración tras recarga y retorno a geometría amplia sin desplazamiento horizontal del documento.
4. **Sin WebGL y fallo real de almacenamiento:** marco y programas sobre acceso plano, `Storage.setItem()` bloqueado, conclusión utilizable en memoria y aviso «Solo en esta sesión» conservado al volver de la libreta.
5. **Reinicio:** acción real desde la tablita, regreso al inicio y eliminación del workspace guardado.

Las suites existentes [acceptance](../../tests/e2e/acceptance.spec.ts), [investigation](../../tests/e2e/investigation.spec.ts) y [office](../../tests/e2e/office.spec.ts) adaptan su navegación a B sin retirar las comprobaciones académicas de fuentes, trazabilidad y revisiones. Las pruebas de estado, geometría, puente y apps de etapa 1 conservan cobertura de datos inválidos, aislamiento, reinicio y fuentes retiradas.

## Evidencia visual

La batería final regeneró estas siete capturas. La revisión independiente confirmó las capturas físicas corregidas a 1280×720 y 1920×1080.

| Captura | Tamaño | Evidencia |
| --- | --- | --- |
| [office-1280.png](office-1280.png) | 1280×720 | Entrada física, dos programas, nota, bisel y oficina |
| [office-1920.png](office-1920.png) | 1920×1080 | Entrada física y proporción de escritorio/oficina |
| [two-programs-saved.png](two-programs-saved.png) | 1280×720 | Lectura y transferencia, dos programas y confirmación exterior «Libreta actualizada» |
| [mobile-390.png](mobile-390.png) | 390×844 | Aplicación única maximizada, barra y HUD accesibles |
| [mobile-note.png](mobile-note.png) | 390×844 | Nota recuperada, orientación y cuatro accesos |
| [flat-no-webgl.png](flat-no-webgl.png) | 1280×720 | Misma PC sobre alternativa plana sin WebGL |
| [session-only.png](session-only.png) | 1280×720 | Informe y fallo real de guardado comunicado fuera del monitor |

La [revisión independiente](review.md) confirmó las dos correcciones finales: el encuadre temporal amplio y los márgenes dejan reconocer mobiliario, paredes, suelo y pasillo sin perder nota, títulos, tareas ni HUD; `preventDefault()` en E conserva el SELECT inicial intacto. Ambos puntos quedaron **resolved**, sin regresiones visibles en las tres capturas físicas revisadas y con disposición **ship** limitada a esas correcciones. El [informe inicial](review-initial.md) conserva el historial de revisión; las evidencias de etapas anteriores permanecen intactas.

## Pendientes y límites

- Implementar y conectar los programas específicos de A/C/D/E/F y el monitor físico junto al rack en etapa 3. La preparación de assets y el tema Server de etapa 1 no acreditan esa integración.
- Completar la revisión de seis puestos y la entrega de etapas 4–5; actualizar entonces PRODUCT, el sistema global DESIGN/sidecar y los recorridos/grabaciones afectados. Los vídeos anteriores no se regeneraron para esta entrega B.
- No se acredita un ensayo físico con proyector ni una validación con estudiantes/docente. La evidencia de proyector de etapa 1 corresponde al montaje aislado.
- El detector reportó avisos advisory por paleta/escala heredadas y rasgos XP frente al sidecar anterior. Se conserva la estética aprobada. El sidecar desfasado y la configuración sin `buildPath` ya eran pendientes; no se reparan ni se convierten en nuevas reglas del sistema en esta fase.
