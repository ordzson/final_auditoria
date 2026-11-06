import type { AuditStore } from '../audit/store';
import type { Assessment, Evaluation, ReviewId, StationId } from '../audit/types';
import type { ComputerIconKey } from '../data/computerAssets';

// Contratos de la etapa 0. Implementaciones y ciclo de vida: docs/contratos-escritorios-pc.md.
export type AppId =
  | 'session-viewer' | 'account-directory'
  | 'query-studio' | 'network-monitor'
  | 'order-history' | 'change-manager'
  | 'event-desk' | 'time-tracker'
  | 'recovery-console' | 'backup-manager'
  | 'file-explorer' | 'clock-comparator'
  | 'station-report' | 'local-dossier';

export type Bounds = { x: number; y: number; width: number; height: number };
export type Point = { x: number; y: number };
export type ScrollPositions = Record<string, Point>;

export type RecordDraft = {
  search: string;
  selectedSourceId: string | null;
  scroll: ScrollPositions;
};

export type AppDrafts = {
  'session-viewer': RecordDraft;
  'account-directory': RecordDraft;
  'query-studio': RecordDraft & { query: string; lastExecutedQuery: string | null };
  'network-monitor': RecordDraft;
  'order-history': RecordDraft;
  'change-manager': RecordDraft;
  'event-desk': RecordDraft;
  'time-tracker': RecordDraft;
  'recovery-console': RecordDraft & { recoveryStep: number };
  'backup-manager': RecordDraft;
  'file-explorer': RecordDraft;
  'clock-comparator': RecordDraft;
  // El texto del informe vive en Assessment.freeNote, nunca en otro borrador.
  'station-report': { scroll: ScrollPositions };
  'local-dossier': RecordDraft;
};

export type WindowState = {
  open: boolean;
  minimized: boolean;
  mode: 'normal' | 'maximized';
  // Siempre la geometría normal, para restaurarla después de maximizar.
  bounds: Bounds;
};

export type ApplicationState<A extends AppId = AppId> = {
  window: WindowState;
  draft: AppDrafts[A];
};

export type PendingCheck = {
  answerId: string;
  // Selección explícita de sustento; no son referencias verificadas todavía.
  sourceIds: string[];
};

export type StationWorkspace = {
  apps: { [A in AppId]?: ApplicationState<A> };
  activeAppId: AppId | null;
  // De atrás hacia delante. Sin instancias duplicadas ni z-index persistido.
  windowOrder: AppId[];
  note: { position: Point; expandedTaskId: string | null };
  // Mesa común de esta PC para contrastar registros de dos aplicaciones.
  comparisonSourceIds: string[];
  // Clave checkId; solo respuestas pendientes por falta de sustento.
  pendingChecks: Record<string, PendingCheck>;
};

export type WorkspaceState = {
  schemaVersion: 1;
  stations: Partial<Record<StationId, StationWorkspace>>;
};

export type TaskCondition =
  | { kind: 'inspected'; sourceIds: readonly string[]; match: 'any' | 'all' }
  | { kind: 'linked'; sourceGroupIds: readonly string[] }
  | { kind: 'check-recorded'; checkId: string };

export type DesktopTask = {
  id: string;
  label: string;
  hint: string;
  condition: TaskCondition;
};

export type TaskProgress = {
  taskId: string;
  satisfied: boolean;
  label: 'Por consultar' | 'Fuente consultada' | 'Pista vinculada' | 'Contraste registrado';
};

export type ComputerDefinition = {
  stationId: StationId;
  reviewId: ReviewId;
  title: string;
  // Fondo/tema se resuelven por stationId en computerAssets, sin otra asignación.
  installedApps: readonly AppId[];
  shortcuts: readonly AppId[];
  initialWindows: readonly { appId: AppId; bounds: Bounds; mode: WindowState['mode'] }[];
  initialActiveAppId: AppId;
  note: { position: Point; tasks: readonly DesktopTask[] };
};

export type PersistenceChange =
  | 'inspection' | 'source' | 'check' | 'conclusion' | 'note' | 'recommendation' | 'interview'
  | 'settings' | 'pose' | 'layout' | 'draft' | 'reset';

// Señal de persistencia independiente de subscribe() y del estado académico v2.
export type PersistenceEvent = {
  domain: 'audit' | 'workspace';
  status: 'pending' | 'saved' | 'session-only';
  change: PersistenceChange;
  revision: number;
  reviewId?: ReviewId;
};

export type CheckSubmission =
  | { status: 'recorded' }
  | { status: 'draft'; missingSourceGroupIds: string[]; reason: string };

// Instancia ligada a una estación. Solo esta capa registra trabajo académico.
export interface ReviewBridge {
  getAssessment(): Readonly<Assessment>;
  getEvaluation(): Evaluation;
  // Lee el borrador pendiente para restaurar su elección en las aplicaciones.
  getPendingCheck(checkId: string): Readonly<PendingCheck> | null;
  inspect(sourceId: string): void;
  useSource(sourceId: string): void;
  answerCheck(checkId: string, answerId: string, sourceIds: readonly string[]): CheckSubmission;
  setConclusion(conclusionId: string | null): void;
  toggleLimitation(limitationId: string): void;
  toggleRequest(requestId: string): void;
  setFreeNote(text: string): void;
  // Vacía el debounce antes de ocultar/desmontar/navegar, sin perder la última frase.
  flush(): void;
  dispose(): void;
}

// Puerto acotado por estación: una aplicación no cambia ventanas de otra PC.
export interface ApplicationWorkspace<A extends AppId> {
  getDraft(): Readonly<AppDrafts[A]>;
  patchDraft(patch: Partial<AppDrafts[A]>): void;
  getComparison(): readonly string[];
  setComparison(sourceIds: readonly string[]): void;
  subscribe(listener: () => void): () => void;
  flush(): void;
}

export type ComputerNavigation = {
  openApp(appId: AppId): void;
  openNotebook(): void;
  openInterview(): void;
  exitToOffice(): void;
};

export type ApplicationContext<A extends AppId> = {
  stationId: StationId;
  reviewId: ReviewId;
  appId: A;
  store: AuditStore;
  workspace: ApplicationWorkspace<A>;
  review: ReviewBridge;
  navigation: ComputerNavigation;
};

export type MountedApplication = {
  focus(): void;
  flush(): void;
  dispose(): void;
};

export type ApplicationDefinition<A extends AppId> = {
  id: A;
  title: string;
  icon: ComputerIconKey;
  minSize: { width: number; height: number };
  mount(container: HTMLElement, context: ApplicationContext<A>): MountedApplication;
};

// Conserva la relación entre id, contexto y borrador al registrar cada aplicación.
export type ApplicationRegistry = { [A in AppId]?: ApplicationDefinition<A> };
