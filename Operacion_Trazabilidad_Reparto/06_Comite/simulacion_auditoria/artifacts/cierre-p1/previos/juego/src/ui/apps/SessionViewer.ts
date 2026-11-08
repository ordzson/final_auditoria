import type { ApplicationDefinition } from '../../computer/types';
import { mountRecordBrowser } from './RecordBrowser';

export const sessionViewer: ApplicationDefinition<'session-viewer'> = {
  id: 'session-viewer', title: 'Visor de sesiones', icon: 'sessions', minSize: { width: 410, height: 310 },
  mount(container, context) {
    return mountRecordBrowser(container, context, {
      title: 'Sesiones y privilegios', icon: 'sessions',
      introduction: 'Filtra por cuenta, sistema u hora y abre la sesión remota o la elevación. Una cuenta identifica actividad registrada, no a la persona que la utilizó.',
      sourceIds: ['EVT-02', 'EVT-03', 'EVT-04', 'E-02'],
    });
  },
};
