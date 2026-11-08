# Operación Trazabilidad: la oficina después del incidente

Juego educativo local para investigar el caso ficticio de RedNova ante una clase que no necesita conocer la organización interna del proyecto. Conserva la oficina, la reconstrucción ilustrativa, seis estaciones, entrevista, programas de investigación y libreta. Los nombres de las fuentes y las preguntas guían la lectura; las claves técnicas quedan como referencias. La presentación y el juego están dirigidos a computadora, en 1280×720 o 1920×1080; no se prevé jugarlo en móvil.

El jugador debe inspeccionar fuentes, contrastarlas y justificar sus conclusiones. **«Documentado» describe el sustento de la actividad educativa: puede seguir siendo no concluyente. No significa aprobación del docente, hallazgo confirmado ni culpabilidad demostrada.**

## Preparar la demostración

Requisitos: Node.js 22.12 o posterior, pnpm y navegador Chrome. Las pruebas de esta actualización usan el Chrome local; `CHROME_PATH` permite elegir otro ejecutable. Desde la raíz del repositorio:

```bash
cd Operacion_Trazabilidad_Reparto/06_Comite/simulacion_auditoria
pnpm install
pnpm build
pnpm preview --port 4174
```

Abrir **http://127.0.0.1:4174**. Mantener el servidor activo. Los recursos de ejecución son locales; la instalación inicial puede necesitar red. No se promete arranque desde caché sin servidor. Para trabajar en desarrollo: `pnpm dev --port 4173`.

Antes de exponer, activar **Accesibilidad y controles → Modo proyector**. Si el equipo no permite WebGL o control del puntero, elegir **Modo plano sin WebGL**: conserva las seis estaciones y la entrevista. Toda la investigación puede hacerse sin escuchar audio. Las voces originales se conservan como orientación; las explicaciones escritas amplían sus términos técnicos.

## Recorrido para la clase

1. Mostrar la reconstrucción. Sus trece sucesos provienen del caso, pero las pantallas, filas animadas y nota de extorsión son ilustrativas. Se puede pausar, retroceder u omitir. Las horas están reportadas en UTC−6 y no se verificaron los relojes.
2. Hablar con el enlace de TI (tecnología de la información) para recibir la tablita. La conversación es orientativa, no una entrevista realizada en la empresa. Consultar las declaraciones y contrastarlas.
3. Explorar las seis estaciones. Abrir registros, buscar, comparar y usar fuentes como sustento. Los programas conservan la estética XP/Server. Sus nombres comerciales se acompañan de instrucciones en español.
4. Abrir **Informe del puesto** o **Libreta** para elegir respuestas, conclusión, límites y solicitudes. Ni consultar ni guardar una pista completa por sí solo una revisión.
5. En la tablita, leer **Tres explicaciones abiertas y dos observaciones pendientes**. Justificar qué registros distinguirían robo de credenciales, uso indebido de acceso legítimo o actividad autorizada coincidente con un ataque por otra vía.
6. Abrir **Cierre, recomendaciones y exportación** para consultar las once acciones propuestas, añadir recomendaciones propias y exportar JSON o imprimir/guardar PDF.

| Puesto | Pregunta que se investiga | Límite principal |
| --- | --- | --- |
| A · Acceso remoto | ¿Quién accedió y con qué autorización? | `ext_ops_04` es una cuenta, no una persona; no conecta las otras acciones. Falta la política de accesos. |
| B · Lectura de datos y red | ¿Se enviaron los datos leídos? | 31,840 registros y ~1.6 GB no identifican contenido ni autorización. El cálculo ficticio de siete campos ocupa ~2.06 o ~5.12 MB. |
| C · Órdenes y cambios | ¿Se alteraron datos y por qué? | 216 órdenes proceden del caso; 144 cambios de monto y 72 de estado son supuestos. Candidatos a duplicidad no prueban doble cobro. |
| D · Alertas y seguimiento | ¿Qué atención está acreditada? | Faltan asignación, primera acción y cierre. Los intervalos de 61 y 24 minutos no prueban demora de detección ni inacción. |
| E · Recuperación | ¿Qué se recuperó y cómo se validó? | 315 y 355 minutos describen retorno de consulta y escritura, sin acreditar integridad ni objetivos de recuperación. |
| F · Registros y horarios | ¿Qué originales y relojes se verificaron? | Ver metadatos no lee archivos, calcula huellas ni comprueba permisos efectivos. |

La administración decide y ejecuta; el auditor recomienda y evalúa. Las once acciones siguen propuestas y sus plazos empiezan en una futura activación del plan. No se simula que hayan ocurrido en RedNova.

| Control | Acción |
| --- | --- |
| WASD / flechas y mouse | Caminar y mirar |
| E | Interactuar con estación o enlace |
| J | Abrir/cerrar tablita, después de recibirla |
| Esc | Cerrar documento o liberar puntero |
| Tab / Shift+Tab / Enter | Navegar y activar controles |
| ↑ / ↓ y Enter en entrevista | Elegir pregunta y hablar |

