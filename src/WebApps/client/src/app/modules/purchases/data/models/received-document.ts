export interface ReceivedDocument {
  idDocumento: number;
  idEstablecimiento: number;
  comprobante?: string;
  codDoc?: string;
  serieComprobante?: string;
  rucEmisor?: string;
  razonSocial?: string;
  fechaEmision?: string;
  fechaAutorizacion?: string;
  identificacionReceptor?: string;
  claveAccesso: string;
  importeTotal?: number;
  hasXml: boolean;
  complete: boolean;
  colorRow?: string;
  colorCol?: string;
  hoverText?: string;
  totalRecords?: number;
  subcategoryName?: string;
  subcategoryId?: number;
}
