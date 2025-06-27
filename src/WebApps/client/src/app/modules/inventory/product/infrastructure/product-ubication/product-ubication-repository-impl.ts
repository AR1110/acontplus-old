import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse } from "@core/models/api-response";
import { Observable} from "rxjs";
import {INVENTORY_PATHS} from "@inventory/domain/enums/inventory.enum";
import {ProductUbicationRepository} from "@inventory/product/domain/repositories/product-ubication.repository";



@Injectable({
  providedIn: 'root'
})
export class ProductUbicationRepositoryImpl implements ProductUbicationRepository{

  private _url =   `${PATHS_API.INVENTORY}${INVENTORY_PATHS.PRODUCT_UBICATION}`;
  private _http = inject(HttpClient);

   post<T>(obj: T)  {
     const paramsJson = JSON.stringify(obj)
    return  this._http.post<ApiResponse>(`${this._url}/?json=${paramsJson}`, null)
  }
   put<T>(id: number, obj: T): Observable<ApiResponse> {
     const paramsJson = JSON.stringify(obj)
     return  this._http.put<ApiResponse>(`${this._url}/${id}?json=${paramsJson}`, null)

   }
    remove (id: number): Observable<ApiResponse> {
      return  this._http.delete<ApiResponse>(`${this._url}/${id}`)
  }

}
