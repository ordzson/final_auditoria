# Plan de escritorios e investigaciones por computadora

Estado al 5 de noviembre de 2026: **etapas 0–3 completadas; etapas 4 y 5 pendientes**. La etapa 2 quedó aceptada dentro del alcance B según [aceptacion-pc-b.md](aceptacion-pc-b.md) y su [informe integrado](../artifacts/desktop-b/README.md). La etapa 3 incorpora las diez aplicaciones específicas de A/C/D/E/F, extiende ComputerDesktop a las seis computadoras desde E y el acceso plano, e integra el monitor Server junto al rack. Los contrastes y conclusiones siguen usando el puente académico y la libreta compartida; Recovery Console no ejecuta restauraciones y Custodia/Relojes conservan los datos ausentes. `pnpm verify` cerró con 99 unitarias, TypeScript/Vite y 30 E2E aprobadas. Las ocho capturas de [etapa 3](../artifacts/desktop-stage3/) cubren los cinco puestos ampliados, Recovery móvil, el rack y Server. Contratos y reparto: [contratos-escritorios-pc.md](contratos-escritorios-pc.md). El diagnóstico inicial y las entregas anteriores se conservan como historial; la revisión independiente final y la entrega global corresponden a las etapas 4–5.

Assets fijados para esta implementación: **leer [assets-pcs.md](assets-pcs.md)** antes de repartir trabajo. Ese documento asigna un fondo distinto a cada PC y fija fuentes, iconos, referencias, modelo de monitor y rutas de preparación. Consultar [inventario-assets.md](inventario-assets.md) y su [índice completo en JSON](inventario-assets.json) para localizar originales y verificar metadatos. Los originales permanecen intactos en `/home/ordson/final auditoria/assets`; las seis computadoras consumen en producción los fondos, Tahoma e iconos locales, y el puesto E utiliza el modelo local de monitor preparado para el rack.

## Objetivo y experiencia

Cada puesto debe sentirse como una computadora con un escritorio muy fiel a Windows XP: fondo, accesos directos, Inicio, barra de tareas, programas abiertos y ventanas independientes. El escritorio aparece dentro de un marco de monitor grande, dejando visible el contexto de la oficina. La consola junto al rack utiliza una variante de Windows Server de la misma época. La investigación ocurre usando los programas; conclusiones y progreso se guardan automáticamente en la libreta y un indicativo del juego confirma la actualización. Una nota adhesiva en el escritorio enumera los asuntos de ese puesto; pulsar un asunto revela una pista sobre dónde buscar, sin abrir el programa ni resolver la investigación automáticamente.

Recorrido esperado:

1. Acercarse al equipo y pulsar E, o elegirlo desde el acceso plano.
2. Acercar la vista a un monitor grande enmarcado, conservando una franja visible de la oficina; ver la nota y uno o dos programas ya abiertos, colocados para dejarla accesible.
3. Pulsar un asunto de la nota para obtener una orientación breve.
4. Abrir un programa desde su icono o recuperar una ventana desde la barra de tareas.
5. Buscar, consultar, inspeccionar y contrastar los registros disponibles.
6. Registrar contrastes y conclusiones desde las aplicaciones: se sincronizan con la libreta sin un segundo botón de guardar ni copiar resultados a mano. Un aviso fuera del monitor confirma la actualización.
7. Volver a la oficina y regresar después al mismo entorno de trabajo.

El jugador debe poder explorar libremente los programas instalados. La nota ayuda a orientarse y no impone un asistente secuencial.

## Decisiones confirmadas

| Decisión | Respuesta del usuario | Consecuencia |
| --- | --- | --- |
| Fidelidad visual | «Muy fiel» a Windows XP | Reproducir lenguaje visual, densidad y comportamiento de época; evitar apariencia de dashboard moderno |
| Fondos por equipo | Un fondo distinto por PC entre los aportados; se permite repetir si hace falta | Usar las seis asignaciones explícitas de [assets-pcs.md](assets-pcs.md), también para el escritorio Server |
| Entrada al equipo | Dentro de un marco de monitor, con la pantalla lo más grande posible y la oficina reconocible | Monitor HTML grande sobre una vista quieta de la oficina; bisel visible y margen de contexto, sin eliminar el espacio físico |
| Libreta y conclusiones | Conclusiones y progreso se guardan automáticamente; indicativo en la pantalla del juego | Investigar y registrar conclusiones dentro de programas; sincronizar con AuditStore y mostrar estado en el HUD, fuera de la pantalla simulada |
| Pantallas de equipos no utilizados | El texto actual está bien; escritorio permanente solo si es barato | Conservar el texto como alcance base. Una miniatura estática reutilizando CanvasTexture es una mejora opcional y posterior |
| Puesto de respaldos | Monitor al lado del rack, con Windows Server o sistema apropiado | Añadir monitor accesible junto al rack y usar una variante de tema clásico inspirada en Windows Server 2003, compartiendo el mismo motor de escritorio |

La petición ya fija: seis entornos propios, programas accesibles desde el escritorio, nota con asuntos del puesto y pistas al pulsarlos. Estas decisiones no necesitan volver a preguntarse.

