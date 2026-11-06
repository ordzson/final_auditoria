# Plan para construir la oficina de auditoría

Plan vigente para trabajar con Kimi Code y Codex. La entrega de esta revisión es el diseño y material de arranque; el juego todavía no está implementado.

Actualización del 4 de noviembre de 2026: apertura definida en diez planos y reglas de las seis revisiones concretadas en `Reglas_evaluacion_auditoria_v2.md`. La guía PDF interna de P1 aún describe dos corridas; para el alcance del juego se sigue la Tarea 9 y los documentos v2. Los PDFs oficiales del curso siguen gobernando hechos y entregables.

## 1. Por qué este alcance es viable

La parte 3D contiene una habitación estática, exploración en primera persona, una mano con tablita, seis zonas de interacción y un enlace de TI fijo. La locomoción requiere un controlador sencillo y colisiones en planta. La tablita baja se representa en 3D y su lectura ampliada reutiliza HTML y el mismo progreso automático. La reconstrucción usa diez planos sobre la misma oficina para trece registros, con 110 segundos objetivo. La caída del CRM y la nota ilustrativa se representan con cambios de pantalla, sin motor de ataque ni animación compleja.

El contenido necesita trabajo editorial y comprobación, pero no requiere implementar una infraestructura, IA en vivo o un lenguaje nuevo de soluciones. La misma mecánica de comparar y vincular fuentes sirve en las seis revisiones. Podemos completar una prueba jugable antes de invertir en toda la oficina.

Esta viabilidad es una valoración del alcance, no una garantía de calendario o rendimiento. Faltan conocer el hardware de exposición y ensayar con jugadores. No fijar una fecha de entrega ni afirmar tiempos reales de desarrollo a partir de este documento.

## 2. Quién prepara qué

| Responsable | Trabajo concreto | Cómo se revisa |
| --- | --- | --- |
| Codex, conmigo en este proyecto | Canon del incidente, estructura de datos, preguntas de auditoría, diálogo, vínculos de evidencia, reglas de revisión, exportación y comprobaciones. Cuando se implemente, puedo desarrollar esas partes o revisar la integración. | Contrastar cifras y conclusiones contra los PDFs; probar las reglas sin necesitar escena 3D. |
| Kimi Code | Habitación, mobiliario, cámara en primera persona, colisiones, mirada/interacción, mano y tablita baja/ampliada, entrega por el enlace e integración de paneles. Puede implementar todo el proyecto usando el prompt si resulta más cómodo. | Se puede caminar e interactuar; la tablita aparece tras recibirla, se lee con J y refleja las mismas marcas automáticas que la revisión. |
| Equipo de estudiantes | Aprobar supuestos, entregar criterios/políticas y exportaciones de laboratorio, validar lo aprendido, completar el registro de IA y ensayar la defensa. | Revisión humana, consultas SQL ejecutadas y materiales académicos con sus responsables. |

Este reparto es una propuesta de colaboración. No supone que Kimi ya esté ejecutando tareas ni que deba existir trabajo simultáneo en los mismos archivos. Si una herramienta trabaja en escena y otra en contenido, acordar los cambios antes de editar el módulo ajeno.

## 3. Contrato pequeño para que ambas partes encajen

La oficina solo necesita avisar qué estación abrió el jugador. El contenido y la libreta deciden qué se ve y si una revisión está sustentada.

```typescript
type StationId = 'accesos' | 'sql_red' | 'crm_cambios' |
                 'siem' | 'respaldos' | 'mesa_auditor';

type ReviewId = 'AU-01' | 'AU-02' | 'AU-03' |
                'AU-04' | 'AU-05' | 'AU-06';

// Operaciones conceptuales: nombres adaptables, responsabilidades estables.
openStation(stationId);
openDocument(documentId);
pinSource(reviewId, documentId, rowId);
compareSources(firstId, secondId);
answerCheck(reviewId, checkId, answerId, sourceRefs);
saveAssessment(reviewId, assessment);
requestHint(reviewId);
exportNotebook();
```

`pinSource` registra una referencia; no cambia el documento original. `saveAssessment` reevalúa fuentes y límites; no marca terminado por recibir cualquier texto. Esos eventos actualizan automáticamente las casillas: no hay operación manual de completarlas. El objeto mirado/cercano usa el mismo `stationId` que los paneles. Abrir un panel o levantar la tablita detiene caminata/mirada y libera cursor. La cámara es en primera persona. Repetir la apertura o cambiar calidad gráfica no modifica conclusiones.

