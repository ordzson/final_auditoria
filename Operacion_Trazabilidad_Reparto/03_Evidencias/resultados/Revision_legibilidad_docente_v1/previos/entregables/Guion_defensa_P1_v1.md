# Guion de defensa P1 · versión 1

P1: Anthony Samuel Ordoñez Son, 2401002033. Preparado por Codex en I6; revisión humana y ensayo con cronómetro pendientes. Fragmento de P1, no presentación integrada del equipo. Corte: 15/10/2026 23:59:59 UTC−6.

## Distribución propuesta de los 12 minutos

| Tiempo del equipo | Responsable | Uso |
| --- | --- | --- |
| 00:00–03:00 | P2 | Reserva para alcance, riesgos y controles propios; aportes no recibidos. |
| 03:00–07:00 | P1 | Seis diapositivas de Presentacion_P1_v1.pdf; cuatro minutos propios. |
| 07:00–11:00 | P3 | Reserva para sus decisiones, continuidad, terceros y plan; aportes no recibidos. |
| 11:00–12:00 | Equipo | Reserva de cierre; integración pendiente. |

La distribución suma 12 minutos; no consta aceptación de P2/P3. Las preguntas se preparan aparte para el comité. No se asignan conclusiones a otros integrantes.

## Intervención de P1: cuatro minutos

- **03:00–03:30, diapositiva 1.** “Separé el resumen académico, las suposiciones del laboratorio y lo que probamos con SQL. El caso reporta un incidente compatible con ransomware; todavía no podemos confirmar exfiltración, autoría o causa raíz.”
- **03:30–04:15, diapositiva 2.** Señalar lectura, flujo, órdenes, despliegue, alerta y caída. “315 y 355 minutos miden disponibilidad reportada. Faltan relojes verificados, integridad de recuperación y objetivos para evaluar continuidad.” Mostrar cinco segundos de reconstrucción o captura de respaldo; la animación es ilustrativa.
- **04:15–04:50, diapositiva 3.** “Investigamos credencial comprometida, abuso por alguien autorizado y coincidencia de actividades legítimas con otra vía de afectación. Ninguna cadena está probada. Pedimos una sesión, proceso o transacción compartida, además de tiempo.”
- **04:50–05:50, diapositiva 4.** Abrir AU-02, E-03/E-04 y Ver metadatos; mostrar respuesta y límite. “El juego usa resúmenes locales; no ejecuta SQL Server. Documentado significa que completamos la revisión educativa. El laboratorio está en sus anexos.” Si el entorno demora, usar libreta-respaldo.pdf y recorrido.webm; no esperar a reiniciar toda la aplicación.
- **05:50–06:40, diapositiva 5.** “Las 216 órdenes reproducen el caso; los campos 144/72 son supuestos y no pérdida monetaria. Proponemos once acciones para administración. B1-1 y B1-2 siguen no concluyentes.” Aclarar que permisos demostrados en PT-25 pertenecen a usuarios ficticios, y que AU-06 no ejecuta ese PT.
- **06:40–07:00, diapositiva 6.** “P2 tiene disponibles nuestra sección y anexos; P3, cronología y propuestas. No consta entrega o revisión real. Dejamos pendientes BIA, criterios y revisión cruzada antes de consolidar.” Ceder el turno sin anticipar conclusiones de P3.

## Recorrido de trazabilidad para practicar: dos minutos

No se suma a los cuatro minutos de exposición; es una práctica de dominio o respuesta ampliada del comité. 0–20 s: diapositiva 4, afirmación sobre falta de contenido. 20–45 s: índice inicial del PDF de papeles, enlace a PT-22 y sus vínculos T-24/T-25, E-03/E-04/E-16/E-17. 45–75 s: abrir Q-05/Q-06 en 04_SQL/Analisis_Auditoria.sql y CSV en 03_Evidencias/resultados/. 75–105 s: comparar TransferenciasRed.csv v2, BytesEnviados desconocido, y su manifiesto; siete campos y bytes en Volumen_31840_I4_v1.json. 105–120 s: volver al Proyecto, pp. 4–5: ~1.6 GB es reportado, no paquete autenticado. El R/C global queda pendiente de P2. Este guion no acredita práctica realizada.

## Respuestas al comité: 30–45 segundos cada una

Duración prevista a 130–150 palabras/minuto. Recuento automático en resultados/I6/Revision_contenido_I6.json; tiempos previstos, sin grabación de voz ni ensayo humano. Preguntas oficiales: Proyecto, p. 7.

### 01. ¿Qué demuestra que los 1.6 GB transferidos fueron exfiltrados y no tráfico legítimo?

**Respuesta.** El volumen por sí solo no lo demuestra. El expediente reporta aproximadamente 1.6 GB, pero no identifica contenido, destino autorizado ni proceso de origen. En PT-22 calculamos que siete campos de 31,840 clientes sintéticos ocupan unos 2.06 MB en CSV o 5.12 MB en JSONL; eso ilustra un límite y no reconstruye el flujo real. Solicitaría archivos u objetos, flujos completos, proxy y nube, autorización y vínculo con la sesión SQL. Si esos registros acreditaran tráfico legítimo, retiraría esa cadena de exfiltración sin descartar otras vías del incidente.

