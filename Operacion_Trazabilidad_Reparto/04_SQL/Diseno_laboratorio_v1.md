# Diseño del laboratorio P1, versión 1

Estado: diseño I1 con parámetros de datos aprobados por P1 en esta conversación. Se eligió el laboratorio pequeño. La generación la hará otro modelo, por instrucción posterior del usuario; debe seguir `Instrucciones_generacion_datos_P1_v1.md`. No se generaron filas ni se ejecutaron consultas académicas en esta sesión.

## Fuentes y propósito

El proyecto oficial, páginas 4–6, aporta los 13 eventos, 31,840 registros leídos, aproximadamente 1.6 GB y 216 órdenes modificadas. La guía oficial, paso 7, exige tablas relacionadas y seis categorías de análisis SQL. Se diseñan Q-01–Q-12 y una consulta de soporte de permisos. Los cinco hashes documentales iniciales se comprobaron y coinciden; la salida queda en `03_Evidencias/resultados/Verificacion_entradas_I1_v1.json`.

Los eventos reportados se transcriben en `EventosExpediente`. Las tablas operativas son un laboratorio: una fila que reproduce una señal conocida no se convierte en una extracción del sistema original. Cuando una prueba necesite cuentas, importes o patrones inventados, se registrarán como datos sintéticos y se conservará la relación con el supuesto aprobado.

## Decisiones que P1 debe revisar

| Referencia | Propuesta concreta | Alcance |
| --- | --- | --- |
| S-03 | Referencia de Guatemala, UTC−6, 24 horas. Original y zona solo cuando estén aportados. | No se da por comprobada la sincronización del incidente. |
| S-09 | 85,000 clientes, 3,000 órdenes, 120 cuentas y exactamente 3,000 sesiones; semilla 1410. | Los clientes reproducen la magnitud del caso; las demás poblaciones son decisiones de laboratorio. |
| S-P1-PER | Órdenes: 1 de abril–15 de octubre; sesiones: 16 de septiembre–15 de octubre; SQL y red: 7–15 de octubre; referencia habitual: 7–13 de octubre de 2026. Corte: 15 de octubre de 2026, 23:59:59, UTC−6. | Provisional de P1 para consultas. No aprueba ni reemplaza S-02, que corresponde a P2. |
| S-04 | Programación diaria de respaldo completo a las 00:30 del 7 al 15 de octubre. Ocho ejecuciones del 7 al 14; el 15 queda sin ejecución registrada. Tamaños sintéticos de 8.0–8.3 GiB y 3.2 GiB el 14. Una ejecución histórica del 30 de junio y una restauración satisfactoria registrada el 1 de julio de 2026. | Nueve ejecuciones y una restauración histórica ficticia. No son respaldos ni restauraciones que se hayan ejecutado al preparar este trabajo. Las fechas retiradas de 01:00/15 de mayo siguen retiradas. |
| S-P1-ACC | Diez personas dadas de baja: seis con una cuenta activa y cuatro con cuenta deshabilitada. Treinta cuentas privilegiadas: ocho personales/externas sin MFA, cuatro compartidas con MFA, seis personales con MFA y recertificación vencida, doce personales con MFA y recertificación vigente. Los cuatro grupos de privilegios no se superponen. | Las ocho incluyen `ext_ops_04`. La fecha de baja y el estado de las cuentas son ficticios. Las seis recertificaciones vencidas se reparten en tres fechas antiguas y tres fechas no aportadas. |
| S-P1-CAS | Tres elevaciones sin ticket y tres sin vencimiento, sin superposición; seis controles con ambos campos. Un administrador ficticio con UPDATE/DELETE sobre `BitacoraSQL` y un control sin esos permisos. Cinco alertas sintéticas adicionales: dos completas, una sin asignación, una sin primera acción y una sin cierre. Tres despliegues sintéticos completos y dos con faltantes. | Los permisos efectivos se comprobarán en SQL Server. No se ejecutará una alteración de bitácoras ni se atribuirá ese permiso a RedNova. |
| S-P1-ORD | Representar las 216 órdenes distintas con 216 cambios sintéticos: 144 de monto y 72 de estado. Cuenta, sesión y vía del incidente permanecen desconocidas. Añadir diez pares de órdenes candidatas a duplicidad y diez pares legítimos que difieren en un campo de la regla. | Los campos y valores de esos cambios son supuestos, no detalles aportados por E-05. No se genera facturación ni se afirma conciliación con el ERP o con un respaldo. |
| S-P1-UMB | Recertificación: más de 180 días o fecha ausente. Sesiones: al menos cinco observaciones en tres días distintos para formar el patrón de horas por cuenta. SQL/red: volumen superior a tres veces el máximo habitual con actividad en cinco días distintos; sin base suficiente se marca no evaluable. Respaldos: variación absoluta superior al 25 % respecto del anterior completo exitoso. | Son reglas de selección del laboratorio. No son políticas de RedNova ni objetivos aprobados por P2/P3. Se mostrarán también las filas con datos insuficientes. |
| S-P1-NOR | Incluir cuentas de soporte y servicio con actividad legítima entre 00:00 y 05:00. Añadir dos sesiones fuera del patrón de cuentas diurnas, una lectura sintética de 20,000 filas y un flujo sintético de 1,200,000,000 bytes como controles anómalos separados del expediente. | La lectura de 31,840 filas conserva login desconocido; el flujo del expediente conserva bytes exactos desconocidos. No se fuerza una comparación por cuenta cuando falta la cuenta. No se inventan lagunas de logs. |

