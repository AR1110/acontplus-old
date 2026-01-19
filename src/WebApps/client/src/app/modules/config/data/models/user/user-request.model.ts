export interface UserRequest {
  rowguid: string;
  idSolicitud: number;
  tipoDoc: string;
  serieComprobante: string;
  usuarioAprobante: string;
  usuarioSolicitante: string;
  codigoAccion: string;
  accionDescripcion: string;
  codEstado: 'A' | 'P' | 'F';
  estadoDescripcion: string;
  observacion: string;
  fechaRegistro: string;
  fechaAprobacion: string | null;
  codRol: string;
}
