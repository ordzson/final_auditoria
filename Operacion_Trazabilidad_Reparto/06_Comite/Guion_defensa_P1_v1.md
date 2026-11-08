# Guion de defensa: investigación del incidente

**Expositor:** Anthony Samuel Ordoñez Son, carné 2401002033. Preparación asistida por Codex; revisión y ensayo del estudiante pendientes. Corresponde a una intervención individual de cuatro minutos dentro de la exposición propuesta del equipo. Límite del análisis: 15 de octubre de 2026, 23:59:59, hora de Guatemala.

## Distribución propuesta de la exposición

| Tiempo | Responsable | Contenido |
| --- | --- | --- |
| 00:00–03:00 | María José Aldana Culajay | Planeación, riesgos y controles; aportes pendientes de integrar. |
| 03:00–07:00 | Anthony Samuel Ordoñez Son | Investigación del incidente: seis diapositivas, cuatro minutos. |
| 07:00–11:00 | Luis Antonio Vicente Zapón | Continuidad, terceros y plan de acción; aportes pendientes de integrar. |
| 11:00–12:00 | Equipo | Decisiones y cierre. |

La distribución suma doce minutos y requiere coordinación del equipo. Las preguntas del docente se preparan aparte. No consta ensayo conjunto.

## Intervención individual de cuatro minutos

- **03:00–03:30. Qué podemos concluir.** «Distinguimos lo que reporta el caso de lo que construimos para probar el método. El incidente es compatible con un programa malicioso que cifra archivos, pero no podemos confirmar quién actuó, por dónde comenzó ni si extrajo información sin autorización. No recibimos registros originales de la empresa».
- **03:30–04:15. Secuencia reportada.** Señalar lectura de clientes, transferencia, cambios de órdenes, instalación de software, alerta y caída. «La consulta volvió después de cinco horas y quince minutos; la escritura, después de cinco horas y cincuenta y cinco. Esos tiempos no demuestran que los datos estuvieran completos. Tampoco conocemos si los relojes estaban sincronizados».
- **04:15–04:50. Tres explicaciones posibles.** «Investigamos robo de credenciales, uso indebido por alguien que tenía acceso y actividad autorizada coincidente con un ataque por otra vía. Para distinguirlas necesitamos conectar sesiones, procesos y archivos. Dos hechos cercanos no prueban que uno causara el otro».
- **04:50–05:50. Qué dice el volumen transferido.** «Leer 31,840 filas no demuestra que fueran los datos enviados. Siete campos de esos clientes ficticios ocupan unos 2.06 o 5.12 megabytes, según el formato. El caso reporta unos 1,600 megabytes de tráfico. Faltan contenido, destino y autorización para interpretarlo». Mostrar el papel «Transferencia externa y comparación de tamaños» si el docente solicita soporte. La simulación interactiva es opcional: abrir la revisión sobre transferencia, denominada AU-02 en su menú, y «Ver metadatos». Es una representación educativa y no ejecuta la base de datos. Si se usa, limitar la demostración a veinte segundos dentro de este bloque.
- **05:50–06:40. Órdenes y decisiones.** «El caso habla de 216 órdenes. Los 144 cambios de monto y 72 de estado son supuestos del laboratorio; no permiten calcular pérdidas. Proponemos once acciones para preservar información, contener el riesgo y recuperar con validación. Siguen sin confirmar el seguimiento de la alerta y la protección de los registros». Los permisos del administrador ficticio no prueban los permisos de la empresa.
- **06:40–07:00. Qué falta.** «Debemos obtener originales, objetivos de recuperación y políticas. Quedan pendientes la revisión cruzada y los aportes de planeación y continuidad. Las recomendaciones deben ejecutarlas los responsables de la empresa; aquí no afirmamos haberlas realizado».

## Cómo mostrar el soporte de una afirmación

Este recorrido se practica aparte de la exposición, como posible respuesta ampliada de dos minutos al docente. Primero, abrir el papel de transferencia desde el índice de Papeles_Trabajo_P1_v1.pdf. Después mostrar las consultas de lectura y tráfico en `../04_SQL/Analisis_Auditoria.sql`, secciones Q-05 y Q-06, y sus resultados en `../03_Evidencias/resultados/`.

Explicar que el campo `BytesEnviados` conserva el valor desconocido para el evento que representa al caso. Mostrar el cálculo de los siete campos en `../03_Evidencias/resultados/I4/Volumen_31840_I4_v1.json`. Volver a las páginas 4–5 del Proyecto: el volumen aproximado procede de ese resumen, no de una captura de red autenticada. Los códigos sirven para encontrar el soporte; la explicación oral debe usar los nombres de las pruebas.

## Respuestas preparadas al docente

