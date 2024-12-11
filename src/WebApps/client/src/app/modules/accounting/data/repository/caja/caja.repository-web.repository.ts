import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/core/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {CajaMapper} from "@accounting/data/repository/caja/caja.mapper";
import {CajaRepository} from "@accounting/core/repositories/caja.repository";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root',
})
export class CajaWebRepository extends CajaRepository{
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CASHBOX}`
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  getAll<T>(params: T) {
    let json = JSON.stringify({ ...params, tipo: 1 })
    return this._http.get(`${this._url}?json=${json}`).pipe(
      map((res)=>{

       return CajaMapper.fromApiGetAll(res)
      })
    )
  }

  getId(id: number) {
    let paramsStr = JSON.stringify({ id, tipo: 3 })
    return this._http.get(`${this._url}?json=${paramsStr}`)
      .pipe(
        map((response) => {
          if (response) {
            let { caja, asignaciones } = response as { caja: any, asignaciones: Array<any> }


            return {
              caja: caja[0],
              asignaciones
            };
          }
          return {
            caja: {},
            asignaciones: []
          }
        })
      )
  }

  getDataForm() {
    let json = JSON.stringify({ tipo: 2 })
    return this._http.get(`${this._url}?json=${json}`)
  }


  create<T>(data: T) {
    return this._http.post<ApiResponse>(`${this._url}`, { data });
  }

  update<T>(id: number, data: T) {
    return this._http.put<ApiResponse>(`${this._url}${id}`, { data });
  }

  delete(id: number) {
    return this._http.delete<ApiResponse>(`${this._url}${id}`);
  }


}
