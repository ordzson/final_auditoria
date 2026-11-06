# Operación Trazabilidad: la oficina después del incidente

Diseño vigente, revisión 2, actualizado el 4 de noviembre de 2026. El jugador es auditor. Reemplaza el diseño de operaciones de TI de la revisión anterior.

La guía PDF interna de P1 conserva la propuesta anterior de dos corridas. Para construir el juego mandan este diseño, la Tarea 9 actualizada y el prompt v2. Los PDFs oficiales del curso siguen mandando sobre hechos y entregables académicos. No se requiere una segunda corrida en el juego base.

## 1. La experiencia

Primero vemos qué quedó registrado durante la madrugada del 14 de octubre. Después entramos como auditores a una única oficina que reúne estaciones, copias de registros, documentos y una persona de enlace. Nuestra libreta contiene seis asuntos por revisar. Investigamos, contrastamos declaraciones y documentamos conclusiones con sus límites.

La oficina concentra el caso por conveniencia del juego. Es una sala de revisión con réplicas y expedientes, no una afirmación de que la nube, la producción y todos los servicios de RedNova estuvieran físicamente juntos. Un pequeño rack representa la copia de revisión de SQL Server y respaldos. Los monitores dan acceso a registros de los otros sistemas.

Nosotros no restablecemos producción ni revocamos cuentas. Inspeccionamos, solicitamos pruebas controladas, evaluamos el resultado y recomendamos acciones. El éxito es entregar una revisión defendible; no conseguir que todos los sistemas terminen en verde ni inventar un culpable.

Lo que debe recordar quien juegue: encontró una contradicción, buscó el registro que la podía resolver y logró distinguir lo probado de lo que solo se estaba afirmando.

[Boceto visual de los tres momentos y la oficina](Storyboard_auditoria_oficina_v2.png), también disponible como [SVG editable](Storyboard_auditoria_oficina_v2.svg). Es una referencia de distribución e interacción, no una captura de una aplicación implementada.

## 2. Alcance que sí podemos terminar

| Elemento | Alcance base |
| --- | --- |
| Espacio | Una oficina 3D compacta, sin exteriores ni otros niveles. |
| Exploración | Primera persona: WASD o flechas para caminar, mouse para mirar y E para interactuar con lo que se mira a corta distancia. |
| Objetos principales | Seis estaciones y una tablita de auditoría que se recibe al comenzar la visita y se lleva parcialmente visible en la mano. J permite ampliarla. |
| Personal | Un enlace de TI visible y fijo, con conversaciones escritas. Facilita declaraciones de otras áreas como documentos atribuidos. |
| Apertura | Diez planos definidos, 110 segundos objetivo, con los trece registros, caída del CRM y nota de extorsión ilustrativa. Pausable, saltable y consultable después; pendiente de ensayo. |
| Partida | Seis revisiones; objetivo aproximado de 15–20 minutos para una primera partida, pendiente de prueba. |
| Mecánicas | Inspeccionar, filtrar, comparar, conversar y vincular evidencia a una conclusión. |
| Cierre | Libreta completada con conclusiones justificadas, recomendaciones y pendientes; exportación imprimible y JSON. |

No construir para esta versión: simulador de ataques, respuesta en tiempo real, red dinámica, personal con rutas autónomas, combate, inventario de llaves, motor de SQL Server en el navegador, conversación con IA en vivo, presupuesto optimizado automáticamente ni editor genérico de soluciones. El auditor sí puede caminar; el enlace de TI permanece en su puesto.

Los tiempos y cantidades de contenido son decisiones propuestas de diseño. No son hechos del caso ni supuestos S-xx ya aprobados.

## 3. Dos momentos visuales, un solo lugar

### La madrugada: reconstrucción

La dirección visual es una reconstrucción de oficina: el público ve los monitores pasar de registros de actividad a una alerta, a la interrupción del CRM y finalmente a una recuperación por etapas. El momento central es la caída de las 03:42 y la aparición de una nota de extorsión ilustrativa. La misma habitación se convierte después en sala de revisión. El foco pasa de «qué se registró» a «qué podemos demostrar».

La oficina 3D ocupa el encuadre; una franja HTML superpuesta mantiene fecha, hora, sistema, un mensaje principal y procedencia legibles. Un registro activo puede mostrarse en grande, pero una consola opaca no debe ocultar la oficina durante toda la apertura. Hay hasta seis líneas recientes en el historial desplegable; no compiten con el mensaje principal. El texto aparece completo, sin escritura letra por letra.

#### Aspecto, composición y movimiento

