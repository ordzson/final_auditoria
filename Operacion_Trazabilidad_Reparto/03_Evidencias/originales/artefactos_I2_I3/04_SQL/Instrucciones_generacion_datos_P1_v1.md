# Instrucciones para generar los datos sintéticos de P1

## Encargo y límite de tu trabajo

Genera el programa Python y los archivos de datos del laboratorio pequeño descrito aquí. P1 aprobó los parámetros en la conversación con Codex y pidió que la generación la haga otro modelo. No necesitas proponer otra población ni pedir de nuevo esos acuerdos. Tu trabajo termina cuando entregues el generador, los CSV y la comprobación de sus archivos.

No ejecutes consultas académicas ni cargues SQL Server. No redactes resultados Q-01–Q-12, papeles PT, hallazgos ni conclusiones del incidente. Esos productos se harán después de recibir y comprobar tus archivos. No construyas un juego ni cambies los archivos de P2/P3.

Trabaja dentro de `Operacion_Trazabilidad_Reparto/`. Usa Python 3 y su biblioteca estándar: `csv`, `random`, `datetime`, `decimal`, `hashlib`, `json`, `pathlib`, `argparse` y `tempfile` son suficientes. No instales paquetes. Para cualquier tarea JavaScript ajena a este encargo, este proyecto exige pnpm; no uses npm ni npx.

Lee estos tres archivos antes de escribir código:

1. `04_SQL/01_esquema.sql`: contrato exacto de tablas, columnas, tipos, claves y restricciones. Ya se ejecutó correctamente en SQL Server 2022 sobre una base vacía: 16 tablas, 18 claves foráneas, cero filas. No lo cambies para acomodar tus datos.
2. `03_Evidencias/Supuestos_P1_v1.csv`: parámetros aprobados y referencia de aprobación.
3. `03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md`: diferencia entre expediente, laboratorio y resultado ejecutado.

Si no tienes acceso al repositorio, pide que te adjunten esos tres archivos junto con este instructivo. Sin el esquema, puedes redactar el generador como borrador, pero no afirmar que cumple el contrato. Si dos instrucciones parecen incompatibles, identifica la contradicción concreta; no inventes una resolución que cambie un dato aprobado.

## 1. Parámetros que debes conservar

```json
{
  "version": "v1",
  "semilla": 1410,
  "clientes": 85000,
  "ordenes": 3000,
  "usuarios": 120,
  "sesiones": 3000,
  "referencia_horaria": "UTC-06:00",
  "corte": "2026-10-15T23:59:59-06:00",
  "ordenes_desde": "2026-04-01",
  "ordenes_hasta": "2026-10-15",
  "sesiones_desde": "2026-09-16",
  "sesiones_hasta": "2026-10-15",
  "referencia_habitual_desde": "2026-10-07",
  "referencia_habitual_hasta": "2026-10-13"
}
```

“Pequeño” reduce órdenes, cuentas y sesiones; mantiene los 85,000 clientes. No lo reduzcas a 8,500 clientes ni interpretes las 31,840 filas leídas como el total de clientes.

Los 216 cambios corresponden al 7.2 % de las 3,000 órdenes del laboratorio. Ese porcentaje es consecuencia del diseño; no es una tasa observada en RedNova. Las fechas de ingreso/creación de cuentas y el respaldo histórico pueden ser anteriores a los períodos de actividad anteriores.

## 2. Archivos que debes entregar

```text
04_SQL/
  02_generar_datos.py
  validar_datos.py
  datos/v1/
    FuentesTiempo.csv
    Empleados.csv
    Usuarios.csv
    Sesiones.csv
    Privilegios.csv
    Clientes.csv
    Ordenes.csv
    HistorialOrdenes.csv
    CambiosSistema.csv
    ProgramacionBackups.csv
    Backups.csv
    PruebasRestauracion.csv
    BitacoraSQL.csv
    TransferenciasRed.csv
    Alertas.csv
    EventosExpediente.csv
    soportes_sinteticos/Pruebas_Cambio_01.md
    soportes_sinteticos/Pruebas_Cambio_02.md
    soportes_sinteticos/Pruebas_Cambio_03.md
    soportes_sinteticos/Pruebas_Cambio_04.md
    Manifest_datos_v1.json
    Validacion_generacion_v1.json
    Diccionario_campos_sinteticos_v1.md
    Registro_generacion_IA_v1.md
```

Escribe los CSV con todas las columnas del esquema, en el mismo orden, sin los corchetes SQL de `[Plan]`. El encabezado del CSV será `Plan`. En SQL Server se escribe `[Plan]` porque la palabra tiene un significado reservado. Usa `csv.DictWriter`; no concatenes líneas con comas manualmente.

Reglas de archivos:

