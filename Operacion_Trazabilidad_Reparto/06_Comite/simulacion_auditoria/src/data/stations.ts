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
    id: 'sql_red', short: 'B', title: 'Lectura de datos y red', reviewId: 'AU-02',
    sourceIds: ['E-03', 'E-04', 'EVT-02', 'EVT-03', 'EVT-04', 'EVT-05'],
    description: 'Resúmenes de lectura y transferencia. El editor consulta resúmenes locales. Los resultados ficticios del laboratorio están en los anexos académicos.',
  },
  {
    id: 'crm_cambios', short: 'C', title: 'Órdenes y cambios', reviewId: 'AU-03',
    sourceIds: ['E-05', 'E-06', 'EVT-05', 'EVT-06', 'EVT-07', 'EVT-08', 'EVT-13'],
    description: 'Órdenes y autorización de instalación de software. Las declaraciones de base de datos y Desarrollo se solicitan al enlace de TI (tecnología de la información).',
  },
  {
    id: 'siem', short: 'D', title: 'Alertas y seguimiento', reviewId: 'AU-04',
    sourceIds: ['E-07', 'EVT-02', 'EVT-03', 'EVT-08', 'EVT-09', 'META-TIEMPO'],
    description: 'Alerta, cronología preliminar y fiabilidad temporal. La ausencia de cierre no prueba ausencia de respuesta.',
  },
  {
    id: 'respaldos', short: 'E', title: 'Respaldo y recuperación', reviewId: 'AU-05',
    sourceIds: ['E-08', 'DECL-07', 'EVT-09', 'EVT-10', 'EVT-11', 'EVT-12', 'EVT-13'],
    description: 'Copia de revisión de respaldo y estados del sistema comercial. No se ejecuta una restauración en esta estación.',
  },
  {
    id: 'mesa_auditor', short: 'F', title: 'Custodia y archivo', reviewId: 'AU-06',
    sourceIds: ['META-CUSTODIA', 'META-TIEMPO', 'E-09', 'E-10', 'EVT-01', 'EVT-02'],
    description: 'Procedencia, campos de custodia y tiempo. El contrato del proveedor y la clasificación por inteligencia artificial se consultan como contexto.',
  },
];

export const stationById = (id: StationId) => stations.find((station) => station.id === id)!;
export const stationForReview = (reviewId: ReviewId) => stations.find((station) => station.reviewId === reviewId)!;