Las referencias `S-P1-*` son provisionales; P2 conserva la numeración global S. Las cantidades de casos anteriores deben reservarse de forma determinista antes de generar el fondo aleatorio para evitar anomalías accidentales. Una cuenta deshabilitada no tendrá sesiones posteriores a su deshabilitación, salvo que se acuerde un caso adicional explícito.

## Modelo relacional y campos

Todas las tablas operativas llevan `ClaseOrigen`, `ReferenciaExpediente` anulable y `SupuestosAplicados`. `ClaseOrigen` distingue `laboratorio` de `reproduccion_expediente`; en una reproducción con campos sintéticos, estos se enumeran en el diccionario y en `SupuestosAplicados`. Los identificadores ficticios no se confunden con códigos de evidencia E.

| Tabla | Clave y campos necesarios | Pregunta o relación |
| --- | --- | --- |
| Empleados | `EmpleadoID` PK, nombre ficticio, área, relación, empresa ficticia, ingreso, baja | RR. HH. ficticio para Q-01; el número de personas se fija en la implementación sin deducir que las categorías del caso sean disjuntas. |
| Usuarios | `UsuarioID` PK, nombre único, `EmpleadoID` FK anulable, tipo, sistema, privilegiada, MFA, estado, creación, última recertificación | Q-01/02 y claves de sesiones/privilegios. Nulo en empleado solo para cuenta compartida/servicio o identidad no aportada del expediente. |
| Sesiones | `SesionID` PK, `UsuarioID` FK, `FuenteID` FK, hora reportada local, original, zona original, IP, dispositivo, método, resultado | Q-03. `ext_ops_04` a las 02:17 sin MFA reproduce E-02; IP y dispositivo originales quedan nulos. |
| Privilegios | `AsignacionID` PK, `UsuarioID` FK anulable, rol, sistema, hora, asignador anulable, ticket, vencimiento, `FuenteID` FK | Q-04. La elevación reportada de las 02:26 no recibe por inferencia una cuenta. |
| Clientes | `ClienteID` PK, etiqueta ficticia, departamento, plan, alta, estado, clasificación anulable | Base de 85,000 clientes ficticios, relación con órdenes y medición del tamaño exportado en el análisis posterior. Sin DPI, teléfonos ni datos personales reales. |
| Ordenes | `OrdenID` PK, `ClienteID` FK, vendedor ficticio, sucursal 1–18, creación, estado, plan, monto GTQ, canal | Q-07/08. Identificadores de vendedor son códigos, sin tabla adicional. |
| HistorialOrdenes | `CambioID` PK, `OrdenID` FK, hora, `UsuarioID`/`SesionID` FK anulables, campo, anterior, nuevo, vía anulable, `FuenteID` FK | Q-07 cuenta cambios y órdenes distintas por separado. Valores anterior/nuevo representan el registro sintético, sin afirmar una comparación con respaldo. |
| CambiosSistema | `CambioSistemaID` PK, ticket, sistema, versión, solicitante/aprobador/ejecutor anulables, aprobación, despliegue, documento de pruebas, hash de artefacto anulable | Q-10. El despliegue de las 03:02 conserva aprobación no documentada; no se fabrica un artefacto ejecutable. |
| ProgramacionBackups | `ProgramacionID` PK, base ficticia, tipo, hora programada, destino `.example` | Q-09 contrasta programación con ejecución; una programación puede carecer de ejecución. |
| Backups | `BackupID` PK, `ProgramacionID` FK anulable, base, tipo, inicio/fin, tamaño GiB, estado, checksum declarado | Q-09. El tamaño usa GiB y se etiqueta como sintético; el checksum registrado no acredita un respaldo real. |
| PruebasRestauracion | `PruebaID` PK, `BackupID` FK, fecha, resultado, minutos, responsable ficticio | Q-09. Registro histórico generado por supuesto, separado de cualquier prueba de restauración ejecutada en este proyecto. |
| BitacoraSQL | `EventoSQLID` PK, hora, `UsuarioID` FK anulable, objeto, acción, filas, aplicación/IP anulables, `FuenteID` FK | Q-05 y prueba de permisos. Lectura reportada de 31,840 con cuenta desconocida; controles normales/anómalos sintéticos aparte. |
| TransferenciasRed | `FlujoID` PK, hora reportada, original/inicio/fin UTC anulables, IP origen/destino, puerto, protocolo, bytes exactos anulables, volumen reportado, clasificación, `FuenteID` FK | Q-06. En E-04, `BytesEnviados` es NULL y `VolumenReportado` es `~1.6 GB`; cuenta/contenido/proceso no aportados. Comparación normal por origen/destino/clase de tráfico sintéticos cuando existan. |
| Alertas | `AlertaID` PK, hora reportada, original UTC anulable, severidad, regla, activo, estado, asignado, primera acción, cierre, nota, `FuenteID` FK | Q-11. La alerta de 03:18 tiene cierre no documentado; no se inventa una primera acción a las 04:05. |
| FuentesTiempo | `FuenteID` PK, nombre, zona original anulable, desfase en segundos anulable, método, verificado | Q-12 y PT-25. Los relojes del caso se conservan sin verificar; las fuentes sintéticas pueden usar UTC−6 declarado por el generador, sin acreditar relojes de producción. |
| EventosExpediente | `EventoID` PK (EVT-01–13), hora reportada, `FuenteID` FK, descripción, cuenta conocida, activo, evidencia E anulable, página PDF, original/zona/desfase anulables | Q-12 presenta los 13 eventos sin duplicarlos por cada cambio de orden. Incluye solicitud API, caída, activación solicitada, retornos y conciliación solicitada sin crear tablas vacías para cada hecho. |