- Conservar madera clara, equipos grafito y paredes marfil. En la madrugada, iluminación ambiental azul grisácea y luz de los monitores; en la visita, luz cálida lateral de ventana. Esta iluminación es puesta en escena, no una hora de visita acreditada.
- Paleta de referencia: fondo nocturno `#17262E`, papel `#F4F0E6`, grafito `#29383D`, acento de revisión `#517C78`, advertencia `#C49A52` y estado crítico `#B84A48`. Rojo solo en el monitor afectado y su aviso; no teñir toda la oficina de alarma.
- Fecha/hora arriba a la izquierda; mensaje principal debajo o en el tercio inferior, sin cubrir el monitor protagonista. En 1280 × 720: hora de al menos 40 px, mensaje de 24 px y procedencia/controles de al menos 20 px. El modo proyector permite aumentar tamaños.
- Fijar posiciones de cámara frente a cada estación y una vista general desde la entrada. En primeros planos, el monitor ocupa aproximadamente la mitad del ancho y queda una porción reconocible de escritorio y oficina. Usar una lente moderada, con campo vertical orientativo de 50°, sin gran angular extremo ni cámara al hombro.
- Cada cambio de plano dura como máximo 700 ms y deja la cámara quieta mientras se lee. Usar corte o fundido si el trayecto atraviesa muebles; no volar entre escritorios. Para movimiento reducido, todos los planos son fijos y los cambios usan un fundido breve.
- El movimiento dirige la mirada hacia el equipo cuyo registro se muestra. No dibujar trayectorias entre VPN, SQL, tráfico y cifrado como si fueran una cadena causal probada. No representar una interrupción de internet de todos los clientes: lo reportado es la caída del CRM.

#### Guion de encuadres obligatorio

Los tiempos siguientes son segundos de reproducción, no horas del caso. Suman 110 segundos como objetivo de diseño. Pausar congela cámara, reloj narrativo y transiciones. Cada evento aparece completo antes de avanzar; las duraciones se ajustarán tras el ensayo sin omitir los trece registros.

| Plano / reproducción | Hora del expediente y registros | Encuadre y cambio visible | Mensaje principal |
| --- | --- | --- | --- |
| P01 · 0–8 s | 12 oct., 16:15 · EVT-01 | Vista general desde la entrada, ligeramente oblicua. Monitores encendidos y oficina nocturna. Una tarjeta muestra la solicitud API pendiente; al final cambia explícitamente la fecha al 14 de octubre. | «RedNova: servicios de internet y televisión. Una solicitud de acceso seguía pendiente». |
| P02 · 8–16 s | 14 oct., 02:17 · EVT-02 | Primer plano del monitor A, desde el lado del escritorio. Se resalta únicamente la sesión ext_ops_04 y la etiqueta «Sin MFA». | «Se registra una sesión remota sin segundo factor». |
| P03 · 16–23 s | 02:26 · EVT-03 | Mantener el ancla de A y pasar a la vista de identidad con un cambio corto de pantalla. La elevación aparece como un registro separado, sin asignarle la cuenta del evento anterior. | «Identidad registra una elevación de privilegios». |
| P04 · 23–37 s | 02:31 y 02:35 · EVT-04/05 | Plano oblicuo de los dos monitores B. Primero se destaca SQL y «31,840 registros» durante 7 s; después red y «~1.6 GB» durante 7 s. Los monitores no se conectan con flechas ni con archivos de clientes animados. | «Lectura reportada»; después «Transferencia externa: contenido sin identificar». |
| P05 · 37–45 s | 02:42 · EVT-06 | Primer plano del monitor C con resumen de actividad del CRM. Aparece «216 órdenes modificadas» sin inventar filas, campos o importes. | «Se reportan cambios en 216 órdenes comerciales». |
| P06 · 45–53 s | 03:02 · EVT-07 | Mismo monitor C, ahora con la tarjeta de despliegue. Dos marcas temporales conservan visibles 02:42 y 03:02. | «El despliegue ocurre después de los cambios de órdenes». |
| P07 · 53–61 s | 03:18 · EVT-08 | Corte al monitor D. Un aviso ámbar pasa a crítico con texto e icono; un único sonido breve opcional dirige la atención. | «Se emite una alerta crítica». |
| P08 · 61–77 s | 03:42 · EVT-09 | Corte al CRM de C. Su vista se sustituye por «CRM no disponible» y un resumen de archivos aparentemente cifrados. A los 3 s del plano aparece la nota descrita abajo durante 10 s, legible en el monitor y en un recuadro HTML. El último tramo devuelve el foco a la interrupción comercial. | «Ventas y facturación afectadas. Se sospecha ransomware». |
| P09 · 77–95 s | 04:05, 08:57 y 09:37 · EVT-10/11/12 | Plano medio con rack E y monitor del CRM. Tres estados de 6 s: «Recuperación solicitada», «Solo consulta» y «Escritura restablecida». El rack no representa una restauración cuya ejecución exacta se conozca. | «Recuperación solicitada» → «Servicio parcial» → «Escritura restablecida; integridad por verificar». |
| P10 · 95–110 s | 11:15 · EVT-13; visita sin hora asignada | Plano de la mesa F con la solicitud de conciliación. En los últimos segundos, volver a la vista general y fundir a la iluminación de visita. Desaparece el reloj del incidente y aparece «Visita de auditoría»; el enlace de TI queda visible. | «Finanzas solicita conciliación»; después «El servicio volvió. ¿Qué podemos sostener con evidencia?». |

