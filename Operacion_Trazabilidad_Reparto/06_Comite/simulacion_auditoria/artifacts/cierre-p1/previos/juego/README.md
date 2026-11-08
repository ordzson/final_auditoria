# Operación Trazabilidad: la oficina después del incidente

Simulación educativa local en primera persona para revisar el caso ficticio RedNova. Incluye una reconstrucción de diez planos y trece eventos, seis estaciones, una entrevista con el enlace de TI y seis fichas de auditoría. TypeScript, Three.js y Vite; dependencias gestionadas con `pnpm`.

La apertura muestra interfaces animadas propias de cada sistema: sesión remota, terminal SQL con filas y contador, transferencia por bloques, órdenes del CRM, despliegue, alertas y recuperación. Primero se observa la actividad y después aparece el enunciado del expediente. Las filas, consultas de muestra y progresos son ilustrativos, no archivos del caso ni resultados SQL ejecutados; las cifras finales conservan 31,840 registros, ~1.6 GB y 216 órdenes. Pausa y retroceso reconstruyen la animación desde el mismo tiempo. Con movimiento reducido se muestran estados estables; en móvil o sin WebGL se reutilizan las mismas pantallas en una vista plana.

Durante la visita, B abre un escritorio XP con Query Studio, Monitor de red, Informe del puesto y Expediente local; los demás ordenadores conservan sus programas de investigación anteriores. El jugador busca actividad, abre registros y compara fuentes. En B registra contrastes y conclusiones con guardado automático; **Libreta** y **Enlace de TI** permiten consultar las superficies del juego y volver al escritorio conservando el trabajo. Los nombres y las horas guían la exploración; los códigos y versiones siguen disponibles en la procedencia y la exportación. **Etapa 2 completada y aceptada dentro del alcance B**, con alcance y evidencia en [el informe integrado B](artifacts/desktop-b/README.md).

**«Documentado» significa que la actividad educativa tiene los sustentos estructurados exigidos. No significa auditoría aprobada, hallazgo formal, causalidad o autoría demostradas.**

## Requisitos y arranque

- Node.js 22.12 o posterior; comprobado con Node.js 22.21.1.
- `pnpm` 11.2.2.
- Chrome para las pruebas y la grabación. Se usa `/usr/bin/google-chrome` cuando existe; también puede indicarse `CHROME_PATH`.
- WebGL para la vista 3D. La alternativa plana conserva las seis estaciones y la entrevista cuando WebGL o el bloqueo del puntero no están disponibles.

```bash
cd "/home/ordson/Escritorio/Operacion_Trazabilidad_Reparto/06_Comite/simulacion_auditoria"
pnpm install
pnpm dev --port 4173
```

Abrir **http://127.0.0.1:4173**. No se cargan fuentes, scripts, modelos ni servicios desde dominios externos durante la ejecución. La instalación inicial necesita que las dependencias estén disponibles; no se afirma una instalación sin red ni un arranque en frío desde caché.

## Uso

1. Ver, pausar, recorrer u omitir la reconstrucción. Su duración objetivo es 110 segundos.
2. Entrar en la oficina y pulsar **Entrar a la oficina** para autorizar el control del puntero.
3. Acercarse al enlace y pulsar **E** para recibir la tablita y abrir la entrevista. Elegir un tema y una pregunta para escuchar su respuesta; las repreguntas aparecen al conversar y revisar documentos. **Consultar** abre la fuente y **Volver a la conversación** recupera el turno. Los temas ya hablados se distinguen y se pueden repetir durante la visita.
4. Explorar A–F y usar las herramientas: buscar una cuenta, ejecutar una consulta local, recorrer la recuperación o comprobar el inventario. Abrir un registro muestra el inspector; **Guardar pista en la libreta** conserva su referencia. **Comparar con otro registro** permite contrastar dos fuentes y sus horas reportadas.
5. Consultar al enlace de TI y contrastar las declaraciones con los registros. Abrir **Libreta** en el programa para registrar los contrastes, la conclusión, los límites y al menos una solicitud. Guardar pistas o ejecutar consultas no completa una revisión por sí solo.
6. Abrir la tablita con **J**, añadir recomendaciones opcionales y exportar JSON o imprimir/guardar en PDF desde el navegador.

