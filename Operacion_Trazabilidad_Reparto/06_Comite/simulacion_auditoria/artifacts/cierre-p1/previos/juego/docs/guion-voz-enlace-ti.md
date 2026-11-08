# Guion de grabación del enlace de TI

Textos extraídos de `src/data/interview.ts` y `src/ui/InterviewPanel.ts`. Incluye las 28 intervenciones de la conversación y la frase breve «Te escucho» que aparece junto al nombre: 29 tomas en total.

Graba en un solo archivo y sigue el orden de este documento. Antes de cada texto di «toma uno», «toma dos», etc.; deja dos segundos de silencio y lee solamente el diálogo entre comillas. Deja tres segundos de silencio antes de anunciar la siguiente toma. Los títulos y los códigos entre paréntesis son referencias; no hace falta leerlos. Si te equivocas, vuelve a anunciar el mismo número y repite la toma completa.

Usa un tono conversacional, tranquilo y profesional. Mantén la misma distancia al micrófono. Puedes enviar el archivo original en WAV, MP3 o M4A. Para las siglas: CRM = «ce erre eme»; MFA = «eme efe a»; SQL = «ese cu ele»; RTO = «erre te o»; RPO = «erre pe o».

## Toma 01 · Saludo inicial (SALUDO-INICIAL)

> Hola. ¿Vienes por lo del CRM? Ya tienes la tablita. Pregúntame lo que necesites y vamos viendo qué dicen los registros.

## Toma 02 · Al volver a conversar (SALUDO-REGRESO)

> ¿Encontraste algo más? Dime qué quieres revisar y lo vemos juntos.

## Toma 03 · Frase breve junto al nombre (TE-ESCUCHO)

> Te escucho.

## Toma 04 · Cuenta externa: inicio del tema (AU-01)

> Claro. ¿Te interesa quién la usó o qué acceso tenía permitido?

## Toma 05 · Quién usó la cuenta (P-IDENTIDAD)

> No puedo darte un nombre. Tenemos la cuenta y una sesión sin MFA, pero eso no nos dice quién estaba detrás. Mira el registro de la sesión.

## Toma 06 · Cuenta y persona (R-IDENTIDAD)

> Exacto. Podemos hablar de la actividad de esa cuenta. Para atribuírsela a alguien hace falta más evidencia que el nombre de usuario.

## Toma 07 · Acceso permitido (P-POLITICA)

> Para responderte necesitaría la política de acceso y su alcance aprobado. No están entre los documentos que tenemos. El registro de la cuenta sí lo puedes consultar.

## Toma 08 · Incumplimiento de la política (R-POLITICA)

> Sin conocer la política y a quién aplicaba, no. Sí podemos señalar lo que muestra la sesión y pedir la política que falta.

## Toma 09 · Tráfico de red: inicio del tema (AU-02)

> Sí, lo que Seguridad llamó una fuga. ¿Qué quieres revisar?

## Toma 10 · Qué datos salieron (P-FUJO)

> Eso todavía no lo sabemos. Seguridad lo llamó una fuga en su declaración inicial, pero también dijo que no había identificado los datos transferidos. Te puedo mostrar esa declaración.

## Toma 11 · Volumen de tráfico (R-VOLUMEN)

> Nos da una pista para investigar. No nos dice qué contenía la transferencia ni permite atribuirla por sí sola. Para eso hay que contrastar el flujo y la lectura SQL.

## Toma 12 · Vincular el flujo con los datos (R-FLUJO)

> No todavía. Nos falta identificar el contenido y enlazar el proceso, la lectura SQL y ese flujo. Que los registros estén ahí no demuestra por sí solo esa conexión.

## Toma 13 · Órdenes y despliegue: inicio del tema (AU-03)

> Hay dos cosas que conviene mirar por separado: las órdenes y la autorización del cambio. ¿Por dónde empezamos?

## Toma 14 · Integridad de las órdenes (P-INTEGRIDAD)

> El administrador de la base de datos dice que sí. El problema es que la conciliación aún no ha terminado. Por ahora tenemos su declaración; falta el soporte para comprobarla.

## Toma 15 · Conciliación pendiente (R-CONCILIACION)

> Ojalá pudiera, pero no está en el expediente. Deja solicitado el historial y una conciliación reproducible de las órdenes y la facturación. Esa es la comprobación que nos falta.

## Toma 16 · Autorización del despliegue (P-APROBACION)

> Desarrollo dice que recibió una autorización verbal. En el ticket no aparece una aprobación final documentada. Te enseño lo que declararon, y luego podemos mirar el ticket.

## Toma 17 · Consultar el ticket (R-TICKET)

> Aquí lo tienes. Revisa qué aprobación quedó documentada y compárala con lo que declaró Desarrollo.

## Toma 18 · Autorización verbal (R-VERBAL)

> No deja documentada una aprobación formal. Pero tampoco sería correcto decir que nunca hubo autorización solo porque no aparece ahí. Tenemos que conservar ese límite.

## Toma 19 · Alerta: inicio del tema (AU-04)

> Podemos revisar lo que quedó registrado de esa alerta. Dime.

## Toma 20 · Atención de la alerta (P-ALERTA)

> No te lo puedo confirmar con este resumen. La alerta figura como crítica y no tiene un cierre documentado, pero tampoco aparecen la asignación ni la primera acción. Eso no significa que nadie la atendiera.

## Toma 21 · Límites sobre la respuesta (R-RESPUESTA)

> Eso sería ir más allá de lo que sabemos. Falta el registro de quién la recibió, qué hizo y cuándo. Podemos pedirlo; no dar por hecho que nadie actuó.

## Toma 22 · Recuperación: inicio del tema (AU-05)

> El CRM volvió a estar disponible, sí. ¿Quieres ver qué quedó documentado de la restauración?

## Toma 23 · Prueba de restauración (P-RESTAURACION)

> Continuidad dice que la última restauración documentada fue varios meses antes. No tenemos una ejecución exacta para este incidente. Te paso su declaración.

## Toma 24 · Recuperación del servicio y los datos (R-RECUPERACION)

> Que el servicio vuelva no demuestra que todos los datos estén completos. Para sostener eso necesitamos las comprobaciones de recuperación. Tampoco tenemos objetivos RTO y RPO aprobados para evaluar su cumplimiento.

## Toma 25 · Horas y originales: inicio del tema (AU-06)

> Bien. Aquí tenemos resúmenes del caso; hay cosas que tendremos que pedir. ¿Qué necesitas primero?

## Toma 26 · Confiabilidad de las horas (P-RELOJ)

> Hay que tomarlas con cuidado. Nos faltan las horas originales y los desfases verificados. La vista de tiempos deja esos campos sin aportar; todavía no podemos dar los relojes por sincronizados.

## Toma 27 · Ordenar los acontecimientos (R-CRONOLOGIA)

> Podemos trabajar con las horas reportadas, dejando claro ese límite. Para confirmar el orden entre sistemas necesitamos sus horas originales y comprobar los desfases.

## Toma 28 · Originales y hashes (P-CUSTODIA)

> No los tenemos aquí. Son resúmenes académicos del caso, y los campos de archivo y hash están sin aportar. Podemos dejar la solicitud en la libreta, pero no sustituirlos por estos resúmenes.

## Toma 29 · Qué solicitar para comprobarlo (R-ORIGINALES)

> Los archivos originales, sus hashes y el registro de custodia. Mientras no se aporten, deja constancia de que aquí solo pudiste revisar resúmenes.

