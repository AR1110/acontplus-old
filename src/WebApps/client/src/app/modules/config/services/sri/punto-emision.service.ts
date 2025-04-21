import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';

@Injectable({
  providedIn: 'root'
})
export class PuntoEmisionService {
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.PUNTO_EMISION}`;
  #http = inject(HttpClient);


  post<T>(data: T) {
    return this.#http.post(`${this.#url}`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }

  annul(id: number) {
    return this.#http.delete(`${this.#url}${id}`)
  }

}
