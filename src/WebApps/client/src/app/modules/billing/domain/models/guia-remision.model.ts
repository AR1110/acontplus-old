import { GroupedEstab } from '@core/models/estab.model';
import {TipoDoc} from "@core/models/tipo-doc.model";

export class GuiasRemisionResponse {
  totalRecords = 0;
  data: GuiaRemisionList[] = [];
}

export interface GuiaRemisionList {
  idGuiaRemision: number;
  codEstab: string;
  fechaEmision: string;
  fechaInicio: string;
  fechaFin: string;
  claveAcceso: string;
  serieComprobante: string;
  razonSocialDestinatario: string;
  identificacionDestinatario: string;
  serieComprobanteInvoice: string;
  razonSocialTransportista: string;
  nomEstado: string;
  nomUsuario: string;
  statusStyle: string;
  totalRecords: string;
}

export interface GuiaRemisionDataForm {
  estabs: GroupedEstab[],
  tiposDoc: TipoDoc[],
  informacionesAdicionales: any[]
}

export interface GuiaRemisionFilterData {
  estabs: GroupedEstab[];
  estadosDoc: any[];
}
