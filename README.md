# Final Auditoría

Simulación de auditoría en una oficina 3D para el proyecto Operación Trazabilidad.

## Contenido

- `Operacion_Trazabilidad_Reparto/06_Comite/simulacion_auditoria/`: código del juego, recursos de ejecución y pruebas.
- `Operacion_Trazabilidad_Reparto/`: material del curso, diseño y documentos del proyecto.
- `assets/`: recursos originales, modelos 3D, imágenes, fuentes y audios.
- `final_auditoria.code-workspace`: workspace con rutas relativas para abrir el proyecto en VS Code.

## Ejecutar el juego

Requisitos: Node.js 20.19+ o 22.12+ y pnpm 11.2.2.

```bash
cd Operacion_Trazabilidad_Reparto/06_Comite/simulacion_auditoria
pnpm install --frozen-lockfile
pnpm dev
```

Abrir en el navegador la dirección que indique Vite.

## Validación y compilación

Desde la carpeta del juego:

```bash
pnpm test
pnpm build
```

Los recursos de terceros conservan sus archivos de licencia y atribución.
