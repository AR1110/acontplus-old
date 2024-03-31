import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CONFIG_PATHS } from "../enums/config.enums";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserCustomerService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER}`;
  private http = inject(HttpClient)

  getAll<T>(data: T) {
    let json = JSON.stringify({
      ...data,
      tipo: 1
    })
    return this.http.get(`${this.url}?json=${json}`)
  }
}