En P09 se pueden mostrar los intervalos calculados de 5 h 15 min hasta solo consulta y 5 h 55 min hasta escritura, sin llamarlos RTO cumplido o incumplido. Las pantallas conservan etiquetas de estado y no se vuelven todas verdes al terminar. El reloj salta entre horas registradas; no reproduce el transcurso real de la noche.

#### Nota de extorsión durante la caída

En P08 debe aparecer un aviso sencillo, sin interacción obligatoria:

> **NOTA DE EXTORSIÓN**
>
> Sus archivos están bloqueados.
> Para recuperarlos, debe realizar un pago.

Junto a él permanece el rótulo «Recreación ilustrativa · no es el texto original». La procedencia ampliada explica: «El expediente reporta una nota exigiendo pago; no aporta su contenido ni la hora de aparición». La hora 03:42 pertenece a la caída del CRM; ubicar la ilustración en ese plano es una decisión narrativa, no una nueva hora de descubrimiento. No añadir importe, dirección de pago, contactos, cuenta regresiva ni afirmaciones de robo de datos.

El usuario autorizó esta redacción genérica para explicar el incidente. Se almacena como contenido de presentación separado de los hechos del caso en el JSON. No es un nuevo evento EVT, evidencia E ni texto recuperado. Pausar y volver a ese plano permite leerla; saltar o repetir no cambia la investigación. En la visita puede consultarse como ilustración, pero no sirve para acreditar exfiltración, autoría o un cifrado técnicamente confirmado.

Evitar alarmas permanentes, parpadeos, glitch y efectos de “hacker”. La secuencia funciona sin sonido. Un rótulo identifica «Reconstrucción del expediente · puesta en escena ilustrativa»; los resultados SQL se identificarán aparte como laboratorio cuando se incorporen. Todos los cambios de pantalla se derivan del evento y del tiempo del reproductor: volver atrás recompone el plano y su estado, sin duplicar avisos ni alterar la partida.

Al terminar, la luz de la oficina cambia a la escena de visita en primera persona. El enlace de TI dice: «El CRM volvió. Ahora revisemos qué podemos sostener con los registros». Al acercarnos y pulsar E recibimos la tablita; una transición corta la coloca en la mano. Antes de recibirla no aparece en pantalla. Omitir la reconstrucción lleva al mismo inicio de visita y conserva esta entrega. No asignar una hora o fecha exacta de visita que el caso no proporciona.

### La visita: exploración

El jugador ve desde los ojos del auditor y camina por la oficina con WASD o flechas; el mouse controla la mirada. Una retícula discreta y la proximidad determinan qué escritorio, rack o persona puede revisarse. Aparece «E · Revisar» o «E · Hablar» y la interacción abre una herramienta HTML legible. Al cerrarla se continúa desde la misma posición y dirección de mirada.

El movimiento ocurre sobre el suelo, con velocidad de caminata y dirección diagonal normalizada. Paredes, escritorios y rack tienen colisiones sencillas en planta para impedir atravesarlos. No hace falta un motor de física, saltar, correr ni un sistema de navegación autónoma. No se necesita modelar un cuerpo completo del auditor: una mano y un tramo de manga sencillos sostienen la tablita en primer plano.

La interacción exige proximidad y línea de vista: no se revisa un equipo a través de paredes o muebles. Los pasillos dejan espacio para llegar a todas las estaciones y al enlace de TI. Al abrir documentos, entrevista o la tablita ampliada se detienen caminata y mirada, se liberan teclas y cursor; escribir o usar flechas en un formulario no desplaza al auditor. También se limpian teclas al perder foco. La reconstrucción inicial usa su cámara propia y no recibe órdenes de caminata.

Al comenzar a explorar, un clic «Entrar a la oficina» activa el control del mouse. Al cerrar un panel se ofrece «Continuar explorando» si el navegador requiere otro clic para recuperarlo. Esc permite liberar el cursor sin perder la partida. No intentar recuperar el puntero repetidamente ni dejar al jugador atrapado si la función no está disponible.

La escena es cálida y algo apretada: escritorios de madera clara, equipos grafito, archivador, cables recogidos, reloj, lámpara y una taza. Luz de mañana, sombras suaves, señalización sobria de oficina. El atractivo viene de reconocer un lugar trabajado y ver sus equipos funcionar, no de añadir efectos caros. La ironía de tenerlo todo al alcance se transmite mediante la composición y algún detalle de oficina, sin convertir el incidente en una broma.

No hay búsqueda de píxeles. Las seis estaciones tienen nombre y señal de proximidad. Caminar es la exploración principal. La libreta señala dónde está cada pendiente; una opción de acceso asistido puede situar al auditor en un punto libre frente a una estación para quien necesite evitar recorridos repetidos. Esa opción complementa el movimiento, no lo sustituye en la partida normal.

## 4. Distribución de la oficina

```text
┌─────────────────────────────────────────────────────┐
│ A · Accesos       B · SQL / red      D · SIEM y reloj │
│ PC y política     dos monitores     monitor de pared │
│                                                     │
│ C · CRM / cambios       Mesa / enlace de TI           │
│ órdenes y ticket       entrevista y declaraciones   │
│                                                     │
│ E · Rack de revisión      F · Mesa del auditor        │
│ respaldo y prueba         libreta, copias y archivo  │
└──────────────────── entrada ─────────────────────────┘
```