- UTF-8 sin BOM; delimitador coma; fin de línea LF; encabezado una sola vez; filas ordenadas por clave primaria. `csv` debe escapar textos que contengan comas.
- Nulo: el token literal `\N`. No escribas `None`, `null`, `N/A`, cero ni una cadena vacía para representar información desconocida.
- Bits: `0` y `1`. Fechas: `YYYY-MM-DD`. Fecha/hora local: `YYYY-MM-DDTHH:MM:SS`. Con zona: `YYYY-MM-DDTHH:MM:SS-06:00` o `+00:00`, según la columna.
- Dinero: dos decimales, sin símbolo ni separador de miles; usa `Decimal`. Tamaño GiB: tres decimales. Bytes: enteros, sin separador.
- No uses `datetime.now()`, `date.today()`, UUID aleatorio ni `hash()` de Python para construir los datos. Usa `random.Random(1410)` y recorre IDs/listas en orden explícito. El momento real de generación solo va en los metadatos, fuera de los CSV.
- Si `datos/v1/` existe, detente con error y conserva sus archivos. No uses `--force`, `DROP`, borrados ni sobrescrituras. Si entregas una corrección, usa `v2` y explica qué cambió. Crea primero una carpeta temporal; publica `v1` solo después de validar el conjunto completo.
- Los soportes de cambios son declaraciones ficticias para probar la presencia de un documento. Su primera línea dirá: “Registro sintético de pruebas declaradas; no acredita pruebas ejecutadas sobre software real”. No inventes capturas, firmas ni aprobación humana.

## 3. Cantidades exactas

Los datos auxiliares siguientes concretan la implementación de los casos ya aprobados. No representan poblaciones históricas de RedNova.

| Tabla | Filas exactas | Composición |
| --- | ---: | --- |
| FuentesTiempo | 18 | Diez fuentes del resumen y ocho fuentes del generador. |
| Empleados | 114 | Una persona ficticia por cuenta personal identificada del laboratorio; ver asignación siguiente. |
| Usuarios | 120 | Incluye 30 privilegiadas, cuatro compartidas y una cuenta de servicio. |
| Sesiones | 3,000 | 2,997 normales, dos anomalías sintéticas y una reproducción E-02. |
| Privilegios | 13 | Doce asignaciones sintéticas y una elevación del expediente sin cuenta atribuida. |
| Clientes | 85,000 | Etiquetas ficticias; sin datos personales reales. |
| Ordenes | 3,000 | Incluye 216 órdenes modificadas, diez pares candidatos y diez pares similares legítimos. |
| HistorialOrdenes | 276 | 216 cambios asociados a E-05 y 60 cambios normales fuera de su ventana. |
| CambiosSistema | 6 | Tres completos, dos con faltantes sintéticos y el despliegue reportado de 03:02. |
| ProgramacionBackups | 9 | Del 7 al 15 de octubre, una programación diaria. |
| Backups | 9 | Ocho ejecuciones del 7 al 14 y una histórica del 30 de junio. |
| PruebasRestauracion | 1 | Registro histórico ficticio del 1 de julio. |
| BitacoraSQL | 142 | 140 lecturas normales, una anómala sintética y la lectura reportada de 31,840. |
| TransferenciasRed | 73 | 70 flujos normales, dos controles sintéticos y la transferencia aproximada del caso. |
| Alertas | 6 | Cinco controles sintéticos y una reproducción E-07. |
| EventosExpediente | 13 | Solo los 13 eventos de la tabla de la sección 10. |

Total: 91,800 filas, sin contar encabezados ni archivos de metadatos.

## 4. Procedencia y datos desconocidos

Todas las tablas tienen `ClaseOrigen`, `ReferenciaExpediente` y `SupuestosAplicados`. No omitas esas columnas.

- Usa `ClaseOrigen=laboratorio` para las filas generadas, incluso cuando representen una cantidad conocida con detalles inventados. Ejemplo: los 216 cambios tienen valores anterior/nuevo inventados; su clase es laboratorio y su referencia E-05.
- Usa `ClaseOrigen=reproduccion_expediente` para los 13 eventos, las diez fuentes CURSO y las reproducciones operativas mínimas indicadas abajo. Esa etiqueta significa transcripción del resumen, nunca extracción autenticada.
- `ReferenciaExpediente` contiene E-02, E-03, etc., cuando hay relación explícita, o `\N`. No asignes E-01 solo porque una cuenta exista.
- `SupuestosAplicados` será una lista separada por punto y coma. Para datos normales usa al menos `S-03;S-09;S-P1-PER`; añade `S-P1-ACC`, `S-P1-CAS`, `S-P1-ORD`, `S-P1-NOR`, `S-P1-UMB` o `S-04` según la receta. Para una transcripción sin añadidos usa `S-03`.

No completes por inferencia:

