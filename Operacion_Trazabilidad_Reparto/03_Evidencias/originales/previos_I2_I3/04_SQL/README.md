# Laboratorio académico P1

Estado: datos v2 recibidos y revisados; carga SQL pendiente. Otro modelo generó los conjuntos siguiendo [Instrucciones_generacion_datos_P1_v1.md](Instrucciones_generacion_datos_P1_v1.md). La revisión propia de recepción aprobó 54 comprobaciones de archivos y 24 hashes; informe en `../03_Evidencias/resultados/Revision_recepcion_datos_v2.json`. Usar `datos/v2/`, conservando v1 como versión anterior.

## Lo que está comprobado

- Docker Engine 29.4.2; SQL Server 2022 Developer, versión real 16.0.4305.5.
- Imagen oficial fijada por digest en `compose.yaml`, contenedor `p1-trazabilidad-sql2022`, volumen propio `p1_trazabilidad_sql2022_v1` y puerto `127.0.0.1:14331`.
- `01_esquema.sql` ejecutado en `P1_Diseno_Contrato_v1`: 16 tablas, 18 claves foráneas y cero filas. Es una comprobación del contrato; la base de trabajo con datos aún no existe.
- Cinco hashes de entrada coinciden con el registro documental inicial.

La clave de administración del contenedor se generó aleatoriamente en `.env`, excluido de Git. No se imprime en informes ni se incorpora a la evidencia. El usuario auditor de lectura todavía no existe.

## Encargo al otro modelo

Comparte el instructivo junto con `01_esquema.sql`, `../03_Evidencias/Supuestos_P1_v1.csv` y `../03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md`. Puede trabajar con Python estándar y sin acceso al contenedor. Su entrega será el generador, los 16 CSV, cuatro soportes ficticios y comprobantes de validación de archivos.

El tamaño aprobado es 85,000 clientes, 3,000 órdenes, 120 cuentas y 3,000 sesiones; semilla 1410. Los datos auxiliares se enumeran en el instructivo. El conjunto fue generado por otro modelo y se recibió en versiones v1 y v2. Se seleccionó v2, que corrige la distribución de sesiones en los 23 días adicionales.

## Continuación cuando lleguen los datos

1. Revisar la procedencia, el generador, los encabezados y los campos desconocidos antes de aceptar el conjunto.
2. Ejecutar su validador y repetir la generación en dos directorios temporales para comparar los hashes. Una validación de archivos no sustituye la carga en SQL Server.
3. Preservar la primera versión recibida en `../03_Evidencias/originales/`, registrar sus hashes y trabajar sobre copias. Mantener los originales documentales previos.
4. Implementar la preparación de una base vacía propia `RedNova_P1_Lab_v1`, la carga y `04_usuario_lectura.sql`. Aplicar el esquema verificado sin modificar servicios de otros proyectos.
5. Comprobar claves, cantidades, nulos, períodos y los 13 eventos en el motor. Probar los permisos efectivos de lectura y el rechazo de escritura del auditor.
6. Solo entonces ejecutar Q-01–Q-12 con fecha de corte fija, exportar resultados auténticos y continuar el plan de análisis.

`03_carga.sql`, `04_usuario_lectura.sql`, `verificar_laboratorio.sql`, el ejecutor `laboratorio.py` y `Analisis_Auditoria.sql` aún están pendientes. Los comandos correspondientes del documento de diseño son una interfaz prevista; no se presentan como programas existentes.

## Administrar el contenedor existente

Desde esta carpeta, con acceso a Docker:

```bash
docker compose -p p1-trazabilidad ps
docker compose -p p1-trazabilidad stop
docker compose -p p1-trazabilidad start
```

Para iniciar en una copia nueva, preparar `.env` con una clave local y usar `docker compose -p p1-trazabilidad up -d`. No ejecutar limpieza de volúmenes ni eliminación de bases para repetir una comprobación. Si el nombre de contenedor/volumen está ocupado por otra instalación, conservarla y elegir nombres propios nuevos, registrando la diferencia.

La imagen y la ubicación de `sqlcmd` se contrastaron con la [guía oficial de Microsoft para SQL Server en Docker](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-docker?view=sql-server-ver16). La versión y los conteos anteriores provienen de la ejecución local, registrada en `../03_Evidencias/resultados/Validacion_contrato_I1_v1.txt`.