El mínimo obligatorio está cubierto: permisos (Usuarios/Privilegios y permisos efectivos), bajas (Empleados/Usuarios), horarios (Sesiones), modificaciones (HistorialOrdenes), duplicidades (Ordenes) y variaciones de backup (Backups). No se añade `ChatbotSesiones`: E-10 corresponde a P3 y no es necesario para estas consultas.

### Claves, nulos, períodos y unidades

Se usarán claves enteras estables, claves foráneas comprobadas y restricciones de estado, montos no negativos y fechas de fin posteriores al inicio. Las cuentas usadas por claves foráneas deben existir. Las cuentas no atribuidas se expresan con NULL; no se crea un usuario llamado “desconocido” que parezca una identidad común.

Las horas locales usan `datetime2(0)` y las horas con zona conocida `datetimeoffset(0)`. `HoraReportadaLocal` no se denomina `HoraNormalizada`: una resta de seis horas solo convierte zona, no verifica desfase. Las filas del expediente mantienen `HoraOriginal`, `ZonaOriginal` y `DesfaseSegundos` nulos si no fueron aportados. Los escenarios de sensibilidad de relojes se calcularán aparte y no alterarán las entradas.

Los montos usan `decimal(12,2)` y moneda GTQ. Los tamaños de respaldo usan GiB (2^30 bytes). Los flujos sintéticos usan bytes enteros. La unidad aproximada GB del expediente se mantiene como texto; cualquier estimación posterior declarará si toma GB decimal o GiB, y no se cargará como bytes exactos del caso.

