import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {PATHS, PATHS_API } from '@/shared/enums/main.enum';

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
