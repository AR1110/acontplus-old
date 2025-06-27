
import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";
import {ProductPhotoSaveParam} from "@inventory/product/domain/entities/product-photo.model";


export abstract class ProductPhotoRepository {
  abstract post (obj:ProductPhotoSaveParam): Observable<ApiResponse>;
  abstract put(obj:ProductPhotoSaveParam): Observable<ApiResponse>;
  abstract getByProductId(productId: number): Observable<ApiResponse<{
    productPhotos: any[]
  }>>;
  abstract setDefault(id: number, isDefault: boolean): Observable<ApiResponse>;
  abstract putStatus(id: number ): Observable<ApiResponse>;
}
