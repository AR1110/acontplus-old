import {Product} from "@inventory/domain/models/product.model";
import {Observable} from "rxjs";


export abstract class ProductRepository {
  abstract getAll<T>(obj:T): Observable<any>
  abstract getDataFilter ( ): Observable<any>
  abstract getDataForm ( ): Observable<any>
  abstract updateStatus(id: number): Observable<any>
  abstract search<T extends { textSearch: string, pageIndex?: number, pageSize?: number }>(obj:T): Observable<any>
  abstract getForSale(id: number): Observable<any>
  abstract checkNotificationStock<T extends {
    idArticulo: number
    cantidad: number
    idBodega: number
    idMedida: number
  }>(obj:T): Observable<any>;
  abstract getDataReport ( ): Observable<any>;
}
