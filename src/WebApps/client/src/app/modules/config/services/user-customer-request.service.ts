import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CONFIG_PATHS } from "../enums/config.enums";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { UserCustomerCustomerRoleEstab } from "../models/user-customer-role-estab.model";
import { UserCustomerCustomerRoleBodega } from "../models/user-customer-role-bodega.model";


@Injectable({
  providedIn: 'root'
})
export class UserCustomerRequestService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_REQUEST}`;
  private http = inject(HttpClient)

  getAll() {
    let json = JSON.stringify({
      tipo: 1
    })

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any) => {
        let requests = []
        if(response!==null && typeof response==='object'){
          requests = response.requests;
        }
         return requests;
      })
    )
  }

  put<T>(data: T){
    return this.http.put(`${this.url}`, {data})
  }

}