| Registro del caso | Datos que deben quedar nulos |
| --- | --- |
| Sesión de ext_ops_04 | Persona, IP, dispositivo, hora original y zona original. La cuenta sí se conoce; su patrón habitual será sintético. |
| Elevación de 02:26 | Usuario, rol concreto, asignador, ticket y vencimiento. |
| Lectura de 31,840 filas | Usuario, aplicación e IP. No la atribuyas a la cuenta de la VPN. |
| Transferencia de ~1.6 GB | Bytes exactos, IPs, puerto, protocolo, inicio/fin originales y contenido. |
| 216 cambios | Usuario, sesión y vía. Los campos e importes que agregues son sintéticos. |
| Despliegue de 03:02 | Ticket exacto, versión exacta, solicitante, aprobador, fecha de aprobación, ejecutor, pruebas y hash de artefacto no aportados. |
| Alerta crítica | Hora original, asignado, primera acción, cierre y nota de cierre. No equipares la solicitud de recuperación de 04:05 a una primera acción de esta alerta. |
| Los 13 eventos | Hora original, zona original y desfase de reloj. En CuentaReportada solo EVT-02 tiene `ext_ops_04`; los otros doce quedan nulos. |

## 5. Fuentes, personas, cuentas y sesiones

### FuentesTiempo

Inserta las fuentes en este orden de IDs, que son cadenas estables:

```text
CURSO_PROVEEDOR, CURSO_VPN, CURSO_IDENTIDAD, CURSO_SQL, CURSO_RED,
CURSO_CRM, CURSO_CAMBIOS, CURSO_SEGURIDAD, CURSO_TI, CURSO_FINANZAS,
LAB_VPN, LAB_IDENTIDAD, LAB_SQL, LAB_RED, LAB_CRM, LAB_BACKUPS,
LAB_SIEM, LAB_CAMBIOS
```

En CURSO: zona y desfase nulos, verificado 0, método “Hora reportada por el expediente; reloj original no verificado”, clase reproducción. En LAB: zona `-06:00`, desfase 0, verificado 1, método “Consistencia interna del generador; no es medición de reloj real”, clase laboratorio. Ese cero solo pertenece al reloj declarado del laboratorio. `ReferenciaExpediente` puede quedar nula en estas 18 filas.

### Usuarios y Empleados

IDs de Usuarios: 1–120. FechaCreacion de todas las cuentas: `2025-01-01`. Estado Activa salvo IDs 39–42. Última recertificación `2026-10-01` salvo los casos indicados. Sistema `Identidad` salvo IDs 19, 43, 45 y 46, que usan `SQLServer`. Son cuentas modeladas; no crees logins reales en SQL Server.

| UsuarioID | Nombre y características |
| --- | --- |
| 1 | `ext_ops_04`, Externa, privilegiada, MFA 0, EmpleadoID nulo; referencia E-02. Los atributos privilegiada, estado y recertificación son supuestos, no datos adicionales del expediente. |
| 2–8 | `lab_priv_nomfa_02`…`lab_priv_nomfa_08`, Personal, privilegiadas, MFA 0. |
| 9–12 | `lab_admin_comp_01`…`lab_admin_comp_04`, Compartida, privilegiadas, MFA 1, EmpleadoID nulo. |
| 13–15 | `lab_priv_sinrec_01`…`03`, Personal, privilegiadas, MFA 1, recertificación `2026-03-01`. |
| 16–18 | `lab_priv_sinrec_04`…`06`, Personal, privilegiadas, MFA 1, recertificación nula. |
| 19 | `admin_bitacora_lab`, Personal, privilegiada, MFA 1, recertificación vigente. |
| 20–30 | `lab_priv_ok_02`…`lab_priv_ok_12`, Personal, privilegiadas, MFA 1, recertificación vigente. |
| 31 | `svc_respaldo_lab`, Servicio, no privilegiada, MFA 0, EmpleadoID nulo; actividad nocturna legítima. |
| 32 | `soporte_noche_lab`, Personal, no privilegiada, MFA 1; actividad nocturna legítima. |
| 33–42 | `lab_baja_01`…`lab_baja_10`, Personal, no privilegiadas, MFA 1. IDs 33–38 activas; 39–42 deshabilitadas. |
| 43 | `lab_sql_diurno`, Personal, no privilegiada, MFA 1; control de lecturas. |
| 44 | `lab_operacion_diurna`, Personal, no privilegiada, MFA 1; dos sesiones anómalas. |
| 45 | `control_bitacora_lab`, Personal, no privilegiada, MFA 1. |
| 46 | `lab_sql_control`, Personal, no privilegiada, MFA 1. |
| 47–120 | `lab_usuario_047`…`lab_usuario_120`, Personal, no privilegiadas, MFA 1. |

Todos los Usuarios son clase laboratorio; enumera en el diccionario qué campos de ID 1 proceden del caso y cuáles son supuestos. Solo IDs 1–30 tienen EsPrivilegiada=1. Los grupos de faltantes no se superponen.

Genera un Empleado por cada usuario excepto IDs 1, 9, 10, 11, 12 y 31. Su EmpleadoID será igual a su UsuarioID: son 114 personas. Nombre `Persona_LAB_002`, etc.; Area `Operaciones_LAB`, Relacion Interno, Empresa `RedNova_LAB.example`, FechaIngreso `2025-01-01`. FechaBaja `2026-09-10` solo para IDs 33–42 y nula para los demás. No presentes 114 como el total real de colaboradores del caso.

### Sesiones: 3,000 exactas

