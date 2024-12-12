import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/core/enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.TAGS}`;
  private http = inject(HttpClient)


  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let result = {
          tags: [] as any[]
        }
        if (response.code === "1") {
          let mainData = JSON.parse(response.payload as string);
          let tags = mainData.tags || []
          result.tags = tags.map((item: any) => {
            return {
              idEtiqueta: item.idEtiqueta,
              descripcion: item.descripcion,
              etiquetas: item.etiquetas,
              estado: item.estado
            }
          })
        }
        return result
      })
    )
  }

  post<T>(data: T) {
    return this.http.post<ApiResponse>(`${this.url}`, { data })
  }

  put<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(`${this.url}${id}`, { data })
  }


  updateStatus(id: number) {
    return this.http.delete<ApiResponse>(`${this.url}${id}`)
  }
}
