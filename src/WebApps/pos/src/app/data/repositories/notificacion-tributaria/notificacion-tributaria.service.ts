import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {PATHS, PATHS_API } from '@domain/enums/main.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificacionTributariaService {
  #url = `${PATHS_API.BILLING}${PATHS.NOTIFICACION_TRIBUTARIA}`
  #http = inject(HttpClient)


  post<T>(data:T){
    return this.#http.post(`${this.#url}`, data)
  }
}