1. Cuentas elegibles para sesiones normales: IDs 1–32 y 43–120, 110 cuentas. Excluye las diez bajas para no introducir otros casos de actividad tras la desvinculación.
2. Para cada elegible, genera dos sesiones por día del 7 al 13 de octubre, ambos inclusive: 110 × 7 × 2 = 1,540 filas. Para IDs 31 y 32 usa 02:00 y 03:00; para las otras usa 09:00 y 14:00.
3. Añade 1,457 sesiones normales distribuidas por las mismas 110 cuentas y por los otros 23 días del período 16 de septiembre–15 de octubre. Usa siempre las mismas horas habituales anteriores y segundos deterministas para distinguir filas. No uses rechazo aleatorio ni crees anomalías adicionales.
4. Añade dos sesiones de ID 44: `2026-10-14T02:10:00` y `2026-10-15T04:10:00`, fuente LAB_VPN y clase laboratorio.
5. Añade la reproducción E-02: UsuarioID 1, `2026-10-14T02:17:00`, fuente CURSO_VPN, método Clave, resultado Exitoso, clase reproducción, IP/dispositivo/hora original/zona original nulos.
6. Ordena por hora, UsuarioID y orden de creación; asigna SesionID 1–3,000 de forma estable. En filas LAB, HoraOriginal lleva el mismo instante con `-06:00`, ZonaOriginal `-06:00`, IP `198.51.100.10`, dispositivo `Equipo_LAB`. Método Clave+MFA si MFA=1, o Clave si MFA=0. Resultado Exitoso.

Esto deja tres sesiones fuera de las horas habituales: dos sintéticas y E-02 contra una base habitual también sintética. El turno nocturno habitual no debe aparecer como anomalía solo por ocurrir de madrugada.

## 6. Privilegios, clientes, órdenes e historial

### Privilegios: 13 filas

- IDs de asignación 1–3: Usuarios 2, 3 y 4, FechaHora `2026-10-10T10:00:00`, ticket nulo, Vence `2026-10-20T10:00:00`.
- IDs 4–6: Usuarios 5, 6 y 7, misma fecha, tickets `LAB-PRIV-004`…`006`, Vence nulo.
- IDs 7–12: Usuarios 19–24, misma fecha, tickets presentes y Vence `2026-10-20T10:00:00`.
- En esas doce: Rol `Operador_LAB`, Sistema `Identidad`, AsignadoPor `administrador_LAB`, FuenteID LAB_IDENTIDAD, clase laboratorio.
- ID 13 reproduce la elevación de `2026-10-14T02:26:00`, fuente CURSO_IDENTIDAD, Sistema Identidad y clase reproducción. Cuenta, rol, asignador, ticket, vencimiento y ReferenciaExpediente nulos. El expediente no aporta un E separado para esta elevación.

### Clientes: 85,000 filas

ClienteID 1–85,000, Nombre `Cliente_LAB_000001`…; FechaAlta `2025-01-01`, Estado Activa, Clasificacion nula. Con el generador sembrado elige Departamento de `[Guatemala, Escuintla, Sacatepequez, Quetzaltenango]` y Plan de `[Plan_A, Plan_B, Plan_C]`. Clase laboratorio. No generes DPI, correos, teléfonos, direcciones ni nombres reales.

### Ordenes: 3,000 filas

Primero genera el fondo y luego aplica los casos reservados, sin aumentar el total:

- OrdenID 1–3,000; ClienteID elegido entre 1 y 85,000 con el generador sembrado; VendedorID `1 + ((OrdenID-1) % 120)`; Sucursal `1 + ((OrdenID-1) % 18)`.
- FechaCreacion `2026-04-01T00:00:00 + OrdenID*90 minutos`. Da fechas únicas y anteriores al corte. Plan_A, Monto 199.00, Moneda GTQ, Canal Web y Estado Confirmada. Clase laboratorio.
- Órdenes 1–144: Monto actual 220.00, Estado Pendiente. Su valor anterior será 200.00.
- Órdenes 145–216: Monto 200.00, Estado actual Confirmada. Su estado anterior será Pendiente.
- Órdenes 217–276: Monto actual 110.00, Estado Confirmada. Valor anterior 100.00.
- Para pares candidatos, grupo g=1…10 usa IDs `1001+2*(g-1)` y el siguiente. Ambos: ClienteID `60000+g`, FechaCreacion `2026-10-09T10:00:00 + g minutos`, Plan_A, Monto 199.00, Canal Web, Estado Confirmada. Exactamente diez grupos de dos filas coinciden en la regla.
- Para pares legítimos, g=1…10 usa IDs `1021+2*(g-1)` y el siguiente. Ambos: ClienteID `60010+g`, misma receta de fecha, Monto 199.00, Canal Web, Estado Confirmada. Primer miembro Plan_A y segundo Plan_B. No cumplen la misma clave de duplicidad.
- No generes facturas. Ser candidato a duplicidad de orden no demuestra doble cobro.

### HistorialOrdenes: 276 filas

