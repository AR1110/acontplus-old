import { Observable } from 'rxjs';
import { UserDataForm } from '@modules/config/data/models/user/user.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  AsignacionEstabList,
  AsignacionEstabResponse,
} from '@modules/config/data/models/user/asignacion-estab.model';

export abstract class AsignacionEstabRepository {
  abstract list<T>(parameters: T): Observable<AsignacionEstabResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponseLegacy>;
  abstract update(parameters: Partial<AsignacionEstabList>): Observable<ApiResponseLegacy>;
}
