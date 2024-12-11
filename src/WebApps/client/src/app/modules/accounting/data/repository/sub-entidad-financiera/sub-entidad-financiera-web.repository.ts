import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/core/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {SubEntidadFinancieraRepository} from "@accounting/core/repositories/sub-entidad-financiera.repository";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root',
})
export class SubEntidadFinancieraWebRepository extends SubEntidadFinancieraRepository{
 private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.SUB_ENTIDAD_FINANCIERA}`;
 private _http = inject(HttpClient);

 constructor() {
   super();
 }

  getAll() {
    let json = JSON.stringify({ tipo: 1 });
    return this._http.get(`${this._url}?json=${json}`).pipe(
      map((response: any) => {
        return {
          entidadesFinancieras: response.entidadesFinancieras,
          subEntidadesFinancieras: response.subEntidadesFinancieras
        }
      })
    )
  }

  create<T>(data: T) {
    return this._http.post<ApiResponse>(`${this._url}`, { data })
  }

  update<T>(id: number, data: T) {
    return this._http.put<ApiResponse>(`${this._url}${id}`, { data })
  }


  delete(id: number) {
    return this._http.delete<ApiResponse>(`${this._url}${id}`)
  }


}
