# Prompt para revisión independiente del diseño

Revisa de forma independiente el diseño de una simulación y juego de auditoría que preparó otra instancia de Codex.

Proyecto:

```text
/home/ordson/Escritorio/Operacion_Trazabilidad_Reparto
```

Tu tarea es revisar el material existente y entregar observaciones. No modifiques archivos ni implementes el juego todavía.

## Contexto y decisiones confirmadas

Somos auditores de RedNova, una empresa ficticia del caso académico.

La experiencia tendrá:

1. Una reconstrucción visual del incidente, con fecha/hora, registros legibles y cambios de estado en las pantallas.
2. Una exploración posterior de una única oficina que concentra computadoras, permisos, base de datos, logs, respaldos, documentos y un miembro del personal para entrevistar.
3. Una investigación jugable: inspeccionar, contrastar fuentes y documentar conclusiones.

El auditor se controla en primera persona:

- WASD/flechas para caminar y mouse para mirar.
- E para interactuar al acercarse y mirar un objeto o persona.
- Al comenzar la visita recibe una tablita de auditoría.
- La tablita queda parcialmente visible en la mano.
- J permite ampliarla para leer avances y pendientes.
- Las casillas se marcan automáticamente al completar las comprobaciones pertinentes; no se marcan manualmente.
- Completar una revisión requiere sustento, no simplemente visitar una estación.

Debe ser atractivo, entretenido, técnicamente educativo y viable de construir con Kimi Code y apoyo de Codex. Queremos profundidad sin tareas repetitivas o tediosas.

## Archivos que debes revisar

Fuentes académicas:

- `00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf`
- `00_Material_del_curso/Guia_Entregables_Operacion_Trazabilidad.pdf`
- `P1_Incidente_evidencia_simulacion/Guia_P1_Incidente_evidencia_simulacion_v1.pdf`

Instrucciones actualizadas:

- `P1_Incidente_evidencia_simulacion/Agente_IA_P1_Incidente_evidencia_simulacion_v1.md`, especialmente el aviso inicial, las convenciones y la Tarea 9.

Dentro de `P1_Incidente_evidencia_simulacion/Diseno_Simulacion_3D/`:

- `Diseno_auditoria_oficina_v2.md`
- `Prompt_Kimi_auditoria_oficina_v2.md`
- `Plan_construccion_y_reparto_v2.md`
- `Caso_RedNova_base_v2.json`
- `Reglas_evaluacion_auditoria_v2.md`
- `Storyboard_auditoria_oficina_v2.svg`
- `Storyboard_auditoria_oficina_v2.png`

Los documentos de diseño v1 fueron sustituidos y ahora redirigen a v2. Una propuesta anterior hacía del jugador personal de TI; esa dirección está descartada.

Actualización del 4 de noviembre de 2026: el diseño fija diez planos de apertura, una nota genérica ilustrativa durante la caída y fichas explícitas de evaluación. La guía PDF interna de P1 conserva una propuesta anterior de dos corridas: para alcance e implementación mandan la Tarea 9 y los documentos v2; para hechos y entregables académicos mandan los PDFs oficiales del curso.

## Qué evaluar

1. **Fidelidad al caso.** Contrasta eventos, horas, cantidades, declaraciones y referencias. Identifica hechos inventados, atribuciones indebidas y confusión entre correlación y causalidad.

2. **Coherencia.** Busca contradicciones entre diseño, prompt, plan, JSON, storyboard y Tarea 9, especialmente sobre primera persona, entrega de la tablita y marcado automático.

3. **Calidad del juego.** ¿Qué hace realmente el jugador? ¿Las actividades requieren investigar y razonar? ¿Alguna mecánica acaba siendo leer documentos y pulsar botones sin decisiones significativas? Propón mejoras concretas usando ejemplos del caso.

4. **Checklist.** Examina qué eventos deberían completar cada revisión. Evalúa cómo se admiten conclusiones no concluyentes, qué ocurre si cambia su sustento y cómo evitar marcas prematuras o tareas imposibles de completar.

5. **Viabilidad.** Valora el alcance para Kimi Code: oficina, movimiento, colisiones, interacción, mano/tablita, paneles y persistencia. Identifica dependencias ocultas, contenido todavía no preparado y partes sobreespecificadas. Distingue requisitos imprescindibles de mejoras que pueden esperar.

6. **Integridad académica.** Distingue resúmenes del curso, datos sintéticos y resultados SQL realmente disponibles. El juego complementa el proyecto académico; no necesita convertir todos sus entregables en minijuegos.

7. **Apertura y dirección visual.** Contrasta los diez planos, sus 110 segundos objetivo y los trece eventos. Comprueba encuadres, estados del CRM, legibilidad, pausa/retroceso y movimiento reducido. Evalúa si caída, impacto comercial y recuperación por etapas se entienden sin audio. La nota de extorsión es una recreación genérica autorizada en `presentation`, con rótulo visible; no debe aparecer como texto recuperado, un nuevo evento o una hora de descubrimiento acreditada.

8. **Evaluación implementable.** Aplica las seis fichas a casos positivos y negativos: referencias alternativas, comprobaciones con fuentes concretas, conclusiones estructuradas, límites, solicitudes, retirada/cambio de fuente y versiones. Comprueba que el comentario libre no se califica automáticamente y que reconocer una ausencia permite completar sin exigir documentos inexistentes.

## Entrega

Empieza con un dictamen claro sobre si el material está listo para entregarlo a Kimi.

Después presenta:

- Problemas priorizados, indicando archivo y sección o línea.
- Impacto concreto de cada problema y corrección propuesta.
- Elementos que conviene conservar.
- Datos o decisiones pendientes que realmente bloqueen la construcción.
- La primera entrega jugable más pequeña que recomendarías construir.

Distingue errores verificables, riesgos de implementación y preferencias de diseño. No afirmes haber probado una aplicación: actualmente hay documentos, datos y un boceto, no un juego implementado.

Si necesitas comprobar paquetes JavaScript, utiliza exclusivamente pnpm.