Interpretación de implementación: «guardar automáticamente las conclusiones» significa persistir lo que el jugador concluye dentro de los programas, sin un paso adicional de guardado. Las acciones observables actualizan el progreso; abrir una ventana no elige una respuesta ni genera una conclusión académica. Esta interpretación mantiene la investigación como actividad del jugador.

## Diagnóstico del código existente

| Archivo o superficie | Situación actual | Trabajo necesario |
| --- | --- | --- |
| `src/main.ts`, `openStation()` | Crea directamente ComputerPanel en `#panel-dialog` | Abrir el escritorio del puesto y coordinar entrada, salida, libreta y entrevista |
| `src/ui/ComputerPanel.ts` | Un único programa por estación; las herramientas son vistas laterales | Separar contenido de investigación, aplicaciones y escritorio |
| `ComputerPanel.render()` | Sustituye todo el contenido del diálogo ante cambios del almacén | Mantener las ventanas montadas y actualizar solo las regiones afectadas |
| Mapa `desks` de ComputerPanel | Conserva vista, filtro, consulta y comparación en memoria | Estado independiente por equipo y por programa, con persistencia de los borradores |
| `src/data/investigation.ts` | Define seis puestos con dos vistas cada uno | Convertir las vistas adecuadas en programas; declarar instalaciones, asuntos y disposición inicial |
| `src/computer.css` | Estilo común de aplicación con tres columnas | Reemplazar el marco común por escritorio y ventanas; conservar las funciones útiles del contenido |
| `src/scene/OfficeScene.ts`, `showVisitScreens()` | Los monitores muestran texto de copia de revisión | Conservarlo como base; miniatura estática de escritorio opcional si no exige sincronización continua |
| `OfficeScene.createRack()` | El puesto E es un rack, sin monitor ni consola de PC | Añadir un monitor al lado, con aspecto de consola Windows Server e interacción física coherente |
| `src/audit/store.ts`, `evaluate.ts`, `rules.ts` | Fuentes, comprobaciones, conclusiones y progreso académico; commit ya intenta persistir cada cambio | Reutilizar como autoridad; añadir confirmación real del guardado para el HUD, sin otra evaluación |
| `src/ui/ReviewPanel.ts` | Contrastes y conclusiones en una libreta separada, con botón para registrar el contraste | Extraer controles reutilizables hacia aplicaciones del equipo y guardar sus cambios automáticamente |
| `src/main.ts`, `toast()` | Avisos generales del juego | Integrar un indicativo de libreta/guardado fuera de la pantalla del monitor, visible también mientras el diálogo esté abierto |
| Pruebas E2E y grabaciones | Esperan abrir directamente el programa y localizar controles globalmente | Actualizar los recorridos para pasar por el escritorio y localizar cada ventana |

Se inspeccionó también la captura existente `.impeccable/review/investigation/sql-desktop.png` y se contrastó con el componente y CSS actuales. El aspecto de diálogo con tres columnas confirma el problema descrito por el usuario.

## Computadoras y programas propuestos

Los nombres de aplicaciones son propuestas de presentación. Los datos siguen procediendo del expediente actual. Cada equipo instala las herramientas que necesita, y todos sus programas aparecen como accesos directos.

| Equipo | Programas del escritorio | Asuntos de la nota | Arranque propuesto |
| --- | --- | --- | --- |
| A · Accesos e identidad | Visor de sesiones; Directorio de cuentas | Revisar la sesión remota; contrastar permisos y solicitudes | Visor de sesiones abierto |
| B · SQL y red | Query Studio; Monitor de red | Investigar la lectura SQL; contrastarla con el tráfico saliente; obtener el contexto de Seguridad | Ambos abiertos, con Query Studio al frente |
| C · CRM y cambios | CRM · Historial de órdenes; Gestor de cambios | Revisar modificaciones; consultar el despliegue y el ticket; contrastar las declaraciones de BD y Desarrollo | CRM abierto |
| D · SIEM y tiempo | Event Desk; Visor de seguimiento y relojes | Revisar la alerta; reconstruir el seguimiento; comparar las horas disponibles | Event Desk abierto |
| E · Respaldo y recuperación | Recovery Console; Gestor de respaldos, en escritorio de servidor | Recorrer la recuperación; revisar el respaldo y sus pruebas; contrastar Continuidad | Recovery Console abierto, tema clásico de servidor |
| F · Custodia y archivo | Explorador del expediente; Comparador de relojes | Revisar originales y hashes; inspeccionar la procedencia; comprobar los campos temporales | Explorador abierto |

Cada escritorio incluye «Informe del puesto»: una aplicación con apariencia de editor de informes de época donde registrar la conclusión, los límites y las solicitudes. Los contrastes se realizan desde las herramientas correspondientes y aparecen en el informe. Los cambios de esta aplicación se guardan solos en la libreta; no obliga a salir de la PC para completar la investigación ni convierte el informe en la pantalla principal de todos los programas.

Cada escritorio puede incluir un acceso común a «Expediente local», limitado al material de ese puesto. Un visor de soportes compartido evita duplicar la lectura de documentos. El conjunto de fuentes del puesto debe seguir siendo accesible aunque cambie su distribución entre programas.