La persona es un enlace de TI. Puede explicar dónde está un documento, reconocer una limitación y entregar declaraciones de BD, Seguridad o Desarrollo. No debe hablar como si ocupara todos esos cargos. Para la primera versión basta un personaje sentado construido con geometría sencilla, sin sincronización labial ni animación de marcha.

## 5. La libreta y el ciclo de juego

Cada revisión sigue el ciclo: observar una pregunta → encontrar una fuente → hacer una comprobación breve → contrastar otra fuente o criterio → documentar una conclusión y un límite.

La libreta se representa como una tablita con hoja y clip, sostenida en la mano. Al caminar queda baja y ligeramente inclinada en una esquina inferior, ocupando una parte pequeña del encuadre; no debe tapar la retícula, equipos o pistas. No es necesario leer la hoja en esa posición. J la levanta/amplía y muestra el contenido nítido en HTML, con pendientes, avances y fuentes; J o Esc permiten bajarla otra vez. Ese panel y la tablita en mano representan la misma hoja y usan el mismo estado.

Las casillas se marcan automáticamente al cumplir las condiciones de cada revisión. El jugador no hace clic en una casilla ni pulsa «Marcar como completado». Inspeccionar la fuente pertinente, realizar la comparación, vincular sustento y documentar el resultado son eventos que reevaluarán el progreso. Un breve trazo de visto o aviso discreto confirma la actualización; la marca sigue ahí cuando se levanta la tablita.

La libreta tiene estas columnas en vista ampliada: asunto, fuentes vinculadas, comprobación y estado. Sus estados son «Pendiente», «Fuentes reunidas», «Por contrastar» y «Documentado». Una conclusión no concluyente bien sustentada también completa automáticamente una revisión. Nunca se marca como hecha solo por visitar la estación o abrir un archivo. Si se modifica o retira el sustento de una conclusión, se reevalúa la marca y se muestra qué sigue faltando.

Al abrir un asunto se ven cuatro espacios sencillos: «Lo observado», «Con qué lo comparo», «Qué puedo afirmar» y «Qué falta». Se pueden fijar filas de una tabla o fragmentos de un documento directamente desde su herramienta. No se pide escribir un ensayo ni memorizar códigos. El sistema conserva la referencia por nosotros.

Las conclusiones evaluables se eligen entre afirmaciones breves con identificador estable. El jugador vincula las fuentes, responde la comprobación de la actividad y selecciona las limitaciones y solicitudes pertinentes. Puede añadir un comentario libre identificado como «Anotación personal: sin evaluación automática». Editar ese comentario no modifica el significado de la afirmación elegida ni se interpreta como una nueva conclusión validada.

Las seis fichas y el contrato de evaluación están definidos en [Reglas_evaluacion_auditoria_v2.md](Reglas_evaluacion_auditoria_v2.md). Incluyen fuentes alternativas, comprobaciones concretas, conclusiones admitidas, opciones sin sustento y respuestas cuando falta información. Se comparan identificadores y referencias, no cadenas de texto ni significado inferido por IA. Una misma transcripción del caso presentada como E-xx y EVT-xx no cuenta como dos corroboraciones independientes.

La marca «Documentado» exige todas las condiciones de la ficha: fuentes pertinentes inspeccionadas y vinculadas, comprobaciones resueltas sobre esas fuentes, conclusión compatible, límites y al menos una solicitud pertinente registrada. Si falta un documento que no está en el expediente, se documenta esa ausencia y qué se pediría; no se exige obtenerlo para terminar. No existe botón de completar ni aprobación automática del comentario libre. El cierre final añade recomendaciones y sus pruebas de verificación, sin recalificar esos textos como hallazgos académicos.

Si falta algo, la respuesta distingue una conclusión excesiva de una revisión incompleta: «El volumen no identifica el contenido: revisa la conclusión» o «Falta registrar qué documento solicitarías». Si ya se anotaron el contenido desconocido y la solicitud pertinente, AU-02 puede completarse sin recibir datos inexistentes. No se castiga por explorar ni se revela toda la solución al primer error. Una pista opcional indica primero dónde buscar y después cómo comparar.

## 6. Seis revisiones jugables

