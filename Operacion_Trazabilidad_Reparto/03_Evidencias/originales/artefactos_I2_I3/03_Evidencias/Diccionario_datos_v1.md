# Diccionario del laboratorio P1

Datos seleccionados: v2, semilla 1410. Fuente estructural: `04_SQL/01_esquema.sql`; tipos y nulabilidad extraídos realmente de sys.columns en SQL Server. Diagrama editable: `Relaciones_v1.dot`; representación: `Relaciones_v1.png`.

CSV UTF-8, coma, encabezado, LF. `\N` representa SQL NULL, nunca cero ni identidad común. Fechas ISO 8601; datetime2 representa hora local reportada de Guatemala (UTC−6 declarado); no es hora sincronizada. datetimeoffset conserva el desplazamiento aportado. Monto: GTQ; TamanoGiB: 2^30 bytes; BytesEnviados: bytes exactos solo en controles sintéticos. `~1.6 GB` es texto aproximado del expediente; sus bytes quedan NULL.

`ClaseOrigen` distingue laboratorio de reproduccion_expediente; `ReferenciaExpediente` vincula E cuando existe; `SupuestosAplicados` declara supuestos. Las PK son los primeros campos de cada tabla, salvo confirmación explícita en el DDL; Usuarios.NombreUsuario también es único. Las 18 FK están en el diagrama y en el DDL, comprobadas activas/confiables y con DBCC CHECKCONSTRAINTS.

Significado, origen por campo y distinción entre reproducción y construcción: véase también el diccionario recibido `04_SQL/datos/v2/Diccionario_campos_sinteticos_v2.md` (preservado con hash) y `04_SQL/Diseno_laboratorio_v1.md`, sección Modelo relacional. Estos documentos forman parte del diccionario y conservan la descripción semántica extensa. El detalle siguiente enumera todos los campos del contrato, sin omitir anulables.

No se aportaron responsables de las operaciones E-03/E-04/E-05, contenidos transferidos ni relojes originales del caso. Los valores de cambios de órdenes son construcciones S-P1-ORD. Aprobaciones, checksums y pruebas de restauración son registros ficticios, no ejecución de respaldos/restauración. Los identificadores ficticios no atribuyen los hechos a una persona real.

