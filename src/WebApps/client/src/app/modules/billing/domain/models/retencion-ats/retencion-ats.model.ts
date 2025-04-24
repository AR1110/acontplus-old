export interface RetencionAts {
  idRetencionAts: number;
  idDocumentoElectronico: number;
  codEstab?: string;
  versionComp?: string;
}

export interface RetencionAtsList
  extends Pick<
    RetencionAts,
    'idRetencionAts' | 'idDocumentoElectronico' | 'codEstab'
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
