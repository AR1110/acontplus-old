import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/core/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SubEntidadFinancieraRepositoryImpl {
 private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.SUB_ENTIDAD_FINANCIERA}`;
 private _http = inject(HttpClient);

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
    return this._http.post(`${this._url}`, { data })
  }

  update<T>(id: number, data: T) {
    return this._http.put(`${this._url}${id}`, { data })
  }


  delete(id: number) {
    return this._http.delete(`${this._url}${id}`)
  }


}
