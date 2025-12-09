import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PATHS_API, SRI_IDENTIFICATION_CODE } from '@core/constants/global.constants';
import { map } from 'rxjs';
import { SriCustomerRepository } from '@customer/domain/repositories/sri-customer.repository';

@Injectable({
  providedIn: 'root',
})
export class SriCustomerWebRepository implements SriCustomerRepository {
  private http = inject(HttpClient);

  //FROM REGISTRO CIVIL DATA
  url = `${PATHS_API.BILLING}Consultas/`;

  search(codigo: string, id: string) {
    let path;
    if (codigo == SRI_IDENTIFICATION_CODE.RUC) {
      path = 'GetRucSRI/';
    } else {
      path = 'GetCedulaSri/';
    }
    return this.http.get(`${this.url}${path}?Ruc=${id}`);
  }

  searchByRuc(id: string) {
    return this.http.get(`${this.url}GetRucSRI/?Ruc=${id}`);
  }

  searchByCedula(id: string) {
    return this.http.get(`${this.url}GetCedulaSri/?Ruc=${id}`);
  }
}
