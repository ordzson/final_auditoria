# Observaciones pendientes de confirmar

**Responsable:** Anthony Samuel Ordoñez Son, carné 2401002033. Preparación asistida por Codex. Límite del análisis: 15 de octubre de 2026, 23:59:59, hora de Guatemala. Revisión del estudiante y del equipo pendientes.

Se presentan dos posibles hallazgos siguiendo la plantilla de la Guía de entregables, página 4. Ambos son **no concluyentes sobre la operación de RedNova**: falta evidencia para confirmar una falla. «No documentado en el expediente» significa que no se recibió el soporte; no demuestra que la actividad nunca ocurriera.

Las observaciones usan buenas prácticas externas como referencia académica. No se ha demostrado que la empresa las adoptara como obligación. La prioridad indica urgencia para investigar, sin puntuación definitiva de probabilidad e impacto ni aceptación del riesgo restante. María José Aldana Culajay debe completar riesgos y controles; Luis Antonio Vicente Zapón revisará y consolidará los hallazgos.

## Seguimiento de la alerta crítica sin soporte suficiente

**Condición observada.** El caso, páginas 4–5, reporta una alerta crítica de seguridad a las 03:18 del 14 de octubre, sin cierre documentado. No se recibieron responsable asignado, primera acción ni cierre. La caída ocurre a las 03:42, pero esos 24 minutos no demuestran inacción. En el laboratorio se representó esa alerta junto con cinco casos de control; la consulta seleccionó cuatro registros incompletos y solo uno corresponde al resumen del incidente.

**Criterio.** Se espera poder identificar quién recibe, clasifica y atiende una alerta, cómo se escala y qué permite cerrarla. Se utilizan como buenas prácticas el Marco de Ciberseguridad del Instituto Nacional de Estándares y Tecnología de Estados Unidos (NIST), versión 2.0, y su guía de respuesta a incidentes, SP 800-61, revisión 3. Apartados y páginas precisos figuran en las fuentes adjuntas bajo «Seguimiento y escalamiento». No se atribuye a RedNova un plazo de respuesta que no haya sido aportado.

**Causa por investigar.** Podría faltar una asignación clara de responsabilidades y seguimiento. También podría existir un registro no suministrado o atención por otro canal. Para distinguir esas posibilidades se necesitan el procedimiento vigente, la configuración de asignaciones, los registros de atención y comunicaciones, y la explicación del responsable que designe la administración.

**Efecto y riesgo.** Con lo recibido no se pueden medir atención y cierre ni evaluar la respuesta. Una falla real podría retrasar la contención o dejar alertas pendientes. No se ha probado que una demora causara la caída ni una pérdida monetaria.

**Evidencia y localización.** Alerta crítica del expediente (E-07), Proyecto, páginas 4–5; papel «Seguimiento de la alerta crítica» (PT-24). El resultado de la consulta de alertas está en `../03_Evidencias/resultados/Q-11.csv`: identificador `AlertaID=6`, cuarto registro de datos. Los casos ficticios y las huellas digitales no corroboran el suceso real.

**Recomendación.** La administración y Seguridad deben recuperar el registro histórico, si existe, y documentar responsable, clasificación, acciones, decisiones y escalamiento. Durante las primeras 24 horas desde la futura activación del plan se propone obtener ese soporte; entre 24 y 72 horas, probar el circuito con una alerta controlada. El plan adjunto desarrolla estas medidas en las acciones 1, 2 y 9.

**Prioridad provisional.** Alta para obtener evidencia y comprobar el seguimiento, por la severidad crítica reportada y la importancia del sistema comercial. La comparación con los demás riesgos del equipo sigue pendiente.

**Qué cambiaría la conclusión.** Un registro histórico íntegro con acciones, responsables y cierre verificables podría acreditar seguimiento y permitir retirar o reformular esta observación. La ausencia de un registro aislado exigiría revisar otros canales antes de concluir que nadie actuó.

## Protección de los registros de actividad sin soporte suficiente

**Condición observada.** La advertencia previa número 8 del caso, página 3, indica que ciertos administradores podrían alterar o eliminar registros. No se recibieron permisos históricos, reglas de conservación, copias independientes ni registros originales del período. Los trece eventos resumidos no permiten detectar pérdidas de registros. En el laboratorio se comprobó que un administrador ficticio podía modificar y eliminar filas; esa capacidad fue diseñada para el ejercicio y no demuestra la configuración de RedNova. No se ejecutó una alteración de bitácora.

**Criterio.** Se espera preservar origen, integridad y acceso autorizado a los registros necesarios para investigar. Se emplean las mismas fuentes NIST, con apartados y páginas en «Conservación e integridad» de la bibliografía adjunta. Una copia separada y la distribución de permisos son medidas propuestas para aplicar esas buenas prácticas; no se atribuye a la fuente una arquitectura obligatoria.

**Causa por investigar.** La protección podría depender de los mismos administradores cuya actividad se registra, sin separación comprobable de la copia conservada. También podría existir almacenamiento protegido que no se haya suministrado. Deben examinarse arquitectura, permisos efectivos y conservación antes de afirmar la causa. Esta cuestión técnica es distinta de la asignación de responsables para atender alertas.

**Efecto y riesgo.** No se puede autenticar la integridad, cobertura y orden de los registros disponibles. Una modificación o eliminación podría dificultar la reconstrucción y la identificación de responsables. No se ha demostrado manipulación ni pérdida de registros del incidente.

**Evidencia y localización.** Advertencia previa número 8, Proyecto, página 3; papel «Integridad de registros y fiabilidad de horarios» (PT-25); resultado de permisos en `../03_Evidencias/resultados/Q-S01.csv`, concesiones y cinco rechazos al auditor en los archivos asociados. La advertencia número 8 no debe confundirse con E-08, que identifica respaldos.

**Recomendación.** Durante las primeras 24 horas desde la activación del plan, Infraestructura y Seguridad deben preservar registros y metadatos con origen, huella digital y acceso restringido, usando una copia separada. También deben documentar permisos y conservación antes de cambiarlos. Entre 24 y 72 horas se propone probar generación, recepción y preservación de un evento controlado, y rechazo de cambios por un usuario operativo. Las acciones 3, 5 y 10 del plan explican cierre y dependencias.

**Prioridad provisional.** Alta para evitar pérdida de información que pueda desaparecer o vencer por sus reglas de conservación. La probabilidad y el riesgo restante no se han estimado ni aceptado.

**Qué cambiaría la conclusión.** Una copia independiente íntegra con permisos y conservación verificados podría retirar o acotar la observación. Registros originales que demuestren cambios no autorizados permitirían ampliar el análisis, sin atribuir automáticamente responsabilidad al administrador.

## Referencias de versiones y revisión

En los registros anteriores estas observaciones se denominaban B1-1 y B1-2, respectivamente. Esas claves sirven únicamente para relacionar versiones. No son hallazgos aprobados. La revisión cruzada y la firma del estudiante siguen pendientes; no consta recepción de productos terminados de los otros integrantes en las ubicaciones examinadas.