| Revisión | Dónde y con qué | Interacción concreta | Qué puede sostenerse y qué debe quedar abierto |
| --- | --- | --- | --- |
| AU-01 · ¿El acceso estaba controlado? | A: listado de cuentas, sesión VPN, criterio de acceso cuando exista. E-01 y E-02; Q-02/Q-03 previstas. | Filtrar cuenta y método; fijar la sesión sin MFA; contrastar con privilegios/política. | El caso registra acceso sin MFA. Afirmar incumplimiento requiere un criterio aplicable; quién usó la cuenta no se deduce del nombre. |
| AU-02 · ¿Qué sabemos de los datos que salieron? | B: bitácora SQL y resumen del flujo. E-03/E-04; declaración de Seguridad; Q-05/Q-06 previstas. | Poner lectura y transferencia lado a lado; seleccionar qué dato está presente y qué conexión falta. | 31,840 registros leídos y aproximadamente 1.6 GB transferidos están reportados. No quedan probados contenido, vínculo entre ambos ni exfiltración. |
| AU-03 · ¿Las órdenes estaban intactas y qué relación hay con el cambio? | C: resumen de 216 órdenes, ticket y declaración de BD/Desarrollo. E-05/E-06; Q-07/Q-10 previstas. | Comparar horas y campos; colocar 02:42 y 03:02 en una línea temporal ya rotulada; pedir sustento para la conciliación o aprobación. | Se reportan modificaciones anteriores al despliegue. Ni fraude, ni autoría, ni causalidad del despliegue se infieren automáticamente. |
| AU-04 · ¿Qué atención de alertas podemos demostrar? | D: alerta crítica y cronología. E-07; Q-11/Q-12 previstas. | Relacionar acceso y alerta; el sistema calcula 61 minutos. Examinar asignación/primera acción/cierre cuando existan. | El intervalo está calculado. Sin registro de cierre no se prueba que nadie actuó; tampoco se conoce el inicio real del ataque. |
| AU-05 · ¿El respaldo demostraba que se podía recuperar? | E: E-08, declaración de Continuidad y estados de vuelta del CRM; Q-09 prevista. | Contrastar respaldo programado con restauración documentada y las etapas de vuelta del servicio; seleccionar qué soporte falta. Una ejecución exitosa solo se incorpora si existe un resultado de laboratorio identificado. | Programación de respaldos no demuestra ejecución exitosa ni restauración dentro de RTO/RPO. Objetivos y punto recuperable ausentes se muestran pendientes. |
| AU-06 · ¿Podemos confiar en las copias y en el orden de los registros? | F y D: procedencia y campos de custodia/tiempo del JSON; archivos reales cuando se incorporen. | Comparar hora reportada con hora original y revisar qué metadatos faltan. Con archivos didácticos disponibles, conservar original, anotar sobre copia y comparar hashes reales como ampliación. | Se puede documentar la limitación sin fabricar un original. Un hash detecta cambios de bytes; no prueba verdad ni completitud. Desfase desconocido no equivale a reloj verificado. |

Estos AU-* son identificadores internos del juego. No sustituyen T-xx, PT-xx, E-xx ni hallazgos H-xx del equipo.

AU-01 puede enseñar un incumplimiento dentro de una política didáctica aprobada para el laboratorio. Si todavía no hay política o criterio, la salida correcta es una observación con criterio pendiente; el juego no inventa un hallazgo confirmado. Para AU-06, cualquier copia, desfase o pérdida que se agregue al fixture debe identificarse como dato didáctico, no como hecho adicional del incidente.

El archivador de F permite consultar E-09 y E-10: SLA, alcance del SOC 2 y puntaje de IA 0.08, con sus limitaciones. Sus minijuegos completos son una ampliación; no impiden terminar las seis revisiones. La auditoría completa del curso sigue requiriendo el trabajo de P2 y P3.

## 7. Una revisión vista desde el jugador

En el escritorio B se abre el flujo de las 02:35. El jugador fija «~1.6 GB, destino no clasificado». En la entrevista abre la declaración de Seguridad, que llama fuga a ese tráfico, y usa «Contrastar con un registro» para colocar el flujo a su lado.

La libreta pregunta qué puede afirmarse. El jugador vincula lectura SQL, transferencia y declaración de Seguridad. La comparación pregunta si esos registros identifican el contenido transferido; elige «No; falta correlación y contenido». Selecciona «Transferencia reportada; exfiltración no demostrada», registra las limitaciones de contenido/vínculo/autoría y solicita evidencia del flujo y proceso de origen. Puede usar el resumen E-03/E-04 o los registros EVT-04/05 como referencias alternativas a la misma fuente del curso.

La revisión queda documentada con una conclusión prudente. El monitor del escritorio queda con una pequeña etiqueta de expediente revisado. Se completa una tarea real de razonamiento en aproximadamente dos minutos de diseño; no hubo que leer miles de líneas ni acertar una contraseña.

Otro momento satisfactorio está en C: al colocar el despliegue después de los cambios de órdenes, se hace visible el problema de una atribución apresurada. No se muestra por eso que el despliegue fuese inocuo; solo que el vínculo causal propuesto no está demostrado.

## 8. Entrevista breve y útil

Un menú de temas ofrece hasta tres preguntas por vez y una salida clara. Las respuestas son textos breves escritos por el equipo, sin voz obligatoria. Al mostrar un documento pertinente se habilita una repregunta contextual.

Ejemplos de contenido propuesto, sujeto a revisión del equipo:

- «¿Con qué respaldan que las órdenes están intactas?» El enlace facilita la declaración atribuida a BD y reconoce que el caso no aporta la conciliación concluida.
- «Seguridad llamó fuga al tráfico. ¿Qué contenido identificaron?» Entrega la declaración inicial y señala que el expediente no identifica los datos transferidos.
- «¿Dónde está la aprobación del despliegue?» Entrega la afirmación de autorización verbal atribuida a Desarrollo y el estado documental del ticket.