| Control | Acción |
| --- | --- |
| WASD o flechas | Desplazarse |
| Mouse | Mirar |
| E | Recibir la tablita o interactuar con una estación |
| J | Abrir o cerrar la tablita, después de recibirla |
| Esc | Cerrar un diálogo o liberar el puntero |
| ↑ / ↓ y Enter, durante la entrevista | Elegir una opción y decirla |

En «Accesibilidad y controles» hay modo proyector, reducción de movimiento, aviso sonoro opcional, sensibilidad y acceso plano. El audio empieza desactivado y toda la información está disponible sin sonido. El acceso plano también funciona con teclado en pantallas estrechas. El progreso se guarda en `localStorage`, bajo `rednova.auditoria.oficina.v2`; reiniciar lo elimina. El guardado puede no persistir si el navegador bloquea el almacenamiento.

### Consultar el expediente

Query Studio ejecuta un subconjunto de SELECT sobre las tablas locales `registros` y `soportes`, construidas desde el canon. El editor es modificable; las consultas de ejemplo solo cargan texto. Se ejecuta con el botón o **Ctrl/⌘ + Enter**. El explorador muestra las columnas disponibles.

```sql
SELECT hora, sistema, cuenta, detalle
FROM registros
WHERE sistema = 'SQL Server'
   OR sistema = 'Monitoreo de red'
ORDER BY fecha, hora;
```

Admite selección de columnas, `*`, `WHERE`, comparaciones, `LIKE`, `IS NULL`, `IS NOT NULL`, `AND`/`OR`, paréntesis, `ORDER BY`, `TOP` y `LIMIT`. No admite JOIN, agregaciones ni escrituras. Las consultas con errores retiran los resultados anteriores y explican cómo corregirlas. Los valores `NULL` siguen ausentes: filtrar por `ext_ops_04` no atribuye la lectura SQL a esa cuenta.

Es una consulta real a datos empaquetados del expediente mediante un intérprete local limitado, sin conexión ni ejecución de SQL Server. No ejecuta ni valida las referencias Q-xx del plan académico. Las filas preservan sus referencias originales; solo se marcan como inspeccionadas al abrirlas o compararlas. B conserva consulta, comparación, borradores y ventanas al volver de libreta/TI y al recargar, en un workspace separado de la auditoría v2. Reiniciar desde la tablita limpia ambos; los fallos de guardado se comunican como «Solo en esta sesión».

## Construcción y verificación

```bash
pnpm test
pnpm build
pnpm test:e2e
pnpm verify
```

`pnpm build` ejecuta TypeScript sin emitir y genera `dist/`. `pnpm test:e2e` inicia o reutiliza el servidor de pruebas en el puerto 4173. `pnpm verify` ejecuta, en orden, pruebas unitarias, compilación y pruebas de navegador.

Para servir exactamente el paquete construido:

```bash
pnpm preview --port 4174
```

Abrir **http://127.0.0.1:4174**. La raíz es la ruta de despliegue prevista; los modelos se cargan desde `/models/`.

Verificación de la entrega base: **49 pruebas unitarias en 5 archivos y 11 pruebas E2E aprobadas**, además de TypeScript y la compilación. Las pruebas cubren navegación física, colisiones, entrega, seis revisiones, dependencia de fuentes, reconstrucción, transporte, persistencia, exportación, 1280×720, 1920×1080, acceso plano móvil a 390×844, reducción de movimiento, audio opcional y fallos simulados de WebGL/puntero. También comprueban que no haya solicitudes externas y que las seis estaciones sigan utilizables al pasar el contexto a offline después de cargar.

La compilación de etapa 2 conserva un aviso no bloqueante: el chunk principal supera 500 kB (793.85 kB; 213.81 kB gzip). No es un error de compilación ni una medida de rendimiento en hardware real.

