import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  FractionalProductDataGetId,
  FractionalProductDataSave,
} from '@inventory/product/domain/entities/fractional-product.model';

export abstract class FractionalProductRepository {
  abstract getAll<T>(obj: T): Observable<any>;
  abstract getId(params: number): Observable<ApiResponseLegacy<FractionalProductDataGetId>>;
  abstract post(obj: FractionalProductDataSave): Observable<ApiResponseLegacy>;
  abstract put(obj: FractionalProductDataSave): Observable<ApiResponseLegacy>;
  // abstract getId(id:number): Observable<ApiResponseLegacy>;
}
