import { GroupedEstab } from '@core/models/estab.model';
import { UserCustomerRole } from '@modules/config/data/models/user-customer/user-customer-role.model';

export interface SolicitudAutorizacion {}

export interface SolicitudAutorizacionList extends SolicitudAutorizacion {
  rowguid: string;
  idSolicitudAutorizacion: number;
  usuarioAprobante: string;
  usuarioSolicitante: string;
  nomAdminRoles: string;
  codigoAccion: string;
  codigoEstado: 'A' | 'P' | 'F' | 'R';
  nombreAccion: string;
  nombreEstado: string;
  obs: string;
  fechaRegistro: string;
  fechaRespuesta: string | null;
  codigoModulo: string;
  nombreModulo: string;
  serieComprobante: string;
  totalRecords: string;
}

export interface SolicitudAutorizacionResponse {
  data: SolicitudAutorizacionList[];
  totalRecords: number;
}
export interface SolicitudAutorizacionFilterResponse {
  estabs: GroupedEstab[];
  usersRole: UserCustomerRole[];
}

export interface SolicitudAutorizacionDetalleList {
  index: number;
  nombre: string;
  valor: string;
  nuevoValor: string;
  obs: string;
}

export interface SolicitudAutorizacionUpdateParams
  extends Pick<SolicitudAutorizacionList, 'idSolicitudAutorizacion' | 'rowguid'> {
  tipo: number;
}
