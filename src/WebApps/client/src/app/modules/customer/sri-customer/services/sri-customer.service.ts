import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SriCustomerService {
  //FROM REGISTRO CIVIL DATA
  url = `${PATHS_API.CUSTOMER}Consultas/`;

  constructor(private http: HttpClient) {}

  async get(codigo: string, id: string) {
    let path;
    if (codigo == '04') {
      path = 'GetCedulaSri/';
    } else {
      path = 'GetCedulaSri/';
    }
    return this.http
      .get(`${this.url}${path}?Ruc=${id}`)
      .pipe(map((response) => response));
  }
}
