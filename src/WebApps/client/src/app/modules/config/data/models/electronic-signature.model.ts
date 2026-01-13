export interface ElectronicSignatureList {
  index: number;
  idFirmaElectronica: number;
  nomEntidad: string;
  contrasenia: string;
  nombreArchivo: string;
  mimeType: string;
  fechaCaducidad: string;
  firma: string;
}

export class ElectronicSignatureListResponse {
  data: ElectronicSignatureList[] = [];
}

export interface ElectronicSignatureParam extends Pick<
  ElectronicSignatureList,
  'idFirmaElectronica' | 'contrasenia'
> {
  file?: File;
}