Los dos monitores físicos del equipo B representan una sola computadora: no crean partidas, notas ni instalaciones independientes. Pueden conservar sus textos actuales; no se requiere mostrar ventanas distintas en tiempo real.

## Marco de monitor y contexto de oficina

- Maximizar el área legible dentro de un bisel de monitor reconocible, con una franja de oficina visible alrededor. Evitar un borde decorativo enorme que reduzca el escritorio.
- Mantener la cámara quieta al investigar y conservar la vista de la oficina detrás del marco; reducir el oscurecimiento para que el espacio siga siendo identificable.
- Los controles de minimizar/maximizar afectan a las ventanas del sistema simulado, siempre dentro de la pantalla del monitor. Maximizar nunca elimina el bisel ni convierte la aplicación en la pantalla del juego.
- Situar salida, acceso a libreta e indicativo de guardado como controles del juego fuera del área de pantalla simulada. Reservarles espacio sin tapar el escritorio.
- El contenedor exterior puede seguir siendo un diálogo para contener el foco. Marco y HUD deben pertenecer a la misma capa superior: un toast normal detrás de un diálogo modal no satisface el requisito.
- En acceso plano y sin WebGL, mantener el marco y los mismos programas. En móvil el bisel se reduce al mínimo, priorizando lectura y acciones táctiles.
- Compartir geometría y lógica entre XP y Server; el tema de servidor cambia barras, controles y aspecto de consola mediante tokens, sin crear otro sistema de ventanas.

La mejora opcional de pantallas lejanas solo se acepta si usa el CanvasTexture existente y se dibuja una vez al entrar en visita o al cambiar una configuración relevante. No incluir capturas continuas del DOM, sincronización de cada ventana, texturas actualizadas por fotograma ni dependencias nuevas. Si hace falta algo de eso, conservar los textos actuales.

## Comportamiento del escritorio

- Ventanas con abrir, cerrar, activar, minimizar, maximizar y restaurar. Arrastre y redimensionado con límites dentro del área útil, sin tapar permanentemente la barra de tareas.
- Una instancia por programa y por PC. Abrir de nuevo un acceso recupera su ventana; no duplica consultas ni listeners.
- Barra de tareas que refleja las ventanas, incluida la minimizada. Inicio ofrece los programas instalados y una salida clara a la oficina. «Mostrar escritorio» permite recuperar la nota y los iconos.
- En escritorio: un clic selecciona el icono, doble clic o Enter abre el programa. En táctil: una acción abre. Los controles de ventana tienen nombres accesibles.
- El foco y la superposición corresponden a la ventana activa. Los eventos de una aplicación no activan controles homónimos de otra.
- Los filtros, consultas, selección, comparación y desplazamiento se conservan al minimizar o cambiar de ventana, ir a la libreta, salir de la PC y volver.
- Al recargar se restauran los borradores y las ventanas válidas; los resultados SQL se reconstruyen desde la consulta guardada y el contenido vigente, sin marcarlos como inspeccionados por restaurarlos.
- Cambiar el tamaño del navegador vuelve a limitar las ventanas. Las posiciones guardadas nunca dejan inaccesible un título o sus controles.
- Esc cierra primero un menú o elemento transitorio abierto; en ausencia de estos vuelve a la oficina conservando el trabajo. Debe existir también un botón de salida.
- El escritorio usa HTML dentro del marco de monitor para mantener texto legible; las ventanas internas no bloquean las otras aplicaciones. El área exterior sigue mostrando oficina y controles del juego.
- En pantalla estrecha se muestra una ventana maximizada por vez, con cambio desde la barra de tareas y acceso a «Mostrar escritorio». La nota y las herramientas deben funcionar sin arrastrar ventanas ni hacer doble clic.
- El modo proyector y la reducción de movimiento siguen disponibles. Audio desactivado por defecto; ningún avance depende del sonido.

## Nota adhesiva y progreso

La nota tiene título del puesto, asuntos breves y una pista desplegable para el asunto seleccionado. Debe poder desplazarse o recuperarse mediante «Mostrar escritorio», y recordar su posición válida.

Ejemplo para B:

- Asunto: «Revisar la lectura masiva de clientes».
- Pista al pulsarlo: «Abre Query Studio. Consulta la actividad de SQL Server y examina el registro de lectura».
- Asunto: «Contrastar la lectura con el tráfico saliente».
- Pista: «El Monitor de red contiene el registro de salida. Compara qué información aporta cada registro».

Las pistas nombran herramientas y acciones; no entregan la conclusión aceptada, la consulta resuelta ni la respuesta correcta de una comprobación. Pulsarlas no abre programas, inspecciona fuentes, guarda pistas ni cambia la evaluación.

Los estados visibles se derivan del trabajo real: fuente consultada, pista guardada o contraste registrado. Cada asunto debe declarar cuál de estas condiciones representa su marca. Abrir o minimizar una aplicación no cumple una tarea. Una fuente ausente puede permitir documentar una limitación, sin inventar el archivo que falta.

El estado final «Documentado» procede exclusivamente de `evaluateReview()`. Retirar una fuente o invalidar su versión debe actualizar las marcas dependientes. No guardar un segundo booleano de «investigación terminada».

