import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface SubcategoryPhotoRepository {
  post(subcategoryId: number, file: Blob): Observable<ApiResponseLegacy>;
  put<T>(obj: T, id: number, file: Blob): Observable<ApiResponseLegacy>;
}
