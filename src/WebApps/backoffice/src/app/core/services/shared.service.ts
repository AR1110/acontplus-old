import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { MAIN_PATHS } from '@core/constants/constants';
import {
  CustomerCedulaSRI,
  CustomerRucSRI,
} from '@core/models/customerSRI.model';
import { ApiResponse, customUrl } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly URL_CONSULTAS =
    environment.apiGatewayAcontplus + MAIN_PATHS.CONSULTAS;

  constructor(private readonly http: HttpClient) {}

  checkCustomerSRIByRUC(identificacion: string): Observable<CustomerRucSRI> {
    return this.http
      .get(`${this.URL_CONSULTAS}GetRucSRI`, {
        params: {
          Ruc: identificacion,
        },
        context: customUrl(),
      })
      .pipe(map((response: any) => response));
  }

  checkCustomerSRIByCedula(
    identificacion: string,
  ): Observable<CustomerCedulaSRI> {
    return this.http
      .get(`${this.URL_CONSULTAS}GetCedulaSri`, {
        params: {
          Ruc: identificacion,
        },
        context: customUrl(),
      })
      .pipe(map((response: any) => response));
  }
}
