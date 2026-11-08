# Consultas y resultados I3

Ejecución real en SQL Server 2022 Developer 16.0.4305.5, base `RedNova_P1_Lab_v2`, login y usuario `auditor_lectura`. Datos sintéticos v2, semilla 1410; corte fijo `2026-10-15T23:59:59-06:00`. Comprobantes y momentos exactos en `resultados/Ejecuciones_v1.csv`. Sentencias editables: `04_SQL/Analisis_Auditoria.sql`; parámetros inyectados por `laboratorio.py` con ese corte y referencia 7–13 de octubre. CSV completos UTF-8, coma, encabezados y LF; `\N` significa NULL, bit 0/1, fechas ISO, montos GTQ, respaldos GiB y tráfico exacto en bytes solo cuando existe. Orden explícito estable en cada consulta.

Las consultas se ejecutaron dos veces y se compararon por contenido dentro de cada corrida. También se reconstruyó otra base desde cero y se contrastaron los CSV por SHA-256 entre bases. Todas las celdas de las 16 tablas fueron contrastadas entre SQL y CSV. El conteo independiente por Python de cambios/órdenes y grupos duplicados consta en `Contraste_independiente_I3.json`.

## Q-01 · Bajas pendientes

Objetivo/regla: Baja hasta corte y cuenta activa; seis positivas frente a cuatro deshabilitadas excluidas.

Resultado ejecutado: **6 filas**, [CSV completo](resultados/Q-01.csv). Prueba el cruce sintético; sugiere revisión de revocación. No acredita bajas reales.

## Q-02 · Privilegios y MFA

Objetivo/regla: Privilegiada sin MFA, compartida, recertificación ausente o >180 días; motivos separados.

Resultado ejecutado: **18 filas**, [CSV completo](resultados/Q-02.csv). Ocho sin MFA, cuatro compartidas, tres vencidas y tres sin registro; doce vigentes excluidas. No prueba políticas de RedNova.

## Q-03 · Horarios por cuenta

Objetivo/regla: Horas observadas 7–13 octubre; >=5 observaciones en >=3 días; desde día 14 fuera de esas horas. Sin referencia: no evaluable.

Resultado ejecutado: **3 filas**, [CSV completo](resultados/Q-03.csv). Tres seleccionadas: reproducción E-02 y dos controles; soporte/servicio nocturnos habituales excluidos. Referencia sintética no demuestra uso ilegítimo.

## Q-04 · Elevaciones

Objetivo/regla: Vigente al corte y ticket/vencimiento ausente.

Resultado ejecutado: **7 filas**, [CSV completo](resultados/Q-04.csv). Seis casos sintéticos y una reproducción de elevación sin atribución; seis controles completos excluidos. Una declaración histórica de rol no prueba permiso efectivo.

## Q-05 · Lecturas

Objetivo/regla: Máximo habitual por cuenta con >=5 días, lectura >3x; NULL o base insuficiente no evaluable.

Resultado ejecutado: **2 filas**, [CSV completo](resultados/Q-05.csv). Control de 20,000 supera base; 31,840 con login desconocido es no evaluable. No vincula la lectura con ext_ops_04.

## Q-06 · Tráfico

Objetivo/regla: Base por IP origen/destino, protocolo y puerto, >=5 días; >3x, clasificación o base ausente.

Resultado ejecutado: **3 filas**, [CSV completo](resultados/Q-06.csv). Control 1,200,000,000 bytes; otro sin clasificación; E-04 ~1.6 GB con bytes NULL. No prueba contenido ni exfiltración.

## Q-07 · Cambios de órdenes

Objetivo/regla: Detalle en ventana inclusiva 14 octubre 02:17–03:42.

Resultado ejecutado: **216 filas**, [CSV completo](resultados/Q-07.csv). 216 filas y 216 órdenes distintas; 144 cambios de monto, 72 de estado. Sin cuenta/sesión/vía ni respaldo original; no acredita daño económico.

## Q-08 · Duplicidad candidata

Objetivo/regla: Cliente, minuto, plan, monto y canal iguales; excluye canceladas.

