import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '../enums/inventory.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {
  #url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MEASURE}`
  #http = inject(HttpClient)
  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj, tipo: 1
    })
    return this.#http.get(`${this.#url}?json=${JSON.stringify(json)}`)
  }
}
