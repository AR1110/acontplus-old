import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { AsignacionEstabList } from '@modules/config/domain/models/user-customer/asignacion-estab.model';
import {
  AsignacionPuntoEmisionList,
  AsignacionPuntoEmisionResponse,
} from '@modules/config/domain/models/user-customer/asignacion-punto-emision.model';

export abstract class AsignacionPuntoEmisionRepository {
  abstract list(
    parameters: Partial<AsignacionPuntoEmisionList>,
  ): Observable<AsignacionPuntoEmisionResponse>;
  abstract create<T>(parameters: T): Observable<ApiResponse>;
  abstract update(parameters: Partial<AsignacionEstabList>): Observable<ApiResponse>;
}
