import {inject, Injectable} from '@angular/core';
import {PATHS, PATHS_API} from "@core/constants/global.constants";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  #url = `${PATHS_API.COMMON}${PATHS.APP_NOTIFICATION }`

  #http = inject(HttpClient)


  post<T>(data:T){
    let json = JSON.stringify(data)
    return this.#http.post<ApiResponse>(`${this.#url}?json=${json}`,'')


  }

}
