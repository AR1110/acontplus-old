import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { SALE_PATHS } from '../enums/sale.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotaEntregaService {
  #url = `${PATHS_API.SALES}${SALE_PATHS.NOTA_ENTREGA}`;
  #http = inject(HttpClient);

  post<T>(data: T) {

    return this.#http.post(`${this.#url}Insert`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put(`${this.#url}${id}`, { data })
  }

}
