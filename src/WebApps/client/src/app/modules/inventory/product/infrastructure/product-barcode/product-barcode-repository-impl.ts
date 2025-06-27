import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse } from "@core/models/api-response";
import { Observable} from "rxjs";
import {INVENTORY_PATHS} from "@inventory/domain/enums/inventory.enum";
import {ProductBarcodeRepository} from "@inventory/product/domain/repositories/product-barcode.repository";



@Injectable({
  providedIn: 'root'
})
export class ProductBarcodeRepositoryImpl implements ProductBarcodeRepository{

  private _url =   `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_BARCODE}`;
  private _http = inject(HttpClient);

   post<T>(obj: T)  {
    return  this._http.post<ApiResponse>(`${this._url} `, {data: obj})
  }
   put<T>(id: number, obj: T): Observable<ApiResponse> {
     return  this._http.put<ApiResponse>(`${this._url}/${id} `, {data: obj})

   }
    remove (id: number): Observable<ApiResponse> {
      return  this._http.delete<ApiResponse>(`${this._url}/${id}`)
  }

}
