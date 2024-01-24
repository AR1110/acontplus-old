import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { ACCOUNTING_PATHS } from "../constants/accounting.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { isApiResponse } from "@core/models/api-response";


@Injectable({
  providedIn: 'root'
})

export class CashboxService {

  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CASHBOX}`

  constructor(
    private http: HttpClient
  ) { }


  getAll<T>(params: T) {
    let paramsStr = JSON.stringify({ ...params, tipo: 1 })
    return this.http.get(`${this.url}?json=${paramsStr}`)
  }

  getId(id: number) {
    let paramsStr = JSON.stringify({ id, tipo: 3 })
    return this.http.get(`${this.url}?json=${paramsStr}`)
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
    let paramsStr = JSON.stringify({ tipo: 2 })
    return this.http.get(`${this.url}?json=${paramsStr}`)
      .pipe(
        map((response) => {
          return response;
        })
      )
  }


  save<T>(data: T) {
    return this.http.post(`${this.url}`, { data });
  }

  update<T>(id: number, data: T) {
    return this.http.put(`${this.url}${id}`, { data });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}`);
  }

}
