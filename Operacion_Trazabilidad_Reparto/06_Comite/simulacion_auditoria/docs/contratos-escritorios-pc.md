# Contratos y reparto de escritorios · etapa 0

Estado: contratos publicados el 5 de noviembre de 2026. Alcance ejecutado: preparación de recursos, tipos y documentación. El escritorio, el autosave y la integración de escena se implementan en las etapas siguientes del [plan](plan-escritorios-pc.md).

Actualización de etapa 1: escritorio, workspace/progreso/puente y aplicaciones B/comunes implementados y probados de forma aislada; [evidencias y traspaso](../artifacts/desktop-stage1/README.md). Las referencias a entregas futuras que siguen describen el reparto original. Registro/entrada desde el juego y escena conservan sus etapas 2/3.

## Decisiones que reciben todos los propietarios

Windows XP Luna azul fiel en A/B/C/D/F; Server clásico en E. Monitor HTML grande, con bisel y oficina visible. Libreta automática con confirmación real fuera de la pantalla simulada. Monitor físico junto al rack E. Se conservan los textos actuales de pantallas lejanas. B tiene dos monitores físicos y un solo espacio de trabajo `sql_red`.

No hay un segundo modelo de progreso: `Assessment`, `SourceRef`, `currentSourceVersion()`, `sameSourceRef()` y `evaluateReview()` siguen siendo la autoridad. La partida académica conserva `schemaVersion: 2` y la clave `rednova.auditoria.oficina.v2`. El contrato de escritorio usa su propio `schemaVersion: 1` y la clave fijada `rednova.computers.workspace.v1`.

Los tipos públicos están en [`src/computer/types.ts`](../src/computer/types.ts). Se importan con `import type` salvo futuros valores de implementación. Las rutas indicadas a continuación son contratos de entrega; solo `types.ts` y el mapa de assets existen al cerrar esta etapa.

## Propiedad de archivos

Un propietario por archivo. Estos nombres designan roles de las futuras etapas, no agentes ya iniciados. Ninguna etapa posterior se ejecutó como parte de la etapa 0.

| Propietario | Archivos reservados | Entrega / dependencia |
| --- | --- | --- |
| Coordinador | `src/computer/types.ts`, `src/data/computerAssets.ts`, `public/computers/**`, `public/models/rack-monitor/**`, `vitest.config.ts`, documentos de esta etapa | Mantiene contratos, claves y recursos. Revisa cualquier cambio compartido antes de incorporarlo |
| Escritorio · etapa 1 | `src/ui/desktop/**`, `src/desktop.css`, `tests/desktop.test.ts` | Consume `ComputerDefinition`, `ApplicationRegistry`, `ApplicationContext`, workspace y eventos de guardado |
| Estado y contenido · etapa 1 | `src/data/computers.ts`, `src/computer/workspace.ts`, `taskProgress.ts`, `reviewBridge.ts`, `src/audit/store.ts`; `tests/workspace.test.ts`, `taskProgress.test.ts`, `reviewBridge.test.ts`, `store.test.ts` | Conserva reglas/evaluación; publica espacio por PC, puente y señal real de persistencia |
| Aplicaciones B · etapa 1 | `src/ui/apps/QueryStudio.ts`, `NetworkMonitor.ts`, `RecordViewer.ts`, `RecordComparison.ts`, `StationReport.ts`, `LocalDossier.ts`, `src/ui/ReviewPanel.ts`; `tests/computer-apps.test.ts` | Propietario exclusivo del visor, comparación, informe y expediente compartidos. Otros agentes los reutilizan o solicitan cambios |
| Coordinador · etapa 2 | `src/main.ts`, `src/ui/ComputerPanel.ts`, `src/computer/registry.ts`, importaciones CSS | Integra B y registra exclusivamente programas instalados. Conserva movimiento/foco y navegación |
| Aplicaciones A/D · etapa 3 | `src/ui/apps/SessionViewer.ts`, `AccountDirectory.ts`, `EventDesk.ts`, `TimeTracker.ts` | Reutiliza visor/comparación; no cambia archivos compartidos por su cuenta |
| Aplicaciones C/E/F · etapa 3 | `src/ui/apps/OrderHistory.ts`, `ChangeManager.ts`, `RecoveryConsole.ts`, `BackupManager.ts`, `FileExplorer.ts`, `ClockComparator.ts` | Respeta datos ausentes, declaraciones y tema Server |
| Escena · etapa 3 | `src/scene/OfficeScene.ts`, `src/scene/screens.ts`, pruebas de acceso físico acordadas con verificación | Monitor `respaldos` accesible; no altera reconstrucción ni añade texturas actualizadas por fotograma |
| Verificación · etapa 4 | `tests/e2e/**`, capturas e informe de aceptación; `tests/computer-assets.test.mjs` tras el traspaso de etapa 0 | Revisa seis PCs, persistencia, accesibilidad, recursos y fallos reales |