Cambios 1–216: OrdenID igual a CambioID, todos a `2026-10-14T02:42:00`, UsuarioID/SesionID/Via nulos, FuenteID LAB_CRM, clase laboratorio, referencia E-05, supuesto S-P1-ORD. Para IDs 1–144, Campo Monto, anterior `200.00`, nuevo `220.00`; para 145–216, Campo Estado, anterior Pendiente, nuevo Confirmada. Sus detalles son inventados y se declaran así; la hora y cantidad reproducen el resumen.

Cambios 217–276: OrdenID igual al ID, Campo Monto, anterior `100.00`, nuevo `110.00`, fecha del 7 al 13 de octubre a las 10:00 distribuida de forma cíclica; UsuarioID 47, SesionID nulo, Via CRM, FuenteID LAB_CRM, sin referencia de evidencia. No hagas cambios normales dentro de la ventana 14 de octubre, 02:17–03:42.

Comprobación: hay 216 cambios y 216 órdenes distintas en esa ventana. Los 144 incrementos suman GTQ 2,880.00 en datos sintéticos; no los describas como pérdida o fraude de RedNova ni como conciliación con respaldo.

## 7. SQL, red y respaldos

### BitacoraSQL: 142 filas

Genera 140 lecturas normales: para cada UsuarioID de `[43,46]`, cada día del 7 al 13 de octubre y j=0…9, una lectura a las `09:00 + j minutos`, Filas `100*(j+1)`, Objeto Clientes, Accion SELECT, Aplicacion `Analitica_LAB`, IP `192.0.2.10`, FuenteID LAB_SQL, clase laboratorio.

Añade una lectura anómala sintética de UsuarioID 43 a `2026-10-14T02:29:00`, Filas 20,000. Conserva los campos normales de LAB_SQL. Añade la reproducción E-03 a `2026-10-14T02:31:00`, Filas 31,840, Objeto Clientes, Accion SELECT, UsuarioID/Aplicacion/IP nulos, fuente CURSO_SQL y clase reproducción. Asigna EventoSQLID en orden estable. No generes 31,840 entradas de bitácora para representar una lectura.

### TransferenciasRed: 73 filas

Genera 70 flujos normales: cada origen de `[192.0.2.10,192.0.2.20]`, cada día del 7 al 13 de octubre y j=0…4. Hora `10:00 + j minutos`; destino `203.0.113.10`, puerto 443, protocolo TCP, bytes `1,000,000*(j+1)`, clasificación `operacion_autorizada_sintetica`, fuente LAB_RED. InicioUTC es hora local más seis horas con `+00:00`; FinUTC diez segundos después. VolumenReportado nulo.

Añade estos tres flujos:

| Hora local | Datos |
| --- | --- |
| 14 oct. 02:34 | Sintético: origen 192.0.2.10, destino 203.0.113.10, 443/TCP, 1,200,000,000 bytes, misma clasificación habitual, LAB_RED. |
| 14 oct. 05:00 | Sintético: origen 192.0.2.20, destino 203.0.113.99, 443/TCP, 2,000,000 bytes, clasificación nula, LAB_RED. |
| 14 oct. 02:35 | Reproducción E-04: `VolumenReportado=~1.6 GB`; bytes, IPs, puerto, protocolo, inicio/fin UTC y clasificación nulos; CURSO_RED. |

Para los dos flujos LAB aplica la conversión UTC anterior. No conviertas los ~1.6 GB en 1,600,000,000 bytes exactos del caso. Asigna FlujoID en orden estable. No afirmes contenido transferido, sesión compartida con SQL ni exfiltración.

### ProgramacionBackups, Backups y PruebasRestauracion

ProgramacionID 1–9: del 7 al 15 de octubre, a las 00:30, BaseDatos `CRM_LAB`, Tipo Completo, Destino `backup-lab.example/CRM_LAB`, clase laboratorio, referencia E-08 y supuesto S-04. No programes a la 01:00.

BackupID 1: 30 de junio de 2026, 00:30–01:00, ProgramacionID nulo, tamaño 8.000 GiB. BackupID 2–9: días 7–14 de octubre, 00:30–01:00, ProgramacionID 1–8 respectivamente; tamaños, por orden, `[8.000,8.100,8.200,8.300,8.000,8.100,8.200,3.200]` GiB. Todos BaseDatos CRM_LAB, Tipo Completo, Estado Completado, ChecksumDeclarado=1, clase laboratorio, referencia E-08. El checksum es un valor ficticio del registro; no se ha ejecutado un backup real. No añadas ejecución para el día 15.

PruebaID 1: BackupID 1, Fecha `2026-07-01T10:00:00`, Resultado Satisfactoria, MinutosRestauracion 45, Responsable `responsable_restauracion_LAB`, clase laboratorio, referencia E-08, supuesto S-04. Es un registro histórico inventado para el ejercicio, no una restauración realizada por ti. No uses el 15 de mayo como fecha de restauración.

## 8. Despliegues y alertas

### CambiosSistema: seis filas

