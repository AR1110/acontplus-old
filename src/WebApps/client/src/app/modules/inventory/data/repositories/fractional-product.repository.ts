import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  FractionalProductDataGetId,
  FractionalProductDataSave,
} from '@inventory/data/models/fractional-product.model';

export interface FractionalProductRepository {
   getAll<T>(obj: T): Observable<any>;
   getId(params: number): Observable<ApiResponseLegacy<FractionalProductDataGetId>>;
   post(obj: FractionalProductDataSave): Observable<ApiResponseLegacy>;
   put(obj: FractionalProductDataSave): Observable<ApiResponseLegacy>;
  // abstract getId(id:number): Observable<ApiResponseLegacy>;
}
