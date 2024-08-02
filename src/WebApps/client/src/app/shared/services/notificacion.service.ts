import {inject, Injectable} from '@angular/core';
import {PATHS, PATHS_API} from "@core/constants/global.constants";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  #url = `${PATHS_API.COMMON}${PATHS.NOTIFICACION}`

  #http = inject(HttpClient)


  post<T>(data:T){
    let json = JSON.stringify(data)
    return this.#http.post(`${this.#url}?json=${json}`,'')
  }

}
