import { Observable } from 'rxjs';
import {ApiResponse} from "@core/models/api-response";
import {
  AsignacionBodegaList,
  AsignacionBodegaResponse
} from "@modules/config/domain/models/user-customer/asignacion-bodega.model";

export abstract class AsignacionBodegaRepository {
  abstract list (parameters: Partial<AsignacionBodegaList>): Observable<AsignacionBodegaResponse>;
    abstract create(parameters: Partial<AsignacionBodegaList>): Observable<ApiResponse>;
   abstract update (parameters: Partial<AsignacionBodegaList>): Observable<ApiResponse>;
}
