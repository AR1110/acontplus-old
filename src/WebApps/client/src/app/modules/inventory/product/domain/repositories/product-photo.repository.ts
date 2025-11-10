import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ProductPhotoSaveParam } from '@inventory/product/domain/entities/product-photo.model';

export abstract class ProductPhotoRepository {
  abstract post(obj: ProductPhotoSaveParam): Observable<ApiResponseLegacy>;
  abstract put(obj: ProductPhotoSaveParam): Observable<ApiResponseLegacy>;
  abstract getByProductId(productId: number): Observable<
    ApiResponseLegacy<{
      productPhotos: any[];
    }>
  >;
  abstract setDefault(id: number, isDefault: boolean): Observable<ApiResponseLegacy>;
  abstract putStatus(id: number): Observable<ApiResponseLegacy>;
}
