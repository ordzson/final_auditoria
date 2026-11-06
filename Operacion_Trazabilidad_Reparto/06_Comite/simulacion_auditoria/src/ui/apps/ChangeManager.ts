import type { ApplicationDefinition } from '../../computer/types';
import { mountRecordBrowser } from './RecordBrowser';

export const changeManager: ApplicationDefinition<'change-manager'> = {
  id: 'change-manager', title: 'Gestor de cambios', icon: 'changes', minSize: { width: 410, height: 310 },
  mount(container, context) {
    return mountRecordBrowser(container, context, {
      title: 'Despliegue, ticket y declaraciones', icon: 'changes',
      introduction: 'Revisa el despliegue y el ticket con sus campos de aprobación. Las declaraciones de BD y Desarrollo aparecen después de solicitarlas al enlace de TI.',
      sourceIds: ['EVT-07', 'E-06', 'E-05'],
    });
  },
};
