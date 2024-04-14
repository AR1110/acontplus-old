import { TECH_SUPPORT_PATHS } from './../constants/tech-support.constants';
import { PATHS_API } from '@core/constants/global.constants';

import { inject, Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderMaintenanceService {

  #url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.ORDER_MAINTENANCE}`;
  #http = inject(HttpClient)

  post<T>(data: T) {
    return this.#http.post(`${this.#url}`, { data: data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }



}
