---
name: "Operación Trazabilidad"
description: "Oficina, programas de investigación y tablita de papel para distinguir registros, límites y recreación ilustrativa."
colors:
  primary: "#385f5c"
  primary-hover: "#284e4c"
  accent: "#517c78"
  paper: "#f4f0e6"
  paper-bright: "#fbfaf5"
  graphite: "#29383d"
  night: "#17262e"
  muted: "#5d6d6b"
  line: "#cfd2c7"
  warning: "#c49a52"
  critical: "#b84a48"
  button-label: "#ffffff"
  status-done-bg: "#d8e6dc"
  status-done-text: "#294f47"
  program-bg: "#edf0ed"
  program-surface: "#fafbf8"
  program-line: "#cbd3ce"
  program-muted: "#536761"
  program-chrome: "#e3e8e3"
  program-header: "#21383f"
  program-header-text: "#edf4f1"
  program-heading: "#243e3e"
  program-inspector: "#eef1e9"
  program-table-head: "#e8ede8"
  program-table-stripe: "#f1f4ee"
  program-selection: "#dfece1"
  query-bg: "#13252e"
  query-text: "#bde1d0"
  siem-alert-bg: "#f3ead3"
  siem-alert-text: "#70532e"
  crm-down-bg: "#f0e7e0"
  crm-down-text: "#8b4541"
typography:
  display:
    fontFamily: "ui-monospace, Cascadia Mono, monospace"
    fontSize: "52px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "25px"
    fontWeight: 700
    letterSpacing: "-0.025em"
  body:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  data:
    fontFamily: "ui-monospace, Cascadia Mono, monospace"
    fontSize: "20px"
    fontWeight: 400
  program-title:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "21px"
    fontWeight: 700
  program-question:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  program-body:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  program-table:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  program-label:
    fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  query:
    fontFamily: "ui-monospace, Cascadia Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.85
rounded:
  program: "4px"
  sm: "5px"
  md: "6px"
  lg: "10px"
  xl: "12px"
spacing:
  sm: "8px"
  program-sm: "12px"
  md: "16px"
  program-md: "20px"
  lg: "24px"
  program-lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.button-label}"
    rounded: "{rounded.md}"
    padding: "10px 15px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.paper-bright}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.md}"
    padding: "10px 15px"
    height: "42px"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    padding: "12px 28px"
  document-dialog:
    backgroundColor: "{colors.paper-bright}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.xl}"
    width: "96vw"
    height: "90vh"
  status-documented:
    backgroundColor: "{colors.status-done-bg}"
    textColor: "{colors.status-done-text}"
    rounded: "{rounded.sm}"
    padding: "5px 8px"
  program-navigation:
    backgroundColor: "{colors.program-chrome}"
    textColor: "{colors.graphite}"
    padding: "20px 12px"
  program-query-editor:
    backgroundColor: "{colors.query-bg}"
    textColor: "{colors.query-text}"
    typography: "{typography.query}"
    padding: "20px 15px"
  program-record:
    backgroundColor: "{colors.program-inspector}"
    textColor: "{colors.graphite}"
    padding: "16px 20px 24px"
  intro-clock:
    textColor: "{colors.paper}"
    typography: "{typography.display}"
---

# Design System: Operación Trazabilidad

## Identidad ambiental Red Nova · actualización solicitada

La ventana incorpora ahora un exterior fotográfico ficticio solicitado por el usuario: Godzilla gigantesco conversa con Master Chief durante una cita con Samus Aran en la terraza de un edificio, con la ciudad al fondo. Recurso local `public/environment/city-godzilla-chief-samus.png`, generado con imagegen; prompt y procedencia en `public/environment/README.md`. El exterior se sitúa seis metros detrás de un hueco real en la pared: jambas de 44 cm, alféizar exterior, vidrio transparente y persiana más recogida. El marco y la ciudad tienen paralaje al moverse; la ciudad continúa siendo un decorado plano distante. Se conserva la imagen generada sin deformarla.