Las declaraciones permanecen sujetas al flujo del enlace de TI. Si falta una declaración, la nota orienta a solicitarla; no la crea ni la desbloquea al pulsar el asunto.

## Guardado automático y aviso del juego

- Inspeccionar una fuente registra su consulta automáticamente. Elegirla como sustento o utilizarla en un contraste vincula su referencia válida sin pedir después «Guardar en libreta». Mostrar resultados SQL no inspecciona ni vincula todas las filas.
- Elegir una respuesta de contraste, conclusión, limitación o solicitud persiste el cambio. La libreta y «Informe del puesto» leen el mismo Assessment, sin copiarlo a otro modelo de datos.
- Una comprobación necesita sus fuentes antes de quedar registrada. Si todavía falta un sustento, conservar la respuesta como borrador y explicar qué falta; no descartarla ni marcarla como verificada. Cambiarla más adelante conserva trazabilidad y actualiza la libreta.
- Los textos se guardan mientras se escriben con una espera breve para agrupar pulsaciones; vaciar cualquier guardado pendiente al cambiar de ventana, salir de la PC o abandonar la página. No depender únicamente del evento change ni exigir perder el foco para conservar la última frase.
- El HUD del juego muestra «Libreta actualizada» o «Conclusión guardada» tras cambios relevantes, fuera del marco de pantalla. Puede incluir el avance de revisiones documentadas. Agrupar avisos para evitar uno por pulsación.
- Una indicación discreta distingue guardado pendiente, confirmado y solo en esta sesión cuando localStorage falla. Confirmar «Guardado» requiere éxito real de persistencia, no solo una mutación en memoria.
- Movimiento del jugador, geometría de ventanas y ajustes no generan avisos de conclusión ni incrementan progreso académico. El aviso no revela cuál respuesta es correcta.
- La libreta se conserva como consulta y exportación del trabajo acumulado; no exige repetir lo registrado dentro de la PC. Mantener coherentes las ediciones existentes que se sigan ofreciendo desde ella.

## Contratos de implementación

Fijar estos límites antes de repartir archivos:

1. **Definición de computadora:** identificador de estación, programas instalados, accesos, ventanas iniciales y asuntos de la nota. Propuesta: `src/data/computers.ts`.
2. **Contrato de aplicación:** identificador estable, nombre, icono, tamaño mínimo y montaje/desmontaje en un contenedor. El contexto entrega estación, acceso a AuditStore, estado propio, registro automático del trabajo y acciones de navegación. Propuesta: `src/computer/types.ts`.
3. **Registro de aplicaciones:** permite resolver únicamente programas instalados para ese puesto. Propuesta: `src/computer/registry.ts`.
4. **Estado del escritorio:** ventanas, ventana activa, orden de superposición, geometría restaurable, nota y borradores por aplicación. Propuesta: `src/computer/workspace.ts`. Persistencia versionada en una clave propia; no alterar la compatibilidad del guardado académico v2.
5. **Progreso de asuntos:** funciones que leen fuentes actuales y evaluación para derivar estados, sin mutar respuestas. Propuesta: `src/computer/taskProgress.ts`.
6. **Contenedor común:** marco de monitor, escritorio, gestor de ventanas, Inicio, barra de tareas, iconos y nota bajo `src/ui/desktop/`; estilos y variantes XP/Server bajo `src/desktop.css`, aislados del estilo de libreta y entrevista.
7. **Aplicaciones:** módulos bajo `src/ui/apps/`, con controles y contenido propios, incluido «Informe del puesto». Extraer las funciones existentes de consulta, búsqueda, comparación, recuperación e inventario; conservar `src/investigation/query.ts` como motor local.
8. **Puente académico:** usar `AuditStore.inspect()`, `pin()`, `answerCheck()`, `setConclusion()` y demás mutaciones actuales para registrar automáticamente el trabajo pertinente. Evitar duplicar la lógica de reglas dentro de aplicaciones, ventanas o nota. Propuesta: `src/computer/reviewBridge.ts` para las acciones de aplicación, con borradores en workspace cuando falten fuentes.
9. **Confirmación de guardado:** AuditStore comunica el resultado real de persistencia; un componente del HUD del juego lo presenta fuera de la pantalla simulada. Separar eventos académicos relevantes de simples cambios de posición o ajustes. No confirmar persistencia dentro del catch que tolera fallos de almacenamiento.

Cerrar una ventana desmonta sus listeners y conserva su borrador. Salir de una PC guarda el espacio de trabajo. Reiniciar la partida limpia ambos guardados. Una falla de almacenamiento permite seguir la sesión; un estado de escritorio inválido restaura la disposición inicial sin borrar la auditoría.

No serializar DOM, suscripciones ni resultados tratados como evidencia nueva. No recrear todo el escritorio en cada `store.subscribe()`: actualizar la nota y las aplicaciones afectadas conservando foco, selección y arrastre.

## Ejecución por agentes