El contrato detallado de `assessment`, las fuentes alternativas y las condiciones positivas/negativas están en [Reglas_evaluacion_auditoria_v2.md](Reglas_evaluacion_auditoria_v2.md). `compareSources` solo abre la herramienta; `answerCheck` registra la respuesta y las referencias versionadas que realmente se contrastaron. Se evalúan identificadores estructurados, nunca el significado del comentario libre. Una solicitud de documento puede quedar pendiente sin impedir completar una revisión correctamente limitada. Retirar una fuente usada invalida su comprobación, que deberá repetirse sobre la nueva referencia.

## 4. Insumos disponibles y pendientes

| Insumo | Estado actual |
| --- | --- |
| Trece registros preliminares y diez resúmenes E-01–E-10 | Transcritos del caso en `Caso_RedNova_base_v2.json`. |
| Evaluación de las seis revisiones | Fuentes, comprobaciones, conclusiones, límites, solicitudes y casos de aceptación definidos en `Reglas_evaluacion_auditoria_v2.md`; falta implementar el evaluador. |
| Dirección de la apertura y nota de extorsión | Diez planos, duración y estados definidos en la sección 3 del diseño. Texto genérico autorizado en `presentation.ransomNote`, separado del reporte histórico de la nota. |
| Preguntas del comité y contradicciones | Están en los PDFs y orientan las actividades del diseño. |
| Base sintética SQL y resultados Q-xx | No se encontraron en la carpeta revisada. No afirmar que ya existen. |
| Políticas y criterios específicos de RedNova | Pendientes de entregar o aprobar como documentos simulados del equipo. |
| Hora original, desfase, custodia y artefactos extraídos | No están aportados para cada registro. Mantener campos pendientes; completar con laboratorio declarado. |
| Arte 3D y aplicación | Pendientes de construir. El storyboard es un boceto, no una captura de una aplicación funcionando. |
| Movimiento, cámara y tablita | Primera persona confirmada: WASD/flechas, mouse y E. Recibimos la tablita, la llevamos parcialmente visible en la mano y la ampliamos con J; sus casillas se actualizan automáticamente. |

Se puede comenzar con los resúmenes del caso. Para permitir inspecciones de filas sin inventar evidencia real, preparar después un fixture compacto con procedencia declarada y suficiente actividad normal de comparación. Ningún dato nuevo se registra unilateralmente con código oficial S/E/H/A.

## 5. Entregas de implementación

### Entrega A: una revisión completa

Crear el proyecto con pnpm, la oficina en primera persona con colisiones, entrega de la tablita, representación en mano y ampliación con J. Agregar escritorio B por proximidad/mirada, lectura SQL, flujo y declaración de Seguridad. Implementar la ficha AU-02: fuentes, comprobación, opciones de conclusión, tres límites y una solicitud pertinente. Documentar contenido y vínculo pendientes debe marcar automáticamente la casilla sin exigir recibir el soporte ausente; afirmar exfiltración con solo el volumen debe explicar qué falta sin marcarla completa. Retirar una fuente debe retirar la marca y preservar el resto del trabajo.

Termina cuando se puede entrar, inspeccionar, contrastar, cerrar la revisión y volver a la oficina. La escena puede ser simple; las fuentes y las consecuencias de una conclusión deben funcionar. Esta entrega resuelve la incertidumbre principal: si auditar de esa manera resulta claro y agradable.

### Entrega B: la oficina completa

Agregar las otras cinco estaciones usando las mismas herramientas; seis revisiones, persona de enlace, preguntas y repreguntas. Guardado local, navegación por libreta y opción de revisar una conclusión anterior. Incorporar criterios aprobados cuando estén disponibles; de lo contrario, conservar observaciones con criterio pendiente.

Termina cuando se puede documentar las seis revisiones en distintos órdenes y ninguna depende de una visita decorativa o un dato imaginario.

### Entrega C: apertura y cierre

Reproductor de los trece registros según los diez planos P01–P10 del diseño: vista general, accesos/identidad, SQL/red, CRM/cambio, SIEM, caída y nota, recuperación por etapas y conciliación. Objetivo de 110 segundos, cámara quieta al leer y transiciones de hasta 700 ms. En P08, a los 3 s, mostrar durante 10 s `presentation.ransomNote` con rótulo ilustrativo. Hora, mensaje y procedencia legibles; luz nocturna y de visita; pausa/salto/repetición y alternativa de movimiento reducido. Retroceder reconstruye pantallas y nota desde el tiempo del reproductor, sin disparar efectos acumulativos.

