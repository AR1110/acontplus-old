import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';
import { GetFloorsByEstabIdResponse } from '@restaurant/data/models/floor.model';

export interface FloorRepository {
  remove(id: number): Observable<ApiResponseLegacy>;

  post<T>(obj: T): Observable<ApiResponseLegacy>;
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;

  getByEstablishmentId(establishmentId: number): Observable<GetFloorsByEstabIdResponse>;
  deleteById(id: number): Observable<ApiResponseLegacy>;
  create<T>(data: T): Observable<ApiResponseLegacy>;
  update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
}
