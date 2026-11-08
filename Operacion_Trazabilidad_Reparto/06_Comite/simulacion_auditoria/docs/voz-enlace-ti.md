# Voz del enlace de TI

Los 29 MP3 aportados en `audios_por_frase.zip` se conservan en `public/audio/enlace-ti/`. `frases.txt` contiene el guion suministrado; se comprobó su coincidencia exacta con las 29 tomas de `guion-voz-enlace-ti.md`. Los archivos ya estaban separados por frase y no necesitaron recorte.

`src/data/interviewAudio.ts` relaciona los identificadores de conversación con cada grabación. La entrevista reproduce el saludo, las aperturas de tema y cada respuesta al seleccionarla. Al volver al menú de temas usa «Te escucho». El audio anterior se interrumpe al cambiar de respuesta o cerrar la conversación, incluso al consultar una fuente.

El botón «Repetir voz» reinicia la frase actual. Los controles de audio permiten pausar, avanzar, ajustar el volumen y silenciar; la elección de silencio se mantiene entre conversaciones durante la sesión. Si el navegador bloquea la reproducción automática, se puede iniciar desde los controles. El aviso sonoro de la reconstrucción conserva su ajuste independiente.

Las grabaciones se sirven localmente con la aplicación y los textos permanecen visibles. La prueba `tests/e2e/interview-audio.spec.ts` comprueba reproducción, correspondencia de frases, silencio, repetición, cierre, regreso y carga de los 29 MP3. Capturas de escritorio y móvil en `artifacts/interview-audio/`.

## Revisión I5

Las 29 frases grabadas, el guion y los MP3 se conservaron sin cambios. La explicación de términos y la precisión sobre el informe de restauración se presentan como ayuda escrita separada de la voz. No se generaron ni se marcaron grabaciones nuevas como realizadas. Comparación de hashes y pruebas actuales en [cierre-p1](../artifacts/cierre-p1/README.md).
