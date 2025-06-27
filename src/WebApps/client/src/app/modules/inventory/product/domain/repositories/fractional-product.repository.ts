import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import {FractionalProductDataGetId, FractionalProductDataSave} from "@inventory/product/domain/entities/fractional-product.model";

export abstract class FractionalProductRepository {
  abstract getAll<T>(obj: T): Observable<any>;
  abstract getId(params: number): Observable<ApiResponse<FractionalProductDataGetId>>;
  abstract post(obj: FractionalProductDataSave): Observable<ApiResponse>;
  abstract put(obj: FractionalProductDataSave): Observable<ApiResponse>;
  // abstract getId(id:number): Observable<ApiResponse>;
}