El personaje no inventa una confesión ni resuelve cada revisión con su respuesta. La conversación sirve para pedir soportes y confrontar una declaración con un documento. Hay un máximo propuesto de nueve preguntas base y tres repreguntas para todo el juego.

## 9. Técnica suficiente, sin trabajo repetitivo

Cada estación reutiliza una herramienta de tabla con filtros, comparación de dos documentos y botón «Vincular a la libreta». Primera vista de 6–12 filas y columnas pertinentes; ampliar es opcional. Los detalles técnicos tienen explicación de una frase al primer uso y permanecen accesibles.

Las consultas SQL se presentan como tarjetas de prueba: pregunta, SELECT expandible y resultado exportado. Se puede cambiar un filtro de visualización o repetir una comprobación local sobre el fixture, pero se distingue claramente de ejecutar SQL Server. Nada de escribir consultas extensas para poder caminar por la oficina.

Una tabla de telemetría puede tener un registro cuyo campo de filas leídas sea 31,840; eso no exige cargar 31,840 clientes al navegador. Para las órdenes se puede usar el conjunto sintético de 216 identificadores y mostrar agrupaciones, siempre que su fuente exista. Si solo está el resumen del PDF, se muestra como resumen y no se fabrican detalles que parezcan extraídos.

No sumar datos inventados a cifras del expediente. El tamaño de una muestra visible no cambia el total reportado. Los nulos se presentan como «No aportado»; se conserva cero como valor distinto. Las horas no dependen de la zona configurada en el equipo.

## 10. Canon del incidente

La fuente es el proyecto oficial, pág. 4, hora de Guatemala UTC−6. Las referencias E-01–E-10 vienen de la pág. 5. El archivo [Caso_RedNova_base_v2.json](Caso_RedNova_base_v2.json) conserva los registros y límites sin añadir una explicación del ataque.

| Fecha/hora | Registro que debe conservarse |
| --- | --- |
| 12 oct., 16:15 | Proveedor solicita renovación de acceso privilegiado a una API; autorización pendiente. |
| 14 oct., 02:17 | Inicio de sesión remoto de ext_ops_04 sin MFA. |
| 02:26 | Servicio de identidad registra elevación de privilegios. |
| 02:31 | SQL Server registra lectura de 31,840 registros de clientes. |
| 02:35 | Transferencia de aproximadamente 1.6 GB a un destino externo no clasificado. |
| 02:42 | CRM registra cambios en 216 órdenes comerciales. |
| 03:02 | Despliegue de versión nueva del servicio de integración. |
| 03:18 | Alerta crítica sobre actividad sospechosa. |
| 03:42 | CRM no disponible; archivos aparentemente cifrados. |
| 04:05 | TI solicita activar recuperación ante desastres. |
| 08:57 | CRM regresa en solo consulta. |
| 09:37 | Se restablece escritura. |
| 11:15 | Finanzas solicita conciliación de órdenes y facturación. |

La pantalla de reconstrucción llama a esas líneas «Registros del expediente». No imita extracciones autenticadas con IP, sesión, dueño o mensajes de error inventados. El caso no permite afirmar por defecto que todas las operaciones pertenecen a ext_ops_04, que los 31,840 registros sean lo transferido, que las 216 órdenes sean fraudulentas ni que 0.08 sea una probabilidad validada de 8 %. El reporte de una nota de extorsión pertenece al contexto del incidente de la pág. 3; su texto ilustrativo y ubicación narrativa se guardan en `presentation`, fuera de `events`, y no agregan un decimocuarto registro.

## 11. Estado y validación del juego

El motor es un gestor pequeño de investigación, no una simulación de toda la infraestructura:

```text
intro: índice de evento, reproducción/pausa y velocidad
exploración: posición y dirección de mirada, objeto bajo la retícula, proximidad y panel abierto
tablita: recibida o no, baja/en mano o ampliada; marcas derivadas del progreso de revisiones
expediente: documentos disponibles e inspeccionados, versión y procedencia
libreta: vínculos a filas/documentos, conclusión, limitación y recomendación por revisión
entrevista: temas abiertos y repreguntas disponibles
cierre: observaciones documentadas y pendientes
```

Implementar el contrato y las seis fichas de [Reglas_evaluacion_auditoria_v2.md](Reglas_evaluacion_auditoria_v2.md). El estado incluye `conclusionId`, `sourceRefs`, `checkAnswers`, `limitationIds`, `requestIds`, `freeNote`, versión de reglas y versión de fuentes. Una comprobación guarda las referencias concretas usadas; retirar o cambiar esas fuentes invalida su resultado hasta volver a comprobar. La función de evaluación devuelve estado, marca derivada y pendientes específicos. No revelar en la UI las claves de respuesta ni precargar conclusiones, límites o solicitudes.

No forzar un único orden de estaciones. Al completar un asunto, sugerir el próximo pendiente cercano. Se puede volver a editar una conclusión y deben reevaluarse sus vínculos. Guardar localmente con versión y proporcionar reinicio explícito. El progreso no depende de fotogramas, sonido, animaciones o tiempo invertido leyendo.