El coordinador mantiene el plan y asigna un propietario por archivo compartido. Todos los agentes reciben este documento, [assets-pcs.md](assets-pcs.md), las respuestas del usuario y el inventario del código. La selección y las rutas de assets se comparten desde la etapa 0; los agentes reutilizan los mismos recursos y claves. Cada entrega incluye archivos modificados, validación realizada y dependencias pendientes. Todos usan exclusivamente pnpm.

### Etapa 0 · Coordinador: contratos y reparto

**Completada.** Entrega: [contratos tipados](../src/computer/types.ts), [reparto y APIs](contratos-escritorios-pc.md), [mapa de assets](../src/data/computerAssets.ts), [créditos](../public/computers/CREDITS.md), [manifiesto de hashes](../public/computers/manifest.json), [dirección visual](../.impeccable/surfaces/computer-desktop.md) y [recorrido B pendiente de ejecución](aceptacion-pc-b.md). Al cerrar la etapa 0 se reservaron propietarios por rol; la implementación paralela de etapa 1 se ejecutó después, en la entrega siguiente.

- Utilizar las decisiones confirmadas: XP fiel, monitor enmarcado grande, oficina visible, libreta automática y consola Server junto al rack. Conservar las pantallas lejanas actuales como alcance base.
- Publicar los contratos mínimos y las rutas de módulos; repartir la propiedad de archivos.
- Preparar los recursos definidos en [assets-pcs.md](assets-pcs.md): seis fondos distintos, Tahoma normal/negrita, iconos XP/clásicos, bandera y monitor del rack. Publicar el mapa `src/data/computerAssets.ts` y los créditos. Conservar la propiedad de los directorios compartidos de assets durante la ejecución.
- Fijar la dirección XP/Server para esta superficie en la documentación de diseño, conservando el contexto del juego.
- Establecer el recorrido de aceptación de la primera PC: B · SQL y red.
- Salida: contratos revisables, assets locales preparados con sus claves y asignaciones concretas. Ningún agente inventa otro sistema de progreso o persistencia.

### Etapa 1 · Agente de escritorio

**Completada.** [ComputerDesktop](../src/ui/desktop/ComputerDesktop.ts), [geometría](../src/ui/desktop/geometry.ts), [temas XP/Server](../src/desktop.css) y [pruebas](../tests/desktop.test.ts). Se comprobaron dos aplicaciones de desarrollo temporales, retiradas de la entrega, y las aplicaciones reales instrumentadas mediante [la prueba reproducible](../scripts/check-desktop-stage1.mjs). El HUD exterior, el teclado, el arrastre, el redimensionado y la proyección móvil tienen evidencia en [el informe](../artifacts/desktop-stage1/README.md).

Propiedad: `src/ui/desktop/*`, `src/desktop.css` y pruebas propias del gestor de ventanas.

- Implementar marco de monitor, escritorio, Inicio, accesos, barra de tareas, nota y ventanas utilizando los contratos. Reservar espacio al HUD del juego fuera de la pantalla simulada.
- Aplicar tema XP muy fiel y variante clásica Server sobre los mismos componentes.
- Usar los fondos por StationId y los recursos del mapa preparado: Tahoma normal/negrita, iconos `wxp_` para XP y selección clásica para Server. Construir controles y nota en HTML/CSS siguiendo las capturas de referencia, sin incorporarlas como escritorio plano.
- Resolver foco, minimización, orden, arrastre, redimensionado y adaptación a pantallas estrechas.
- Probar con dos aplicaciones de desarrollo temporales que no se incluyan en la entrega.
- Aceptación: dos ventanas funcionales dentro del monitor con oficina visible; minimizar/restaurar y «Mostrar escritorio» recuperan el trabajo; todos los accesos son operables con teclado.

### Etapa 1 · Agente de estado y contenido

**Completada.** [Definiciones de seis PCs](../src/data/computers.ts), [workspace v1](../src/computer/workspace.ts), [progreso derivado](../src/computer/taskProgress.ts), [puente académico](../src/computer/reviewBridge.ts) y [persistencia real](../src/audit/store.ts). Pruebas cubren aislamiento, restauración inválida, reinicio, retirada de fuentes, borradores pendientes y almacenamiento bloqueado. La partida académica conserva su clave y versión v2, sin cambios de reglas/evaluación.

Propiedad: `src/data/computers.ts`, `src/computer/workspace.ts`, `src/computer/taskProgress.ts`, `src/computer/reviewBridge.ts`, `src/audit/store.ts` y pruebas correspondientes. Los contratos compartidos solo cambian por coordinación; conservar intactas reglas y evaluación salvo ajustes imprescindibles acordados.

- Definir programas, asuntos, pistas y disposición inicial para las seis computadoras; asociar fondo, tema e iconos mediante las claves fijadas en `src/data/computerAssets.ts`.
- Implementar estado aislado y guardado versionado, restauración segura y limpieza al reiniciar.
- Asociar las marcas de la nota a fuentes y comprobaciones existentes.
- Implementar registro automático de trabajo y conclusiones, borradores cuando faltan fuentes y señal de confirmación real de persistencia para el HUD.
- Aceptación: asuntos y programas coherentes con cada estación; ningún clic de orientación concede progreso; guardado anterior de auditoría intacto; el autosave no informa éxito si el almacenamiento falla.

