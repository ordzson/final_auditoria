import { accountDirectory } from '../ui/apps/AccountDirectory';
import { backupManager } from '../ui/apps/BackupManager';
import { changeManager } from '../ui/apps/ChangeManager';
import { clockComparator } from '../ui/apps/ClockComparator';
import { eventDesk } from '../ui/apps/EventDesk';
import { fileExplorer } from '../ui/apps/FileExplorer';
import { localDossier } from '../ui/apps/LocalDossier';
import { networkMonitor } from '../ui/apps/NetworkMonitor';
import { orderHistory } from '../ui/apps/OrderHistory';
import { queryStudio } from '../ui/apps/QueryStudio';
import { recoveryConsole } from '../ui/apps/RecoveryConsole';
import { sessionViewer } from '../ui/apps/SessionViewer';
import { stationReport } from '../ui/apps/StationReport';
import { timeTracker } from '../ui/apps/TimeTracker';
import type { ApplicationRegistry, ComputerDefinition } from './types';

const applications: ApplicationRegistry = {
  'session-viewer': sessionViewer,
  'account-directory': accountDirectory,
  'query-studio': queryStudio,
  'network-monitor': networkMonitor,
  'order-history': orderHistory,
  'change-manager': changeManager,
  'event-desk': eventDesk,
  'time-tracker': timeTracker,
  'recovery-console': recoveryConsole,
  'backup-manager': backupManager,
  'file-explorer': fileExplorer,
  'clock-comparator': clockComparator,
  'station-report': stationReport,
  'local-dossier': localDossier,
};

/** Solo expone programas implementados e instalados en la computadora solicitada. */
export function registryForComputer(computer: ComputerDefinition): ApplicationRegistry {
  return Object.fromEntries(computer.installedApps
    .filter((id) => applications[id])
    .map((id) => [id, applications[id]]));
}
