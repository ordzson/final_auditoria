-- Verificaciones reales en motor; además laboratorio.py compara cada celda con CSV v2.
SELECT 'Eventos' AS Prueba,COUNT(*) AS Observado,13 AS Esperado FROM dbo.EventosExpediente
UNION ALL SELECT 'Eventos originales desconocidos',COUNT(*),13 FROM dbo.EventosExpediente WHERE HoraOriginal IS NULL AND ZonaOriginal IS NULL AND DesfaseSegundos IS NULL
UNION ALL SELECT 'Lectura E03 sin atribucion',COUNT(*),1 FROM dbo.BitacoraSQL WHERE ReferenciaExpediente='E-03' AND Filas=31840 AND UsuarioID IS NULL AND Aplicacion IS NULL AND IPOrigen IS NULL
UNION ALL SELECT 'Red E04 aproximada',COUNT(*),1 FROM dbo.TransferenciasRed WHERE ReferenciaExpediente='E-04' AND VolumenReportado='~1.6 GB' AND BytesEnviados IS NULL AND IPOrigen IS NULL AND IPDestino IS NULL AND InicioUTC IS NULL AND FinUTC IS NULL
UNION ALL SELECT 'Ordenes distintas ventana',COUNT(DISTINCT OrdenID),216 FROM dbo.HistorialOrdenes WHERE FechaHora BETWEEN '2026-10-14T02:17:00' AND '2026-10-14T03:42:00'
UNION ALL SELECT 'Cambios ventana',COUNT(*),216 FROM dbo.HistorialOrdenes WHERE FechaHora BETWEEN '2026-10-14T02:17:00' AND '2026-10-14T03:42:00'
UNION ALL SELECT 'Cambios E05 sin atribucion',COUNT(*),216 FROM dbo.HistorialOrdenes WHERE ReferenciaExpediente='E-05' AND UsuarioID IS NULL AND SesionID IS NULL AND Via IS NULL
UNION ALL SELECT 'Clientes',COUNT(*),85000 FROM dbo.Clientes
UNION ALL SELECT 'Sesiones fuera periodo',COUNT(*),0 FROM dbo.Sesiones WHERE HoraReportadaLocal<'2026-09-16' OR HoraReportadaLocal>'2026-10-15T23:59:59'
UNION ALL SELECT 'Ordenes fuera periodo',COUNT(*),0 FROM dbo.Ordenes WHERE FechaCreacion<'2026-04-01' OR FechaCreacion>'2026-10-15T23:59:59'
UNION ALL SELECT 'SQL fuera periodo',COUNT(*),0 FROM dbo.BitacoraSQL WHERE FechaHora<'2026-10-07' OR FechaHora>'2026-10-15T23:59:59'
UNION ALL SELECT 'Red fuera periodo',COUNT(*),0 FROM dbo.TransferenciasRed WHERE HoraReportadaLocal<'2026-10-07' OR HoraReportadaLocal>'2026-10-15T23:59:59'
UNION ALL SELECT 'Relojes curso verificados indebidamente',COUNT(*),0 FROM dbo.FuentesTiempo WHERE FuenteID LIKE 'CURSO%' AND (Verificado<>0 OR DesfaseSegundos IS NOT NULL)
ORDER BY Prueba;
