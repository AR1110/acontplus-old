
import {Observable} from "rxjs";
import {
  GetProductPurchaseResult,
  ProductDataForm,
  ProductGetIdResult
} from "@inventory/product/domain/entities/product.entity";
import {ApiResponse} from "@core/models/api-response";


export abstract class ProductRepository {
  abstract getAll<T>(obj:T): Observable<any>
  abstract getDataFilter ( ): Observable<any>
  abstract getDataForm ( ): Observable<ProductDataForm>
  abstract updateStatus(id: number): Observable<any>
  abstract search<T extends { textSearch: string, pageIndex?: number, pageSize?: number }>(obj:T): Observable<any>
  abstract getForSale(id: number): Observable<any>
  abstract getForPurchase(id: number): Observable<GetProductPurchaseResult>
  abstract checkNotificationStock<T extends {
    idArticulo: number
    cantidad: number
    idBodega: number
    idMedida: number
  }>(obj:T): Observable<any>;
  abstract getDataReport ( ): Observable<any>;
  abstract post<T>(obj:T, file?:Blob): Observable<ApiResponse>;
  abstract put<T>(id:number, obj:T): Observable<ApiResponse>;
  abstract getId(id:number): Observable<ProductGetIdResult>;
  abstract listProductWithPrices(params:any): Observable<any>;
}