El coordinador conserva `src/data/investigation.ts`, `src/investigation/query.ts`, `src/audit/types.ts`, `rules.ts` y `evaluate.ts`: se reutilizan. Una necesidad de cambio se comunica con archivo, razón y efecto en compatibilidad. La reserva de pruebas de etapa 1 también comprende archivos nuevos bajo sus nombres propios; las pruebas existentes no cambian de propietario por importarlas.

## Identificadores e instalaciones

`ComputerDefinition` declara estación/revisión, programas instalados, accesos, ventanas iniciales y asuntos. Tema/fondo se resuelven por `stationId` en `computerAssets.stations`, sin otra tabla de asignaciones. Cada programa declara un `ComputerIconKey`, resuelto en `computerIcons.xp` o `computerIcons.classic` según tema; la familia clásica solo contiene los roles utilizados por E y los comunes. Un programa instalado debe tener icono en su familia.

| Estación / revisión | AppId → nombre → clave de icono | Ventanas iniciales |
| --- | --- | --- |
| `accesos` / AU-01 | `session-viewer` → Visor de sesiones → `sessions`; `account-directory` → Directorio de cuentas → `directory` | Visor de sesiones |
| `sql_red` / AU-02 | `query-studio` → Query Studio → `query`; `network-monitor` → Monitor de red → `network` | Ambos; Query Studio activo |
| `crm_cambios` / AU-03 | `order-history` → CRM · Historial de órdenes → `orders`; `change-manager` → Gestor de cambios → `changes` | CRM |
| `siem` / AU-04 | `event-desk` → Event Desk → `events`; `time-tracker` → Visor de seguimiento y relojes → `time` | Event Desk |
| `respaldos` / AU-05 | `recovery-console` → Recovery Console → `recovery`; `backup-manager` → Gestor de respaldos → `backup` | Recovery Console, Server clásico |
| `mesa_auditor` / AU-06 | `file-explorer` → Explorador del expediente → `explorer`; `clock-comparator` → Comparador de relojes → `time` | Explorador |
| Todas, ligadas a su propia revisión | `station-report` → Informe del puesto → `report`; `local-dossier` → Expediente local → `folder` | Cerradas; accesos e Inicio disponibles |

`local-dossier` es un visor del material del puesto, distinto de la exploración de custodia de F. En ambos, las declaraciones solo aparecen después de obtenerlas por el enlace de TI. La presencia de `DECL-07` en listas antiguas de E no autoriza mostrarla anticipadamente. Usar el conjunto permitido del puesto y las declaraciones obtenidas, no simplemente recorrer todo el canon.

## Aplicaciones, montaje y registro

`ApplicationDefinition<A>` fija `id`, `title`, `icon`, `minSize` y `mount(container, context)`. El contenedor pertenece a una ventana. `ApplicationContext<A>` proporciona estación/revisión, AuditStore, borrador tipado, puente y navegación. La instancia devuelve `focus()`, `flush()` y `dispose()`.

Montar una vez al abrir; activar/minimizar/maximizar conservan el DOM montado. Cerrar llama primero a `flush()` y luego a `dispose()`, eliminando listeners/suscripciones/timers sin borrar borradores. Reabrir monta con el borrador existente. Salir o abrir libreta/entrevista vacía todos los cambios antes de ocultar o desmontar; la aplicación no controla el diálogo exterior. Las suscripciones actualizan regiones afectadas, sin reemplazar todo el escritorio ni perder selección o foco.

`src/computer/registry.ts` exportará `applicationRegistry: ApplicationRegistry` y `getInstalledApplication<A extends AppId>(computer: ComputerDefinition, appId: A): ApplicationDefinition<A> | null`. Devuelve `null` si falta el registro o la instalación; no se monta un programa de otra PC. En la primera integración solo se registran programas B y comunes implementados; no se ofrecen accesos sin función.

## Workspace y persistencia