Para IDs 1–5, los valores comunes son Sistema `Integracion_LAB`, Version `lab-{ID}`, SolicitadoPor `solicitante_LAB`, EjecutadoPor `desplegador_LAB` y AprobadoPor `aprobador_LAB`, excepto los nulos expresamente indicados para ID 4. FechaAprobacion será el mismo día a las 10:00 salvo ID 4. No dejes sin valor una columna NOT NULL del esquema.

- IDs 1–3: despliegues sintéticos del 7, 8 y 9 de octubre a las 11:00; aprobación del mismo día a las 10:00; ticket `LAB-CAMBIO-001`…`003`; sistema Integracion_LAB, versiones `lab-1`, `lab-2`, `lab-3`; solicitante/desplegador/aprobador con etiquetas LAB. EvidenciaPruebas apunta al soporte real `04_SQL/datos/v1/soportes_sinteticos/Pruebas_Cambio_01.md`…`03.md`.
- ID 4: 10 de octubre, 11:00; ticket LAB-CAMBIO-004; sin AprobadoPor/FechaAprobacion; sí tiene soporte `Pruebas_Cambio_04.md`.
- ID 5: 11 de octubre, 11:00; ticket LAB-CAMBIO-005; aprobación previa presente; EvidenciaPruebas nula.
- ID 6: reproducción E-06 del 14 de octubre, 03:02, Sistema Integracion, FuenteID CURSO_CAMBIOS. Todos los demás detalles no aportados que enumera la sección 4 quedan nulos. Clase reproducción.
- En IDs 1–5: FuenteID LAB_CAMBIOS, clase laboratorio. HashArtefacto nulo en las seis filas: no se aportó ni construyó un binario. No calcules el hash de un documento y lo presentes como hash de despliegue.

### Alertas: seis filas

IDs 1–5, fuente LAB_SIEM, severidad Critica, Regla `Control_sintetico`, Activo CRM_LAB, hora 10:00 de los días 7, 8, 9, 10 y 11 de octubre respectivamente. FechaHoraUTC se convierte desde la hora local. Usa AsignadoA `equipo_seguridad_LAB`, PrimeraAccion 10:05, FechaCierre 10:30, NotaCierre `Cierre ficticio de control` y Estado Cerrada, excepto:

- ID 3: AsignadoA nulo; las otras marcas se conservan para aislar la ausencia de asignación registrada.
- ID 4: PrimeraAccion nula; las otras marcas se conservan.
- ID 5: FechaCierre y NotaCierre nulos, Estado Abierta.

ID 6 reproduce E-07, a `2026-10-14T03:18:00`, FuenteID CURSO_SEGURIDAD, Severidad Critica, Regla `Alerta crítica reportada; regla no aportada`, Activo `No aportado`, Estado `Sin_documentar`, todas las marcas de la sección 4 nulas y clase reproducción. No inventes un tiempo de respuesta objetivo ni una atención de la alerta durante la recuperación.

## 9. Reglas que los datos deben permitir comprobar después

Estas reglas fijan condiciones de prueba; tú no debes escribir sus CSV de resultados SQL:

- Q-01: seis bajas con cuenta activa; cuatro bajas con cuenta deshabilitada como controles.
- Q-02: 18 cuentas privilegiadas con al menos un motivo, sin doble conteo entre los grupos 1–8, 9–12 y 13–18. Recertificación: más de 180 días o fecha no aportada, diferenciadas.
- Q-03: al menos cinco sesiones en tres días distintos por cuenta; compara sus horas con el 7–13 de octubre. Incluye actividad nocturna legítima.
- Q-04: tres asignaciones sintéticas sin ticket, tres sin vencimiento, seis completas y una elevación no atribuida del resumen.
- Q-05/Q-06: umbral estrictamente mayor a tres veces el máximo habitual, con al menos cinco días distintos de referencia. Sin cuenta/base/bytes suficientes: no evaluable; conserva la fila.
- Q-07: 216 órdenes distintas, 216 cambios en ventana, cuenta/sesión/vía del incidente desconocidas.
- Q-08: duplicidad candidata por mismo cliente, minuto de creación, plan, monto y canal, excluyendo canceladas. Exactamente diez grupos de dos; diez pares similares se excluyen por plan distinto.
- Q-09: variación absoluta estrictamente superior a 25 % respecto del anterior completo exitoso; separar programación de ejecución y de restauración.
- Q-10/Q-11: detectar campos no documentados sin suponer que su ausencia prueba que la autorización/acción nunca existió.
- Q-12: 13 eventos ordenados, con hora reportada y relojes originales desconocidos.
- Permisos de bitácora: los nombres `admin_bitacora_lab` y `control_bitacora_lab` están reservados para comprobar después permisos efectivos en SQL Server. Una fila de Usuarios no prueba permisos del motor. No crees un CSV que afirme haberlos probado.

## 10. Los 13 eventos que debes transcribir

Todas las fechas son de 2026; HorasReportadasLocal se escriben completas. PaginaPDF=4, del proyecto oficial. Activo y descripción son etiquetas del resumen, sin procesos o personas adicionales.