### Etapa 1 · Agente de aplicaciones B

**Completada.** [Query Studio](../src/ui/apps/QueryStudio.ts), [Monitor de red](../src/ui/apps/NetworkMonitor.ts), [visor](../src/ui/apps/RecordViewer.ts), [comparación](../src/ui/apps/RecordComparison.ts), [Informe del puesto](../src/ui/apps/StationReport.ts) y [Expediente local](../src/ui/apps/LocalDossier.ts). Conservan intérprete, procedencia, campos ausentes y declaraciones obtenidas. Consulta, comparación, borrador→sustento→contraste y conclusión automática se verificaron en el montaje aislado; la navegación real de libreta/entrevista corresponde a la etapa 2.

Propiedad: aplicaciones de Query Studio y Monitor de red bajo `src/ui/apps/`, visor compartido de registros, comparación e «Informe del puesto». Puede extraer controles de `src/ui/ReviewPanel.ts`, con propiedad reservada durante esta etapa. El coordinador reserva explícitamente los módulos compartidos a este agente.

- Extraer y adaptar las funciones de SQL y red sin reescribir el intérprete.
- Consumir los iconos y fuentes comunes de [assets-pcs.md](assets-pcs.md); el equipo B usa el fondo azul XP Professional asignado, compartido por sus dos monitores físicos.
- Hacer posible consultar en una ventana e inspeccionar o contrastar con la otra.
- Mantener referencias, valores ausentes y errores de consulta. Integrar contraste y conclusión con guardado automático mediante el puente académico.
- Aceptación: editar y ejecutar SQL, abrir una fila, comparar lectura/tráfico y registrar un contraste y una conclusión sin un paso adicional para guardarlos en la libreta.

Estas tres tareas se ejecutaron en paralelo después de cerrar los contratos. La ampliación coordinada de `ReviewBridge.getPendingCheck()` permite restaurar la elección pendiente sin duplicar el modelo académico. Registro de validación y límites: [etapa 1](../artifacts/desktop-stage1/README.md).

### Etapa 2 · Coordinador: primera PC completa

**Completada y aceptada dentro del alcance B.** B dispone de las cuatro aplicaciones, navegación real a libreta/TI, guardado compartido y retorno con consulta, comparación y desplazamiento conservados. El encuadre temporal amplio deja contexto de oficina sin guardar otra pose del visitante; E consume la entrada antes de enfocar SQL. El [informe integrado](../artifacts/desktop-b/README.md) registra `pnpm verify` aprobado (99 unitarias, TypeScript/Vite y 23 E2E), siete capturas finales y revisión independiente con ambos puntos `resolved` y disposición `ship` limitada a esas correcciones. Las aplicaciones restantes y el monitor físico del rack se completaron en etapa 3.

Propiedad: `src/main.ts`, adaptador `src/ui/ComputerPanel.ts`, importaciones CSS y `src/computer/registry.ts`.

- Integrar B con monitor enmarcado, escritorio, nota, dos programas, informe y acceso a libreta/entrevista. El HUD de guardado debe verse fuera de la pantalla simulada incluso con el diálogo abierto.
- Conservar el bloqueo de movimiento de la oficina y el control del foco durante el uso.
- Verificar el recorrido completo en 1280×720 y pantalla estrecha antes de extenderlo.
- Aceptación: entrar, pedir una pista, usar dos programas y registrar un contraste y conclusión; comprobar actualización automática de libreta e indicativo exterior, sin perder el entorno. Registrar una captura real que incluya bisel y oficina.

La extensión a los demás puestos empieza después de superar esta etapa. El equipo debe evaluar aquí si el escritorio ya se siente como una computadora.

### Etapa 3 · Agente de aplicaciones A y D

**Completada.** Session Viewer, Account Directory, Event Desk y Time Tracker están registrados y disponibles en sus puestos. Reutilizan búsqueda, visor y comparación compartidos; el seguimiento por cuenta conecta Event Desk y Query Studio sin atribuir una persona a partir de una cuenta. A conserva Bliss y D Stonehenge con el tema XP y los iconos asignados.

Propiedad: aplicaciones de sesiones/directorio y SIEM/seguimiento bajo `src/ui/apps/`.

- A: búsqueda de cuenta, sesión, permisos y solicitudes con acciones disponibles según el puesto.
- D: cronología, alerta, seguimiento y procedencia temporal.
- Aceptación verificada: las cuatro aplicaciones abren desde sus iconos, funcionan en paralelo y conservan búsquedas y selecciones.

### Etapa 3 · Agente de aplicaciones C, E y F

**Completada.** Order History, Change Manager, Recovery Console, Backup Manager, File Explorer y Clock Comparator están registrados y disponibles. Recovery recorre los estados reportados sin ejecutar una restauración; Custodia y Relojes mantienen explícitos los originales, hashes, horas y desfases ausentes. C conserva isla tropical, E camino otoñal con Server clásico y F duna roja con luna.

Propiedad: aplicaciones de órdenes/cambios, recuperación/respaldos y archivo/relojes bajo `src/ui/apps/`.

