-- Contrato de datos P1 v1. Ejecutar solo en una base vacía propia.
-- No crea datos, no elimina tablas y no modifica bases ajenas.
SET XACT_ABORT ON;
BEGIN TRANSACTION;

CREATE TABLE dbo.FuentesTiempo (
 FuenteID varchar(32) NOT NULL PRIMARY KEY,
 Nombre nvarchar(100) NOT NULL,
 ZonaOriginal varchar(16) NULL,
 DesfaseSegundos int NULL,
 Metodo nvarchar(250) NOT NULL,
 Verificado bit NOT NULL,
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.Empleados (
 EmpleadoID int NOT NULL PRIMARY KEY,
 Nombre nvarchar(80) NOT NULL,
 Area nvarchar(40) NOT NULL,
 Relacion varchar(10) NOT NULL CHECK (Relacion IN ('Interno','Externo')),
 Empresa nvarchar(80) NOT NULL,
 FechaIngreso date NOT NULL,
 FechaBaja date NULL,
 CHECK (FechaBaja >= FechaIngreso),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.Usuarios (
 UsuarioID int NOT NULL PRIMARY KEY,
 NombreUsuario varchar(80) NOT NULL UNIQUE,
 EmpleadoID int NULL REFERENCES dbo.Empleados(EmpleadoID),
 TipoCuenta varchar(12) NOT NULL CHECK (TipoCuenta IN ('Personal','Externa','Compartida','Servicio')),
 Sistema varchar(40) NOT NULL,
 EsPrivilegiada bit NOT NULL,
 MFAHabilitado bit NOT NULL,
 Estado varchar(16) NOT NULL CHECK (Estado IN ('Activa','Deshabilitada')),
 FechaCreacion date NOT NULL,
 UltimaRecertificacion date NULL,
 CHECK (UltimaRecertificacion >= FechaCreacion),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.Sesiones (
 SesionID int NOT NULL PRIMARY KEY,
 UsuarioID int NOT NULL REFERENCES dbo.Usuarios(UsuarioID),
 FuenteID varchar(32) NOT NULL REFERENCES dbo.FuentesTiempo(FuenteID),
 HoraReportadaLocal datetime2(0) NOT NULL,
 HoraOriginal datetimeoffset(0) NULL,
 ZonaOriginal varchar(16) NULL,
 IPOrigen varchar(45) NULL,
 Dispositivo varchar(60) NULL,
 Metodo varchar(16) NOT NULL CHECK (Metodo IN ('Clave','Clave+MFA')),
 Resultado varchar(16) NOT NULL CHECK (Resultado IN ('Exitoso','Rechazado')),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.Privilegios (
 AsignacionID int NOT NULL PRIMARY KEY,
 UsuarioID int NULL REFERENCES dbo.Usuarios(UsuarioID),
 Rol varchar(60) NULL,
 Sistema varchar(40) NOT NULL,
 FechaHora datetime2(0) NOT NULL,
 AsignadoPor varchar(80) NULL,
 Ticket varchar(60) NULL,
 Vence datetime2(0) NULL,
 CHECK (Vence >= FechaHora),
 FuenteID varchar(32) NOT NULL REFERENCES dbo.FuentesTiempo(FuenteID),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.Clientes (
 ClienteID int NOT NULL PRIMARY KEY,
 Nombre nvarchar(80) NOT NULL,
 Departamento nvarchar(40) NOT NULL,
 [Plan] varchar(30) NOT NULL,
 FechaAlta date NOT NULL,
 Estado varchar(16) NOT NULL,
 Clasificacion nvarchar(40) NULL,
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.Ordenes (
 OrdenID int NOT NULL PRIMARY KEY,
 ClienteID int NOT NULL REFERENCES dbo.Clientes(ClienteID),
 VendedorID int NOT NULL CHECK (VendedorID BETWEEN 1 AND 120),
 Sucursal int NOT NULL CHECK (Sucursal BETWEEN 1 AND 18),
 FechaCreacion datetime2(0) NOT NULL,
 Estado varchar(20) NOT NULL CHECK (Estado IN ('Pendiente','Confirmada','Cancelada')),
 [Plan] varchar(30) NOT NULL,
 Monto decimal(12,2) NOT NULL CHECK (Monto >= 0),
 Moneda char(3) NOT NULL CHECK (Moneda = 'GTQ'),
 Canal varchar(20) NOT NULL,
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.HistorialOrdenes (
 CambioID int NOT NULL PRIMARY KEY,
 OrdenID int NOT NULL REFERENCES dbo.Ordenes(OrdenID),
 FechaHora datetime2(0) NOT NULL,
 UsuarioID int NULL REFERENCES dbo.Usuarios(UsuarioID),
 SesionID int NULL REFERENCES dbo.Sesiones(SesionID),
 Campo varchar(30) NOT NULL CHECK (Campo IN ('Monto','Estado')),
 ValorAnterior nvarchar(100) NOT NULL,
 ValorNuevo nvarchar(100) NOT NULL,
 Via varchar(20) NULL,
 FuenteID varchar(32) NOT NULL REFERENCES dbo.FuentesTiempo(FuenteID),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.CambiosSistema (
 CambioSistemaID int NOT NULL PRIMARY KEY,
 Ticket varchar(60) NULL,
 Sistema varchar(60) NOT NULL,
 Version varchar(40) NULL,
 SolicitadoPor varchar(80) NULL,
 AprobadoPor varchar(80) NULL,
 FechaAprobacion datetime2(0) NULL,
 FechaHoraDespliegue datetime2(0) NOT NULL,
 EjecutadoPor varchar(80) NULL,
 EvidenciaPruebas nvarchar(260) NULL,
 HashArtefacto char(64) NULL,
 FuenteID varchar(32) NOT NULL REFERENCES dbo.FuentesTiempo(FuenteID),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.ProgramacionBackups (
 ProgramacionID int NOT NULL PRIMARY KEY,
 BaseDatos varchar(80) NOT NULL,
 Tipo varchar(20) NOT NULL CHECK (Tipo = 'Completo'),
 HoraProgramada datetime2(0) NOT NULL,
 Destino nvarchar(160) NOT NULL,
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.Backups (
 BackupID int NOT NULL PRIMARY KEY,
 ProgramacionID int NULL REFERENCES dbo.ProgramacionBackups(ProgramacionID),
 BaseDatos varchar(80) NOT NULL,
 Tipo varchar(20) NOT NULL CHECK (Tipo = 'Completo'),
 Inicio datetime2(0) NOT NULL,
 Fin datetime2(0) NOT NULL,
 CHECK (Fin >= Inicio),
 TamanoGiB decimal(10,3) NOT NULL CHECK (TamanoGiB >= 0),
 Estado varchar(20) NOT NULL CHECK (Estado IN ('Completado','Fallido')),
 ChecksumDeclarado bit NULL,
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.PruebasRestauracion (
 PruebaID int NOT NULL PRIMARY KEY,
 BackupID int NOT NULL REFERENCES dbo.Backups(BackupID),
 Fecha datetime2(0) NOT NULL,
 Resultado varchar(20) NOT NULL CHECK (Resultado IN ('Satisfactoria','Fallida')),
 MinutosRestauracion int NOT NULL CHECK (MinutosRestauracion >= 0),
 Responsable varchar(80) NOT NULL,
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.BitacoraSQL (
 EventoSQLID int NOT NULL PRIMARY KEY,
 FechaHora datetime2(0) NOT NULL,
 UsuarioID int NULL REFERENCES dbo.Usuarios(UsuarioID),
 Objeto varchar(80) NOT NULL,
 Accion varchar(20) NOT NULL CHECK (Accion = 'SELECT'),
 Filas int NOT NULL CHECK (Filas >= 0),
 Aplicacion varchar(60) NULL,
 IPOrigen varchar(45) NULL,
 FuenteID varchar(32) NOT NULL REFERENCES dbo.FuentesTiempo(FuenteID),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.TransferenciasRed (
 FlujoID int NOT NULL PRIMARY KEY,
 HoraReportadaLocal datetime2(0) NOT NULL,
 InicioUTC datetimeoffset(0) NULL,
 FinUTC datetimeoffset(0) NULL,
 CHECK (FinUTC >= InicioUTC),
 IPOrigen varchar(45) NULL,
 IPDestino varchar(45) NULL,
 Puerto int NULL CHECK (Puerto BETWEEN 1 AND 65535),
 Protocolo varchar(10) NULL,
 BytesEnviados bigint NULL CHECK (BytesEnviados >= 0),
 VolumenReportado nvarchar(60) NULL,
 ClasificacionDestino varchar(80) NULL,
 FuenteID varchar(32) NOT NULL REFERENCES dbo.FuentesTiempo(FuenteID),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.Alertas (
 AlertaID int NOT NULL PRIMARY KEY,
 HoraReportadaLocal datetime2(0) NOT NULL,
 FechaHoraUTC datetimeoffset(0) NULL,
 Severidad varchar(16) NOT NULL,
 Regla nvarchar(160) NOT NULL,
 Activo varchar(80) NOT NULL,
 Estado varchar(20) NOT NULL,
 AsignadoA varchar(80) NULL,
 PrimeraAccion datetime2(0) NULL,
 CHECK (PrimeraAccion >= HoraReportadaLocal),
 FechaCierre datetime2(0) NULL,
 CHECK (FechaCierre >= HoraReportadaLocal),
 NotaCierre nvarchar(250) NULL,
 FuenteID varchar(32) NOT NULL REFERENCES dbo.FuentesTiempo(FuenteID),
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);
CREATE TABLE dbo.EventosExpediente (
 EventoID varchar(6) NOT NULL PRIMARY KEY,
 HoraReportadaLocal datetime2(0) NOT NULL,
 FuenteID varchar(32) NOT NULL REFERENCES dbo.FuentesTiempo(FuenteID),
 Descripcion nvarchar(500) NOT NULL,
 CuentaReportada varchar(80) NULL,
 Activo varchar(80) NOT NULL,
 PaginaPDF int NOT NULL CHECK (PaginaPDF > 0),
 HoraOriginal datetimeoffset(0) NULL,
 ZonaOriginal varchar(16) NULL,
 DesfaseSegundos int NULL,
 ClaseOrigen varchar(32) NOT NULL CHECK (ClaseOrigen IN ('laboratorio','reproduccion_expediente')),
 ReferenciaExpediente varchar(5) NULL,
 SupuestosAplicados nvarchar(400) NOT NULL
);

CREATE INDEX IX_Sesiones_UsuarioHora ON dbo.Sesiones(UsuarioID, HoraReportadaLocal);
CREATE INDEX IX_BitacoraSQL_UsuarioHora ON dbo.BitacoraSQL(UsuarioID, FechaHora);
CREATE INDEX IX_Historial_OrdenHora ON dbo.HistorialOrdenes(OrdenID, FechaHora);
CREATE INDEX IX_Ordenes_Duplicidad ON dbo.Ordenes(ClienteID, FechaCreacion, [Plan], Monto, Canal);
COMMIT TRANSACTION;