El refinamiento de las pantallas se verificó aparte con 7 pruebas enfocadas de reconstrucción, TypeScript y compilación; revisión de navegador a 1280×720, 1920×1080 y 390×844, pausa, retroceso, movimiento reducido y alternativa sin WebGL. Sus capturas están en `artifacts/refinement/`. No se repitió la batería completa de la entrega base.

La extensión de los ordenadores se verificó con **66 pruebas unitarias**, compilación TypeScript/Vite y **18 E2E**: las 11 originales y 7 de investigación. Las pruebas nuevas comprueban consultas editables y errores, valores ausentes, conservación del foco y del desplazamiento móvil, pistas con trazabilidad, comparación de órdenes/despliegue, estados de recuperación, inventario sin originales y seguimiento de cuenta en SIEM. Capturas de los seis programas, escritorio 1440×900 y 1280×720, y móvil 390×844: `.impeccable/review/investigation/`. No se regeneraron el vídeo ni la libreta de ejemplo de la entrega anterior.

La integración B cerró **`pnpm verify` con código 0: 99 unitarias en 12 archivos, TypeScript/Vite y 23 E2E aprobadas**, incluidas cinco nuevas de B. Sus siete capturas y el veredicto independiente están en [el informe de etapa 2](artifacts/desktop-b/README.md). La revisión confirmó oficina reconocible y SELECT intacto con disposición `ship` limitada a esas dos correcciones; las etapas 3–5 siguen pendientes.

## Recorrido y archivos de ejemplo

Con el servidor de desarrollo activo:

```bash
pnpm record
```

O contra el paquete construido, con `pnpm preview --port 4174` activo en otra terminal:

```bash
BASE_URL=http://127.0.0.1:4174 pnpm record
```

`CHROME_PATH=/ruta/a/chrome pnpm record` permite seleccionar otro Chrome. El script usa acciones reales de la aplicación, posa en puntos de la reconstrucción y completa una libreta de ejemplo. No ejecuta SQL ni demuestra una auditoría humana.

Archivos generados:

- `artifacts/entrega/recorrido.webm`: vídeo WebM de la demostración; **no MP4**.
- `artifacts/entrega/libreta-respaldo.pdf`: informe A4 de ejemplo generado con Chrome.
- `artifacts/entrega/libreta-ejemplo.json`: estado y trazabilidad exportados.
- `artifacts/screenshots/`: capturas de apertura, oficina, revisión, tablita y accesibilidad.

El vídeo es una selección de la demostración, no la reproducción íntegra de 110 segundos. El PDF/JSON de ejemplo conservan las solicitudes y limitaciones aunque las seis fichas estén documentadas. Las anotaciones y recomendaciones libres no se interpretan automáticamente.

## Separación de hechos y presentación

- Los registros EVT-01–EVT-13 conservan sus **horas reportadas UTC−6**, no horas originales verificadas.
- Los resúmenes E-xx no son archivos originales autenticados ni resultados de consultas ejecutadas. Las referencias Q-xx no acreditan conexión ni ejecución en SQL Server.
- Las DECL-xx son declaraciones atribuidas, no corroboraciones independientes.
- Las vistas META-CUSTODIA y META-TIEMPO se calculan a partir del canon; no acreditan custodia ni sincronización.
- La oficina concentra copias por conveniencia didáctica; no sitúa físicamente la infraestructura.
- La nota se obtiene exclusivamente de `canon.presentation.ransomNote` en `src/data/canon.json`. Aparece en P08 entre 64 y 74 segundos, marcada como **recreación ilustrativa**, no como texto original, evento 14 o evidencia de cifrado, autoría o exfiltración.
- Los intervalos calculados no demuestran inicio del ataque, inacción, causalidad, conciliación, aprobación ni cumplimiento de RTO/RPO.

El canon y sus reglas se mantienen separados de la interfaz: `src/data/canon.json`, `src/audit/rules.ts` y `src/audit/evaluate.ts`. Las alternativas de una misma fuente no cuentan como grupos independientes; retirar una fuente utilizada invalida la comprobación correspondiente sin borrar el resto del trabajo.

## Modelos locales