| ID | Hora reportada local | FuenteID | Referencia | Descripción |
| --- | --- | --- | --- | --- |
| EVT-01 | 2026-10-12T16:15:00 | CURSO_PROVEEDOR | nula | Proveedor solicita renovación de acceso privilegiado a una API; autorización pendiente. |
| EVT-02 | 2026-10-14T02:17:00 | CURSO_VPN | E-02 | Inicio de sesión remoto de cuenta ext_ops_04 sin MFA. |
| EVT-03 | 2026-10-14T02:26:00 | CURSO_IDENTIDAD | nula | Servicio de identidad registra elevación de privilegios. |
| EVT-04 | 2026-10-14T02:31:00 | CURSO_SQL | E-03 | SQL Server registra lectura de 31,840 registros de clientes. |
| EVT-05 | 2026-10-14T02:35:00 | CURSO_RED | E-04 | Monitoreo identifica transferencia de ~1.6 GB hacia destino externo no clasificado. |
| EVT-06 | 2026-10-14T02:42:00 | CURSO_CRM | E-05 | CRM registra cambios en 216 órdenes comerciales. |
| EVT-07 | 2026-10-14T03:02:00 | CURSO_CAMBIOS | E-06 | Se ejecuta despliegue de versión nueva del servicio de integración. |
| EVT-08 | 2026-10-14T03:18:00 | CURSO_SEGURIDAD | E-07 | Sistema de seguridad emite alerta crítica sobre actividad sospechosa. |
| EVT-09 | 2026-10-14T03:42:00 | CURSO_CRM | nula | CRM deja de estar disponible; archivos aparentemente cifrados. |
| EVT-10 | 2026-10-14T04:05:00 | CURSO_TI | nula | TI solicita activar recuperación ante desastres. |
| EVT-11 | 2026-10-14T08:57:00 | CURSO_CRM | nula | CRM retorna en modo solo consulta. |
| EVT-12 | 2026-10-14T09:37:00 | CURSO_CRM | nula | Se restablecen operaciones de escritura. |
| EVT-13 | 2026-10-14T11:15:00 | CURSO_FINANZAS | nula | Finanzas solicita conciliación de órdenes y facturación. |

CuentaReportada es ext_ops_04 únicamente en EVT-02. Activo puede usar API, VPN, Identidad, SQLServer, Red, CRM, Integracion, Seguridad, TI o Finanzas según el evento. En todos: HoraOriginal/ZonaOriginal/DesfaseSegundos nulos, clase reproducción y SupuestosAplicados S-03. “nula” en esta tabla de instrucciones se escribe `\N` en el archivo CSV.

## 11. Comandos y comprobaciones obligatorias

Implementa esta interfaz, desde `Operacion_Trazabilidad_Reparto/`:

```bash
python3 04_SQL/02_generar_datos.py --salida 04_SQL/datos/v1 --semilla 1410
python3 04_SQL/validar_datos.py --datos 04_SQL/datos/v1 --esquema 04_SQL/01_esquema.sql
```

`validar_datos.py` debe abrir los archivos escritos de nuevo. No basta con contar las listas en memoria usadas por el generador. Comprueba:

1. Los 16 archivos, sus encabezados en orden y cada cantidad de la sección 3; total 91,800 filas.
2. Claves primarias únicas y todas las claves foráneas no nulas existentes; IDs referenciados y fechas válidos.
3. Tipos, límites de texto, bits, montos, fechas y restricciones CHECK del contrato. Al leer el DDL distingue restricciones de tabla de columnas. Puedes usar un contrato explícito de columnas en Python y contrastarlo con el DDL; no necesitas construir un analizador SQL general.
4. Las seis bajas activas, cuatro deshabilitadas y los cuatro grupos de cuentas privilegiadas; cero sesiones de IDs 33–42.
5. Las 3,000 sesiones y cobertura habitual de cada cuenta elegible; tres sesiones fuera de sus horas habituales y cuentas nocturnas correctas.
6. Las 216 órdenes distintas en la ventana y exactamente 144 cambios de Monto y 72 de Estado. El estado/monto actuales de Ordenes coincide con el último cambio. Los 60 controles quedan fuera de esa ventana.
7. Regla de duplicidad: diez grupos con dos miembros y ningún otro; excluir los diez pares que difieren en plan.
8. SQL: una sola reproducción de 31,840 filas, usuario nulo; control sintético de 20,000 separado; 140 observaciones normales.
9. Red: una sola reproducción `~1.6 GB` con bytes e IPs nulos; control exacto de 1,200,000,000 bytes separado; 70 observaciones normales.
10. Nueve programaciones, nueve ejecuciones con la histórica incluida, ninguna ejecución del día 15; restauración de julio ligada al respaldo de junio y ninguna “restauración ejecutada ahora”.
11. Los 13 eventos y sus horas/fuentes/referencias; nulos del expediente conservados; no hay un desfase cero en ninguna fuente CURSO.
12. Cada ruta de EvidenciaPruebas no nula apunta a uno de los cuatro soportes que efectivamente entregaste.
13. Dos ejecuciones del generador en dos carpetas temporales distintas, semilla 1410, producen CSV y soportes idénticos byte por byte. No compares timestamps del manifiesto como si fueran datos de negocio.
14. Un segundo intento sobre la misma carpeta se rechaza sin cambiar sus hashes.

