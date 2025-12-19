import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SubCategoryListDto } from '@inventory/domain/models/sub-category.model';

export interface SubCategoryRepository {
  getAll<T>(data: T): Observable<SubCategoryListDto[]>;
  post<T>(obj: T, file: Blob | string): Observable<ApiResponseLegacy>;
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
  updateStatus(id: number): Observable<ApiResponseLegacy>;
}
