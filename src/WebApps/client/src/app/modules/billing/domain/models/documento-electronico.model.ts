export interface DocumentoElectronico {
  idDocumentoElectronico: number;
  codDoc: string;
  comprobante: string;
  serieComprobante: string;
  rucReceptor: string;
  razonSocialReceptor: string;
  fechaEmision: string;
  claveAcceso: string;
  fechaAutorizacion: string;
  estado?: string;
  codEstado: string;
  versionComp: string;
  usuario?: string;
  codEstab: string;
  totalRecords?: number;
  idDocumento: number;
  idPuntoEmision: number;
  idEstablecimiento: number;
}