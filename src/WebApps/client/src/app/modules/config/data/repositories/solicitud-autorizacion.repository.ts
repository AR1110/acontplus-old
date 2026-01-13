import { Observable } from 'rxjs';
import {
  SolicitudAutorizacionDetalleList,
  SolicitudAutorizacionFilterResponse,
  SolicitudAutorizacionList,
  SolicitudAutorizacionResponse,
  SolicitudAutorizacionUpdateParams,
} from '@modules/config/data/models/solicitud-autorizacion.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface SolicitudAutorizacionRepository {
  filter(): Observable<SolicitudAutorizacionFilterResponse>;
  list<T>(parameters: T): Observable<SolicitudAutorizacionResponse>;
  listDetalle(
    parameters: Partial<SolicitudAutorizacionList>,
  ): Observable<SolicitudAutorizacionDetalleList[]>;
  update(parameters: SolicitudAutorizacionUpdateParams): Observable<ApiResponseLegacy>;
}