- C: historial de órdenes, despliegue, ticket y declaraciones obtenidas mediante el enlace.
- E: estados reportados y respaldos con sus límites, dentro de la variante Server.
- F: exploración del material del expediente y comparación de relojes sin inventar campos.
- Aceptación verificada: los seis programas conservan comparaciones, estados y procedencia; contrastes y conclusiones se reflejan automáticamente en la libreta.

### Etapa 3 · Agente de escena e integración visual

**Completada.** El modelo local `/models/rack-monitor/scene.gltf` está montado junto al rack, con `ScreenPainter` sobre `Cube_RenderMonitor_0`, interacción `respaldos`, colisiones y pose de acceso fuera del mueble. Las seis estaciones abren ComputerDesktop desde la oficina y el acceso plano. Se conservan los textos de monitores de visita, los dos monitores de B y las animaciones de reconstrucción.

Propiedad: `src/scene/OfficeScene.ts`, `src/scene/screens.ts` y las pruebas necesarias de acceso físico.

- Integración del monitor, encuadre y colisiones verificada en el recorrido físico E2E y en `rack-monitor.png`.
- Aceptación verificada: seis equipos utilizables sin atravesar muebles ni introducir un acceso dentro del rack.

El registro común contiene las catorce aplicaciones. `desktop-stage3.spec.ts` cubre los cinco puestos ampliados, Recovery móvil y el acceso físico al rack; las pruebas existentes se adaptaron al recorrido por escritorio. La verificación final de etapa 3 ejecutó `pnpm verify` con **99 unitarias en 12 archivos, TypeScript/Vite y 30 E2E aprobadas**, sin errores de página ni recursos 404 en estos recorridos. Las ocho capturas se conservan en [artifacts/desktop-stage3](../artifacts/desktop-stage3/). La revisión independiente final sigue correspondiendo a etapa 4.

### Etapa 4 · Agente de verificación y revisión independiente

Propiedad: pruebas E2E, capturas de aceptación y reporte de revisión. El coordinador aplica las correcciones en archivos de integración; cada propietario corrige los suyos.

- Actualizar las pruebas que suponían acceso directo al programa, manteniendo las afirmaciones sobre investigación y procedencia.
- Revisar el escritorio y las seis PCs contra la petición original y las decisiones confirmadas.
- Verificar aislamiento entre ventanas, foco, borradores, cambio de estación, restauración y reinicio; guardado automático de conclusiones, oficina visible e indicativo exterior que comunica correctamente los fallos de persistencia.
- Comprobar las seis asignaciones de fondos, carga de Tahoma e iconos y dependencias del monitor; verificar los criterios de assets de [assets-pcs.md](assets-pcs.md), incluidos recursos locales y ausencia de errores de carga.
- Entregar fallos con ubicación, reproducción y resultado esperado; comprobar las correcciones.
- Salida: informe de aceptación con evidencias y pendientes reales.

### Etapa 5 · Coordinador: entrega

- Retirar el contenedor y CSS antiguos que queden sin uso, después de comprobar paridad funcional.
- Actualizar README, PRODUCT, DESIGN y los artefactos visuales correspondientes a la superficie cambiada.
- Actualizar los scripts de recorrido/grabación afectados por la navegación nueva. Identificar explícitamente los vídeos anteriores si no se regeneran.
- Ejecutar la verificación final, registrar limitaciones reales y entregar el resultado.

## Matriz de aceptación

| Área | Condición de aceptación |
| --- | --- |
| Sensación de PC | Windows XP muy fiel, fondo, accesos, Inicio, barra de tareas, ventanas y programas iniciales; marco de monitor grande y oficina visible |
| Cobertura | Las seis PCs tienen escritorio propio y todos sus programas accesibles; el puesto E tiene monitor junto al rack y tema Server |
| Assets | Seis fondos según el reparto fijado; fuentes, iconos y monitor procedentes de [assets-pcs.md](assets-pcs.md), con recursos locales y procedencia registrada |
| Nota | Solo muestra asuntos del equipo; un clic orienta sin abrir programas ni otorgar progreso; siempre puede recuperarse |
| Ventanas | Abrir, activar, arrastrar, redimensionar, minimizar, maximizar, restaurar y cerrar funcionan sin perder los borradores |
| Estado | Búsqueda, SQL, selección, comparación y disposición aislados por PC; volver desde libreta/entrevista y recargar conserva el trabajo válido |
| Investigación | Se mantienen las funciones actuales de SQL, red, sesiones, cambios, SIEM, recuperación y custodia |
| Libreta automática | Contrastes, conclusiones y progreso se actualizan sin copiar ni pulsar guardar; HUD del juego visible fuera de la pantalla de PC y confirmación real de persistencia |
| Evaluación | Consultar registra inspección; usar como sustento vincula fuentes válidas; las acciones no eligen respuestas por el jugador ni completan solas la revisión |
| Compatibilidad | Una partida v2 anterior conserva fuentes, conclusiones, recomendaciones y ajustes; reiniciar limpia también los escritorios |
| Accesibilidad | Teclado completo, foco visible, controles nombrados, salida disponible, proyector, movimiento reducido y uso táctil sin arrastre obligatorio |
| Escena | B conserva dos monitores y E tiene monitor accesible; se admite el texto actual en equipos lejanos; reconstrucción anterior conserva su comportamiento |
| Entrega local | Misma experiencia sin WebGL; recursos locales y ningún requisito de servicios remotos nuevos |

