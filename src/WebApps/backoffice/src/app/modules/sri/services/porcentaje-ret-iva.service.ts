import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SRI_PATHS_API } from '@modules/sri/constants/constants';
import { ApiResponse } from 'acontplus-utils';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PorcentajeRetIvaService {
  private http = inject(HttpClient);
  private url = `${SRI_PATHS_API.PORCENTAJE_RET_IVA}`;

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 1,
    });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        let { porcentajesRetIva } = JSON.parse(response.payload as string);

        return {
          porcentajesRetIva,
        };
      }),
    );
  }

  post<T>(data: T) {
    return this.http.post<ApiResponse>(this.url, { data });
  }

  put<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(this.url + id, { data });
  }

  putStatus(id: number, status: boolean) {
    return this.http.put<ApiResponse>(
      `${this.url}PutStatus/${id}/${status}`,
      {},
    );
  }
}
