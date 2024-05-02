import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { BILLING_PATHS } from '../enums/billing.enum.ts';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  #url = `${PATHS_API.BILLING}${BILLING_PATHS.INVOICE}`
  #http = inject(HttpClient)


  post<T>(data: T) {
    return this.#http.post(`${this.#url}Insert`, { data })
  }
}
