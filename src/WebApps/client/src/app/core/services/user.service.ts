import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import {ApiResponse, isApiResponse } from "@core/models/api-response";
import { UserSearch } from "@core/models/user.model";
import { Observable, map } from "rxjs";
import {getNoLoader} from "@core/interceptors/loader.interceptor";
import { CONFIG_PATHS } from "@modules/config/domain/enums/config.enums";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER}`;
  private http = inject(HttpClient);

  search<T extends { textSearch: string }>(data: T): Observable<UserSearch[]> {
    const json = JSON.stringify({
      tipo: 3,
      textSearch: data.textSearch,
    })
    return this.http.get(`${this.url}?json=${json}`, {
      context: getNoLoader()
    })
      .pipe(
        map((response:any) => {
          let userCustomers = [];
          if(response && typeof  response==='object'){
            userCustomers =  response.userCustomers.map((user: any) => {
              return {
                idUsuario: user.idUsuario,
                nombreCompleto: user.fullname || user.fullName,
                nombreUsuario: user.username,
                nroIdentificacion: user.idCard,
              }
            })
          }
          return userCustomers;
        })
      )
  }
}