## Verificación prevista

- Unitarias del gestor de ventanas: activación, minimización, geometría al cambiar tamaño, una instancia por aplicación y aislamiento entre PCs.
- Unitarias del espacio de trabajo y progreso: restauración de datos inválidos, conservación del guardado académico, reinicio y marcas que se retiran al perder su fuente válida.
- E2E de la primera PC: monitor enmarcado → nota → Query Studio → consulta editable → Monitor de red → contraste → conclusión → libreta actualizada automáticamente → salida y reapertura.
- E2E parametrizadas para acceder a los programas de las seis estaciones, más recorridos propios para sesiones, SIEM, órdenes, recuperación y custodia.
- E2E de varias ventanas: escribir en SQL, activar otra aplicación, minimizar/restaurar y conservar texto, resultados válidos, selección y foco.
- E2E de restauración y reinicio: partida académica v2 previa, borradores de varias PCs, recarga, cambio de resolución y limpieza total al reiniciar.
- E2E de autosave: respuesta sin todas las fuentes conservada como borrador, selección de conclusión, texto sin perder foco antes de salir, persistencia confirmada y localStorage bloqueado sin falso mensaje de éxito. No notificar como avance los cambios de pose o geometría.
- Capturas reales del escritorio y programas en 1280×720, 1920×1080 y móvil 390×844; comprobar nota, barra y controles dentro de pantalla, marco visible y HUD exterior. En escritorio, la oficina debe seguir siendo identificable. Una ronda de inspección conjunta y una de confirmación tras corregir.
- Ejecutar `pnpm test`, `pnpm build` y `pnpm test:e2e`; usar `pnpm verify` como batería final. Adaptar las pruebas a los nuevos recorridos sin quitar comprobaciones sobre el expediente.

El análisis inicial no ejecutó pruebas. La preparación de etapa 0 añade `tests/computer-assets.test.mjs` para cotejar recursos locales, asignaciones, hashes contra inventario, variantes PNG y dependencias/licencia del monitor. La validación ejecutada se registra en [el informe de etapa 0](../artifacts/desktop-stage0/README.md); no acredita todavía el recorrido interactivo B.

La etapa 1 añade pruebas de escritorio, workspace, progreso, puente y aplicaciones. `pnpm test:desktop` comprueba sus componentes en un diálogo de prueba con Chrome y Vite locales, sin conectar rutas de producción ni distribuir programas temporales. Las capturas de `artifacts/desktop-stage1/` prueban ese montaje; no sustituyen la aceptación integrada de etapa 2.

## Límites de alcance

- Simular un escritorio y sus programas de investigación; no emular Windows ni ejecutar programas del sistema operativo.
- Conservar el canon, los trece registros, las seis revisiones y la separación entre datos, declaraciones y recreaciones.
- No inventar correos, archivos originales, hashes, aprobaciones, resultados SQL Server ni resultados de restauración para llenar ventanas.
- Mantener TypeScript, Three.js, Vite y HTML/CSS. No añadir un framework o una biblioteca de escritorio sin una necesidad demostrada.
- Priorizar iconos, controles y documentos útiles; evitar menús decorativos con acciones sin implementar.
- Los fondos e iconos se entregan como recursos locales con procedencia documentada según [assets-pcs.md](assets-pcs.md). Cada equipo usa su fondo asignado; fidelidad XP muy alta y consola del rack con variante Server clásica.
- El escritorio permanente en monitores no utilizados es opcional y de coste acotado; conservar sus textos actuales es un resultado válido.

## Riesgos a resolver durante la implementación

1. **Solo cambiar colores:** el resultado seguirá sintiéndose como un formulario si no hay escritorio y programas independientes. La primera PC debe demostrar toda la interacción.
2. **Reutilizar el render global:** sustituir el HTML completo rompería arrastre, foco y consultas cuando se guarda una pista. Separar el ciclo de vida de ventanas y aplicaciones.
3. **Duplicar la evaluación:** una lista de checks propios puede contradecir la libreta. Derivar las marcas desde fuentes y comprobaciones existentes.
4. **Romper partidas guardadas:** el espacio de trabajo requiere estado propio y restauración defensiva; no cambiar de versión el guardado académico solo para guardar ventanas.
5. **Conflictos entre agentes:** contratos primero, un propietario por archivo compartido e integración centralizada.
6. **Controles fuera de pantalla:** limitar geometría al restaurar y ofrecer uso maximizado en móvil/proyector.
7. **Perder la oficina:** un escritorio que ocupe toda la pantalla sin bisel ni contexto incumple el encuadre confirmado. Mostrar el monitor grande conservando el entorno.
8. **Guardado engañoso:** el commit actual tolera fallos de localStorage sin comunicarlos. El HUD solo puede confirmar guardado tras éxito real y debe seguir visible por encima de la capa modal, fuera del monitor.
9. **Trabajo secundario costoso:** no sincronizar escritorios en todos los monitores; conservar sus textos si la miniatura estática deja de ser sencilla.
