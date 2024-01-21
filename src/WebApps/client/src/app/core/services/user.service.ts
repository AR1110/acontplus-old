import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { PATHS, PATHS_API } from "@core/constants/global.constants";
import { isApiResponse } from "@core/models/api-response";
import { UserSearch } from "@core/models/user.model";
import { Observable, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private url = `${PATHS_API.CONFIG}${PATHS.USER}`;
    private http = inject(HttpClient);

  search<T extends { textSearch: string }>(data: T): Observable<Array<UserSearch>> {
    let query = {
      textSearch: data.textSearch,
      tipo: 5
    }
    return this.http.get(`${this.url}?json=${JSON.stringify(query)}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {
            let users = response.payload && JSON.parse(response.payload as string) || [];
            console.log(users)
            return []
            // return results.map((proveedor: any) => {
            //   return {
            //     idProveedor: proveedor.idProveedor,
            //     numeroIdentificacion: proveedor.numeroIdentificacion,
            //     razonSocial: proveedor.razonSocial,
            //     tipoIdentificacion: proveedor.tipoIdentificacion,
            //     subContribuyente: proveedor.subContribuyente,
            //   }
            // })
          }
          return []
        })
      )
  }
}