El [inventario de assets](docs/inventario-assets.md) permite localizar los recursos aportados para los escritorios XP/Server y la oficina, con formatos, dimensiones, contenido de ZIP, cambios de nombre y correspondencias de los modelos existentes. Su [índice JSON](docs/inventario-assets.json) incluye las rutas internas y hashes; los originales permanecen en `/home/ordson/final auditoria/assets`. Las **etapas 0 y 1 del [plan de escritorios](docs/plan-escritorios-pc.md) están ejecutadas**: recursos locales en `public/computers/`, monitor preparado en `public/models/rack-monitor/`, escritorio XP/Server, estado de seis PCs, puente académico y aplicaciones B/comunes. El [mapa tipado](src/data/computerAssets.ts), los [créditos](public/computers/CREDITS.md) y el [manifiesto](public/computers/manifest.json) fijan claves y procedencia; los [contratos](docs/contratos-escritorios-pc.md) y la [dirección XP/Server](.impeccable/surfaces/computer-desktop.md) delimitan la implementación. El [informe de etapa 0](artifacts/desktop-stage0/README.md) conserva la validación de recursos. El [informe de etapa 1](artifacts/desktop-stage1/README.md) conserva las 99 unitarias, compilación, prueba aislada `pnpm test:desktop`, 18 E2E y nueve capturas de esa entrega. **La etapa 2 está completada y aceptada dentro del alcance B**, que utiliza el escritorio en producción; resultados y límites se registran en [su informe](artifacts/desktop-b/README.md), bajo el [recorrido B](docs/aceptacion-pc-b.md). A/C/D/E/F conservan ComputerPanel; sus aplicaciones nuevas y el monitor físico del rack siguen en etapa 3.

`public/models/` contiene cinco GLB: `rack.glb`, `filing-cabinet.glb`, `desk.glb`, `chair.glb` y `lamp.glb`. Son copias del material proporcionado por el usuario en `/home/ordson/final auditoria/assets/`, con ajustes de escala y posición en la escena y respaldo procedural si un modelo falla. No son evidencia del incidente. No se aporta una licencia o autoría adicional; confirmar los permisos antes de redistribuirlos fuera de esta actividad.

El enlace de TI utiliza el personaje local `public/models/fbi-agent/scene.gltf`, extraído de `fbi__cs2_agent_model_no1.zip` con su binario, quince texturas y [licencia](public/models/fbi-agent/license.txt). Se presenta a 1.8 m de altura detrás de su mesa; conserva su papel en la entrevista y la entrega de la tablita. El paquete incluye esqueleto y no incluye clips de animación. Si falla la carga, permanece el personaje geométrico de respaldo.

This work is based on "FBI | CS2 Agent Model №1" (https://sketchfab.com/3d-models/fbi-cs2-agent-model-no1-5dbf712384a3450f87ebbe502155df18) by 6lucius (https://sketchfab.com/6lucius) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/).

## Pendientes reales

- No se realizó un ensayo físico con proyector ni una validación con estudiantes/docente. La entrega base tuvo revisión en el hilo principal; la extensión de los programas recibió revisión independiente de escritorio y móvil. Su veredicto final `ship` resolvió las dos correcciones solicitadas (seguimiento de cuenta y documentación), al alcance de esa lista. Se conserva la advertencia anterior por Arial en la hoja de impresión (`src/styles.css:316`).
- No se aportó una base SQL ni se validaron resultados Q-xx; no se afirma que se hayan ejecutado consultas.
- Se inspeccionó el PDF digital, no una impresión física.
- La prueba offline bloqueó acceso externo y cambió el contexto a offline tras cargar. No hubo desconexión física del sistema ni arranque sin servidor desde caché.
- No hay backend, IA en vivo, multijugador, red dinámica, segunda corrida ni cambios a producción.
- La aplicación no sustituye el informe académico ni la revisión humana, y no demuestra autores, contenido transferido, causalidad, aprobaciones, conciliación o cumplimiento de RTO/RPO.

`PRODUCT.md` y `DESIGN.md` documentan el alcance y el sistema visual. La dirección fijada está en `.impeccable/direction-contract.md`; las capturas de revisión se conservan en `.impeccable/review/`.
