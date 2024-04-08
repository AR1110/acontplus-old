
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/enums/config.enums';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentServiceService {
  #url = `${PATHS_API.CONFIG}${CONFIG_PATHS.ESTABLISHMENT}`
  #http =inject(HttpClient);

  constructor() { }

  getDataForm() {
    let json = JSON.stringify({
      tipo: 1
    })
    return this.#http.get(`${this.#url}?json=${json}`)
  }

  getAll<T>(obj: T){
    let json = JSON.stringify({
      tipo: 1
    })
    return this.#http.get(`${this.#url}?json=${json}`)
  }

  post<T>(data: T) {
    return this.#http.post(`${this.#url}`, {data})

   }
  put<T>(id:number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }

}
