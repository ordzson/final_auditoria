import type { ApplicationDefinition } from '../../computer/types';
import { mountRecordBrowser } from './RecordBrowser';

export const localDossier: ApplicationDefinition<'local-dossier'> = {
  id: 'local-dossier', title: 'Expediente local', icon: 'folder', minSize: { width: 410, height: 310 },
  mount(container, context) {
    return mountRecordBrowser(container, context, {
      title: 'Material del puesto', icon: 'folder',
      introduction: 'Registros y soportes de esta computadora. Las declaraciones aparecen cuando se obtienen a través del enlace de TI; ningún original ausente se crea al consultarlas.',
    });
  },
};
