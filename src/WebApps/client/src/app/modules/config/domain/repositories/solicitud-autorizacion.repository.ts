import { Observable } from 'rxjs';
import {
  SolicitudAutorizacionFilterResponse,
  SolicitudAutorizacionResponse
} from "@modules/config/domain/models/solicitud-autorizacion.model";

export abstract class SolicitudAutorizacionRepository {
  abstract filter(): Observable<SolicitudAutorizacionFilterResponse>;
  abstract list<T>(parameters: T): Observable<SolicitudAutorizacionResponse>;

}
