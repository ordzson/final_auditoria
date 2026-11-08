# Laboratorio P1 · I2/I3 ejecutadas

SQL Server 2022 Developer 16.0.4305.5 en `p1-trazabilidad-sql2022`, puerto `127.0.0.1:14331`, imagen fijada en compose.yaml. Base cargada: `RedNova_P1_Lab_v2`; reconstrucción independiente: `RedNova_P1_Lab_v2_repeticion`. Datos seleccionados `datos/v2/`, 16 tablas / 91,800 filas / semilla 1410. v1 se conserva. `P1_Diseno_Contrato_v1` se consultó y conserva sus 16 tablas vacías; nunca se utiliza para carga.

## Repetir desde cero

Requiere Python estándar, Docker con acceso al contenedor existente y su sqlcmd en `/opt/mssql-tools18/bin/sqlcmd`. No se requiere instalar paquetes. Desde `04_SQL/`:

```bash
docker compose -p p1-trazabilidad start
python3 laboratorio.py --base RedNova_P1_Lab_v2_nueva01 --salida I2_I3_nueva01
```

Usar un nombre nuevo tanto para base como para salida. El ejecutor valida nombres y rechaza una base o carpeta de resultados existente. No borra, vacía ni sobrescribe bases. El rechazo de base existente se comprobó realmente y está documentado. Los intentos previos se conservan; no ejecutar DROP ni limpieza de volúmenes para repetir.

Secuencia efectiva: comprobar 24 hashes y preservar recibidos → comprobar contrato/motor → crear base vacía con `00_preparar_base.sql` → aplicar `01_esquema.sql` → cargar los CSV v2 existentes con `03_carga.sql` y OPENJSON tipado, en lotes de 1,000 filas → comparar cada celda SQL/CSV → crear login/usuario con `04_usuario_lectura.sql` → restricciones, fechas, nulos y cifras con `verificar_laboratorio.sql` → conectar como auditor y probar rechazos → Q-S01 → Q-01–12 dos veces → exportar CSV y metadatos. No vuelve a ejecutar el generador ni cambia supuestos.

Para comprobar y exportar de nuevo una base ya construida, sin cargar ni crear usuarios:

```bash
python3 laboratorio.py --base RedNova_P1_Lab_v2 --salida I2_I3_verificacion_nueva01 --solo-verificar
```

El login de lectura se crea una sola vez con secreto aleatorio local en `.env.auditor`, modo 0600 y excluido de Git. La clave de administración ya reside en `.env`; el ejecutor la utiliza desde el entorno del contenedor. No imprime ni copia claves a evidencias. Si el login existe y falta su archivo local, se detiene sin cambiarlo. Nunca guardar los archivos .env en anexos ni compartirlos con el equipo.

El auditor tiene SELECT en dbo y denegación explícita INSERT/UPDATE/DELETE/ALTER; no pertenece a roles administrativos. CONTROL no se concede: se verifica como ausente. Denegarlo explícitamente a nivel de base impediría también CONNECT. Usuarios `admin_bitacora_lab` y `control_bitacora_lab` son WITHOUT LOGIN, solo en las bases propias; se comprueban bajo EXECUTE AS USER por sa. El administrador ficticio puede UPDATE/DELETE en BitacoraSQL; no se ejecutan cambios de bitácora.

Las pruebas reales de escritura/ALTER/CREATE USER del auditor usan transacción con rollback. UPDATE/DELETE tienen WHERE 1=0. Los códigos de rechazo reales son 229 (escritura), 1088 (ALTER) y 15247 (CREATE USER). La conexión real del auditor queda en Conexion_auditor.json y las concesiones en Concesiones_SQL.csv.

## Resultados y límites

`../03_Evidencias/resultados/I2_I3_cierre/` conserva la corrida de verificación final de la base principal. `I2_I3_repeticion/` conserva creación, carga y análisis completos desde cero con la versión corregida. Resultados de acceso directo en `../03_Evidencias/resultados/`: Q-01.csv…Q-12.csv, Q-S01.csv, Ejecuciones_v1.csv y Validacion_laboratorio_v1.json/txt. Metadatos, hash de SQL, manifest, corte y hash de cada CSV figuran en Ejecuciones_v1.csv. Comparacion_reconstruccion.json coteja los resultados entre bases. Incidencias_ejecucion_I2_I3.md conserva las correcciones y los intentos previos.

Los CSV completos son UTF-8, coma, encabezado, LF y NULL `\N`. sqlcmd devuelve JSON con nulos explícitos; Python lo convierte con csv.DictWriter, sin analizar tablas impresas. El ejecutor usa archivo temporal en el contenedor, eliminado al cerrar el cliente, y desactiva sustitución de variables SQLCMD. Los scripts SQL con `$(BASE)` y `$(JSON)` son plantillas sustituidas por Python, no instrucciones para ejecutar directamente en sqlcmd. Las consultas tienen orden determinista y corte fijo `2026-10-15T23:59:59-06:00`, sin GETDATE().

Diccionario, diagrama DOT/PNG, interpretación, índice, custodia y hashes en `../03_Evidencias/`. La copia recibida se preservó antes de cargar en `originales/recepcion_I2/`; primeras versiones de artefactos nuevos en `originales/artefactos_I2_I3/`. El generador v2 existente y su validador se conservan sin modificaciones. No se repitió generación: esta sesión valida e importa los datos recibidos, según el encargo.

Los resultados comprueban el laboratorio sintético; no corroboran independientemente el expediente ni identifican personas, contenidos transferidos o sincronización de relojes desconocidos. La restauración histórica de julio es un registro ficticio, no una restauración ejecutada aquí. Captura gráfica, revisión humana y traspasos P2/P3 pendientes. El juego no fue modificado ni probado en este encargo.
