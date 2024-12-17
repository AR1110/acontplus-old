import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/core/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "@core/models/api-response";
import {map} from "rxjs";
import {SubCategoryMapper} from "@accounting/data/sub-category/sub-category.mapper";
import {SubCategoryRepository} from "@accounting/core/repositories/sub-category.repository";
import {ControlCajaRepository} from "@accounting/core/repositories/control-caja.repository";


@Injectable({
  providedIn: 'root'
})
export class ControlCajaWebRepository extends ControlCajaRepository{

  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CONTROL_CAJA}`
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  getAll<T>(params: T) {
    let json = JSON.stringify({ ...params, tipo: 1 })
    return this._http.get(`${this._url}?json=${json}`)
  }

  getDataFilter() {
    let json = JSON.stringify({ tipo: 5 })
    return this._http.get(`${this._url}?json=${json}`)
      .pipe(
        map((response:any) => {
          const {estadoPago} = response;
          return {
            estados: estadoPago
          }
        })
      )
  }


  getDataForm() {
    let json = JSON.stringify({ tipo: 2 })
    return this._http.get(`${this._url}?json=${json}`)
  }


  getArqueoCaja(id: number) {
    let json = JSON.stringify({id, tipo: 8 })
    return this._http.get(`${this._url}?json=${json}`)
  }

  getDataFormCashboxClose() {
    let json = JSON.stringify({ tipo: 3 })
    return this._http.get(`${this._url}?json=${json}`)
  }


  post<T>(data: T) {
    return this._http.post<ApiResponse>(`${this._url}`, { data });
  }

  put<T>(id: number, data: T) {
    return this._http.put<ApiResponse>(`${this._url}${id}`, { data });
  }


}
