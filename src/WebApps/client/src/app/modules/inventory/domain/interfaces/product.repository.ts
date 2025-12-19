import { Observable } from 'rxjs';
import {
  GetProductEstabStockResult,
  GetProductPurchaseResult,
  ProductDataForm,
  ProductGetIdResult,
  ValidateProductStockParams,
} from '@inventory/domain/models/product.entity';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface ProductRepository {
   getAll<T>(obj: T): Observable<any>;
   getDataFilter(): Observable<any>;
   getDataForm(): Observable<ProductDataForm>;
   updateStatus(id: number): Observable<any>;
   search<T extends { textSearch: string; pageIndex?: number; pageSize?: number }>(
    obj: T,
  ): Observable<any>;
   getForSale(obj: { id?: number; search?: string }): Observable<any>;
   getForPurchase(id: number): Observable<GetProductPurchaseResult>;
  checkNotificationStock(params: ValidateProductStockParams): Observable<any>;
  getDataReport(): Observable<any>;
  post<T>(obj: T, file?: Blob): Observable<ApiResponseLegacy>;
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
  getId(id: number): Observable<ProductGetIdResult>;
  listProductWithPrices(params: any): Observable<any>;
  getEstabStock(id: number): Observable<GetProductEstabStockResult>;
}
