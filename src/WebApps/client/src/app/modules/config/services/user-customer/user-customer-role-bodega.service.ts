import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CONFIG_PATHS } from "../../enums/config.enums";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { UserCustomerCustomerRoleEstab } from "../../models/user-customer/user-customer-role-estab.model";
import { UserCustomerCustomerRoleBodega } from "../../models/user-customer/user-customer-role-bodega.model";


@Injectable({
  providedIn: 'root'
})
export class UserCustomerRoleBodegaService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE_BODEGA}`;
  private http = inject(HttpClient)

  getAll<T>(codEstab_Asig: T) {
    let json = JSON.stringify({
      codEstab_Asig,
      tipo: 1
    })

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let bodegasAsignadas: UserCustomerCustomerRoleBodega[] = [];
        if (response !== null && typeof response === 'object') {
          bodegasAsignadas = response.bodegasAsignadas.map((item: any) => {
            let obj: UserCustomerCustomerRoleBodega = {
              idBodeg_Asig: item.idBodeg_Asig,
              codEstab_Asig: item.codEstab_Asig,
              idBodega: item.idBodega,
              descripcion: item.bodega,
              defaultBodga: item.predeterminado,
              estado: item.estado,
            };
            return obj;
          });
        }
        return bodegasAsignadas;
      })
    )
  }

  put(idPtoEmi_Asig: number) {
    return this.http.put(`${this.url}${idPtoEmi_Asig}`, {})
  }

  post<T>(data: T) {
    return this.http.post(`${this.url}`, { data })
  }

}
