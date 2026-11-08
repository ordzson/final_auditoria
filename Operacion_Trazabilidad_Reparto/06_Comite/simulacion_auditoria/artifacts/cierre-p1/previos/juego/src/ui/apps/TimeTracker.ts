import type { ApplicationDefinition } from '../../computer/types';
import { mountRecordBrowser } from './RecordBrowser';

export const timeTracker: ApplicationDefinition<'time-tracker'> = {
  id: 'time-tracker', title: 'Visor de seguimiento y relojes', icon: 'time', minSize: { width: 410, height: 310 },
  mount(container, context) {
    return mountRecordBrowser(container, context, {
      title: 'Atención y procedencia temporal', icon: 'time',
      introduction: 'Revisa el seguimiento disponible y la vista de relojes. Las horas son reportadas: un desfase no verificado no equivale a cero.',
      sourceIds: ['E-07', 'META-TIEMPO', 'EVT-02', 'EVT-08'],
    });
  },
};
