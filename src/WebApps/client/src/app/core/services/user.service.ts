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
      busqueda: data.textSearch,
    }
    return this.http.get(`${this.url}Search?json=${JSON.stringify(query)}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {
            let users = response.payload && JSON.parse(response.payload as string) || []; 

            return users.map((user: any) => {
              return {
                idUsuario: user.idUsuario,
                nombreCompleto: user.nombreCompleto,
                nombreUsuario: user.nombreUsuario,
                nroIdentificacion: user.nroIdentificacion,
              }
            })
          }
          return []
        })
      )
  }
}