Resultado ejecutado: **10 filas**, [CSV completo](resultados/Q-08.csv). Diez grupos de dos; diez pares que difieren en plan excluidos. Sin facturas ni ID de petición no demuestra doble cobro.

## Q-09 · Respaldos

Objetivo/regla: Nueve programaciones; comparación con anterior completo exitoso; variación absoluta >25%; último registro satisfactorio al corte.

Resultado ejecutado: **9 filas**, [CSV completo](resultados/Q-09.csv). 3.2 GiB el 14; día 15 sin ejecución; registro ficticio 1 de julio (106 días al corte). No se realizó backup ni restore ni se evaluó RTO/RPO.

## Q-10 · Despliegues

Objetivo/regla: Aprobador/fecha ausentes, posterior al despliegue o documento de pruebas ausente.

Resultado ejecutado: **3 filas**, [CSV completo](resultados/Q-10.csv). Dos controles incompletos y reproducción E-06; tres completos excluidos. No documentada no demuestra ausencia de autorización verbal.

## Q-11 · Alertas críticas

Objetivo/regla: Falta asignación, primera acción o cierre; intervalos solo con ambas marcas.

Resultado ejecutado: **4 filas**, [CSV completo](resultados/Q-11.csv). Tres controles incompletos y reproducción E-07; dos completos excluidos. No se impone un SLA no recibido.

## Q-12 · Cronología

Objetivo/regla: 13 eventos ordenados por hora reportada e ID; incluye fuente, página, originales y verificación.

Resultado ejecutado: **13 filas**, [CSV completo](resultados/Q-12.csv). Comprueba transcripción y orden; no sincroniza relojes ni prueba causalidad. Cuenta conocida solo en EVT-02.

## Q-S01 · PT-25 / alerta 08

`resultados/Q-S01.csv` contiene permisos efectivos reales con HAS_PERMS_BY_NAME bajo EXECUTE AS USER para admin_bitacora_lab y control_bitacora_lab (ejecutor sa), y conexión propia para auditor_lectura. Admin ficticio: SELECT/UPDATE/DELETE=1, ALTER/CONTROL BD=0. Control y auditor: SELECT=1 y UPDATE/DELETE/ALTER/CONTROL BD=0. Concesiones declaradas exportadas aparte en Concesiones_SQL.csv. Esto demuestra la posibilidad de modificar esa bitácora sintética, no su alteración ni permisos de producción. El administrador de preparación sa tiene privilegios de servidor; su conexión se identifica por separado y no se confunde con las doce consultas del auditor. Un valor NULL de permisos de servidor en contextos WITHOUT LOGIN significa no evaluable en ese contexto, no un permiso concedido.

`Permisos_rechazos.csv` registra intentos reales del auditor rechazados: INSERT, UPDATE, DELETE, ALTER y CREATE USER, bajo transacciones revertidas. UPDATE/DELETE usan WHERE 1=0; no se modificó la bitácora. Conexion_auditor.json registra login, base y lectura de 85,000 clientes. La captura gráfica real permanece pendiente; no se fabricó una imagen de conexión. `Limites_umbrales.json` verifica en SQL los límites exactos 180/181 días, 3x/>3x y 25%/>25%.

## Revisión explicable por P1

Ejecutar una base nueva según README; abrir Q-07.csv, tomar CambioID/OrdenID de la primera fila y localizarla mediante `SELECT * FROM dbo.HistorialOrdenes WHERE CambioID=...` como auditor. Comparar con el CSV fuente y su ClaseOrigen/SupuestosAplicados. Una anomalía introducida comprueba que la consulta selecciona el caso diseñado; no es una nueva fuente del incidente. P1 debe revisar esa muestra y los desconocidos de Q-05/Q-06/Q-12. La revisión humana no se ha realizado.

Disponibilidad local: Q-01–04 y Q-10 preparados para P2; Q-09 y S-04 para P3. No consta traspaso ni aportes de esos integrantes. R/C/S globales, políticas, BIA, RTO/RPO y facturación siguen pendientes. Las seis categorías obligatorias están cubiertas; papeles e hipótesis corresponden a I4.