Al final de la partida, libreta imprimible y JSON, con recomendaciones, pendientes y procedencia. Consultar E-09/E-10 desde el archivador, sin añadir sus minijuegos completos todavía.

Termina cuando el flujo reconstrucción → oficina → libreta final es continuo y puede reiniciarse. La apertura se puede omitir sin bloquear documentos o habilidades.

### Entrega D: paquete de exposición

Legibilidad a 1280 × 720 y 1920 × 1080, teclado, reducción de movimiento, silencio y alternativa sin WebGL. Comprobar ejecución con red desconectada, incluyendo recursos gráficos y fuentes. Ensayar un fragmento breve de la apertura y una revisión representativa; grabar ese recorrido y generar el PDF de respaldo cuando la aplicación exista.

Termina con comandos y prerrequisitos documentados, paquete preparado y registro de las comprobaciones realmente ejecutadas. La prueba con el proyector corresponde al equipo cuando tenga acceso.

## 6. Qué recortar si falta tiempo

| Mantener | Simplificar o posponer |
| --- | --- |
| Seis revisiones y sus fuentes | Modelos detallados de muebles: cajas, planos y materiales bastan. |
| Primera persona, tablita en mano/ampliada y marcas automáticas | Mano y manga de geometría sencilla, sin cuerpo completo ni animación esquelética; colisiones en planta. |
| Contraste de declaraciones | Voz y gestos: retrato/personaje fijo con texto. |
| Diez encuadres, horas correctas, caída y nota ilustrativa legible | Usar planos fijos/cortes y materiales sencillos; prescindir de shaders, glitch y vídeo generado. |
| Libreta, guardado y cierre | Arrastrar con física: botones «Vincular» y selección funcionan también con teclado. |
| Paquete local y legibilidad | Minijuegos de SLA, SOC 2, IA, presupuesto y segunda corrida de mejora. |

No simplificar convirtiendo todas las revisiones en botones de completar, ocultando incertidumbres o reemplazando las fuentes por una explicación del narrador.

## 7. Revisión de contenido antes del arte final

Comprobar una vez, de forma conjunta: trece eventos; cuenta ext_ops_04; 31,840 registros; ~1.6 GB; 216 órdenes; 02:42 antes de 03:02; 61 minutos; 315 minutos hasta solo consulta y 355 hasta escritura. Confirmar que toda cifra adicional esté atribuida a un fixture o supuesto y no al PDF.

Revisar las seis actividades como auditor: ¿qué observa?, ¿qué criterio aplica?, ¿qué fuente falta?, ¿qué no puede concluir? El mejor diagnóstico puede ser no concluyente. No fijar cinco hallazgos en el juego solo para imitar el mínimo del informe.

Verificar los casos de aceptación de las seis fichas, incluyendo revisión completa con soportes solicitados aún ausentes, reemplazo/retirada de fuentes, cambio de conclusión y carga con otra versión. Verificar también que la ilustración no se acepte como evidencia y que P08 se recomponga al retroceder. Ninguna comprobación de esta lista se considera ejecutada hasta tener la aplicación.

## 8. Registro de uso de IA propuesto

| Fecha | Herramienta | Prompt resumido | Resultado usado | Validación humana | Cambios y aprendizaje |
| --- | --- | --- | --- | --- | --- |
| Pendiente de completar con la fecha real de la sesión | Codex | Reexaminar el caso y rediseñar como reconstrucción del incidente seguida de auditoría en una oficina con personal, registros y checklist; alcance viable con Kimi. | Diseño v2, plan, prompt, canon JSON y storyboard. | La completa el equipo. | La completa el equipo. |
| 2026-11-04 | Codex | Concretar la dirección visual y los encuadres, definir evaluación de conclusiones, mostrar una nota de extorsión genérica y aclarar la diferencia con la guía antigua. | Diseño, fichas de evaluación, prompt de Kimi, plan, canon de presentación, Tarea 9, prompt de revisión y storyboard actualizados; sin implementar el juego. | La completa el equipo. | La completa el equipo. |

El registro no afirma que se haya construido o probado el juego. La entrada de Kimi se añade cuando su implementación ocurra.