La oficina incorpora una identidad escenográfica propia: petróleo `#193f46`, marfil `#f4f0e6` y cobre `#b67a50`, con una nova de cuatro puntas conectada a nodos. El arte maestro generado mediante imagegen está en `public/brand/red-nova-master.png`; su procedencia y prompt exacto están en `public/brand/README.md`. Las placas componen los nombres de los puestos con Canvas y reutilizan ese arte, manteniendo legibles los textos variables. Aplicaciones: rótulos central y lateral, salida, área técnica, enlace de TI, puestos y alfombrillas.

La luz de visita combina ambiente neutro con rebote cálido, cuatro luminarias interiores y relleno azulado desde la ventana. Paredes de yeso claro, suelo piedra cálido, pintura petróleo, listones de madera y jardineras periféricas sustituyen la dominante verdosa. La reconstrucción conserva su transición desde la madrugada. El antialiasing suaviza letreros y arquitectura. Solo la luz direccional produce sombras: las luces de relleno no añaden mapas de sombras.

Alcance: identidad y ambientación de la oficina 3D; se conservan los programas XP/Server, las fuentes académicas, el recorrido y la evaluación. Los elementos ambientales son ilustrativos. El detector señaló avisos advisory de colores de materiales 3D fuera de la paleta de interfaz heredada; no se adopta esa paleta para los escritorios.


## Dirección aprobada para los escritorios de PC · estado de etapa 3

La superficie [escritorios XP/Server](.impeccable/surfaces/computer-desktop.md) conserva el motor de ventanas, el estado aislado, el puente académico y las aplicaciones B/comunes de las etapas anteriores. **Etapa 3 completada**: las seis computadoras abren ComputerDesktop desde E y el acceso plano; se añaden las diez aplicaciones específicas de A/C/D/E/F y el monitor físico Server junto al rack. Se mantiene la dirección aprobada de Windows XP Luna muy fiel en A/B/C/D/F y Server clásico en E, seis fondos asignados, Tahoma local e iconos de época. El monitor HTML centrado conserva bisel, HUD exterior y contexto de oficina; Recovery Console recorre estados sin simular restauraciones y las aplicaciones de custodia y relojes no completan datos ausentes. `pnpm verify` terminó con 99 unitarias, TypeScript/Vite y 30 E2E aprobadas; las ocho capturas de [etapa 3](artifacts/desktop-stage3/) incluyen los cinco puestos ampliados, móvil, rack y Server.

La verificación y las capturas de [etapa 1](artifacts/desktop-stage1/README.md) se conservan como evidencia del montaje aislado; la [revisión independiente B](artifacts/desktop-b/review.md) mantiene su alcance limitado a las correcciones de etapa 2. Las secciones heredadas que siguen describen el sistema anterior y se actualizarán en la entrega global. Los colores, formas y tipografía XP/Server quedan limitados al escritorio y sus aplicaciones, conservando el marfil/verde de libreta, entrevista y HUD y los materiales de oficina y reconstrucción. El YAML y `.impeccable/design.json` conservan el sistema anterior; su refresco global está reservado a etapa 5. Los avisos advisory sobre paleta/escala heredadas y XP frente al sidecar anterior se reportan sin cambiar la estética.

Contratos y propiedad: [contratos-escritorios-pc.md](docs/contratos-escritorios-pc.md). Recursos locales: [computerAssets.ts](src/data/computerAssets.ts) y [créditos](public/computers/CREDITS.md). Primera aceptación integrada: [B · SQL y red](docs/aceptacion-pc-b.md). Las etapas 4 y 5 siguen pendientes: revisión independiente final, retirada de código heredado sin uso y actualización global de documentación y recorridos.

## Entrevista conversacional · actualización solicitada

La entrevista adopta la interacción de Skyrim: seis temas, una respuesta por turno, ramas de repreguntas y opciones ya habladas atenuadas con una marca textual accesible. En 3D, un primer plano fijo del enlace conserva al personaje a la izquierda, opciones a la derecha y la respuesta en una franja inferior. Cerrar recupera la pose de exploración. En móvil y a poca altura, el orden de lectura es interlocutor, respuesta y opciones, con desplazamiento vertical. Modo plano, teclado, proyector y movimiento reducido conservan el mismo contenido.

