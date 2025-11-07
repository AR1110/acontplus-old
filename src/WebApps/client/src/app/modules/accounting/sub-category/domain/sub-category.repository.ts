import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class SubCategoryRepository {
  abstract getAll<T>(obj: T): Observable<any[]>;
  abstract getDataForm(): Observable<{ categories: any[] }>;
  abstract create<T>(data: T): Observable<ApiResponseLegacy>;
  abstract update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
  abstract delete(id: number): Observable<ApiResponseLegacy>;
}
