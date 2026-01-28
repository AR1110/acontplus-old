import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { AsignacionEstabList } from '@modules/config/data/models/user/asignacion-estab.model';
import {
  AsignacionPuntoEmisionList,
  AsignacionPuntoEmisionResponse,
} from '@modules/config/data/models/user/asignacion-punto-emision.model';

export abstract class AsignacionPuntoEmisionRepository {
  abstract list(
    parameters: Partial<AsignacionPuntoEmisionList>,
  ): Observable<AsignacionPuntoEmisionResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponseLegacy>;
  abstract update(parameters: Partial<AsignacionEstabList>): Observable<ApiResponseLegacy>;
}
