export interface RetencionAts {
  idRetencionAts: number;
  idDocumentoElectronico: number;
}

export interface RetencionAtsList
  extends Pick<RetencionAts, 'idRetencionAts' | 'idDocumentoElectronico'> {
  isAutomatic: boolean;
  codEstado: string;
  estado: string;
  totalRecords: number;
}

export interface RetAtsInfoAdicional
  extends Pick<RetencionAts, 'idRetencionAts'> {
  idRetAtsInfoAdicional: number;
  nombre: string;
  valor: string;
}