Escribe `Validacion_generacion_v1.json` con cada comprobación, observado, esperado y estado aprobado/fallido. Si alguna falla, devuelve código distinto de cero y no publiques el conjunto como validado. No declares carga SQL, consultas ejecutadas ni validación humana: esta validación solo inspecciona archivos y reproducibilidad.

En `Manifest_datos_v1.json` registra semilla, versión del generador, versión real de Python, corte, cantidades, parámetros aprobados, hash SHA-256 del esquema y de Supuestos_P1_v1.csv, hashes de los 16 CSV, cuatro soportes y scripts, y momento real de generación. No incluyas el manifiesto dentro de su propia lista de hashes.

En el diccionario enumera por tabla qué columnas fueron inventadas, qué campos transcriben el resumen, las unidades y el marcador de nulos. En el registro de IA identifica tu herramienta real, este encargo, archivos usados, comprobaciones efectivamente ejecutadas y revisión humana pendiente. No inventes nombres de custodios ni confirmación de P2/P3.

## 12. Entrega y revisión posterior

Entrega los archivos en sus rutas. Si tu entorno no permite escribir archivos, entrega ambos scripts completos y los comandos para ejecutarlos; declara que los CSV todavía no existen. No pegues 85,000 clientes en el chat. No respondas solo “listo” si no tienes archivos y comprobación.

Al terminar informa: rutas entregadas, cantidades, reproducibilidad comprobada o pendiente y cualquier diferencia respecto de este contrato. Conserva como pendientes la carga a SQL Server, la creación de auditor_lectura, las pruebas de permisos, Q-01–Q-12 y la revisión de P1. El agente que retome el plan verificará tus archivos antes de usarlos como base del análisis.

## Anexo: encabezados exactos

Estos encabezados se extrajeron del esquema comprobado. Copia cada línea completa en el CSV correspondiente; no agregues ni cambies columnas.

### FuentesTiempo.csv

```csv
FuenteID,Nombre,ZonaOriginal,DesfaseSegundos,Metodo,Verificado,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### Empleados.csv

```csv
EmpleadoID,Nombre,Area,Relacion,Empresa,FechaIngreso,FechaBaja,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### Usuarios.csv

```csv
UsuarioID,NombreUsuario,EmpleadoID,TipoCuenta,Sistema,EsPrivilegiada,MFAHabilitado,Estado,FechaCreacion,UltimaRecertificacion,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### Sesiones.csv

```csv
SesionID,UsuarioID,FuenteID,HoraReportadaLocal,HoraOriginal,ZonaOriginal,IPOrigen,Dispositivo,Metodo,Resultado,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### Privilegios.csv

```csv
AsignacionID,UsuarioID,Rol,Sistema,FechaHora,AsignadoPor,Ticket,Vence,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### Clientes.csv

```csv
ClienteID,Nombre,Departamento,Plan,FechaAlta,Estado,Clasificacion,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### Ordenes.csv

```csv
OrdenID,ClienteID,VendedorID,Sucursal,FechaCreacion,Estado,Plan,Monto,Moneda,Canal,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### HistorialOrdenes.csv

```csv
CambioID,OrdenID,FechaHora,UsuarioID,SesionID,Campo,ValorAnterior,ValorNuevo,Via,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### CambiosSistema.csv

```csv
CambioSistemaID,Ticket,Sistema,Version,SolicitadoPor,AprobadoPor,FechaAprobacion,FechaHoraDespliegue,EjecutadoPor,EvidenciaPruebas,HashArtefacto,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### ProgramacionBackups.csv

```csv
ProgramacionID,BaseDatos,Tipo,HoraProgramada,Destino,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### Backups.csv

```csv
BackupID,ProgramacionID,BaseDatos,Tipo,Inicio,Fin,TamanoGiB,Estado,ChecksumDeclarado,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### PruebasRestauracion.csv

```csv
PruebaID,BackupID,Fecha,Resultado,MinutosRestauracion,Responsable,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### BitacoraSQL.csv

```csv
EventoSQLID,FechaHora,UsuarioID,Objeto,Accion,Filas,Aplicacion,IPOrigen,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### TransferenciasRed.csv

```csv
FlujoID,HoraReportadaLocal,InicioUTC,FinUTC,IPOrigen,IPDestino,Puerto,Protocolo,BytesEnviados,VolumenReportado,ClasificacionDestino,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### Alertas.csv

```csv
AlertaID,HoraReportadaLocal,FechaHoraUTC,Severidad,Regla,Activo,Estado,AsignadoA,PrimeraAccion,FechaCierre,NotaCierre,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```

### EventosExpediente.csv

```csv
EventoID,HoraReportadaLocal,FuenteID,Descripcion,CuentaReportada,Activo,PaginaPDF,HoraOriginal,ZonaOriginal,DesfaseSegundos,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados
```