El enlace de TI utiliza ahora el modelo FBI aportado por el usuario, a 1.8 m de altura, con sus texturas y la pose estática del paquete. Se mantiene el encuadre de conversación y el personaje geométrico como respaldo de carga. El recurso y su atribución están en `public/models/fbi-agent/`; las capturas del cambio están en `artifacts/fbi-agent/`. El aspecto del personaje no cambia la atribución de las declaraciones del expediente.

El cambio de tema y la despedida son frases del jugador. Las respuestas usan voz conversacional y mantienen la atribución de declaraciones y todos los límites del caso. Abrir una fuente permite volver al mismo turno; las repreguntas sobre documentos exigen haber inspeccionado todos sus soportes y haber hablado de la pregunta inicial. La memoria de conversación dura durante la visita, incluso al pasar por fuentes y ordenadores; no modifica las conclusiones ni el guardado académico.

Estilos aislados en `src/interview.css`: texto marfil `#f4f0e6`, secundario `#bbc6bf`, selección cálida `#ead49f`, superficie de lectura `#101d22` con opacidades de 92–96 %, fondo plano `#17262e` y separadores `#718078`, `#51635f`, `#87988a`. Nombre del interlocutor de 30–44 px, opciones de 17–21 px y respuesta de 19–25 px; proyector aumenta opciones a 24 px y respuesta a 28 px. Son decisiones específicas de esta conversación; libreta y escritorios conservan sus estilos.

## Overview

**Creative North Star: "La habitación que delimita lo que se sabe"**

Una oficina tridimensional de madera clara y grafito contiene los resúmenes del incidente. La interfaz de marfil y verde grisáceo ayuda a leerlos sin hacerse pasar por la evidencia. La madrugada azul grisácea da paso a una visita cálida: cambia la presentación, no la certeza de los hechos.

La experiencia combina una apertura de cámara fija con una herramienta de trabajo densa y tranquila. La habitación, los monitores y la tablita física son el motivo memorable; los diálogos HTML hacen legibles las fuentes, comprobaciones y limitaciones. El color y el movimiento comunican estado, no alarma espectacular. Los ordenadores prolongan ese mundo mediante programas reconocibles, con herramientas propias y una libreta aparte: investigar precede a documentar el razonamiento.

**Key Characteristics:**
- Escena 3D local con mobiliario proporcionado por el usuario y respaldo procedural.
- Jerarquía de lectura clara, con papel, datos monoespaciados y procedencia visible.
- Un solo sistema de estado para las seis estaciones, la libreta y la exportación.
- Programas con búsqueda, datos e inspector; preguntas legibles antes que códigos de referencia.
- Accesibilidad sin depender de audio, WebGL o control del puntero.

## Colors

La paleta es restringida: grafito y azul noche para la escena, marfil para la lectura y verde grisáceo para las acciones.

### Primary
- **Verde de contraste** (`primary`): acciones principales, vínculos y estados de selección.
- **Verde de reposo** (`accent`): foco de formulario, iconografía y selección menos intensa.

### Secondary
- **Petróleo de aplicación RN** (`program-header`): identifica el programa abierto sin teñir su área de lectura.
- **Editor SQL azul noche** (`query-bg`) y **texto de consulta** (`query-text`): distinguen el código editable de la tabla clara de resultados. El contraste técnico pertenece a esa herramienta y no al resto de la oficina.

### Neutral
- **Marfil de tablita** (`paper`) y **papel claro** (`paper-bright`): barra, diálogos, documentos y libreta.
- **Grafito** (`graphite`): texto y paneles de mensaje.
- **Noche azulada** (`night`): campo de la escena y franja de transporte.
- **Gris de lectura secundaria** (`muted`) y **línea cálida** (`line`): procedencia auxiliar y división de regiones.
- **Fondo del programa** (`program-bg`), **área de investigación** (`program-surface`) y **explorador gris verdoso** (`program-chrome`): tres planos tonales del ordenador. **Papel del inspector** (`program-inspector`) separa el detalle sin elevarlo como una tarjeta.
- **Divisor del programa** (`program-line`), **lectura secundaria del programa** (`program-muted`), **pregunta de investigación** (`program-heading`) y **texto de cabecera RN** (`program-header-text`): jerarquía y contraste dentro de esas superficies.
- **Cabecera tabular** (`program-table-head`), **alternancia tabular** (`program-table-stripe`) y **registro seleccionado** (`program-selection`): lectura de filas; la selección también conserva controles y texto.

