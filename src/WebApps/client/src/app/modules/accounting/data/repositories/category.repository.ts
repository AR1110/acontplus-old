import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export interface CategoryRepository {
   get<T>(params: T): Observable<any>;
   delete(id: number): Observable<ApiResponseLegacy>;
   post<T>(data: T): Observable<ApiResponseLegacy>;
   put<T>(id: number, data: T): Observable<ApiResponseLegacy>;
}
