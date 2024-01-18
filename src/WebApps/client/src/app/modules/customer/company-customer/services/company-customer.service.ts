import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { isApiResponse } from '@core/models/api-response';
import { CompanyCustomerSearch } from '@modules/customer/company-customer/models/company-customer';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyCustomerService {
  //For customers of Acontplus Customers (cliente)
  url = `${PATHS_API.CUSTOMER}CompanyCustomer/`
  constructor(private http: HttpClient) { }

  checkExistence(params: any) {
    return this.http.get(`${this.url}?json=${JSON.stringify({ ...params, tipo: 3 })}`).pipe(map((response) => response))
  }

  get(params: any) {
    return this.http.get(`${this.url}?json=${JSON.stringify({ ...params, tipo: 1 })}`).pipe(map((response: any) => response))
  }

  getById(id: number) {
    return this.http.get(this.url + id).pipe(map((response) => response))
  }

  getDataForm() {
    return this.http.get(this.url + '?json=' + JSON.stringify({ tipo: 2 })).pipe(map((response) => response))
  }

  post(data: any) {
    return this.http.post(this.url, data).pipe(map((response) => response))
  }

  put(id: number, data: any) {
    return this.http.put(this.url + id, data).pipe(map((response) => response))
  }

  search<T extends { textSearch: string }>(data: T): Observable<Array<CompanyCustomerSearch>> {
    let query = {
      textSearch: data.textSearch,
    }
    return this.http.get(`${this.url}Search?json=${JSON.stringify(query)}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {
            let customers = response.payload && JSON.parse(response.payload as string) || [];
            return customers || [];
          }
          return []
        })
      )
  }
}
