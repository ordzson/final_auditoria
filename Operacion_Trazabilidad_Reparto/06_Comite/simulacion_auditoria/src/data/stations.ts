import type { ReviewId, StationId } from '../audit/types';

export type StationDefinition = {
  id: StationId;
  short: string;
  title: string;
  reviewId: ReviewId;
  sourceIds: string[];
  description: string;
};

export const stations: StationDefinition[] = [
  {
    id: 'accesos', short: 'A', title: 'Accesos e identidad', reviewId: 'AU-01',
    sourceIds: ['E-01', 'E-02', 'EVT-01', 'EVT-02', 'EVT-03', 'EVT-04'],
    description: 'Cuentas, sesión remota y elevación registrada. La cuenta no identifica por sí sola a una persona.',
  },
  {
    id: 'sql_red', short: 'B', title: 'SQL y red', reviewId: 'AU-02',
    sourceIds: ['E-03', 'E-04', 'EVT-02', 'EVT-03', 'EVT-04', 'EVT-05'],
    description: 'Resúmenes de lectura y transferencia. No hay una conexión a SQL Server ni resultados Q-xx ejecutados.',
  },
  {
    id: 'crm_cambios', short: 'C', title: 'CRM y cambios', reviewId: 'AU-03',
    sourceIds: ['E-05', 'E-06', 'EVT-05', 'EVT-06', 'EVT-07', 'EVT-08', 'EVT-13'],
    description: 'Órdenes, ticket y despliegue. Las declaraciones de BD y Desarrollo se solicitan al enlace de TI.',
  },
  {
    id: 'siem', short: 'D', title: 'SIEM y tiempo', reviewId: 'AU-04',
    sourceIds: ['E-07', 'EVT-02', 'EVT-03', 'EVT-08', 'EVT-09', 'META-TIEMPO'],
    description: 'Alerta, cronología preliminar y fiabilidad temporal. La ausencia de cierre no prueba ausencia de respuesta.',
  },
  {
    id: 'respaldos', short: 'E', title: 'Respaldo y recuperación', reviewId: 'AU-05',
    sourceIds: ['E-08', 'DECL-07', 'EVT-09', 'EVT-10', 'EVT-11', 'EVT-12', 'EVT-13'],
    description: 'Copia de revisión de respaldo y estados del CRM. No se ejecuta una restauración en esta estación.',
  },
  {
    id: 'mesa_auditor', short: 'F', title: 'Custodia y archivo', reviewId: 'AU-06',
    sourceIds: ['META-CUSTODIA', 'META-TIEMPO', 'E-09', 'E-10', 'EVT-01', 'EVT-02'],
    description: 'Procedencia, campos de custodia y tiempo. E-09 y E-10 se consultan como contexto, sin minijuegos adicionales.',
  },
];

export const stationById = (id: StationId) => stations.find((station) => station.id === id)!;
export const stationForReview = (reviewId: ReviewId) => stations.find((station) => station.reviewId === reviewId)!;