`src/computer/workspace.ts` exportará `WORKSPACE_STORAGE_KEY`, `restoreWorkspace(raw: string | null, computers: readonly ComputerDefinition[]): WorkspaceState` y `WorkspaceStore`. Métodos públicos fijados:

```ts
constructor(computers: readonly ComputerDefinition[])
getStation(stationId: StationId): Readonly<StationWorkspace>
forApp<A extends AppId>(stationId: StationId, appId: A): ApplicationWorkspace<A>
openApp(stationId: StationId, appId: AppId): void
closeApp(stationId: StationId, appId: AppId): void
activateApp(stationId: StationId, appId: AppId): void
minimizeApp(stationId: StationId, appId: AppId): void
toggleMaximize(stationId: StationId, appId: AppId): void
setBounds(stationId: StationId, appId: AppId, bounds: Bounds): void
showDesktop(stationId: StationId): void
setNote(stationId: StationId, patch: Partial<StationWorkspace['note']>): void
setPendingCheck(stationId: StationId, checkId: string, draft: PendingCheck | null): void
constrain(stationId: StationId, area: { width: number; height: number }): void
subscribe(listener: () => void): () => void
subscribePersistence(listener: (event: PersistenceEvent) => void): () => void
flush(): void
reset(): void
dispose(): void
```

`windowOrder` va de atrás hacia delante y solo contiene ventanas abiertas sin duplicados. `activeAppId` es nulo o una ventana abierta y visible. `openApp` recupera la instancia existente. `showDesktop` minimiza las ventanas conservando sus modos; la barra de tareas permite restaurarlas. La maximización conserva `bounds` normales; minimizar una maximizada no pierde su modo. La adaptación móvil es una proyección de la disposición, no una escritura destructiva de toda la geometría de escritorio.

La restauración valida versión, estaciones, instalaciones, campos y números finitos; descarta entradas desconocidas y recupera la disposición inicial de una PC inválida, conservando las demás válidas. `constrain()` aplica mínimos efectivos limitados por el viewport y hace accesibles títulos, controles y nota; descuenta la barra de tareas. Se ejecuta al restaurar y cambiar tamaño. Una ventana cerrada conserva su borrador. Las dos apps de B comparten `comparisonSourceIds` (máximo dos fuentes permitidas), aislados de las otras PCs.

No se serializan nodos, listeners, resultados SQL, evaluaciones ni copias de Assessment. `query` conserva el editor y `lastExecutedQuery` la última consulta efectivamente ejecutada; si el editor cambia e invalida el resultado, se vacía `lastExecutedQuery`. Al restaurar se ejecuta el motor local para reconstruir resultados vigentes sin inspeccionar/vincular filas. La selección restaurada tampoco concede una inspección. Los borradores, texto libre y geometría se agrupan durante 300 ms; cada salida/cambio de ventana y `pagehide` llama a `flush()`. El evento `input` alimenta el borrador antes de esperar el debounce.

Reiniciar llama a `AuditStore.reset()` y `WorkspaceStore.reset()` desde la misma acción del coordinador, vaciando timers y ambos guardados. Cada almacén tolera almacenamiento bloqueado conservando la sesión. Un fallo de workspace no borra ni reversiona la auditoría.

## Puente académico y señal de guardado

`createReviewBridge(store: AuditStore, workspace: WorkspaceStore, stationId: StationId): ReviewBridge` se exportará desde `reviewBridge.ts`. `getAssessment()` lee el mismo Assessment que la libreta; `getEvaluation()` llama a `evaluateReview()`. Las apps leen AuditStore para datos y suscripciones, pero registran trabajo por este puente.

Ampliación coordinada de etapa 1: `getPendingCheck(checkId: string): Readonly<PendingCheck> | null` lee la elección pendiente de workspace para restaurar los controles de las aplicaciones. No crea otra respuesta ni cambia el Assessment.

`inspect()` valida pertenencia/disponibilidad y llama a `store.inspect()`. Abrir realmente un registro inspecciona; una tabla de resultados, una pista de la nota, restaurar estado o abrir una aplicación no lo hacen. `useSource()` registra inspección y vínculo mediante `inspect()`/`pin()` para una fuente pertinente que el jugador elige como sustento. No añade fuentes de contexto a grupos ajenos.

