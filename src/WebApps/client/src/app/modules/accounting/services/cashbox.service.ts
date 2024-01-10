import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { ACCOUNTING_PATHS } from "../constants/accounting.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class CashboxService {

  url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CASHBOX}`

  constructor(
    private http: HttpClient
  ) { }


  getAll<T>(params: T) {
    let paramsStr = JSON.stringify({ ...params, tipo: 1 })
    return this.http.get(`${this.url}?json=${paramsStr}`)
  }

  getDataForm() {
    console.log("test ")
    let paramsStr = JSON.stringify({ tipo: 2 })
    return this.http.get(`${this.url}?json=${paramsStr}`)
      .pipe(
        map((response) => {  
          return response;
        }) 
      )
  }


  save<T>(data: T) {
    return this.http.post(`${this.url}`, {data});
  }

  update<T>(id: number, data: T) {
    return this.http.put(`${this.url}${id}`, {data});
  }

  delete(id: number) {
    return this.http.delete(`${this.url}${id}`);
  }

}