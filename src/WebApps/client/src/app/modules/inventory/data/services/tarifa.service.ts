import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TarifaService {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.TARIFA}`;
  private http = inject(HttpClient);

  getAll<T>(obj: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map(response => {
          const result = {
            tarifas: [] as any[],
          };
          if (response.code === '1') {
            const mainData = JSON.parse(response.payload as string);
            const tarifas = mainData.tarifas || [];
            result.tarifas = tarifas.map((item: any) => {
              return {
                idTarifa: item.idTarifa,
                descripcion: item.descripcion,
                codigo: item.codigo,
                predeterminada: item.predeterminada,
                estado: item.estado,
                ventaPorMayor: item.ventaPorMayor,
              };
            });
          }
          return result;
        }),
      );
  }

  put<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(`${this.url}${id}`, { data });
  }
}