## Guardado y consultas

Se conserva `rednova.auditoria.oficina.v2` en `localStorage`, los identificadores de evaluación y el espacio de trabajo de los escritorios. Esta actualización editorial no requiere borrar partidas. El guardado pertenece al navegador y a la dirección con su puerto: cambiar de 4173 a 4174 abre otro espacio de guardado y no borra el anterior. Se comprobó restauración de una libreta anterior con las seis revisiones documentadas; conserva fuentes, respuestas, conclusiones y anotaciones. Un navegador que bloquee almacenamiento informa «Solo en esta sesión». Reiniciar es una opción explícita que borra el progreso.

Query Studio ejecuta un SELECT limitado sobre `registros` y `soportes` locales. SQL es el lenguaje de consulta; SELECT lee datos. Se puede editar y ejecutar con el botón o Ctrl/⌘+Enter. Admite filtros, ordenación, TOP y LIMIT, sin escrituras, JOIN ni agregaciones. Los valores ausentes siguen ausentes. No conecta con SQL Server ni ejecuta las consultas de los anexos académicos, que se probaron con datos ficticios.

## Fuentes y límites

El orden de autoridad es: documentos oficiales del curso para los hechos; entregables revisados para análisis y límites. Las guías internas de reparto no agregan hechos. La selección de documentos para el docente y los pendientes del equipo están en [entregables/LEEME.md](../../entregables/LEEME.md).

Se revisaron los dos PDF oficiales; reconstrucción del incidente; seis papeles de trabajo; observaciones pendientes; pestañas **Lectura** de cronología, índice y programa de pruebas; once acciones; guion; presentación y fuentes. Se distinguen datos reportados, declaraciones, resultados ficticios, hipótesis y desconocidos. No se aportaron originales de la empresa, identidades personales, autorizaciones, conciliación concluida ni relojes comprobados.

Las referencias técnicas y las versiones permanecen en detalles y exportaciones. `src/data/language.ts` describe las fuentes sin modificar el canon; `guidance.ts` concentra límites, hipótesis y propuestas. Pantallas e impresión comparten estas explicaciones. El JSON mantiene sus campos anteriores y añade textos legibles. No cambian las respuestas admitidas ni los requisitos para documentar.

## Verificación y respaldo de presentación

```bash
pnpm test
pnpm build
pnpm test:e2e
pnpm verify
```

`pnpm verify` ejecuta unitarias, TypeScript/Vite y pruebas de navegador. El [registro de esta actualización](artifacts/clase/README.md) contiene los resultados actuales, capturas y límites. Los conteos de entregas anteriores son históricos y se conservan en [README anterior](artifacts/clase/previos/README-anterior.md) y en sus respectivos informes. No acreditan esta versión.

Para regenerar la demostración desde el paquete construido, mantener el servidor de preview activo y ejecutar:

```bash
BASE_URL=http://127.0.0.1:4174 RECORD_SCREENSHOTS=artifacts/clase/recorrido pnpm record
```

Archivos para presentar:

- [Recorrido grabado WebM](artifacts/entrega/recorrido.webm), selección automatizada y muda del recorrido; no es un ensayo humano.
- [Libreta de respaldo PDF](artifacts/entrega/libreta-respaldo.pdf), ejemplo con seis revisiones y sus límites.
- [Libreta de ejemplo JSON](artifacts/entrega/libreta-ejemplo.json), con identificadores, preguntas, respuestas, hipótesis y acciones propuestas.
- [Capturas y verificación](artifacts/clase/README.md).

Las recomendaciones libres del ejemplo pueden quedar vacías. Las once propuestas documentadas se muestran aparte y no se presentan como decisiones del jugador ni como acciones ejecutadas. Los archivos reemplazados y los cambios previos se conservaron en `artifacts/clase/previos/`.

## Pendientes reales

Faltan ensayo físico en clase con proyector, revisión de estudiantes/docente e inspección de una impresión física. Las comprobaciones digitales no equivalen a esos ensayos. El informe completo del equipo, las matrices globales, los cinco hallazgos sustentados, el plan de 90 días con presupuesto y la defensa conjunta siguen pendientes según los entregables.

No hay backend, ataque dinámico, conexión a producción ni nueva ejecución del laboratorio académico. Las pruebas offline se limitan a bloquear solicitudes externas y desconectar el contexto del navegador después de cargar; no prueban un arranque físico sin red. La compilación advierte un archivo JavaScript mayor de 500 kB; no es una medida de rendimiento en el equipo del aula.

Los modelos proporcionados por el usuario conservan su procedencia y los respaldos geométricos. Las licencias de Kenney y del personaje permanecen en `public/models/`. El personaje se basa en “FBI | CS2 Agent Model №1” de 6lucius, CC-BY-4.0: [fuente](https://sketchfab.com/3d-models/fbi-cs2-agent-model-no1-5dbf712384a3450f87ebbe502155df18), [licencia](http://creativecommons.org/licenses/by/4.0/).
