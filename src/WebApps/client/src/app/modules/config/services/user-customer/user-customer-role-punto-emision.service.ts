import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CONFIG_PATHS } from "../../enums/config.enums";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { UserCustomerCustomerRoleEstab } from "@modules/config/domain/models/user-customer/user-customer-role-estab.model";
import { UserCustomerCustomerRolePtoEmision } from "@modules/config/domain/models/user-customer/asignacion-punto-emision.model";


@Injectable({
  providedIn: 'root'
})
export class UserCustomerRolePuntoEmisionService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE_PUNTO_EMISION}`;
  private http = inject(HttpClient)

  getAll<T>(codEstab_Asig: T) {
    let json = JSON.stringify({
      codEstab_Asig,
      tipo: 1
    })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response:any) => {
        let puntosEmisionAsignadas:UserCustomerCustomerRolePtoEmision[] = [];
        if (response !== null && typeof response === 'object') {
          puntosEmisionAsignadas = response.puntosEmisionAsignadas.map((item:any)=>{
            let obj: UserCustomerCustomerRolePtoEmision = {
              idPtoEmi_Asig: item.idPtoEmi_Asig,
              codEstab_Asig: item.codEstab_Asig,
              idPuntoEmision: item.idPuntoEmision,
              ptoEmi: item.ptoEmi,
              defaultPtoEmi: item.predeterminado,
              estado: item.estado,
            }
            return obj;
          })
        }
        return puntosEmisionAsignadas;
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
