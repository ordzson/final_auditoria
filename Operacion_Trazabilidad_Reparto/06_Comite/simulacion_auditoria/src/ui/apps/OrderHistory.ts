import type { ApplicationDefinition } from '../../computer/types';
import { mountRecordBrowser } from './RecordBrowser';

export const orderHistory: ApplicationDefinition<'order-history'> = {
  id: 'order-history', title: 'CRM · Historial de órdenes', icon: 'orders', minSize: { width: 410, height: 310 },
  mount(container, context) {
    return mountRecordBrowser(container, context, {
      title: 'Historial de órdenes', icon: 'orders',
      introduction: 'Examina las modificaciones y la conciliación solicitada. Compara la actividad con el despliegue; el orden temporal no demuestra causalidad.',
      sourceIds: ['EVT-06', 'EVT-07', 'EVT-13', 'E-05'],
    });
  },
};
