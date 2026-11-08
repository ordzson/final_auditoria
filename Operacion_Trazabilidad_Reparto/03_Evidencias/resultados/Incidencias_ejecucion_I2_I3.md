# Incidencias reales de ejecución I2/I3

Registro consolidado el 7 de noviembre de 2026 UTC. Se conservan los directorios de intentos; no se sustituyen por resultados satisfactorios. Los errores siguientes se observaron durante esta sesión, no son casos generados del incidente.

| Intento / carpeta | Observación real | Corrección y destino |
| --- | --- | --- |
| I2_I3_ejecucion_01 | sqlcmd rechazó combinar -h y -y 0; no se creó base. | Se retiró -h. |
| I2_I3_ejecucion_02; RedNova_P1_Lab_v2_I2 | Entrada larga por stdin produjo errores 102/105 al iniciar FuentesTiempo. | Ejecución mediante archivo temporal; se conservó la base del intento. |
| I2_I3_ejecucion_03; RedNova_P1_Lab_v2_I2_b | El transporte por archivo permitió continuar; salida JSON vacía provocó JSONDecodeError durante comprobaciones. | Se interpreta ausencia de filas como lista vacía. Base conservada. |
| I2_I3_reconstruccion_01; RedNova_P1_Lab_v2_reconstruccion | Se cargaron las 16 tablas; falló interpretación de salida sin filas al buscar login aún inexistente. | Mismo manejo de lista vacía. Se mejoró carga por lotes y JSON multilínea. No se reutilizó esta base para la prueba final. |
| I2_I3_final; RedNova_P1_Lab_v2 | Carga y comparación integral completadas; DENY CONTROL también impidió conectar al auditor. | REVOKE CONTROL ON DATABASE::[RedNova_P1_Lab_v2] TO auditor_lectura. CONTROL nunca se concedió. El DDL final conserva DENY de escritura y ALTER. |
| I2_I3_final_validada | El auditor conectó; INSERT/UPDATE/DELETE rechazados con 229. ALTER fue rechazado con 1088, distinto del 4902 previsto por el comprobador. | Se corrigió el código esperado al observado, manteniendo la exigencia de rechazo; Fallo.json conserva el contraste fallido. |
| I2_I3_cierre | Verificación de la base principal con --solo-verificar; 95 comprobaciones aprobadas. | Doce consultas repetidas; CSV completos. |
| I2_I3_repeticion; RedNova_P1_Lab_v2_repeticion | Nueva base vacía, carga y análisis completos con las correcciones. | 95 aprobadas y 15 archivos CSV idénticos entre bases (12 Q, Q-S01, concesiones y rechazos). |
| I2_I3_rechazo_base_existente | El motor rechazó crear RedNova_P1_Lab_v2 por existir, error 51000. | Rechazo_base_existente.json; no se sobreescribió la base. |

Durante el diagnóstico se enviaron terminaciones a clientes sqlcmd en el contenedor propio para detener las lecturas largas; no se detuvo SQL Server ni se eliminaron bases o volúmenes. Los fallos observados y las bases de intentos quedan separados de los dos comprobantes finales. Las cantidades parciales de intentos no se presentan como certificación final.

No se guardaron secretos en evidencia. No se atribuye revisión humana ni ejecución de restauración real. Las fechas exactas de inicio/fin de las corridas completas figuran en sus JSON; no se reconstruyen horas exactas de los errores a partir de esta narración.
