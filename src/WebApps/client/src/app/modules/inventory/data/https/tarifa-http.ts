import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { TarifaRepository } from '../repositories/tarifa.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { getNoLoader } from '@core/interceptors/loader.interceptor';

@Injectable()
export class TarifaHttp implements TarifaRepository {
  private url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.TARIFA}`;
  private http = inject(HttpClient);

  getAll<T>(obj: T): Observable<{ tarifas: any[] }> {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this.http
      .get<ApiResponseLegacy>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
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

  put<T>(id: number, data: T): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`${this.url}${id}`, { data });
  }
}
