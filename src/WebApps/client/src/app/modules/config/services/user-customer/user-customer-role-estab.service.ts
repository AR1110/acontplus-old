import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '../../enums/config.enums';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { UserCustomerCustomerRoleEstab } from '../../models/user-customer/user-customer-role-estab.model';
import { isApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UserCustomerRoleEstabService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE_ESTAB}`;
  private http = inject(HttpClient);

  getAll<T>(data: T) {
    let json = JSON.stringify({
      ...data,
      tipo: 1,
    });
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response) => {
        let userCustomerRoleEstabs: Array<UserCustomerCustomerRoleEstab> = [];
        if (isApiResponse(response) && response.code == '1') {
          userCustomerRoleEstabs = JSON.parse(response.payload as string).map(
            (item: any) => {
              return {
                idEstab_Asig: item.idEstab_Asig,
                codEstab_Asig: item.codEstab_Asig,
                codEstab: item.codEstab,
                estab: item.estab,
                nombreComercial: item.nombreComercial,
                defaultEstab: item.predeterminado,
                estado: item.estado,
              };
            },
          );
        }
        return userCustomerRoleEstabs;
      }),
    );
  }

  put(idEstab_Asig: number) {
    return this.http.put(`${this.url}${idEstab_Asig}`, {});
  }

  post<T>(data: T) {
    return this.http.post(`${this.url}`, { data });
  }
}
