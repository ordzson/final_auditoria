import type { ApplicationDefinition } from '../../computer/types';
import { mountRecordBrowser } from './RecordBrowser';

export const accountDirectory: ApplicationDefinition<'account-directory'> = {
  id: 'account-directory', title: 'Directorio de cuentas', icon: 'directory', minSize: { width: 410, height: 310 },
  mount(container, context) {
    return mountRecordBrowser(container, context, {
      title: 'Cuentas, permisos y solicitudes', icon: 'directory',
      introduction: 'Consulta el resumen del directorio, los permisos reportados y la solicitud del proveedor. Compara sus alcances sin inferir una identidad personal.',
      sourceIds: ['E-01', 'E-02', 'EVT-01'],
    });
  },
};