### Tertiary
- **Ámbar de alerta** (`warning`): alerta SIEM y asuntos pendientes; evita presentar toda alerta como daño probado.
- **Rojo del CRM** (`critical`): equipo afectado y su recreación asociada en P08, no un tinte global de alarma.
- **Alerta SIEM** (`siem-alert-bg`, `siem-alert-text`): ámbar contenido en la entrada de cronología que requiere revisión.
- **Caída del CRM** (`crm-down-bg`, `crm-down-text`): fondo cálido y hora rojiza en el estado de servicio indisponible; la recuperación vuelve a los verdes de lectura.

**The Application Palette Rule.** Las superficies de aplicación pueden usar petróleo, editor oscuro y tablas claras sin cambiar el marfil y verde de la libreta. La variación identifica una herramienta; no inventa un nuevo nivel de certeza.

**The Measured Alarm Rule.** El ámbar comunica revisión pendiente; el rojo intenso se reserva al CRM afectado. No convertir la reconstrucción en una consola de emergencia.

## Typography

**Display Font:** monoespaciada del sistema, con Cascadia Mono y monospace de respaldo; reservada a hora y medición.
**Body Font:** sans funcional del sistema, sin descargas externas.
**Label/Mono Font:** la misma familia monoespaciada para identificadores, versiones y cifras tabulares.

La escala se apoya en peso y tamaño, no en tipografía decorativa. La hora mide 52 px en escritorio, el mensaje 26 px y la procedencia/controles 20 px. En móvil se reduce la apertura; el acceso plano es la ruta completa recomendada para esa pantalla. El modo proyector eleva la hora a 64 px y el mensaje a 31 px.

- **Display** (700, 52 px, interlineado 1.1): hora reportada, nunca una hora original inventada.
- **Title** (700, 25 px): títulos de diálogo y estación.
- **Body** (400, 16 px, interlineado habitual 1.45): controles y lectura general; los resúmenes suben a 18 px.
- **Data** (400, 20 px): tiempo, códigos y referencias con cifras tabulares.
- **Program title** (700, 21 px) y **Program question** (700, 24 px, interlineado 1.2): nombre de aplicación y pregunta que orienta el trabajo. La pregunta ocupa el peso principal del área central.
- **Program body** (400, 14 px, interlineado 1.6) y **Program table** (400, 13 px): instrucciones breves y registros densos. Los resúmenes del inspector usan 15 px e interlineado 1.65.
- **Program label** (400, 12 px): contexto, encabezados de tabla y acciones auxiliares; metadatos tabulares y barra de estado pueden bajar a 11 px. El modo proyector aumenta tabla, editor, resumen y campos del inspector a 16 px.
- **Query** (400, 13 px, interlineado 1.85): consulta editable; sus resultados usan monoespaciada de 12 px. Horas tabulares y de cronología usan 14 px.

**The Reading First Rule.** La cámara permanece quieta mientras se lee. Ninguna animación, etiqueta estrecha o efecto de terminal puede competir con mensaje, fuente y procedencia.

## Layout

La oficina ocupa todo el viewport bajo una barra de 72 px. La apertura usa una sola habitación, diez cortes fijos y una franja inferior de transporte. En la visita se reduce el HUD para devolver el espacio a la escena.

La libreta de estación organiza índice, documento y comprobación en tres columnas desplazables. Por debajo de 1180 px la comprobación pasa bajo las dos primeras; a 760 px el contenido se apila y el diálogo ocupa la pantalla. La variante plana presenta seis filas de acceso grandes, con navegación de teclado y desplazamiento propio.

El ordenador tiene cabecera de aplicación, franja de contexto y barra de estado alrededor de tres regiones: explorador (210 px), trabajo flexible y detalle (300 px). Las tres regiones pueden desplazarse de forma independiente en escritorio. El área de trabajo lleva padding de 26 × 24 × 32 px y la pregunta se limita a 72ch. A partir de 1650 px los laterales pasan a 230 y 340 px y el trabajo usa 30 px de padding. Entre 761 y 1180 px conserva las tres regiones con laterales de 175 y 260 px, padding central de 22 × 16 px y menos texto auxiliar en la barra de consulta.