Los CSV usan UTF-8, encabezado, coma y reglas de escape de CSV. El token `\N` representa NULL; se distingue de cero, falso y texto vacío. La carga debe convertirlo antes de insertar a las tablas finales. Las exportaciones tendrán orden estable y fechas ISO 8601. Ningún resultado depende de `GETDATE()`; usa el corte acordado.

## Diseño de Q-01–Q-12 y comprobación de permisos

| Consulta / prueba | Campos, origen y regla de selección | Salida y límite | PT / destinatario |
| --- | --- | --- | --- |
| Q-01 / T-20 | Empleados.baja y Usuarios.estado; baja hasta el corte con cuenta activa. Filas de laboratorio. | Cuenta y días desde baja. Falta de baja o cuenta deshabilitada no se considera el mismo caso. No demuestra bajas pendientes de RedNova. | P2; R/C pendientes. |
| Q-02 / T-21 | Usuarios: privilegiada y sin MFA, compartida o recertificación >180 días/ausente, al corte. | Una fila por cuenta, motivos separados. Se informa nulo como “sin registro”, no como fecha vencida conocida. Criterio de selección sintético. | PT-20; P2. |
| Q-03 / T-22 | Sesiones: horas de referencia por cuenta y días con observaciones; fuera de las horas habituales con muestra suficiente. | Incluir actividad nocturna legítima como control. Reproducción E-02 y referencia sintética diferenciadas. Cuenta sin base suficiente: no evaluable. | PT-20. |
| Q-04 / T-23 | Privilegios: ticket o vencimiento ausentes, concesiones aún vigentes al corte. | Campo faltante y origen; permisos históricos declarados no equivalen a permiso efectivo actual. Cuenta de 02:26 desconocida. | PT-21; P2. |
| Q-05 / T-24 | BitacoraSQL: lecturas frente a máximo habitual por cuenta, muestra de cinco días, umbral 3×. | Filas y razón; login NULL de E-03 no se adjudica a ext_ops_04 ni al login del control sintético. | PT-21. |
| Q-06 / T-25 | TransferenciasRed: destino sin clasificar o volumen >3× máximo habitual por origen/destino/clase; cinco días de referencia. | Filas con base/bytes ausentes visibles como no evaluables; E-04 sigue aproximada. IP y volumen no identifican contenido ni exfiltración. | PT-22. |
| Q-07 / T-26 | HistorialOrdenes y Ordenes: ventana del 14 de octubre, 02:17–03:42; agrupar por orden/campo/cuenta/vía. | CSV conserva detalle; contar 216 órdenes distintas frente al número de cambios. Los valores sintéticos no acreditan daño monetario del caso. | PT-23. |
| Q-08 / T-27 | Ordenes: mismo cliente, minuto de creación, plan, monto y canal, estado distinto de cancelada; grupos con COUNT >1. | Candidatas a duplicidad. Los diez pares legítimos difieren en una clave. Sin factura/identificador de petición no prueba cobro duplicado. | PT-23; P2. |
| Q-09 / T-28 | ProgramacionBackups/Backups/PruebasRestauracion: ejecución faltante, variación >25 % frente al anterior completo exitoso, última restauración satisfactoria al corte. | Programación, ejecución y restauración en columnas distintas. El 1 de julio sería un registro sintético; no se declara restauración realizada por nosotros. | PT-23; P3. |
| Q-10 / T-29 | CambiosSistema: aprobación ausente/posterior al despliegue o documento de pruebas ausente. | Motivos por despliegue. No documentada no equivale a nunca autorizada. | P2. |
| Q-11 / T-30 | Alertas críticas hasta el corte con asignación, primera acción o cierre ausente; intervalos solo con ambas marcas. | Duración conocida o pendiente; sin política recibida no se afirma incumplimiento de SLA de atención. | PT-24. |
| Q-12 / T-31 | EventosExpediente/FuentesTiempo, intervalo 12–15 de octubre, orden por hora reportada e ID. | Exactamente 13 eventos, original/zona/desfase/verificación y página. Reproducción del resumen, sin corroboración independiente ni reloj normalizado por inferencia. | PT-20–PT-25; P3. |
| Q-S01 / T-32 | Metadatos SQL Server, contexto efectivo de `admin_bitacora_lab` y control; verificar UPDATE/DELETE/ALTER y capacidad administrativa del auditor. | Mostrar concesiones y permisos efectivos. El usuario auditor consulta una vista de resultados/metadatos autorizados. El administrador de preparación verifica el contexto y registra por separado su ejecución. | PT-25, alerta 08. |
| V-LAB / T-33 | Claves, conteos, orígenes, nulos, fechas, 13 eventos y cifras; intento inocuo de escritura del auditor en una transacción que se revierte. | Registro real de aprobación/rechazo del motor. No se altera ningún sistema ajeno ni se usa escritura como consulta académica. | Todos los PT. |

