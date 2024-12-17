import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';

import { INVENTORY_PATHS } from '@inventory/core/enums/inventory.enum';
import { MeasureRead } from '../core/domain/measure.model';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ApiResponse } from '@core/models/api-response';

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
    return this.#http.get(`${this.#url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response:any)=>{
        let results: MeasureRead[] = []
        if(response!==null && typeof  response==='object'){
          results = response.measures;
        }
        return results;
      })
    )
  }


  post<T>(data: T) {
    return this.#http.post(`${this.#url}`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }

  updateStatus(id: number) {
    return this.#http.delete<ApiResponse>(`${this.#url}${id}`)
  }
}
