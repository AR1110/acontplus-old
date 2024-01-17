import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { ACCOUNTING_PATHS } from "../constants/accounting.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { isApiResponse } from "@core/models/api-response";



@Injectable({
  providedIn: 'root'
})

export class AnticipoService {
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.ANTICIPO}`
  http = inject(HttpClient)

  getAll<T>(data: T) {
    let params = JSON.stringify({ ...data, tipo: 1 })
    return this.http.get(`${this.url}?json=${params}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {
            console.log(response)
          }
        })
      )
  }

}