Hasta 760 px el ordenador forma una sola columna desplazable: herramientas y soportes se convierten en filas horizontales, luego aparece el trabajo y finalmente el inspector abierto. El inspector vacío se oculta; seleccionar un registro lleva el foco a su título. La cabecera baja de 78 a 68 px, el nombre del programa pasa de 21 a 16 px y la pregunta de 24 a 23 px. El trabajo usa 24 × 16 px. Se reducen contexto y contador auxiliares, manteniendo «Libreta» y cierre. Las tablas conservan ancho mínimo de 560 px (640 px para resultados SQL) con desplazamiento interno; no se comprimen sus celdas hasta hacerlas ilegibles. La comparación mantiene sus dos columnas con separación reducida.

Los espacios recurrentes globales son 8, 16 y 24 px; dentro de los programas también se repiten 12, 20 y 32 px. Los textos largos se limitan por medida de caracteres cuando explican límites; las tablas anchas usan desplazamiento interno. La impresión separa portada y seis revisiones en páginas A4.

**The Room Before Chrome Rule.** La escena es el contexto, pero no sustituye el documento. Abrir una fuente detiene el movimiento y muestra lectura HTML, sin obligar a leer texto diminuto en un monitor 3D.

## Elevation & Depth

La escena 3D obtiene profundidad de geometría, luz y sombras reales. La interfaz usa tonos de papel y bordes finos en reposo. Las sombras difusas pertenecen a menús, diálogos y avisos superpuestos, no a cada tarjeta. El ordenador hereda el diálogo, pero su explorador, tabla e inspector se distinguen por tono y divisores sin sombras interiores.

- **Menú** (`0 16px 40px #17262e33`): distingue ajustes sin aislarlos de la barra.
- **Diálogo** (`0 24px 80px #101d22aa`): separa el trabajo de lectura de la escena atenuada.
- **Aviso** (`0 10px 26px #17262e44`): elevación breve y subordinada al contenido.

## Shapes

Los controles de programa y soportes usan esquinas de 4 px; las tablas y el editor conservan esquinas rectas. Los controles generales y filas seleccionadas tienen esquinas suaves de 5–6 px; los diálogos llegan a 12 px. Las formas no imitan bisel metálico, cristal o relieve. La hoja con clip se modela como un objeto físico sencillo y permanece baja en el encuadre solo tras recibirla.

## Components

### Buttons
- **Forma:** rectángulos de esquinas suaves (6 px), altura mínima de 42–44 px y padding de 10 × 15 px.
- **Primario:** verde oscuro con texto blanco; secundario de papel con borde gris verdoso.
- **Estados:** cambio tonal al pasar el cursor, contorno visible de 3 px al navegar por teclado y opacidad reducida al deshabilitar.

### Navigation
La barra superior mantiene nombre, reconstrucción y ajustes en una franja de papel. En móvil se conservan identidad y accesibilidad; el resto queda disponible dentro de los flujos. Las estaciones planas son botones de ancho completo, no tarjetas ornamentales.

### Inputs / Fields
Radios y casillas conservan controles nativos visibles, etiquetas completas y color de acento. Los campos de recomendación usan papel claro, borde fino y radio de 5 px. El foco no depende solo del color. El texto libre se identifica como no evaluado.

### Cards / Containers
Los documentos usan columnas de papel, divisores y tablas con encabezados adherentes cuando corresponde. El diálogo principal tiene radio de 12 px y una sombra difusa; el interior prioriza desplazamiento por región y encabezado persistente. Los estados «Documentado» usan verde pálido y texto, nunca una marca manual.

### Investigation programs
El programa tiene identidad propia y herramientas de trabajo; la libreta es su acción persistente, no un formulario incrustado. El explorador separa vistas y soportes, el centro abre con una pregunta concreta y el inspector amplía la fila seleccionada. Los nombres de actividad, cuenta y contexto llevan la lectura; identificadores, versión y procedencia se conservan en detalles desplegables.

