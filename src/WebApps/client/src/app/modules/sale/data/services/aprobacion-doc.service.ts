import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { SALE_PATHS } from '@sale/domain/enums/sale.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AprobacionDocService {
  #url = `${PATHS_API.SALES}${SALE_PATHS.APROBACION_DOC}`
  #http = inject(HttpClient);


  post<T>(obj: T) {
    return this.#http.post(`${this.#url}`, { data: obj })
  }

}
