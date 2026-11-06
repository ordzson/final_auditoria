# Etapa 0 · contratos y recursos de las computadoras

Preparación realizada el 5 de noviembre de 2026. La interfaz ejecutable sigue siendo ComputerPanel; no se implementaron etapas posteriores.

## Entrega

- [Contratos tipados](../../src/computer/types.ts) de aplicaciones, contexto, ventanas, borradores, nota, progreso, puente y persistencia.
- [APIs, instalaciones y propiedad de archivos](../../docs/contratos-escritorios-pc.md), con un propietario por módulo compartido y guardado de workspace separado del académico v2.
- [Mapa de recursos](../../src/data/computerAssets.ts) con los seis fondos, temas, fuentes, bandera, roles/variantes de iconos y pantalla/material del monitor.
- [Créditos](../../public/computers/CREDITS.md) y [manifiesto](../../public/computers/manifest.json): procedencia, entradas exactas de ZIP y hashes cotejados con el inventario.
- [Dirección XP/Server](../../.impeccable/surfaces/computer-desktop.md), enlazada desde DESIGN, y [recorrido B](../../docs/aceptacion-pc-b.md) pendiente de ejecución en etapa 2.
- [Selección visual de iconos](icon-selection.png), hoja de inspección de recursos a 32 px; no representa una captura del juego.

## Recursos preparados

81 archivos, 19,522,511 bytes (aproximadamente 18.6 MiB), más créditos y manifiesto:

| Tipo | Cantidad | Preparación |
| --- | ---: | --- |
| Fondos | 6 | Copias exactas, seis asignaciones distintas por StationId |
| Tahoma | 2 | Normal 400 y negrita 700, sin instalar fuentes |
| Bandera | 1 | WebP original con transparencia |
| Iconos | 68 PNG / 24 selecciones ICO | Fotogramas nativos de 16/32/48 px disponibles, sin redimensionar; XP y clásicos |
| Monitor | 4 | glTF, binario, textura y licencia CC BY 4.0 de portgl16; referencias internas preservadas |

Los originales permanecen intactos. No se copiaron sonidos, periféricos, capturas como interfaz, bienvenida ni recursos de reserva. El monitor todavía no está colocado junto al rack; los recursos de PC todavía no se cargan desde la interfaz. Los archivos preparados también se copiaron a `dist/` durante la compilación.

## Validación

- `pnpm test`: **71 pruebas aprobadas en 7 archivos**, incluidas cinco nuevas de asignaciones, hashes/procedencia, fuentes/bandera, PNG nativos y dependencias/pantalla/licencia del monitor.
- `pnpm build`: **aprobado**, incluida comprobación de los contratos TypeScript. Advertencia existente de chunk principal mayor de 500 kB: 724.70 kB, 193.87 kB gzip. No se añadieron dependencias.
- `pnpm test:e2e`: **18 pruebas aprobadas** en 2.6 minutos sobre la interfaz vigente, incluidos tamaños de escritorio/móvil, modo plano, investigación, guardado, seis revisiones, reconstrucción y exportación.
- Enlaces de los documentos revisados: correctos. Las 81 copias de recursos presentes en `dist/` coinciden por SHA-256 con el manifiesto.

`pnpm verify` alcanzó compilación pero el sandbox impidió abrir el servidor de Playwright (`listen EPERM` en 127.0.0.1:4173). La ejecución E2E se retomó con permiso de ejecución fuera del sandbox y pasó completa; las tres comprobaciones quedaron aprobadas mediante los comandos indicados arriba. La prueba de assets usa `.mjs`, y Vitest incluye explícitamente ese formato, para usar la biblioteca estándar de Node sin añadir tipos ni dependencias al proyecto.

Se inspeccionaron las capturas XP aportadas, la captura previa del programa SQL y las familias completas de iconos XP/w2k antes de seleccionar los recursos. Los hashes originales y de las entradas seleccionadas se validaron durante la preparación; las pruebas vuelven a cotejar las copias entregadas contra el manifiesto y el inventario.

## Traspaso

La etapa 1 puede consumir los contratos y recursos publicados. Las pruebas actuales no certifican ventanas, autosave, carga tipográfica en el nuevo escritorio ni acceso físico al nuevo monitor. Esas comprobaciones pertenecen a la implementación e integración B y a la revisión de las seis PCs. No hay una captura nueva de escritorio ni un veredicto visual de una superficie aún no construida.
