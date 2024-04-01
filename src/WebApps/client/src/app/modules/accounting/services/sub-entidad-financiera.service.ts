
import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { ACCOUNTING_PATHS } from "../constants/accounting.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubEntidadFinancieraService {
  #url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.SUB_ENTIDAD_FINANCIERA}`;
  #http = inject(HttpClient);

  getAll() {
    let json = JSON.stringify({ tipo: 1 });
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        console.log(response)
        return {
          entidadesFinancieras: response.entidadesFinancieras,
          subEntidadesFinancieras: response.subEntidadesFinancieras
        }
      })
    )
  }

  post<T>(data: T) {
    return this.#http.post(`${this.#url}`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }


  delete(id: number) {
    return this.#http.delete(`${this.#url}${id}`)
  }

}