`answerCheck()` recibe la elección explícita y sus fuentes. Usa las reglas actuales para comprobar grupos y las referencias vigentes/inspeccionadas antes de llamar a `store.answerCheck()`. Si falta un grupo, guarda `PendingCheck` en workspace y devuelve `status: 'draft'` con grupos faltantes y explicación; una selección inválida o una fuente no disponible produce un error y no concede trabajo. Cuando el jugador aporta el sustento faltante se reintenta su elección pendiente, sin escoger otra respuesta. La restauración no registra comprobaciones por sí sola. Si se retira o cambia una fuente de un contraste ya registrado, `evaluateReview()` lo invalida; no se vinculan fuentes de reemplazo automáticamente.

Conclusión, límites, solicitudes y nota usan las mutaciones actuales. Solo `setFreeNote()` agrupa escritura; el texto permanece en memoria y `flush()` completa la mutación pendiente antes de navegar. `station-report` y la libreta comparten estos datos, sin otro botón para guardar ni otra conclusión persistida. Deseleccionar un sustento desde libreta conserva la trazabilidad de la respuesta anterior y actualiza los estados derivados.

`AuditStore` añadirá `subscribePersistence(listener: (event: PersistenceEvent) => void): () => void` y `notifyPending(change: PersistenceChange, reviewId?: ReviewId): void` sin cambiar `subscribe()` ni la forma del guardado v2. `notifyPending()` solo comunica espera, no muta respuestas ni afirma persistencia; permite al puente avisar durante el debounce de texto. La señal `pending` precede al intento, `saved` solo se emite después de `localStorage.setItem()` exitoso, y `session-only` se emite si falla. La revisión es un contador por almacén para asociar intentos/avisos y evitar confirmaciones atrasadas. Restaurar datos no anuncia un guardado. El commit académico confirma el resultado real. Reset comunica también el fallo de borrado si ocurre.

El HUD usa `domain` y `change`: inspección/vínculo/contraste/nota → «Libreta actualizada»; conclusión → «Conclusión guardada»; fallo → «Solo en esta sesión»; espera → «Guardado pendiente». Agrupa avisos de cambios cercanos y usa una región `aria-live="polite"`. Pose, ajustes, geometría y borradores de SQL no anuncian conclusiones ni avance; los errores de persistencia permanecen visibles discretamente. El HUD está en la misma capa superior del diálogo, fuera de la pantalla del monitor.

## Progreso de la nota

`taskProgress.ts` exportará `deriveTaskProgress(computer: ComputerDefinition, state: GameState): TaskProgress[]`. Es una función pura: no llama a mutaciones ni guarda resultados. `inspected` exige referencias de versión actual, con `any`/`all` explícito; `linked` exige fuentes actuales e inspeccionadas en todos los grupos declarados; `check-recorded` exige respuesta admitida con sustento vigente y todavía vinculado. Registrar un contraste no afirma que su respuesta sea la aceptada. Solo `evaluateReview()` decide «Documentado», sin un booleano adicional en workspace.

Para B se fijan `b-lectura` (inspección de E-03 o EVT-04), `b-contraste` (C02-CONTENIDO registrado con fuentes válidas) y `b-seguridad` (inspección obtenida de DECL-05). Sus pistas nombran Query Studio, Monitor de red y enlace de TI respectivamente. No incluyen SQL resuelto ni respuesta académica. La tarea de contraste puede reflejar trabajo registrado y la evaluación seguir pendiente.

## Recursos publicados y traspaso

[`src/data/computerAssets.ts`](../src/data/computerAssets.ts) fija URLs, temas, fuentes, branding, roles/variantes de iconos y nodo/material del monitor. [`public/computers/CREDITS.md`](../public/computers/CREDITS.md) registra originales, entradas de ZIP, destinos y licencia; [`manifest.json`](../public/computers/manifest.json) permite cotejar las copias por hash contra el inventario. No se copian sonidos ni recursos opcionales.

El escritorio carga TahomaXP 400 y 700 localmente con `@font-face` dentro de `src/desktop.css`; la familia se limita a `.computer-desktop`. `font-synthesis: none` evita fabricar negrita. Las variantes PNG de los iconos son fotogramas nativos: 16 px en barras/menús, 32 px en accesos y 48 px solo cuando exista esa variante. Referencias y criterios de composición: [dirección de diseño](../.impeccable/surfaces/computer-desktop.md). No hay fuentes/CDN ni dependencias nuevas.

La etapa 1 puede partir de estos contratos. Su aceptación no se presupone: la primera integración debe superar el [recorrido B](aceptacion-pc-b.md) antes de extender los demás puestos.
