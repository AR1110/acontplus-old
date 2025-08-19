import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { groupEstabUtil } from "@core/utils/group-estab.util";
import { INVENTORY_PATHS } from "@inventory/domain/enums/inventory.enum";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TransactionService {
  #url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.TRANSACTION}`;
  #http = inject(HttpClient)
  getDataFilter() {
    const json = JSON.stringify({
      tipo: 3
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        return {
          estabs: groupEstabUtil({
            bodegas: response.bodegas,
            isGroupBodega: true
          }),
          tiposTransaccion: response.tipoTransaccion
        }
      })
    )
  }


  getDataKardex<T>(obj: T) {
    const json = JSON.stringify({ ...obj, tipo: 2 })

    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => {
        return {
          dataArticulo: response.dataArticulo[0],
          kardex: response.kardex
        }

      }))
  }
}