La búsqueda filtra los registros del programa. Abrir una fila muestra resumen, campos y acciones para guardar o comparar; guardar una pista informa su estado con texto y evita duplicados. La comparación coloca dos registros lado a lado, conserva sus contextos y presenta diferencias de horas con sus límites. La mesa pertenece al área de trabajo, separada por un divisor, sin modal adicional.

El editor SQL usa una pestaña oscura, números de línea, campo editable y barra clara con ejecución, ejemplos y ayuda desplegable. Los resultados vuelven a la tabla clara; abrir una fila conserva su referencia en el inspector. Los errores usan una región de mensaje ámbar legible. El editor es una herramienta local de solo lectura sobre el expediente, y la interfaz mantiene visible ese alcance.

Cronología SIEM, estados de recuperación e inventario reutilizan la misma estructura de programa. La cronología se lee por hora y actividad; la recuperación combina etapas seleccionables con un deslizador y una instantánea; el inventario mantiene explícitos los archivos y hashes ausentes. La libreta conserva el contraste, las conclusiones y las solicitudes en su propia superficie. Al regresar al programa se conserva la mesa de trabajo.

**The Investigate Before Documenting Rule.** Un ordenador abre herramientas y una pregunta. La revisión estructurada se realiza en la libreta; consultar, abrir o comparar no se presenta visualmente como una conclusión aprobada.

### Reconstruction
Fecha y hora arriba a la izquierda; plano y etiqueta ilustrativa arriba a la derecha; mensaje y procedencia sobre fondo grafito en el tercio inferior. En P08 la nota, el mensaje y el monitor tienen regiones separadas. El mensaje mantiene su identificador de evento; la nota conserva su etiqueta de recreación.

**Dirección de la apertura refinada, solicitada por el usuario:** los monitores representan aplicaciones con personalidad propia, no láminas del PDF. La familia RN usa cabecera azul petróleo y pestañas funcionales; SQL combina editor monoespaciado y filas que avanzan, red representa paquetes y progreso, CRM usa una tabla comercial clara, y SIEM una cola de eventos ámbar. El rojo se conserva para la indisponibilidad del CRM. Los planos cercanos son fijos y dejan espacio a la hora y al enunciado.

Cada tramo muestra unos 3,6 segundos de actividad ilustrativa y luego congela el resultado para explicar el registro del caso. En P08 el cambio de servicio se resuelve antes de aparecer la nota en su intervalo original. La cifra intermedia, las filas de muestra y los pasos visuales son presentación; las cifras finales proceden del canon. Toda la secuencia se deriva del tiempo del reproductor y la actualización de texturas se limita a diez estados por segundo. Movimiento reducido conserva los estados finales sin desplazamiento ni contadores; móvil y ausencia de WebGL reutilizan el mismo dibujado en canvas plano.

Paleta interna de las aplicaciones RN: fondo `#101d26`, cabecera `#21383f`, texto `#e4eeec`, datos activos `#9fd8c6`, paquetes `#6fadb7`, alerta `#e6bd76`; CRM comercial `#e9ede6` con texto `#243b40`. Son superficies del monitor, no nuevos colores globales de los documentos de auditoría. Las capturas y su procedencia están en `artifacts/refinement/README.md`.

### Clipboard and sources
La entrevista entrega la tablita antes de permitir su apertura con J. Una fuente debe abrirse antes de vincularse. Retirar una fuente invalida la comprobación asociada sin borrar las demás respuestas. Las fuentes alternativas no inflan la corroboración.

## Do's and Don'ts

### Do:
- **Do** conservar visible la diferencia entre registro, declaración, vista calculada y presentación ilustrativa.
- **Do** mantener una cámara fija durante la lectura y usar cortes entre estaciones.
- **Do** proporcionar foco visible, acceso de teclado, reducción de movimiento y alternativa plana.
- **Do** usar monoespaciada para horas, identificadores y medidas.
- **Do** registrar pendientes y límites incluso cuando las seis revisiones estén documentadas.
- **Do** conservar nombre de actividad y contexto en primer plano, con referencias y procedencia accesibles en el inspector.
- **Do** mantener la libreta accesible desde cada programa y conservar la mesa al volver a investigar.

