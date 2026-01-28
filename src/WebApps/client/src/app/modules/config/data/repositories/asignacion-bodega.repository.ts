import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  AsignacionBodegaList,
  AsignacionBodegaResponse,
} from '@modules/config/data/models/user/asignacion-bodega.model';

export abstract class AsignacionBodegaRepository {
  abstract list(parameters: Partial<AsignacionBodegaList>): Observable<AsignacionBodegaResponse>;
  abstract create(parameters: Partial<AsignacionBodegaList>): Observable<ApiResponseLegacy>;
  abstract update(parameters: Partial<AsignacionBodegaList>): Observable<ApiResponseLegacy>;
}