Las respuestas se proponen para unos 30–45 segundos cada una. La duración requiere ensayo y no se presenta como medida.

### ¿Qué demuestra que los 1.6 GB fueron una extracción sin autorización?

El volumen por sí solo no lo demuestra. El expediente no identifica el contenido enviado, la autorización del destino ni el proceso de origen. La comparación con clientes ficticios solo muestra que siete campos ocuparían mucho menos; no reconstruye la transferencia. Solicitaría los archivos u objetos, los registros completos de red y nube, la autorización y una conexión comprobable con la lectura de la base de datos. Si esos registros acreditaran un envío legítimo, retiraría esa explicación de fuga para ese flujo, manteniendo abierta la investigación de la caída y de otras posibles salidas.

### ¿Cómo separar cercanía temporal de causa?

Buscaría una sesión, transacción o proceso que conecte los eventos y una secuencia técnica compatible, con relojes verificados. Los cambios de órdenes aparecen antes de instalar la nueva versión, lo que debilita una explicación simple de que la instalación los causó. Sin comprobar los relojes tampoco puede descartarse definitivamente esa posibilidad. Conservamos tres explicaciones abiertas y señalamos qué evidencia podría confirmarlas o debilitarlas. La ausencia de una prueba contraria no confirma ninguna. Un registro original que una los pasos permitiría revisar la conclusión, conservando la versión anterior del análisis.

### ¿Qué falta para atribuir los 216 cambios de órdenes?

Se necesita el historial original antes y después, con identidad efectiva, sesión, aplicación, permisos y autorización de cada cambio. También hay que vincular la cuenta con una persona mediante registros independientes. La consulta del ejercicio conserva como desconocidos usuario, sesión y vía. Los 144 cambios de monto y 72 de estado son ficticios. Para evaluar un efecto económico se requieren facturas, cobros y comparación con un respaldo validado y el sistema financiero. Sin esa conciliación no afirmamos fraude, pérdida económica ni que los datos hayan quedado intactos.

### ¿Cómo conservar la cronología si los relojes no coinciden?

Conservaría cada hora original, su zona, el sistema de origen y el método de obtención, sin sustituirla por una corrección. Buscaría eventos compartidos y registros de sincronización para calcular el desfase. Solo entonces añadiría una hora corregida con su fórmula y limitaciones. Hoy esos campos están vacíos porque faltan originales. Los ejercicios de errores de cinco, diez o quince minutos muestran que podría cambiar el orden, pero no calculan el error real. Por eso describimos intervalos entre horas reportadas y no afirmamos haber verificado las horas del incidente.

### ¿Qué haría si recuperar el servicio amenaza la evidencia?

La administración dirige la respuesta y el auditor recomienda y evalúa. Ante daño activo propondría contención proporcional y captura rápida de información que pueda desaparecer, cuando sea viable. No demoraría una medida urgente por buscar una recopilación perfecta. Se debe registrar qué se conservó, qué se alteró o perdió, quién decidió y por qué, con copias protegidas y huellas digitales que permitan detectar cambios. Recomendaría recuperar en otro entorno limpio. Antes de habilitar escritura se deben validar el respaldo, la integridad y la conciliación. Aquí son propuestas, no actividades ejecutadas en la empresa.

## Ejercicios de información contradictoria

Estos escenarios son hipotéticos; no son nueva evidencia ni modifican los resultados del laboratorio.

1. **Aparece una transferencia autorizada.** El docente aporta una tarea aprobada, destino corporativo y archivos que explican todo el flujo. Comprobar autenticidad y correspondencia. Si coinciden, retirar el vínculo de ese envío con una fuga, sin dar por explicada la caída. Actualizar papel de transferencia, mapa e informe; un correo genérico no basta.
2. **Se invierte el orden al verificar los relojes.** El docente aporta evidencia de que el reloj comercial estaba atrasado quince minutos y el de instalación, adelantado quince. Las órdenes reportadas a las 02:42 habrían ocurrido a las 02:57; la instalación de las 03:02, a las 02:47. Se revisaría esa hipótesis, conservando las horas originales. Cambiar el orden no demuestra por sí solo causalidad.
3. **Se demuestra recuperación íntegra, pero se arriesga el original.** El docente aporta respaldo limpio y conciliación completa, mientras recuperar sobre el equipo afectado destruiría memoria y registros. La integridad validada debilita una hipótesis de pérdida persistente, pero no prueba preservación previa ni autoría. Recomendar otro entorno; si la urgencia obliga a alterar el original, registrar decisión y pérdida de evidencia.

## Práctica pendiente

Faltan ensayo individual de cuatro minutos, recorrido de soporte de dos minutos, cinco respuestas cronometradas, exposición conjunta y prueba del equipo físico y proyector. No se han medido tiempos humanos ni registrado aprobaciones del equipo.
