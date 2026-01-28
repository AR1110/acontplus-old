import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { GetFloorsByEstabIdResponse } from '@restaurant/data/models/floor.model';

export abstract class FloorRepository {
  abstract remove(id: number): Observable<ApiResponseLegacy>;

  abstract post<T>(obj: T): Observable<ApiResponseLegacy>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;

  abstract getByEstablishmentId(establishmentId: number): Observable<GetFloorsByEstabIdResponse>;
  abstract deleteById(id: number): Observable<ApiResponseLegacy>;
  abstract create<T>(data: T): Observable<ApiResponseLegacy>;
  abstract update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
}
