import type { ApplicationDefinition } from '../../computer/types';
import { mountRecordBrowser } from './RecordBrowser';

export const networkMonitor: ApplicationDefinition<'network-monitor'> = {
  id: 'network-monitor', title: 'Monitor de red', icon: 'network', minSize: { width: 410, height: 310 },
  mount(container, context) {
    return mountRecordBrowser(container, context, {
      title: 'Tráfico y lectura reportados', icon: 'network',
      introduction: 'Consulta el registro de salida y compáralo con la actividad SQL. Los resúmenes conservan su procedencia y sus campos ausentes.',
      sourceIds: ['EVT-04', 'EVT-05', 'E-03', 'E-04'],
    });
  },
};
