import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '../enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvModelService {

  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MODEL}`;
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
          modelos: [] as any[]
        }
        if (response.code === "1") {
          let mainData = JSON.parse(response.payload as string);
          let modelos = mainData.modelos || []
          result.modelos = modelos.map((item: any) => {
            return {
              idModelo: item.idModelo,
              codigo: item.codigo,
              descripcion: item.descripcion,
              estado: item.estado,
              idMarca: item.idMarca,
              marca: item.marca,
              totalRecords: item.totalRecords,
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
