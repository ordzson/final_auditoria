# Diccionario de campos sintéticos P1 v2

Todos los CSV son datos de laboratorio. `\N` es el único marcador de nulo. Los importes están en GTQ y se escriben con dos decimales; `TamanoGiB` está en GiB con tres decimales; `BytesEnviados` está en bytes enteros; los desfases están en segundos. Las horas sin zona son horas reportadas locales de referencia UTC−06:00, no una comprobación de los relojes del incidente. Los campos desconocidos del expediente permanecen nulos.

| Tabla | Columnas inventadas o derivadas para el laboratorio | Campos que reproducen el resumen | Unidades y límites |
|---|---|---|---|
| FuentesTiempo | Nombre, ZonaOriginal, DesfaseSegundos, Metodo, Verificado, ClaseOrigen, SupuestosAplicados | Nombre/fuente curso, con zona y desfase desconocidos; las fuentes LAB declaran el reloj interno del generador | Desfase en segundos; fuentes CURSO no verificadas |
| Empleados | Todos los campos y 114 personas seudónimas | Ninguno; no representan la plantilla real | Fechas ISO |
| Usuarios | TipoCuenta, sistema, MFA, estado, empleado, fechas y nombres salvo la etiqueta `ext_ops_04` | Solo el identificador de cuenta `ext_ops_04` en UsuarioID 1 (E-02); sus atributos son supuestos | Bits 0/1; fechas ISO |
| Sesiones | Todas las observaciones LAB, IP y dispositivo sintéticos, método y resultado | La fila E-02 reproduce cuenta y hora reportada; IP, dispositivo, hora y zona originales nulos | Fecha/hora local; IP de documentación sintética |
| Privilegios | Doce asignaciones completas o parcialmente ficticias | La elevación E-02 conserva únicamente hora reportada y fuente; cuenta, rol, asignador, ticket y vencimiento nulos | Fecha/hora local |
| Clientes | Las 85,000 etiquetas, departamentos, planes, fechas, estado y campos de origen | Ninguno; son clientes de laboratorio, no personas reales | IDs enteros |
| Ordenes | Todas las filas, clientes elegidos, vendedores, sucursales, importes, planes, fechas, canal y estado | 216 órdenes representan el conteo de E-05; valores de campos inventados | GTQ, dos decimales; fecha/hora local |
| HistorialOrdenes | 216 detalles anterior/nuevo y 60 cambios normales con usuario/vía sintéticos | E-05 aporta el conteo de 216 y hora reportada; no aporta autor, sesión, vía ni valores de cambios | Importes en GTQ; hora local |
| CambiosSistema | IDs 1–5 y todos sus atributos LAB, soportes declarativos | E-06 aporta sistema Integracion y hora 03:02; los detalles ausentes siguen nulos | Versión/ticket ficticios; hash de artefacto nulo |
| ProgramacionBackups | Programación diaria de laboratorio, base y destino | La ventana y periodicidad corresponden a S-04, no son historial del incidente | Fecha/hora local |
| Backups | Todos los registros, tamaños y checksum declarado ficticio | La referencia temporal/cuantidades son decisiones de S-04; no es un backup ejecutado | GiB, tres decimales |
| PruebasRestauracion | Todos los campos del registro histórico ficticio | Registro de julio conforme a S-04; no es restauración ejecutada durante esta tarea | Minutos enteros |
| BitacoraSQL | 140 controles normales y lectura sintética de 20,000; campos de las filas LAB | E-03 reproduce una lectura de 31,840 a las 02:31; usuario, aplicación e IP nulos | Filas enteras |
| TransferenciasRed | 70 flujos normales y controles LAB; campos del control de 1,200,000,000 bytes | E-04 conserva `~1.6 GB`; bytes exactos, IPs, puerto, protocolo, UTC y contenido nulos | Bytes enteros solo para LAB |
| Alertas | Cinco controles LAB, marcas y responsables ficticios | E-07 conserva hora reportada, severidad y descripción asociada; marcas de atención/cierre nulas | Fecha/hora local y UTC según columna |
| EventosExpediente | IDs EVT, etiquetas de activo, página 4 y procedencia técnica | 13 horas reportadas, fuentes, descripciones y referencias transcritas del resumen; solo EVT-02 atribuye `ext_ops_04` | Hora local; originales, zona y desfase nulos |

Los nombres `admin_bitacora_lab` y `control_bitacora_lab` solo reservan identidades modeladas. Este conjunto no prueba permisos efectivos de SQL Server. Los soportes de despliegue son declaraciones ficticias, no pruebas ejecutadas.
