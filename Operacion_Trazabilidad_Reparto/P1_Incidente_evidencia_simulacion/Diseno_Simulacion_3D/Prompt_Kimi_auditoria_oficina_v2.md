# Prompt vigente para Kimi Code: auditoría en una oficina

El usuario confirmó que somos auditores. Este prompt reemplaza el de operaciones de TI de la versión 1. Usarlo con los archivos de esta carpeta; no mezclar ambos diseños.

Actualizado el 4 de noviembre de 2026. La guía PDF interna de P1 aún describe dos corridas: esa parte fue sustituida por la Tarea 9 y este diseño v2. No implementar la segunda corrida como requisito base. Los PDFs oficiales del curso conservan autoridad sobre hechos y entregables académicos.

---

Construye «Operación Trazabilidad: la oficina después del incidente», una experiencia local de navegador con una reconstrucción visual del incidente y un juego de auditoría en una única oficina 3D. Somos auditores: inspeccionamos, entrevistamos, contrastamos fuentes y documentamos. No repararemos producción como personal de TI.

Lee, en este orden:

1. `P1_Incidente_evidencia_simulacion/Diseno_Simulacion_3D/Diseno_auditoria_oficina_v2.md`.
2. `P1_Incidente_evidencia_simulacion/Diseno_Simulacion_3D/Plan_construccion_y_reparto_v2.md`.
3. `P1_Incidente_evidencia_simulacion/Diseno_Simulacion_3D/Caso_RedNova_base_v2.json`.
4. `00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf` y `00_Material_del_curso/Guia_Entregables_Operacion_Trazabilidad.pdf`.
5. Tarea 9 vigente del agente P1 y sus convenciones de evidencia. El diseño v1 de jugador TI queda sustituido.
6. `P1_Incidente_evidencia_simulacion/Diseno_Simulacion_3D/Storyboard_auditoria_oficina_v2.svg`: boceto de distribución e interacción, no una captura del juego ni una exigencia de reproducir una interfaz plana dentro del 3D.
7. `P1_Incidente_evidencia_simulacion/Diseno_Simulacion_3D/Reglas_evaluacion_auditoria_v2.md`: contrato de estado, fuentes y las seis fichas de evaluación; implementarlas sin inferir reglas nuevas de texto libre.

## La experiencia que buscamos

La apertura debe mostrar la oficina 3D y sus equipos como protagonistas. Superponer fecha/hora, un mensaje principal y procedencia en HTML legible; la consola no puede tapar toda la reconstrucción. Implementar los diez planos obligatorios de la sección 3 del diseño, con 110 segundos objetivo y los trece registros:

| Plano | Segundos | Cámara y acción |
| --- | --- | --- |
| P01 | 0–8 | Vista general nocturna desde la entrada; solicitud API del 12 de octubre y cambio explícito al 14. |
| P02 | 8–16 | Monitor A: sesión de ext_ops_04 sin MFA a las 02:17. |
| P03 | 16–23 | Mantener ancla A; registro separado de elevación a las 02:26, sin atribuirle la cuenta anterior. |
| P04 | 23–37 | Dos monitores B: 7 s para lectura de 31,840 registros, 7 s para ~1.6 GB sin contenido identificado. |
| P05 | 37–45 | Monitor C: 216 órdenes modificadas a las 02:42. |
| P06 | 45–53 | Mismo monitor C: despliegue a las 03:02; conservar las dos marcas temporales. |
| P07 | 53–61 | Monitor D: alerta crítica de las 03:18, con un único aviso sonoro opcional. |
| P08 | 61–77 | Primer plano de C: caída a las 03:42; a los 3 s aparece la nota ilustrativa durante 10 s. Es el momento central de la apertura. |
| P09 | 77–95 | Plano medio de rack E/CRM: recuperación solicitada, solo consulta y escritura; 6 s por estado. |
| P10 | 95–110 | Mesa F: conciliación de las 11:15; terminar con vista general, luz de visita y el enlace de TI visible. |

En P08 mostrar el texto genérico «Sus archivos están bloqueados. Para recuperarlos, debe realizar un pago.», con título «NOTA DE EXTORSIÓN» y rótulo permanente «Recreación ilustrativa · no es el texto original». Leer el texto desde `presentation.ransomNote` del canon, sin duplicarlo en el código. El expediente reporta la nota, pero no da texto ni hora de aparición: situarla durante la caída es una puesta en escena autorizada, no un nuevo hecho fechado. No añadir importes, contactos ni instrucciones de pago. La ilustración no cuenta como evidencia de exfiltración, autoría o cifrado confirmado ni como un decimocuarto evento.

