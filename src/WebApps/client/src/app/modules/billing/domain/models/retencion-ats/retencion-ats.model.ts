import { RetAtsDocSustento } from '@billing/domain/models/retencion-ats/ret-ats-doc-sustento.model';

export interface RetencionAts {
  idRetencionAts: number;
  idDocumentoElectronico: number;
  codEstab?: string;
  versionComp?: string;
  documentosSustento?: string;
  infoAdicional?: string;
}

export interface RetencionAtsList
  extends Pick<
    RetencionAts,
    | 'idRetencionAts'
    | 'idDocumentoElectronico'
    | 'codEstab'
    | 'documentosSustento'
  > {
  isAutomatic: boolean;
  codEstado: string;
  estado: string;
  emailReceptor?: string;
  totalRecords?: number;
}

export interface RetAtsInfoAdicional
  extends Pick<RetencionAts, 'idRetencionAts'> {
  idRetAtsInfoAdicional: number;
  nombre: string;
  valor: string;
}
