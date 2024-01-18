import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SriCustomerService {
  //FROM REGISTRO CIVIL DATA
  url = `${PATHS_API.CUSTOMER}Consultas/`

  constructor(private http: HttpClient) { }

  async getCedula(idCard: string) {
    return this.http.get(`${this.url}GetCedulaSri/?Ruc=${idCard}`).pipe(map((response) => response))
  }

  async getRuc(idCard: string) {
    return this.http.get(`${this.url}GetRucSRI/?Ruc=${idCard}`).pipe(map((response) => response));
  }
}