## Alertas

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| AlertaID | int | 4 / 10 / 0 | no |
| HoraReportadaLocal | datetime2 | 6 / 19 / 0 | no |
| FechaHoraUTC | datetimeoffset | 8 / 26 / 0 | sí |
| Severidad | varchar | 16 / 0 / 0 | no |
| Regla | nvarchar | 320 / 0 / 0 | no |
| Activo | varchar | 80 / 0 / 0 | no |
| Estado | varchar | 20 / 0 / 0 | no |
| AsignadoA | varchar | 80 / 0 / 0 | sí |
| PrimeraAccion | datetime2 | 6 / 19 / 0 | sí |
| FechaCierre | datetime2 | 6 / 19 / 0 | sí |
| NotaCierre | nvarchar | 500 / 0 / 0 | sí |
| FuenteID | varchar | 32 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## Backups

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| BackupID | int | 4 / 10 / 0 | no |
| ProgramacionID | int | 4 / 10 / 0 | sí |
| BaseDatos | varchar | 80 / 0 / 0 | no |
| Tipo | varchar | 20 / 0 / 0 | no |
| Inicio | datetime2 | 6 / 19 / 0 | no |
| Fin | datetime2 | 6 / 19 / 0 | no |
| TamanoGiB | decimal | 9 / 10 / 3 | no |
| Estado | varchar | 20 / 0 / 0 | no |
| ChecksumDeclarado | bit | 1 / 1 / 0 | sí |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## BitacoraSQL

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| EventoSQLID | int | 4 / 10 / 0 | no |
| FechaHora | datetime2 | 6 / 19 / 0 | no |
| UsuarioID | int | 4 / 10 / 0 | sí |
| Objeto | varchar | 80 / 0 / 0 | no |
| Accion | varchar | 20 / 0 / 0 | no |
| Filas | int | 4 / 10 / 0 | no |
| Aplicacion | varchar | 60 / 0 / 0 | sí |
| IPOrigen | varchar | 45 / 0 / 0 | sí |
| FuenteID | varchar | 32 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## CambiosSistema

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| CambioSistemaID | int | 4 / 10 / 0 | no |
| Ticket | varchar | 60 / 0 / 0 | sí |
| Sistema | varchar | 60 / 0 / 0 | no |
| Version | varchar | 40 / 0 / 0 | sí |
| SolicitadoPor | varchar | 80 / 0 / 0 | sí |
| AprobadoPor | varchar | 80 / 0 / 0 | sí |
| FechaAprobacion | datetime2 | 6 / 19 / 0 | sí |
| FechaHoraDespliegue | datetime2 | 6 / 19 / 0 | no |
| EjecutadoPor | varchar | 80 / 0 / 0 | sí |
| EvidenciaPruebas | nvarchar | 520 / 0 / 0 | sí |
| HashArtefacto | char | 64 / 0 / 0 | sí |
| FuenteID | varchar | 32 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## Clientes

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| ClienteID | int | 4 / 10 / 0 | no |
| Nombre | nvarchar | 160 / 0 / 0 | no |
| Departamento | nvarchar | 80 / 0 / 0 | no |
| Plan | varchar | 30 / 0 / 0 | no |
| FechaAlta | date | 3 / 10 / 0 | no |
| Estado | varchar | 16 / 0 / 0 | no |
| Clasificacion | nvarchar | 80 / 0 / 0 | sí |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## Empleados

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| EmpleadoID | int | 4 / 10 / 0 | no |
| Nombre | nvarchar | 160 / 0 / 0 | no |
| Area | nvarchar | 80 / 0 / 0 | no |
| Relacion | varchar | 10 / 0 / 0 | no |
| Empresa | nvarchar | 160 / 0 / 0 | no |
| FechaIngreso | date | 3 / 10 / 0 | no |
| FechaBaja | date | 3 / 10 / 0 | sí |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## EventosExpediente

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| EventoID | varchar | 6 / 0 / 0 | no |
| HoraReportadaLocal | datetime2 | 6 / 19 / 0 | no |
| FuenteID | varchar | 32 / 0 / 0 | no |
| Descripcion | nvarchar | 1000 / 0 / 0 | no |
| CuentaReportada | varchar | 80 / 0 / 0 | sí |
| Activo | varchar | 80 / 0 / 0 | no |
| PaginaPDF | int | 4 / 10 / 0 | no |
| HoraOriginal | datetimeoffset | 8 / 26 / 0 | sí |
| ZonaOriginal | varchar | 16 / 0 / 0 | sí |
| DesfaseSegundos | int | 4 / 10 / 0 | sí |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## FuentesTiempo

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| FuenteID | varchar | 32 / 0 / 0 | no |
| Nombre | nvarchar | 200 / 0 / 0 | no |
| ZonaOriginal | varchar | 16 / 0 / 0 | sí |
| DesfaseSegundos | int | 4 / 10 / 0 | sí |
| Metodo | nvarchar | 500 / 0 / 0 | no |
| Verificado | bit | 1 / 1 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## HistorialOrdenes

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| CambioID | int | 4 / 10 / 0 | no |
| OrdenID | int | 4 / 10 / 0 | no |
| FechaHora | datetime2 | 6 / 19 / 0 | no |
| UsuarioID | int | 4 / 10 / 0 | sí |
| SesionID | int | 4 / 10 / 0 | sí |
| Campo | varchar | 30 / 0 / 0 | no |
| ValorAnterior | nvarchar | 200 / 0 / 0 | no |
| ValorNuevo | nvarchar | 200 / 0 / 0 | no |
| Via | varchar | 20 / 0 / 0 | sí |
| FuenteID | varchar | 32 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## Ordenes

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| OrdenID | int | 4 / 10 / 0 | no |
| ClienteID | int | 4 / 10 / 0 | no |
| VendedorID | int | 4 / 10 / 0 | no |
| Sucursal | int | 4 / 10 / 0 | no |
| FechaCreacion | datetime2 | 6 / 19 / 0 | no |
| Estado | varchar | 20 / 0 / 0 | no |
| Plan | varchar | 30 / 0 / 0 | no |
| Monto | decimal | 9 / 12 / 2 | no |
| Moneda | char | 3 / 0 / 0 | no |
| Canal | varchar | 20 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## Privilegios

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| AsignacionID | int | 4 / 10 / 0 | no |
| UsuarioID | int | 4 / 10 / 0 | sí |
| Rol | varchar | 60 / 0 / 0 | sí |
| Sistema | varchar | 40 / 0 / 0 | no |
| FechaHora | datetime2 | 6 / 19 / 0 | no |
| AsignadoPor | varchar | 80 / 0 / 0 | sí |
| Ticket | varchar | 60 / 0 / 0 | sí |
| Vence | datetime2 | 6 / 19 / 0 | sí |
| FuenteID | varchar | 32 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## ProgramacionBackups

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| ProgramacionID | int | 4 / 10 / 0 | no |
| BaseDatos | varchar | 80 / 0 / 0 | no |
| Tipo | varchar | 20 / 0 / 0 | no |
| HoraProgramada | datetime2 | 6 / 19 / 0 | no |
| Destino | nvarchar | 320 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## PruebasRestauracion

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| PruebaID | int | 4 / 10 / 0 | no |
| BackupID | int | 4 / 10 / 0 | no |
| Fecha | datetime2 | 6 / 19 / 0 | no |
| Resultado | varchar | 20 / 0 / 0 | no |
| MinutosRestauracion | int | 4 / 10 / 0 | no |
| Responsable | varchar | 80 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## Sesiones

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| SesionID | int | 4 / 10 / 0 | no |
| UsuarioID | int | 4 / 10 / 0 | no |
| FuenteID | varchar | 32 / 0 / 0 | no |
| HoraReportadaLocal | datetime2 | 6 / 19 / 0 | no |
| HoraOriginal | datetimeoffset | 8 / 26 / 0 | sí |
| ZonaOriginal | varchar | 16 / 0 / 0 | sí |
| IPOrigen | varchar | 45 / 0 / 0 | sí |
| Dispositivo | varchar | 60 / 0 / 0 | sí |
| Metodo | varchar | 16 / 0 / 0 | no |
| Resultado | varchar | 16 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## TransferenciasRed

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| FlujoID | int | 4 / 10 / 0 | no |
| HoraReportadaLocal | datetime2 | 6 / 19 / 0 | no |
| InicioUTC | datetimeoffset | 8 / 26 / 0 | sí |
| FinUTC | datetimeoffset | 8 / 26 / 0 | sí |
| IPOrigen | varchar | 45 / 0 / 0 | sí |
| IPDestino | varchar | 45 / 0 / 0 | sí |
| Puerto | int | 4 / 10 / 0 | sí |
| Protocolo | varchar | 10 / 0 / 0 | sí |
| BytesEnviados | bigint | 8 / 19 / 0 | sí |
| VolumenReportado | nvarchar | 120 / 0 / 0 | sí |
| ClasificacionDestino | varchar | 80 / 0 / 0 | sí |
| FuenteID | varchar | 32 / 0 / 0 | no |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |

## Usuarios

| Campo | Tipo SQL | Longitud bytes / precisión / escala | NULL |
| --- | --- | --- | --- |
| UsuarioID | int | 4 / 10 / 0 | no |
| NombreUsuario | varchar | 80 / 0 / 0 | no |
| EmpleadoID | int | 4 / 10 / 0 | sí |
| TipoCuenta | varchar | 12 / 0 / 0 | no |
| Sistema | varchar | 40 / 0 / 0 | no |
| EsPrivilegiada | bit | 1 / 1 / 0 | no |
| MFAHabilitado | bit | 1 / 1 / 0 | no |
| Estado | varchar | 16 / 0 / 0 | no |
| FechaCreacion | date | 3 / 10 / 0 | no |
| UltimaRecertificacion | date | 3 / 10 / 0 | sí |
| ClaseOrigen | varchar | 32 / 0 / 0 | no |
| ReferenciaExpediente | varchar | 5 / 0 / 0 | sí |
| SupuestosAplicados | nvarchar | 800 / 0 / 0 | no |