### 02. ¿Cómo separar correlación temporal de causa del incidente?

**Respuesta.** Dos hechos cercanos en el tiempo justifican investigar, pero no prueban que uno produzca el otro. Buscaría un identificador compartido de sesión, transacción, token o proceso y una secuencia técnica compatible, con relojes contrastados y fuentes independientes. Las órdenes aparecen antes del despliegue en las horas reportadas; eso debilita una explicación simple, aunque sin verificar desfases tampoco la refuta definitivamente. Mantengo tres hipótesis abiertas y marco cada enlace no demostrado en el mapa causal. Si una traza autenticada uniera los pasos, revisaría la conclusión y preservaría la versión anterior.

### 03. ¿Qué información falta para atribuir los 216 cambios de órdenes?

**Respuesta.** Necesitamos el historial original antes y después, con identidad efectiva, sesión, aplicación o API, request o transaction ID, permisos y autorizaciones vigentes. También debemos vincular la cuenta con una persona mediante registros independientes; el nombre de usuario no basta. Q-07 reproduce 216 órdenes y deja UsuarioID, SesionID y Via desconocidos. Sus 144 cambios de monto y 72 de estado son un supuesto sintético, no datos de producción. Para evaluar efecto económico pediría además facturas, cobros, ERP y respaldo validado. Sin esa conciliación no afirmo fraude, pérdida ni que los datos estén intactos.

### 06. ¿Cómo preservar la cronología si existe desincronización de relojes?

**Respuesta.** Conservaría cada marca original, zona, sistema, método de extracción y hash, sin reemplazarla por una hora corregida. Buscaría eventos compartidos y registros de sincronización para estimar el desfase y su incertidumbre; luego añadiría una columna derivada con la fórmula y la versión. Hoy esas columnas están vacías porque faltan originales. Los ejercicios de más o menos cinco, diez o quince minutos muestran que el orden puede invertirse, pero no estiman un error real. Hasta verificarlo usaría intervalos entre horas reportadas, indicando sus límites y sin llamar normalizada a la representación UTC−6.

### 07. ¿Qué haría si la recuperación inmediata amenaza la cadena de custodia?

**Respuesta.** El auditor recomienda y evalúa; administración dirige y autoriza la respuesta. Ante daño activo priorizaría contención proporcional y captura rápida de datos volátiles y registros cuando sea viable, sin demorar una medida urgente por buscar una adquisición perfecta. Documentaría qué se preservó, qué se alteró o perdió, quién decidió, cuándo y por qué, con hashes y acceso restringido para las copias conservadas. Propondría recuperar en infraestructura limpia, dejando el original aislado. Antes de volver a escribir exigiría validación de respaldo, integridad y conciliación, según criterios aprobados. Aquí son propuestas: no afirmamos haberlas ejecutado.

## Ejercicios hipotéticos de evidencia contradictoria

Los tres escenarios siguientes son **ejercicios hipotéticos de defensa**. No se incorporan al expediente ni a los resultados, fuentes o reglas v2.1 del juego.

1. **Ejercicio hipotético A: aparece una transferencia autorizada.** El comité entrega un job firmado, destino corporativo y objetos que explican el flujo completo de ~1.6 GB. Comprobar autenticidad, cobertura y vínculo técnico. Si coinciden, retirar el enlace de ese flujo con la fuga; mantener abierta la causa de cifrado/caída y otras salidas no cubiertas. Cambiarían PT-22, mapa e informe, con preservación de versiones. No basta un correo genérico de aprobación.
2. **Ejercicio hipotético B: aparece un registro NTP que invierte el orden.** El comité aporta originales con CRM atrasado 15 min y despliegue adelantado 15 min, ambos contrastados con referencia independiente. Con reportada = real + offset, órdenes 02:42 pasan a 02:57 y despliegue 03:02 a 02:47, invirtiendo el orden; el caso inverso da órdenes 02:27 y despliegue 03:17. Aplicar únicamente los offsets realmente demostrados, conservar marcas originales y recalcular. La inversión permite revisar la hipótesis de despliegue, pero no demuestra causalidad sin proceso/transacción.
3. **Ejercicio hipotético C: la recuperación amenaza un original y aparece integridad validada.** El comité aporta prueba de respaldo limpio y conciliación completa, pero informa que recuperar sobre el disco afectado destruye memoria y logs. Verificar alcance de la prueba; una recuperación íntegra debilitaría la afirmación de pérdida persistente, sin acreditar preservación previa ni autoría. Recomendar recuperación en otro medio; si la urgencia obliga a alterar el original, administración registra decisión, pérdida de evidencia y mitigación. Actualizar límites de PT-23/25 y continuidad sin afirmar una custodia perfecta.

## Registro de práctica pendiente

| Actividad | Estado | Tiempo observado |
| --- | --- | --- |
| Exposición P1 de cuatro minutos | Pendiente de P1 | No medido |
| Recorrido de trazabilidad de dos minutos | Pendiente de P1 | No medido |
| Cinco respuestas de 30–45 s | Duración prevista; ensayo humano pendiente | No medido |
| Defensa conjunta de 12 min | Pendiente de aportes y coordinación P2/P3 | No medido |
| Equipo físico, USB y proyector | Pendiente | No medido |
