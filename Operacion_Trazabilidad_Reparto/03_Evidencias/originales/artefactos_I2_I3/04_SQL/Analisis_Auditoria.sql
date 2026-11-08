-- P1 I3. Solo lectura; UTC-06 declarado, no sincronización comprobada.
-- Cada bloque se ejecuta separadamente por laboratorio.py como auditor_lectura.
-- Q-01 Bajas pendientes; S-P1-ACC.
SELECT u.*,e.FechaBaja,DATEDIFF(day,e.FechaBaja,@corte) AS DiasDesdeBaja
FROM dbo.Usuarios u JOIN dbo.Empleados e ON e.EmpleadoID=u.EmpleadoID
WHERE u.Estado='Activa' AND e.FechaBaja<=@corte ORDER BY u.UsuarioID;
-- Q-02 Privilegiadas: motivos independientes; umbral estrictamente >180 días.
SELECT u.*,CAST(CASE WHEN MFAHabilitado=0 THEN 1 ELSE 0 END AS bit) AS SinMFA,
CAST(CASE WHEN TipoCuenta='Compartida' THEN 1 ELSE 0 END AS bit) AS Compartida,
CASE WHEN UltimaRecertificacion IS NULL THEN 'sin registro' WHEN DATEDIFF(day,UltimaRecertificacion,@corte)>180 THEN 'vencida' ELSE 'vigente' END AS Recertificacion
FROM dbo.Usuarios u WHERE EsPrivilegiada=1 AND FechaCreacion<=@corte AND
(MFAHabilitado=0 OR TipoCuenta='Compartida' OR UltimaRecertificacion IS NULL OR DATEDIFF(day,UltimaRecertificacion,@corte)>180) ORDER BY UsuarioID;
-- Q-03 Horas por cuenta, referencia 7-13 octubre. No evaluable visible.
WITH b AS (SELECT UsuarioID,COUNT(*) n,COUNT(DISTINCT CAST(HoraReportadaLocal AS date)) dias FROM dbo.Sesiones WHERE HoraReportadaLocal>=@ref AND HoraReportadaLocal<@finref GROUP BY UsuarioID)
SELECT s.*,b.n AS Observaciones,b.dias AS DiasReferencia,CASE WHEN COALESCE(b.n,0)<5 OR COALESCE(b.dias,0)<3 THEN 'no evaluable' ELSE 'fuera de patron' END AS Evaluacion
FROM dbo.Sesiones s LEFT JOIN b ON b.UsuarioID=s.UsuarioID WHERE s.HoraReportadaLocal>=@finref AND s.HoraReportadaLocal<=@corte AND
(COALESCE(b.n,0)<5 OR COALESCE(b.dias,0)<3 OR NOT EXISTS(SELECT 1 FROM dbo.Sesiones r WHERE r.UsuarioID=s.UsuarioID AND r.HoraReportadaLocal>=@ref AND r.HoraReportadaLocal<@finref AND DATEPART(hour,r.HoraReportadaLocal)=DATEPART(hour,s.HoraReportadaLocal))) ORDER BY s.SesionID;
-- Q-04 Concesiones vigentes con faltantes; no son permisos efectivos actuales.
SELECT *,CAST(CASE WHEN Ticket IS NULL THEN 1 ELSE 0 END AS bit) AS SinTicket,CAST(CASE WHEN Vence IS NULL THEN 1 ELSE 0 END AS bit) AS SinVencimiento
FROM dbo.Privilegios WHERE FechaHora<=@corte AND (Vence IS NULL OR Vence>=@corte) AND (Ticket IS NULL OR Vence IS NULL) ORDER BY AsignacionID;
-- Q-05 Lecturas por cuenta, cinco días y >3x máximo; identidad ausente no evaluable.
WITH b AS (SELECT UsuarioID,MAX(Filas) maximo,COUNT(DISTINCT CAST(FechaHora AS date)) dias FROM dbo.BitacoraSQL WHERE FechaHora>=@ref AND FechaHora<@finref GROUP BY UsuarioID)
SELECT s.*,b.maximo AS MaximoHabitual,b.dias AS DiasReferencia,CASE WHEN s.UsuarioID IS NULL OR COALESCE(b.dias,0)<5 THEN 'no evaluable' ELSE 'supera 3x' END AS Evaluacion
FROM dbo.BitacoraSQL s LEFT JOIN b ON b.UsuarioID=s.UsuarioID WHERE s.FechaHora>=@finref AND s.FechaHora<=@corte AND (s.UsuarioID IS NULL OR COALESCE(b.dias,0)<5 OR CAST(s.Filas AS bigint)>3*CAST(b.maximo AS bigint)) ORDER BY s.EventoSQLID;
-- Q-06 Red por origen/destino/protocolo/puerto; cinco días, bytes exactos.
WITH b AS (SELECT IPOrigen,IPDestino,Protocolo,Puerto,MAX(BytesEnviados) maximo,COUNT(DISTINCT CAST(HoraReportadaLocal AS date)) dias FROM dbo.TransferenciasRed WHERE HoraReportadaLocal>=@ref AND HoraReportadaLocal<@finref GROUP BY IPOrigen,IPDestino,Protocolo,Puerto)
SELECT s.*,b.maximo AS MaximoHabitualBytes,b.dias AS DiasReferencia,CASE WHEN s.BytesEnviados IS NULL OR COALESCE(b.dias,0)<5 THEN 'no evaluable' ELSE 'supera 3x' END AS Evaluacion
FROM dbo.TransferenciasRed s LEFT JOIN b ON b.IPOrigen=s.IPOrigen AND b.IPDestino=s.IPDestino AND b.Protocolo=s.Protocolo AND b.Puerto=s.Puerto WHERE s.HoraReportadaLocal>=@finref AND s.HoraReportadaLocal<=@corte AND (s.ClasificacionDestino IS NULL OR COALESCE(b.dias,0)<5 OR s.BytesEnviados IS NULL OR s.BytesEnviados>3*b.maximo) ORDER BY s.FlujoID;
-- Q-07 Detalle completo de cambios en ventana; órdenes distintas se verifican aparte.
SELECT h.*,o.Moneda FROM dbo.HistorialOrdenes h JOIN dbo.Ordenes o ON o.OrdenID=h.OrdenID WHERE h.FechaHora>='2026-10-14T02:17:00' AND h.FechaHora<='2026-10-14T03:42:00' AND h.FechaHora<=@corte ORDER BY h.CambioID;
-- Q-08 Candidatas: cliente/minuto/plan/monto/canal, excluye canceladas.
SELECT ClienteID,DATEADD(minute,DATEDIFF(minute,0,FechaCreacion),0) AS MinutoCreacion,[Plan],Monto,Moneda,Canal,COUNT(*) AS Cantidad,STRING_AGG(CAST(OrdenID AS varchar(max)),',') WITHIN GROUP(ORDER BY OrdenID) AS Ordenes
FROM dbo.Ordenes WHERE Estado<>'Cancelada' AND FechaCreacion<=@corte GROUP BY ClienteID,DATEADD(minute,DATEDIFF(minute,0,FechaCreacion),0),[Plan],Monto,Moneda,Canal HAVING COUNT(*)>1 ORDER BY ClienteID,MinutoCreacion,[Plan],Monto,Moneda,Canal;
-- Q-09 Programación separada de ejecución y restauración; GiB, >25% absoluto.
SELECT p.*,b.BackupID,b.Inicio,b.Fin,b.TamanoGiB,b.Estado,prev.TamanoGiB AS AnteriorGiB,
CAST(100.0*(b.TamanoGiB-prev.TamanoGiB)/NULLIF(prev.TamanoGiB,0) AS decimal(12,3)) AS VariacionPct,
CAST(CASE WHEN ABS((b.TamanoGiB-prev.TamanoGiB)/NULLIF(prev.TamanoGiB,0))>0.25 THEN 1 ELSE 0 END AS bit) AS Supera25Pct,
CAST(CASE WHEN b.BackupID IS NULL THEN 1 ELSE 0 END AS bit) AS SinEjecucion,
r.Fecha AS UltimaRestauracionSintetica,DATEDIFF(day,r.Fecha,@corte) AS DiasDesdeRegistroRestauracion
FROM dbo.ProgramacionBackups p LEFT JOIN dbo.Backups b ON b.ProgramacionID=p.ProgramacionID AND b.Inicio<=@corte
OUTER APPLY(SELECT TOP(1) a.TamanoGiB FROM dbo.Backups a WHERE a.BaseDatos=p.BaseDatos AND a.Tipo='Completo' AND a.Estado='Completado' AND a.Inicio<b.Inicio ORDER BY a.Inicio DESC,a.BackupID DESC) prev
OUTER APPLY(SELECT TOP(1) pr.Fecha FROM dbo.PruebasRestauracion pr JOIN dbo.Backups rb ON rb.BackupID=pr.BackupID WHERE rb.BaseDatos=p.BaseDatos AND pr.Resultado='Satisfactoria' AND pr.Fecha<=@corte ORDER BY pr.Fecha DESC,pr.PruebaID DESC) r
WHERE p.HoraProgramada<=@corte ORDER BY p.ProgramacionID,b.BackupID;
-- Q-10 Autorización previa y pruebas documentadas.
SELECT *,CAST(CASE WHEN AprobadoPor IS NULL OR FechaAprobacion IS NULL OR FechaAprobacion>FechaHoraDespliegue THEN 1 ELSE 0 END AS bit) AS AprobacionNoAcreditada,CAST(CASE WHEN EvidenciaPruebas IS NULL THEN 1 ELSE 0 END AS bit) AS SinPruebas
FROM dbo.CambiosSistema WHERE FechaHoraDespliegue<=@corte AND (AprobadoPor IS NULL OR FechaAprobacion IS NULL OR FechaAprobacion>FechaHoraDespliegue OR EvidenciaPruebas IS NULL) ORDER BY CambioSistemaID;
-- Q-11 Alertas críticas incompletas. No interpreta SLA no recibido.
SELECT *,DATEDIFF(minute,HoraReportadaLocal,PrimeraAccion) AS MinutosPrimeraAccion,DATEDIFF(minute,HoraReportadaLocal,FechaCierre) AS MinutosCierre FROM dbo.Alertas WHERE Severidad='Critica' AND HoraReportadaLocal<=@corte AND (AsignadoA IS NULL OR PrimeraAccion IS NULL OR FechaCierre IS NULL) ORDER BY AlertaID;
-- Q-12 Cronología reportada: no normaliza relojes desconocidos.
SELECT e.*,f.Nombre AS Fuente,f.Verificado AS RelojVerificado,f.Metodo AS MetodoReloj,DATEDIFF(minute,LAG(e.HoraReportadaLocal) OVER(ORDER BY e.HoraReportadaLocal,e.EventoID),e.HoraReportadaLocal) AS MinutosDesdeAnterior FROM dbo.EventosExpediente e JOIN dbo.FuentesTiempo f ON f.FuenteID=e.FuenteID WHERE e.HoraReportadaLocal>='2026-10-12' AND e.HoraReportadaLocal<=@corte ORDER BY e.HoraReportadaLocal,e.EventoID;