Una revisión marcada «Documentado» indica que el razonamiento de la actividad quedó respaldado; no equivale a que todo control cumpla, a que se haya emitido un hallazgo formal ni a que una persona haya validado el trabajo académico.

## 12. Cierre que tenga sentido

La libreta final muestra qué observamos, con qué criterio, qué se concluye y qué debe solicitarse. Puede dejar varios asuntos no concluyentes y aun así ser una buena auditoría. Permitir exportar un informe breve con referencias, no autocompletar un informe académico de 12–18 páginas ni fabricar cinco hallazgos para conseguir una pantalla de victoria.

El jugador elige recomendaciones concretas y cómo se verificarían: MFA y revisión de accesos, conservación de registros, conciliación, restauraciones probadas, atención de alertas. La primera versión usa tarjetas editables de recomendación, responsable y prueba de cierre. No necesita reprogramar el ataque ni una segunda infraestructura para mostrar esos controles.

Una comparación «antes/después» puede añadirse después con evidencia de prueba aportada por el equipo, claramente diferenciada entre resultado observado y resultado esperado. Las partidas originales y el expediente no se reescriben para que el plan parezca exitoso.

## 13. Construcción técnica propuesta

TypeScript, Three.js y Vite con pnpm. Interfaz de lectura en HTML/CSS. Elegir las versiones compatibles realmente instaladas y conservar el archivo de bloqueo. Sin nuevos frameworks, backend o servicios salvo que una necesidad concreta los justifique.

