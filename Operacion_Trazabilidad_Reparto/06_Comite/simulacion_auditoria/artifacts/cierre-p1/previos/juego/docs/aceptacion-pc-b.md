# Primera PC · B: SQL y red

Recorrido de aceptación fijado en la etapa 0. **Etapa 2 completada y aceptada dentro del alcance B el 5 de noviembre de 2026**: solo B abre ComputerDesktop desde E y el acceso plano, con cuatro aplicaciones, libreta/TI y retorno al escritorio. El [informe integrado B](../artifacts/desktop-b/README.md) registra `pnpm verify` con código 0: 99 unitarias, TypeScript/Vite y 23 E2E aprobadas, incluidas las cinco de B; siete capturas finales y revisión independiente con ambos puntos `resolved` y disposición `ship` limitada a las correcciones de oficina reconocible y SELECT intacto. La evidencia de etapa 1 se conserva en [su montaje aislado](../artifacts/desktop-stage1/README.md). Este documento mantiene el contrato de aceptación; las etapas 3–5 siguen pendientes.

Contratos: [contratos-escritorios-pc.md](contratos-escritorios-pc.md). Dirección: [computer-desktop.md](../.impeccable/surfaces/computer-desktop.md). Revisión académica: AU-02; estación única: `sql_red`.

## Preparación y tamaños

Usar una partida limpia, luego una partida académica v2 existente con conclusiones/recomendaciones/ajustes. Revisar 1280×720, 1920×1080 y 390×844, acceso físico y plano. La oficina permanece reconocible tras el monitor en escritorio; el modo plano mantiene marco, programas y controles aunque no haya WebGL. El modo proyector y movimiento reducido conservan funciones y legibilidad.

B instala Query Studio, Monitor de red, Informe del puesto y Expediente local. Usa `/computers/wallpapers/xp-professional-azul.jpg` y tema XP. Query Studio y Monitor de red aparecen abiertos; Query Studio activo. La nota y sus tres asuntos permanecen accesibles. No confundir los dos monitores físicos con dos estaciones.

## Recorrido principal

1. Entrar por E desde B y repetir desde el acceso plano. Deben verse bisel, oficina y HUD exterior con salida/libreta. Se detiene el movimiento y el foco queda dentro del diálogo del juego.
2. Pulsar «Revisar la lectura masiva de clientes» en la nota. Despliega una orientación hacia Query Studio sin abrir aplicaciones, ejecutar SQL ni cambiar `inspected`, `sourceRefs`, respuestas o evaluación. «Mostrar escritorio» recupera nota y accesos desde cualquier disposición.
3. Recuperar Query Studio desde su tarea. Editar y ejecutar un SELECT local, por ejemplo el siguiente. Los resultados conservan procedencia y `NULL`; mostrar filas no inspecciona fuentes. Ctrl/⌘+Enter funciona dentro de esta ventana.

   ```sql
   SELECT hora, sistema, cuenta, detalle
   FROM registros
   WHERE sistema = 'SQL Server' OR sistema = 'Monitoreo de red'
   ORDER BY fecha, hora;
   ```

4. Abrir la fila EVT-04: registra su inspección y muestra el registro de 31,840 lecturas. Abrir Monitor de red, inspeccionar EVT-05 y comparar ambos. La transferencia reportada es ~1.6 GB; el programa conserva los campos ausentes y no afirma que identifica el contenido ni la causa. Elegir las fuentes como sustento las vincula automáticamente, sin un paso posterior para copiarlas a la libreta.
5. Elegir una respuesta al contraste C02-CONTENIDO antes de obtener Seguridad. Se conserva como borrador con aviso del grupo faltante; no aparece un contraste verificado ni «Documentado». Solicitar la declaración de Seguridad al enlace (`P-FUJO`, nombre actual del identificador; fuente DECL-05) desde la navegación del juego. Volver conserva consulta, selección, comparación y ventanas. La nota no obtiene declaraciones al pulsarla.
6. Inspeccionar y usar DECL-05 como sustento desde el expediente o la herramienta pertinente. El puente registra la elección pendiente cuando dispone de sus fuentes. Cambiar la respuesta actualiza el mismo Assessment conservando sus referencias. La interfaz no selecciona la respuesta correcta.
7. Abrir «Informe del puesto» y elegir conclusión, límites y solicitudes; escribir una frase sin desenfocar el campo y abrir inmediatamente la libreta. La última frase y selecciones aparecen automáticamente allí. La confirmación de guardado se ve fuera de la pantalla simulada, incluso con el diálogo abierto.
8. Volver, minimizar/restaurar, maximizar/restaurar, cerrar/reabrir un programa y salir/regresar a B. Se mantienen borradores, consulta, comparación y desplazamiento. Reabrir el mismo acceso no crea otra instancia ni duplica listeners.
9. Recargar. Se reconstruyen resultados desde la consulta guardada sin nuevas inspecciones ni respuestas. Cambiar la resolución mantiene títulos, botones, nota y barra accesibles. En móvil se usa una ventana maximizada a la vez y un toque abre los accesos.

## Variantes que deben fallar de forma controlada

| Caso | Resultado esperado |
| --- | --- |
| SQL inválido | Error dentro de Query Studio, sin conservar resultados engañosos ni conceder evidencia |
| Cambiar a otra PC y volver | B conserva su borrador; ninguna consulta/ventana de la otra estación lo sustituye |
| Retirar un sustento desde la libreta | Se actualizan contraste, marcas y evaluación; no persiste otro «terminado» en la nota |
| Bloquear localStorage | Trabajo utilizable en memoria, «Solo en esta sesión»; nunca «Guardado» tras el fallo |
| Mover ventanas/cambiar pose | No dispara «Conclusión guardada» ni incrementa progreso académico |
| Workspace corrupto o versión desconocida | Disposición inicial segura; auditoría v2 intacta |
| Reiniciar | Se limpian auditoría, ventanas, nota, consultas y borradores pendientes de todas las PCs |
| Menú Inicio abierto + Esc | Primero cierra el menú; siguiente Esc vuelve a la oficina conservando trabajo |
| Teclado/táctil | Un clic selecciona acceso, doble clic o Enter abre; táctil abre con un toque. Controles nombrados, foco visible, salida disponible |

## Evidencia requerida para aceptar la etapa 2

Capturas reales a 1280×720, 1920×1080 y 390×844 con bisel/barra/nota; en escritorio, oficina identificable. Una captura debe mostrar el HUD exterior de libreta con dos programas abiertos. Registrar también modo plano y fallo de almacenamiento. Guardar bajo `artifacts/desktop-b/` junto con el reporte de resultados, comandos ejecutados y pendientes reales. Las capturas anteriores de `.impeccable/review/investigation/` solo documentan ComputerPanel y no validan el nuevo escritorio.

Pasar las pruebas apropiadas de estado/ventanas/apps, `pnpm test`, `pnpm build` y los E2E del recorrido B. Extender A/C/D/E/F después de aceptar B. La entrega global exige además `pnpm verify` en la etapa final; ninguna selección de respuesta convierte la actividad en aprobación académica automática.
