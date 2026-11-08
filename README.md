# Final Auditoría

Simulación de auditoría en una oficina 3D para el proyecto Operación Trazabilidad.

## Contenido

- `Operacion_Trazabilidad_Reparto/06_Comite/simulacion_auditoria/`: código del juego, recursos de ejecución y pruebas.
- `Operacion_Trazabilidad_Reparto/`: material del curso, diseño y documentos del proyecto.
- `assets/`: recursos originales, modelos 3D, imágenes, fuentes y audios.
- `final_auditoria.code-workspace`: workspace con rutas relativas para abrir el proyecto en VS Code.

## Descargar todo el contenido

Los paquetes portátiles, respaldos y trazas grandes se conservan completos mediante **Git LFS**. Instalar Git LFS antes de clonar y ejecutar:

```bash
git lfs install
git clone https://github.com/ordzson/final_auditoria.git
cd final_auditoria
git lfs pull
```

Si el repositorio ya está clonado, ejecutar `git pull` y `git lfs pull`. El inventario de archivos grandes se consulta con `git lfs ls-files`.

El repositorio incluye los entregables académicos, la compilación final del juego, capturas, vídeo, libreta PDF/JSON, respaldos y registros de verificación. Las credenciales locales y las dependencias instaladas quedan excluidas.

Los [archivos para presentar y los resultados actuales](Operacion_Trazabilidad_Reparto/06_Comite/simulacion_auditoria/artifacts/clase/README.md) se distinguen de los paquetes y registros históricos.

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