Paleta: madera clara, grafito y marfil; madrugada azul grisácea y visita cálida. Rojo reservado al CRM afectado. Primeros planos oblicuos, monitor de aproximadamente medio encuadre, cámara quieta mientras se lee y transiciones de hasta 700 ms. Cámara anclada por estación, sin vuelos que crucen muebles; usar cortes cuando corresponda. Hora de al menos 40 px, mensaje de 24 px y procedencia/controles de 20 px a 1280 × 720. Movimiento reducido usa planos fijos y fundidos breves. No añadir glitch, alarmas continuas ni flechas que presenten causalidad como probada.

Pausa, saltar, volver a un plano y repetir disponibles. Pausar congela el reproductor completo; retroceder reconstruye el estado de las pantallas y nota sin duplicar efectos ni cambiar progreso. Todo se entiende sin sonido. No escribir texto letra por letra. El CRM vuelve en solo consulta y escritura en sus horas registradas, con integridad aún por verificar; no presentar una caída de internet de todos los clientes.

Después cambia la iluminación y entramos en primera persona. El enlace de TI nos entrega una tablita de auditoría al acercarnos y pulsar E. A partir de entonces la llevamos parcialmente visible en una mano, baja en una esquina del encuadre; antes de recibirla no se muestra. Omitir la reconstrucción conserva esa entrega. Exploramos la misma oficina: cuentas, SQL/red, CRM/cambios, SIEM, respaldo y mesa de custodia. El enlace también facilita preguntas y declaraciones. Todo se concentra ahí como sala de revisión con copias.

La cámara está en los ojos del auditor: WASD o flechas para caminar, mouse para mirar. Una retícula discreta y el alcance determinan qué equipo o persona se revisa con E. No usar tercera persona ni sustituir la caminata por saltos entre estaciones. J levanta/amplía la tablita para leer los pendientes con claridad; J o Esc la bajan. La mano/manga y tablita pueden ser geometría sencilla; no necesitamos un cuerpo completo. Los documentos y la tablita ampliada se leen en HTML nítido.

Implementar colisiones sencillas, espacios transitables e interacción por proximidad y línea de vista. Movimiento por tiempo transcurrido, diagonal normalizada y posición/mirada guardadas. Documentos, tablita ampliada y conversación detienen movimiento/mirada y liberan cursor; limpiar teclas al abrir paneles o perder foco. Activar el control del mouse con un clic del usuario; gestionar Esc y la reanudación sin intentar capturar el puntero continuamente. No añadir física compleja, saltos, carrera ni rutas autónomas del personal.

Las marcas de la tablita son automáticas: cada inspección pertinente, comparación y conclusión reevalúa las condiciones de la revisión. No hay botones para marcar casillas manualmente. Al reunir sustento suficiente se dibuja un visto discreto y queda guardado; una visita aislada no basta. Tablita en mano y ampliación leen el mismo estado. Mostrar lo pendiente y reevaluar las marcas si cambia el sustento.

El objetivo jugable es documentar la auditoría con sustento. El ciclo es encontrar una fuente, hacer una comprobación, contrastar y anotar qué podemos afirmar y qué falta. Una estación visitada no completa una tarea. Una conclusión no concluyente puede estar bien resuelta si explica la limitación con las fuentes pertinentes.

## Seis revisiones

- AU-01: cuenta, sesión y MFA, contrastados con el criterio disponible.
- AU-02: lectura de 31,840 registros y transferencia de aproximadamente 1.6 GB; distinguir lo reportado de exfiltración confirmada.
- AU-03: 216 órdenes modificadas a las 02:42, despliegue a las 03:02, ticket y declaraciones. Comparar integridad, atribución y orden temporal.
- AU-04: alerta de las 03:18, intervalo de 61 minutos desde el acceso de las 02:17 y límites del registro de atención.
- AU-05: respaldo programado frente a restauración probada; no dar por exitosa una ejecución no aportada. Revisar qué falta para evaluar RTO/RPO.
- AU-06: origen de copias, custodia, hora reportada/original y fiabilidad de registros.

Reutiliza las mismas herramientas de tabla, comparación y vinculación para las seis. Primera vista de 6–12 filas; detalles expandibles. La libreta conserva referencias sin obligarnos a copiarlas a mano. Las pistas son opcionales y no castigan explorar.

En AU-02 se puede colocar la declaración de Seguridad junto al flujo y señalar que el contenido está sin identificar. En AU-03 se comparan horas y el jugador puede pedir a BD la conciliación que respalde su afirmación. Queremos esos momentos concretos de descubrimiento.

## Alcance estricto para terminarlo bien

Una habitación, exploración en primera persona, una mano con tablita, seis estaciones, un enlace de TI fijo y un cierre. Sin cuerpo completo del auditor, movimiento autónomo del personal, sincronización labial, IA en vivo, red/ataque dinámicos, multijugador, backend, presupuesto automático ni motor de SQL en el navegador. No construir un editor genérico de controles ni un simulador de recuperación.