No se interpreta como “fuera de patrón” una cuenta que solo tiene una sesión. SQL y red sin muestra habitual suficiente quedan visibles. Se revisarán valores situados justo en 180 días, 3× y 25 % para comprobar que los límites de la sentencia coincidan con la regla documentada.

## Muestra propuesta para la revisión conjunta

Esta tabla es un diseño, no una salida ejecutada ni un archivo de evidencia nuevo.

| Fila propuesta | Origen | Valor que se conserva | Dato que no se completará |
| --- | --- | --- | --- |
| EVT-02 | Expediente, proyecto p. 4 | 14 de octubre, 02:17; ext_ops_04; sin MFA | Persona, IP y reloj original no aportados. |
| EVT-04 | Expediente, proyecto p. 4 | 02:31; 31,840 registros | Login, sesión y contenido exacto no aportados. |
| EVT-05 | Expediente, proyecto p. 4 | 02:35; ~1.6 GB; destino no clasificado | Bytes exactos y contenido no aportados. |
| Cuenta `svc_respaldo_lab` | Laboratorio, S-P1-NOR aprobado | Actividad habitual de madrugada | No es una cuenta recibida de RedNova. |
| Par de órdenes `LAB-DUP-01` | Laboratorio, S-P1-ORD aprobado | Coincide en la clave propuesta de duplicidad | No se convierte en dos facturas ni en fraude confirmado. |

## Entorno y secuencia reproducible

Se comprobó Docker Engine 29.4.2 mediante el permiso de la herramienta; el acceso al socket desde el aislamiento ordinario fue denegado. No había imagen SQL Server antes de esta sesión; se descargó y se inició un contenedor propio. Hay aproximadamente 20 GiB libres y 16 GiB de memoria disponible al comprobar. Otros servicios Docker existentes se conservan.

Se prepara SQL Server 2022 Developer con la imagen oficial `mcr.microsoft.com/mssql/server:2022-latest`. Su digest real es `sha256:cf8f0ab2ebe61feec2eed2629061a07d247f791c2a8ddda74a4ac9f06a291718`; `SELECT @@VERSION` devolvió SQL Server 2022 Developer 16.0.4305.5. La guía oficial de Microsoft documenta la imagen y `sqlcmd` dentro de `/opt/mssql-tools18/bin` ([fuente consultada](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-docker?view=sql-server-ver16)).

Nombres propios: contenedor `p1-trazabilidad-sql2022`, volumen `p1_trazabilidad_sql2022_v1`, base `RedNova_P1_Lab_v1`. Publicación prevista solo en `127.0.0.1:14331`. El arranque publicó correctamente ese puerto; la consulta previa con `ss` no pudo acceder a netlink dentro del aislamiento. No se reutiliza una base ni un volumen de otros proyectos. Las claves locales se generarán en `.env`, fuera de Git y fuera de los documentos de evidencia.

