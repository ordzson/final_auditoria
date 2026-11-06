# Escritorios · entrega de etapa 1

Implementación del 5 de noviembre de 2026 según [el plan](../../docs/plan-escritorios-pc.md). Esta entrega reúne los tres roles de etapa 1; la navegación de producción todavía usa ComputerPanel. Las capturas se obtuvieron montando ComputerDesktop en un diálogo de prueba sobre la oficina real y su acceso plano. No certifican la entrada física ni el recorrido integrado de etapa 2.

## Entregas

- `src/ui/desktop/ComputerDesktop.ts`, `geometry.ts` y `src/desktop.css`: monitor con HUD exterior, XP Luna y Server clásico, Inicio, accesos, nota, barra de tareas y ventanas independientes. Abrir, activar, minimizar, maximizar/restaurar, cerrar, mover y redimensionar conservan el trabajo. Teclado para accesos, Inicio, nota y geometría; un toque abre en táctil, con botones de ventana de 44 px. La pantalla estrecha proyecta una ventana maximizada sin sobrescribir la geometría amplia.
- `src/data/computers.ts` y `src/computer/{workspace,taskProgress,reviewBridge}.ts`: programas/asuntos/pistas de seis PCs, persistencia v1 separada de auditoría v2, restauración defensiva, comparación por estación y progreso derivado. No hay progreso por abrir programas o desplegar pistas. Un contraste sin sustento queda pendiente; aportar el sustento registra esa misma elección, sin corregirla automáticamente.
- `src/audit/store.ts`: eventos `pending`, `saved` y `session-only` según el resultado real de almacenamiento. Texto agrupado durante 300 ms y vaciado antes de navegar o abandonar la página; la libreta y el informe comparten Assessment.
- `src/ui/apps/`: Query Studio, Monitor de red, Informe del puesto y Expediente local; visor, comparación, navegador de registros y estilos compartidos. Se reutiliza el intérprete SELECT; resultados y selección restaurados no inspeccionan filas. SQL inválido retira el resultado anterior. Se conservan NULL, referencias, fuentes contextuales y declaraciones obtenidas por el enlace.

La única ampliación de contrato público es `ReviewBridge.getPendingCheck()` para recuperar el borrador de contraste. No se modificaron canon, reglas de evaluación, motor SQL, fuentes originales ni escenas. Los programas temporales usados para comprobar el escritorio no forman parte de la entrega.

## Verificación

Desde `06_Comite/simulacion_auditoria/`:

```sh
pnpm test
pnpm build
pnpm test:desktop
pnpm test:e2e
```

- Unitarias: **99/99**, 12 archivos. Cubren geometría, instancia única y estado por PC, validación/restauración, reinicio, referencias retiradas, señales reales de guardado, debounce/flush y aplicaciones sin concesión automática de progreso.
- Build: aprobado. Vite mantiene el aviso previo de paquete principal mayor de 500 kB; los módulos nuevos se comprueban con TypeScript y se montan mediante Vite en la prueba aislada, pendientes de entrar al grafo de producción en etapa 2.
- Navegador de etapa 1: aprobado; [resultado estructurado](browser-results.json). Comprueba ciclo de vida con aplicaciones reales instrumentadas, SQL/red/contraste/conclusión, recuperación, escritorio/móvil, Touch API, proyector, modo plano y `Storage.setItem()` bloqueado. Cero errores JavaScript y cero recursos con respuesta HTTP de error en el recorrido principal.
- Pruebas E2E del juego actual: **18/18 aprobadas**. No se sustituyeron sus aserciones por pruebas del montaje aislado.
- Dos rondas de inspección agrupadas: la corrección intermedia añadió fondo sólido al HUD para conservar contraste sobre la barra existente y elevó los controles de ventana táctiles a 44 px.
- Revisión independiente: [informe y veredicto](review.md). La revisión inicial pidió corregir la pérdida de foco al recrear filas/controles de registro. Se conservan las filas seleccionadas y se repone un destino útil tras vincular, comparar, retirar o cerrar detalle. La prueba final con Enter y `toBeFocused()` pasó, junto con una recarga real y la navegación de libreta que vacía el texto pendiente. El revisor puntuó esa corrección **resolved**, con disposición **ship** al alcance de esa lista; reabrió y validó las nueve capturas regeneradas sin regresiones visuales.

El detector de Impeccable se ejecutó una vez. Señaló Tahoma, paleta y tamaños XP fuera del esquema anterior de DESIGN, y un borde de 3 px en el glifo de maximizar. Son rasgos fijados por la referencia XP/Server, no una razón para modernizar el escritorio. No se regeneró el metadato de diseño anterior como efecto lateral; la documentación global de integración corresponde a etapa 5.

## Capturas

| Evidencia | Alcance |
| --- | --- |
| [XP 1280×720](xp-1280.png) | Dos programas dentro del monitor, nota y HUD exterior; oficina visible en el margen |
| [XP 1920×1080](xp-1920.png) | Fondo propio, ventanas y contexto de oficina |
| [Móvil 390×844](xp-mobile.png) | Una ventana proyectada y cambio desde barra de tareas |
| [Nota en móvil](xp-mobile-note.png) | Mostrar escritorio recupera asuntos y accesos |
| [Server clásico](server-1280.png) | Componentes compartidos, iconos clásicos y fondo de E; informe común |
| [Solo en esta sesión](session-only.png) | Fallo real de almacenamiento comunicado fuera del monitor |
| [Proyector](projector-1280.png) | Texto y controles de aplicación ampliados |
| [Modo plano](flat-1280.png) | Mismo marco sobre el acceso plano existente |
| [Táctil](xp-touch.png) | Monitor de red abierto con un toque; controles de 44 px |

## Traspaso a etapa 2

`new ComputerDesktop(host, { computer, registry, store, workspace, navigation })` recibe un host HTML, la definición del puesto, un registro de aplicaciones y los almacenes compartidos. `navigation` proporciona `openNotebook()`, `openInterview()` y `exitToOffice()`; `openApp()` lo resuelve el escritorio. El montaje crea su propio ReviewBridge y lo libera en `dispose()`. `focus()`, `flush()` y `dispose()` son públicos. Si el host es un diálogo, usar la clase `computer-dialog` y su apertura/cierre modal desde el coordinador. Solo se ofrecen accesos registrados e instalados.

Exports listos: `computers`, `getComputer()`, `WorkspaceStore`, `deriveTaskProgress()`, `createReviewBridge()`, `queryStudio`, `networkMonitor`, `stationReport` y `localDossier`. Los helpers `RecordViewer`, `RecordComparison` y `mountRecordBrowser` quedan disponibles para las aplicaciones posteriores.

La etapa 2 debe conectar `main.ts`, el adaptador ComputerPanel y `computer/registry.ts`, compartir AuditStore con libreta/entrevista, detener movimiento y mantener la cámara quieta. Debe llamar a `flush()` antes de ocultar el escritorio, liberar el montaje al cerrar definitivamente y ejecutar `AuditStore.reset()` y `WorkspaceStore.reset()` desde la misma acción de reinicio. El monitor físico de E y las aplicaciones A/C/D/E/F siguen en etapa 3. El recorrido integrado B y su captura final siguen pendientes.
