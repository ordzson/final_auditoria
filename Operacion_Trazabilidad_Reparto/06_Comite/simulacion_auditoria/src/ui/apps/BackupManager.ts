import type { ApplicationDefinition } from '../../computer/types';
import { mountRecordBrowser } from './RecordBrowser';

export const backupManager: ApplicationDefinition<'backup-manager'> = {
  id: 'backup-manager', title: 'Gestor de respaldos', icon: 'backup', minSize: { width: 410, height: 310 },
  mount(container, context) {
    return mountRecordBrowser(container, context, {
      title: 'Respaldos y pruebas', icon: 'backup',
      introduction: 'Consulta la programación y el resumen del respaldo. Una copia programada no acredita su ejecución ni una restauración validada; solicita el contexto de Continuidad al enlace de TI.',
      sourceIds: ['E-08', 'EVT-10', 'EVT-13'],
    });
  },
};