### Don't:
- **Don't** añadir glitch, texto letra por letra, alarmas continuas o flechas que sugieran causalidad.
- **Don't** convertir la nota ilustrativa en evidencia ni inventar una hora de aparición.
- **Don't** introducir fuentes web remotas, fondos de consola «hacker» o una estética de juego de puntuación.
- **Don't** usar la sans funcional del sistema como una voz editorial decorativa; el protagonismo pertenece a la oficina y sus documentos.
- **Don't** sustituir una fuente ausente por un archivo, hash, consulta o conciliación inventados.

## Oficina industrial · dirección Valve

La mejora de noviembre de 2026 lleva la habitación hacia las oficinas industriales de Half-Life y Counter-Strike: techo modular cerrado, vigas y conductos expuestos, tuberías con abrazaderas, pintura verde utilitaria en el zócalo, baldosas gastadas y placas fijadas al mobiliario. Se conserva la habitación, sus seis estaciones, las cámaras y los controles. Los fluorescentes fríos contrastan con lámparas cálidas y el rincón de mantenimiento; no hay parpadeos ni efectos de alarma.

Los materiales ambientales amplían la paleta exclusivamente dentro de la escena: acero `#454d49`, fondo `#262e2c`, pintura `#68776b`, yeso `#b4b0a0`, suelo `#8c8a77`, techo `#96988e`, señalización `#293d39`/`#e7e4cf`, vidrio `#839a9b`, papel `#d7d0b9` y ámbar `#b99b59`. Las variaciones procedurales expresan desgaste físico. El HUD y los escritorios XP/Server conservan sus estilos.

`OfficeEnvironment.ts` reúne la arquitectura, las texturas deterministas y la utilería. Los periféricos, libros, cajas y radio proceden del Furniture Kit 2.0 local de Kenney; se conserva su licencia CC0 en `public/models/office-props/License.txt`. El cargador configura MeshoptDecoder incluido en Three.js para mostrar los modelos comprimidos existentes. Las superficies procedurales no necesitan imágenes remotas. La señalización, papeles ambientales y utilería no son fuentes del caso.

Capturas y comprobación visual: [oficina industrial](artifacts/office-valve/README.md).

## Menús y documentos como objetos de la oficina

Los menús dejan de ser paneles blancos genéricos. `src/overlays.css` reúne su presentación: la tablita usa soporte marrón `#71583d`, clip metálico y hoja `#ded6b9`; las fuentes se presentan en carpeta ocre `#9c8559` y papel cálido; el índice de revisión adopta pestañas de archivo y mantiene una zona de trabajo petróleo. Los ajustes son una placa de mantenimiento con marco metálico, tornillos y conmutadores. La entrevista conserva la oficina visible y las opciones propias de una conversación del juego. Los menús de inicio conservan Luna/Server con fondos marfil y gris propios de esos sistemas.

La tipografía solicitada es **Roboto Mono**, variable 100–700, incluida localmente en `public/fonts/roboto-mono/` con su licencia OFL. Se usa en interfaz, documentos, HUD, escritorios, consultas y menús; los letreros y texturas de la escena conservan su arte. Se precarga en `index.html`; no requiere Google Fonts en ejecución. Lecturas de 16–18 px, tablas de 14 px y metadatos de 12–13 px, con alturas de línea de 1.5–1.6. Las esquinas de objetos y controles usan 2–5 px; el soporte de la tablita usa 12 px. Petróleo `#122327`/`#243b3e`, texto `#eee8d8`, cobre `#dab483`, papel `#ded6b9`/`#e9e1c8`, tinta `#30382f` y verde de archivo `#354b43` forman esta extensión de paleta.

El reinicio usa una confirmación integrada en la hoja, con foco inicial en «Conservar mi partida», en lugar del diálogo nativo del navegador. Cancelar conserva el estado y devuelve el foco. En móvil la acción de tablita se reduce a su icono, las acciones de revisión ocupan una segunda fila y las tablas conservan desplazamiento interno.

Capturas de escritorio y móvil y validación: [menús integrados](artifacts/overlays/README.md).