Una escena en primera persona, seis estaciones y un enlace de TI fijo. Implementar un controlador pequeño sobre el suelo, colisiones en planta, mirada y alcance de interacción. [PointerLockControls](https://threejs.org/docs/pages/PointerLockControls.html) ofrece control de cámara en primera persona; [Raycaster](https://threejs.org/docs/pages/Raycaster.html) permite comprobar el objeto bajo la retícula y su distancia. Los paneles y la investigación permanecen separados de la locomoción.

El bloqueo del puntero se activa mediante una interacción del usuario y se libera al leer paneles. Manejar su salida, error y reanudación sin asumir recuperación automática; consultar la [documentación de Pointer Lock](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API). Mantener el acceso alternativo previsto si el navegador no permite esa función.

La tablita y la mano pueden ser geometría sencilla vinculada a la cámara, visible solo después de la entrega y con tamaño ajustado al encuadre. Evitar que se atraviesen visualmente con paredes, desaparezcan por recorte o ocupen el centro de la pantalla. La lectura ampliada usa HTML y el mismo estado de revisión; no crear dos checklists que puedan desincronizarse. No hace falta animación esquelética, cuerpo completo ni manos realistas.

Calcular desplazamiento por tiempo transcurrido, limitar saltos de tiempo al volver a la pestaña y evitar que el movimiento diagonal sea más rápido. Guardar posición/orientación junto con la partida y validar un punto libre al reanudar. Usar límites de habitación y cajas o círculos de colisión sencillos; no añadir dependencias de física para esta oficina.

Separar `data`, `audit`, `scene`, `ui` y `export`. Reutilizar un componente de inspección para todas las estaciones y otro de libreta. No implementar una aplicación distinta por computadora.

```text
06_Comite/simulacion_auditoria/
  src/data/     canon, documentos, diálogo y revisiones
  src/audit/    vínculos, comprobaciones, progreso y guardado
  src/scene/    oficina, primera persona, movimiento, colisiones, mano, tablita y estaciones
  src/ui/       reconstrucción, tablas, entrevista y libreta
  src/export/   informe imprimible y JSON
  public/       recursos locales
  README.md     preparación, inicio y ensayo
```

Funcionar con archivos locales empaquetados y servidor ligado a 127.0.0.1, sin recursos remotos durante la exposición. Un modo plano con los seis puntos ofrece acceso a las mismas pruebas si falla WebGL. No hace falta un segundo recorrido visual completo para esa alternativa.

El paquete del juego no sustituye la base sintética SQL del curso. Se conecta a ella mediante exportaciones cuando existan. La primera versión puede comenzar con resúmenes del expediente y fixtures declarados; debe mantener la distinción visible en su inspector.

## 14. Diseño de lectura y control

- Hora grande en la reconstrucción; un evento principal por vez y un historial accesible.
- Al explorar, oficina despejada y solo la libreta/progreso esencial visible. Al inspeccionar, el panel legible tiene prioridad sobre el fondo.
- Texto de unos 20 px o más en modo proyector, con ajuste de tamaño. Estados acompañados por palabras y símbolos, no solo color.
- WASD/flechas permiten caminar; mouse permite mirar; E interactúa al estar cerca y mirar el objeto; J levanta/baja la tablita; Esc cierra el panel o libera el cursor. Tab conserva la navegación de controles HTML. Ningún atajo de exploración se intercepta al escribir.
- Movimiento reducido elimina balanceo de cabeza/mano y transiciones de elevación de la tablita, manteniendo la caminata y lectura. Sensibilidad del mouse ajustable y audio silenciable. El jugador puede omitir y repetir la reconstrucción.
- Pistas opcionales y explicaciones breves. No temporizador de castigo, tipeo obligatorio, contraseñas ocultas ni repetición de una explicación ya vista.

## 15. Qué comprobar antes de entregar

Estas son comprobaciones previstas; el juego todavía no está implementado.

1. Los 13 registros, cifras y horas coinciden con el canon, y la hora original no se inventa.
2. Se puede pausar, saltar y volver a abrir la reconstrucción sin perder la partida.
3. El auditor puede caminar con WASD/flechas hasta las seis estaciones y el enlace de TI. Las colisiones impiden atravesar muebles o salir de la oficina; E y la interacción con puntero respetan proximidad.
4. Visitar una estación o leer un documento no completa por sí solo una revisión.
5. AU-02 no permite confirmar exfiltración con el volumen aislado; una conclusión con contenido pendiente sí puede documentarse.
6. AU-03 mantiene 02:42 antes de 03:02 y no confunde modificaciones con fraude o integridad verificada.
7. Un incumplimiento requiere criterio; sin él se conserva observación o no concluyente. Se distinguen datos del caso y del laboratorio.
8. Una declaración del personal conserva atribución y no se convierte sola en prueba concluyente. Las repreguntas requieren documentos pertinentes.
9. Los cálculos dan 61 minutos entre 02:17 y 03:18, 315 hasta solo consulta y 355 hasta escritura desde 03:42. No afirman incumplimiento de objetivos ausentes.
10. Cambiar un vínculo o conclusión reevaluará la revisión; guardar/cargar conserva referencias y versión. Nulos no se convierten en cero.
11. Exportación e impresión incluyen las fuentes, limitaciones y pendientes; si se calcula un hash, se calcula sobre bytes reales del artefacto.
12. Las consultas mostradas distinguen resultados importados, pruebas locales y resúmenes. No simulan una conexión real a SQL Server.
13. Se prueba 1280 × 720 y 1920 × 1080, reducción de movimiento, tamaño de texto y alternativa sin WebGL.
14. El paquete inicia con internet desconectado y no usa fuentes, modelos, librerías, voces ni API remotas.
15. La primera entrega permite terminar una revisión desde la oficina hasta su anotación en la libreta; la versión base permite cerrar las seis y exportar.
16. Documentos, libreta y entrevista detienen la locomoción; cerrar un panel o perder foco no deja teclas activas. La velocidad es consistente al variar fotogramas y no aumenta en diagonal.
17. Guardar/cargar conserva posición y dirección de mirada válidas; la vista en primera persona permite alcanzar todas las estaciones sin quedar atrapado.
18. La tablita solo aparece tras recibirla; omitir la introducción no omite ni duplica la entrega. Guardar/cargar conserva su posesión y las marcas.
19. J permite leer nítidamente la misma checklist que se lleva en la mano. La versión baja no tapa pistas y la ampliada pausa movimiento y libera el cursor.
20. Las casillas se actualizan automáticamente desde las pruebas y conclusiones; no existe marcado manual. Retirar sustento reevalúa el estado sin perder el resto del trabajo.
21. Esc, salida de foco y denegación del bloqueo del puntero se manejan sin teclas pegadas, reactivación de mouse forzada ni pérdida de partida.
22. Los diez planos muestran los trece registros en 110 segundos objetivo, con cámara fija durante la lectura y estados del CRM reconstruibles al saltar hacia atrás. El plano P08 muestra la nota ilustrativa; su texto, procedencia y separación de los hechos coinciden con el JSON.
23. La nota no crea un nuevo evento ni una hora de aparición confirmada. La apertura se entiende sin audio y el movimiento reducido conserva encuadres, registros y nota.
24. Cada AU satisface los casos positivos y negativos de sus fichas: fuentes retiradas, comentario libre, documentos ausentes, respuestas cambiadas y guardado con otra versión no dejan marcas antiguas.
25. El retorno de escritura no oculta la conciliación pendiente; ninguna animación convierte la transferencia en exfiltración confirmada ni el despliegue en causa demostrada.

## 16. Fuentes y límites académicos

Reexaminados: [proyecto oficial](../../00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf), especialmente págs. 4–8; [guía de entregables](../../00_Material_del_curso/Guia_Entregables_Operacion_Trazabilidad.pdf), pasos 6–12; y Tareas 2, 5, 6 y 7 del [agente de P1](../Agente_IA_P1_Incidente_evidencia_simulacion_v1.md).

No hay aún exportaciones SQL ni políticas aprobadas en los archivos revisados. Todo detalle de oficina, diálogo adicional, política, muestra o metadato creado para el juego debe registrarse como propuesta didáctica y someterse a la revisión del equipo antes de usarlo como evidencia académica. No asignar unilateralmente códigos S-xx, E-xx nuevos, H-xx ni A-xx.

El juego cubre una selección jugable del análisis. Las doce alertas, la base y seis SELECT del curso, los cinco hallazgos, terceros/IA, presupuesto y demás entregables se completan en el trabajo del equipo. El juego no los reemplaza ni necesita implementarlos todos como minijuegos para cumplir su propósito.