Crear una oficina agradable con geometría sencilla, madera clara, equipos grafito, iluminación diurna para la visita y una variante nocturna para la reconstrucción. Evitar efectos costosos y decoración de “hacker”. Una persona estilizada sentada basta. Las interacciones deben funcionar antes de ampliar el arte.

## Datos y evaluación

El JSON base contiene resúmenes del caso y referencias previstas a consultas, no resultados ya ejecutados. No inventar horas originales, IP, cuenta responsable de cada operación, contenido de tráfico, aprobación de cambios, causa probada o culpable. Los detalles de laboratorio añadidos necesitan procedencia didáctica explícita.

Ningún cambio de órdenes se presume fraudulento; una declaración no es prueba concluyente; respaldo exitoso no demuestra recuperación; falta de cierre de alerta no prueba ausencia de respuesta; 0.08 no es una probabilidad calibrada por sí solo. Un hallazgo requiere criterio aplicable: si falta, conservar la observación y lo pendiente.

Implementar las seis fichas de `Reglas_evaluacion_auditoria_v2.md`. Guardar `conclusionId`, referencias de fuente versionadas, respuestas de comprobación con sus fuentes, `limitationIds`, `requestIds` y `freeNote`. La marca es derivada de todos los requisitos: fuentes pertinentes inspeccionadas/vinculadas, comprobaciones resueltas, conclusión admitida, todos sus límites y al menos una solicitud pertinente. No existe operación manual de completar.

Las conclusiones evaluables son opciones estructuradas; el texto libre se guarda aparte como anotación sin evaluación automática. No intentar interpretar su significado con palabras clave o IA. No precargar respuestas. E-03/EVT-04 y E-04/EVT-05 son referencias alternativas, no corroboraciones independientes.

AU-02 exige lectura + transferencia + declaración de Seguridad, la comprobación de contenido/vínculo, una de sus dos conclusiones admitidas, los tres límites y una solicitud pertinente. Puede cerrarse sin recibir el documento solicitado. Retirar una fuente invalida las comprobaciones que la usaban, aunque exista otra alternativa; se rehacen con las referencias nuevas. Guardar/cargar reevalúa versiones y no restaura marcas antiguas sin comprobarlas.

Para AU-06, generar las vistas META-CUSTODIA y META-TIEMPO desde los campos existentes del canon. Su ausencia de originales/hashes/desfases puede documentarse sin fabricar un archivo. Los ejercicios con bytes reales son ampliaciones; no bloquean el cierre base. Si el vínculo que sostiene una conclusión no existe, no marcarla terminada.

Se puede mostrar el SELECT y su resultado importado. Una comprobación local sobre datos empaquetados se identifica como tal; no fingir conexión a SQL Server. Las escrituras permitidas son anotaciones sobre copias de trabajo, nunca cambios operativos a producción.

## Implementación y entrega

- Proyecto: `06_Comite/simulacion_auditoria/`.
- TypeScript, Three.js, Vite y HTML/CSS; exclusivamente pnpm para paquetes y scripts. Versiones compatibles verificadas al instalar y archivo de bloqueo.
- Separar canon/contenido, progreso/validación, escena y paneles. Geometría simple y una sola lógica de inspección reutilizable.
- Guardado local versionado, reinicio, pistas, modo proyector, teclado y reducción de movimiento.
- Informe imprimible y exportación JSON de la libreta, con referencias, conclusiones y pendientes. No generar hallazgos académicos aprobados automáticamente.
- Paquete con todos los recursos locales, servido desde 127.0.0.1 sin internet. No exigir abrir módulos por doble clic. Preparar una alternativa plana con los mismos seis accesos si falla WebGL.

## Orden de trabajo

Primera entrega: oficina básica en primera persona con colisiones, entrega de tablita, vista en mano y ampliación con J; estación B operable, declaración de Seguridad y comparación que documenta AU-02 y marca su casilla automáticamente. Debe poder completarse de principio a fin. No entregar solamente una escena bonita ni todos los paneles vacíos.

Segunda: completar seis estaciones, libreta, entrevista y validación de revisiones. Tercera: los diez planos de reconstrucción, nota ilustrativa, iluminación, pulido y exportación. Cuarta: prueba de recorrido, casos de aceptación de las fichas, legibilidad, paquete sin internet y correcciones. El archivo de plan detalla responsabilidades e insumos. Los encuadres y el contraste de las fuentes forman parte de la entrega; no sustituirlos por un panel de registros genérico.

Al finalizar, reportar ubicación del juego, instrucciones exactas con pnpm, qué comprobaciones se ejecutaron y qué falta. No afirmar ensayo con proyector ni datos SQL validados sin haberlos comprobado. La auditoría del curso y su base SQL siguen siendo entregables separados.

---

Este es un prompt de implementación, no prueba de que el juego ya existe. Los documentos v1 contienen decisiones sustituidas y no deben gobernar esta construcción.
