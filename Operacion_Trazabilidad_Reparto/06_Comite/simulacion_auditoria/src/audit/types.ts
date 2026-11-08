export type StationId = 'accesos' | 'sql_red' | 'crm_cambios' | 'siem' | 'respaldos' | 'mesa_auditor';
export type ReviewId = 'AU-01' | 'AU-02' | 'AU-03' | 'AU-04' | 'AU-05' | 'AU-06';

export type SourceRef = {
  sourceId: string;
  sourceVersion: string;
  rowId?: string;
};

export type CheckAnswer = {
  checkId: string;
  answerId: string;
  sourceRefs: SourceRef[];
};

export type Assessment = {
  reviewId: ReviewId;
  rulesVersion: string;
  sourceRefs: SourceRef[];
  checkAnswers: CheckAnswer[];
  conclusionId: string | null;
  limitationIds: string[];
  requestIds: string[];
  freeNote: string;
};

export type ReviewStatus = 'Pendiente' | 'Fuentes reunidas' | 'Por contrastar' | 'Documentado';

export type Evaluation = {
  status: ReviewStatus;
  isDocumented: boolean;
  missingReasons: string[];
  gatheredGroups: number;
  totalGroups: number;
};

export type PlayerPose = {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
};

export type Settings = {
  projector: boolean;
  reducedMotion: boolean;
  audioEnabled: boolean;
  sensitivity: number;
  flatMode: boolean;
};

export type Recommendation = {
  deadline?: string;
  action: string;
  owner: string;
  verification: string;
};

export type GameState = {
  schemaVersion: 2;
  contentVersion: string;
  rulesVersion: string;
  assessments: Record<ReviewId, Assessment>;
  inspected: SourceRef[];
  clipboardReceived: boolean;
  pose: PlayerPose;
  settings: Settings;
  recommendations: Record<ReviewId, Recommendation>;
  hintLevels: Record<ReviewId, number>;
  introSeen: boolean;
};
