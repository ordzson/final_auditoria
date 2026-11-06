---
version: 1
slug: "src-main-ts"
primary_target: "src/main.ts"
related_targets: ["src/scene/OfficeScene.ts","src/ui/ComputerPanel.ts","src/ui/ReviewPanel.ts","src/computer.css","src/data/investigation.ts","src/investigation/query.ts"]
---

# Superficie: experiencia completa de auditoría

Modo: Operate, con una apertura Experience. La tarea es contrastar fuentes y cerrar revisiones con sustento; la oficina y la reconstrucción sirven a ese trabajo.

## Direction contract

THESIS: Seguir pistas mediante programas propios de cada sistema y usar la libreta aparte para razonar. La misma oficina conserva su apertura con terminal SQL, transferencia y CRM animados; sus filas y progresos se identifican como ilustrativos. Durante la investigación, consultar, abrir, comparar y guardar referencias convierte los registros en trabajo interactivo sin convertirlo en un checklist de códigos.

OWN-WORLD: Madera clara, grafito, marfil y acento verde grisáceo; madrugada azul grisácea, visita cálida, rojo solo en el CRM. Modelos GLB locales, geometría sencilla y hoja con clip. Las aplicaciones RN usan cabecera petróleo, SQL editor oscuro y tablas claras, SIEM ámbar y caída CRM rojiza. Herramientas HTML densas pero tranquilas, con texto de actividad y contexto primero y procedencia técnica accesible en el inspector.

STORY: El visitante observa trece registros, recibe la tablita y recorre seis estaciones. En cada programa consulta, abre filas, sigue cuentas cuando la herramienta lo permite, compara dos registros y guarda referencias; después lleva el razonamiento a la libreta, contrasta declaraciones y exporta lo que puede sostener sin borrar lo pendiente.

FIRST VIEWPORT: La oficina 3D llena la pantalla. Fecha y hora grandes arriba a la izquierda; mensaje y procedencia en el tercio inferior; controles en una franja discreta. Los monitores dominan los primeros planos y la consola nunca sustituye la habitación. Al visitar, solo retícula, señal de interacción y tablita baja quedan sobre la escena. Al abrir un ordenador, el primer viewport presenta el programa y su pregunta de investigación, con herramientas, área central e inspector; la libreta permanece accesible desde la cabecera, sin formulario evaluado dentro del programa.

FORM: Diez cortes fijos y una sola habitación transitable; seis puestos y una sola fuente de estado para programas, libreta y exportación. Identity Manager, Query Studio, CRM · Control de cambios, Event Desk, Recovery Console y Archivo de investigación reutilizan explorador, trabajo e inspector. SELECT local limitado sobre registros y soportes del canon: sin SQL Server ni evidencia nueva. Dirección y distribución fijadas por el brief v2 y el storyboard; seed key: `brief-v2-pinned` (sin ronda de concepto abierta).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance


## Composición de los programas

En escritorio: cabecera de aplicación, contexto, tres regiones desplazables (explorador, trabajo e inspector) y barra de estado. El centro abre con la pregunta del puesto; las acciones y los nombres legibles conducen a registros, comparación e inspector. La libreta se abre como superficie propia y el programa conserva vista, selección, consulta y comparación al volver.

Hasta 760 px: una columna de trabajo; herramientas y soportes usan filas horizontales desplazables, el inspector abierto sigue al contenido y recibe el foco en su título. Las tablas anchas se desplazan internamente. Entre 761 y 1180 px se conservan tres regiones compactas; desde 1650 px se amplían laterales y padding central. Medidas, colores y jerarquía vigentes en `../../DESIGN.md` y `../design.json`.

## Evidencia de la extensión

Artefactos: `src/computer.css`, `src/ui/ComputerPanel.ts`, `src/data/investigation.ts`, `src/investigation/query.ts`, `src/ui/ReviewPanel.ts` y `src/main.ts`. Capturas de revisión: `.impeccable/review/investigation/README.md` y sus capturas PNG. La documentación incorpora composición, reflujo móvil y tokens reutilizables de la implementación; mantiene la apertura y las decisiones del sistema previo.
