import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  //All Customers (Customer)
  url = `${PATHS_API.CUSTOMER}Customers`
  constructor(private http: HttpClient) { }

  get(params: any) {
    return this.http.get(`${this.url}?json=${JSON.stringify({ ...params })}`).pipe(map((response: any) => response))
  }

  getById(id: number) {
    return this.http.get(this.url + id).pipe(map((response) => response))
  }

  post(data: any) {
    return this.http.post(this.url, data).pipe(map((response) => response))
  }

  put(id: number, data: any) {
    return this.http.put(this.url + id, data).pipe(map((response) => response))
  }
}
