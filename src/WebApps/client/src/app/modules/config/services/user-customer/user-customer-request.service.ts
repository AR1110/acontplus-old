import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { groupEstabUtil } from "@core/utils/group-estab.util";
import { CONFIG_PATHS } from "@modules/config/enums/config.enums";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserCustomerRequestService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_REQUEST}`;
  private http = inject(HttpClient)

  getDataFilter() {
    let json = JSON.stringify({
      tipo: 3
    })

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        if (response !== null && typeof response === 'object') {

          let estabs = groupEstabUtil({
            estabs: response.estabs,
            isGroupPuntoEmision: true
          })

          return {
            establecimientos: estabs,
            usersRole: response.usersRole
          }
        }

        return {
          establecimientos: [],
          usersRole: []
        }
      })
    )
  }

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 1
    })

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let requests = []
        if (response !== null && typeof response === 'object') {
          requests = response.requests;
        }
        return requests;
      })
    )
  }

  put<T>(data: T) {
    return this.http.put(`${this.url}`, { data })
  }

}
