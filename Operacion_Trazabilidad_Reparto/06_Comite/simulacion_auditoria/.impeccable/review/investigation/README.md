# Ordenadores de investigación

Capturas reales de Chrome sobre Vite local, con movimiento reducido y el modo plano de acceso a los mismos programas utilizados desde la oficina 3D. No contienen arte generado ni resultados de SQL Server. Los datos de las herramientas proceden de `src/data/canon.json`.

- `sql-desktop.png`: consulta editable de lectura y tráfico, dos filas y el inspector de la lectura. 1440×900.
- `sql-1280.png`: la misma consulta después de seleccionar una fila, con desplazamiento del área de trabajo para ver resultados. 1280×720.
- `sql-mobile.png`: programa desde su inicio. 390×844.
- `inspector-mobile.png`: detalle de la lectura, con guardado y comparación visibles. 390×844.
- `sesiones.png`: acceso remoto, cuenta y búsqueda. 1440×900.
- `crm-comparacion.png`: comparación de cambios y despliegue, con el área central desplazada hasta la mesa. 1440×900.
- `siem.png`: cronología y alerta crítica. 1440×900.
- `recuperacion.png`: selección del retorno en solo consulta. 1440×900.
- `archivo.png`: comprobación de un original no aportado. 1440×900.
- `siem-cuenta.png`: búsqueda de la cuenta desde la sesión y reapertura correcta de Event Desk. 1440×900.
- `archivo-sesion.png`: la sesión en Archivo conserva solo las acciones disponibles en ese puesto. 1440×900.

Las nueve capturas iniciales no registraron errores JavaScript ni desbordamiento horizontal del documento o del área del programa. Las dos capturas de corrección tampoco registraron errores JavaScript. Las tablas anchas tienen desplazamiento interno. Las pruebas de navegador cubren por separado interacción, accesibilidad por teclado, móvil, guardado y evaluación.

El vídeo y las exportaciones bajo `artifacts/entrega/` pertenecen a la entrega anterior y no se regeneraron con esta extensión.

La revisión independiente examinó las nueve capturas iniciales y pidió corregir la búsqueda de cuenta en puestos sin vista compatible y documentar la extensión. Veredicto final: `ship`; ambas correcciones puntuadas como resueltas. El veredicto cubre esa lista, con las capturas de corrección, código y documentación. `inspector-mobile.png` se actualizó para mostrar el detalle conservado en pantalla después de guardar una pista.