Archivos previstos: `compose.yaml`, `00_preparar_base.sql`, `01_esquema.sql`, `02_generar_datos.py`, `03_carga.sql`, `04_usuario_lectura.sql`, `verificar_laboratorio.sql` y un ejecutor Python estándar para carga/exportación si hace falta. `sqlcmd` se ejecutará en el contenedor; Python generará CSV y preparará carga por lotes sin instalar un controlador de base adicional. La exportación consumirá valores correctamente escapados, sin tratar una tabla impresa de `sqlcmd` como CSV válido.

Secuencia objetivo desde `04_SQL/`, que I2 deberá implementar y comprobar:

```bash
python3 laboratorio.py preparar
python3 laboratorio.py construir --version v1
python3 laboratorio.py verificar --version v1
python3 laboratorio.py consultas --version v1
```

Son comandos previstos; el ejecutor todavía no existe. `construir` rechazará una base existente y una carpeta de datos versionada existente. La repetición usará una segunda base vacía propia y conservará datos/resultados anteriores. El orden interno será crear base → esquema → generar → cargar → crear usuario de lectura → verificar. Ninguna opción borrará automáticamente evidencia ni bases existentes.

`auditor_lectura` tendrá solo lectura de la base del laboratorio, sin pertenecer a roles de escritura/administración. El administrador ficticio de bitácoras será otro contexto de prueba. Un permiso excesivo en ese contexto no modifica los permisos del auditor.

## Versiones, evidencia y dependencias

Al generar se preservará la primera versión en `03_Evidencias/originales/` y se iniciará `hashes_sha256_v1.csv`, sin incluirse a sí mismo. Los resultados conservarán consulta, hash del SQL, versión de datos, corte, motor, usuario y momento real. La repetición comparará contenido con orden determinista y comprobará un conteo por un método independiente en Python.

Asignación prevista, todavía sin registro de evidencia generada: E-11 manifiesto del laboratorio; E-12–E-23 resultados Q-01–Q-12; E-24 permisos de bitácora; E-25 validación; E-26 archivos de datos; E-27 esquema/generador; E-28 diccionario/relaciones; E-29 captura real si se obtiene. Cada ruta/version/hash se individualizará. Los PT no se convertirán en extracciones originales.

Las pruebas T-20–T-33 pertenecen al rango de P1. Los vínculos R/C y códigos S definitivos quedan pendientes de P2. RTO, RPO, criterio de atención de alertas y periodicidad exigible de restauración no se inventan: se solicitan a P2/P3. El laboratorio puede mostrar registros incompletos y días transcurridos sin declarar un incumplimiento de una política no recibida.

La plantilla adaptada desde el DOCX aportado por el usuario y el formato escrito de la guía interna queda disponible para P2. Se conservó la fuente original con su hash. Su disponibilidad local no se registrará como entrega o revisión humana efectiva. El usuario confirmó a Anthony Samuel Ordoñez Son (2401002033) como P1/custodio, a María José Aldana Culajay (2301002013) como P2 y a Luis Antonio Vicente Zapón (2301002003) como P3. El registro está en `03_Evidencias/Responsables_equipo_v1.csv`; los traspasos y revisiones siguen pendientes hasta que ocurran.

## Cambio de ejecución acordado

P1 eligió el tamaño pequeño: 85,000 clientes, 3,000 órdenes, 120 cuentas y 3,000 sesiones. Después pidió que otro modelo genere los datos. El contrato detallado para esa entrega está en `Instrucciones_generacion_datos_P1_v1.md`, que concreta nombres, IDs, cantidades auxiliares, encabezados, casos y validaciones. `01_esquema.sql` fue comprobado en una base vacía propia: 16 tablas, 18 claves foráneas y cero filas. La carga y las consultas quedan pendientes de recibir y verificar el conjunto; no se generaron datos en esta sesión.
