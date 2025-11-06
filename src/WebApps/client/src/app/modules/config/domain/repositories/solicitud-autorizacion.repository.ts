import { Observable } from 'rxjs';
import {
  SolicitudAutorizacionDetalle,
  SolicitudAutorizacionFilterResponse,
  SolicitudAutorizacionList,
  SolicitudAutorizacionResponse,
  SolicitudAutorizacionUpdateParams,
} from '@modules/config/domain/models/solicitud-autorizacion.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class SolicitudAutorizacionRepository {
  abstract filter(): Observable<SolicitudAutorizacionFilterResponse>;
  abstract list<T>(parameters: T): Observable<SolicitudAutorizacionResponse>;
  abstract listDetalle(
    parameters: Partial<SolicitudAutorizacionList>,
  ): Observable<SolicitudAutorizacionDetalle[]>;
  abstract update(parameters: SolicitudAutorizacionUpdateParams): Observable<ApiResponseLegacy>;
}
