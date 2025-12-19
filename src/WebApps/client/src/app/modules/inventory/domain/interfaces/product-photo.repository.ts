import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ProductPhotoSaveParam } from '@inventory/domain/models/product-photo.model';

export interface ProductPhotoRepository {
  post(obj: ProductPhotoSaveParam): Observable<ApiResponseLegacy>;
  put(obj: ProductPhotoSaveParam): Observable<ApiResponseLegacy>;
  getByProductId(productId: number): Observable<
    ApiResponseLegacy<{
      productPhotos: unknown[];
    }>
  >;
  setDefault(id: number, isDefault: boolean): Observable<ApiResponseLegacy>;
  putStatus(id: number): Observable<ApiResponseLegacy>;
}
