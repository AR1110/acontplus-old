import { inject, Injectable } from '@angular/core';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { ReportReadDto } from '@modules/config/models/report.model';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  #url = CONFIG_PATHS.REPORT;
  #http = inject(HttpClient);

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 1,
    });
    return this.#http.get<ApiResponse>(`${this.#url}?json=${json}`).pipe(
      map((response: ApiResponse) => {
        let results: ReportReadDto[] = [];
        if (response) {
          if (response.code === '1') {
            let { reports } = JSON.parse(response.payload as string);

            results = reports.map((item: any) => {
              return {
                idReporte: item.idReporte,
                codigo: item.codigo,
                reportPath: item.reportPath,
                contentType: item.contentType,
                storedProcedure: item.storedProcedure,
                nombreReporte: item.nombreReporte,
                estado: item.estado,
                fechaRegistro: item.fechaRegistro,
                nextDs: item.nextDs,
                dataSources: item.dataSources,
                totalRecords: item.totalRecords,
              };
            });
          }
        }
        return results;
      }),
    );
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponse>(this.#url, { data });
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponse>(`${this.#url}${id}`, { data });
  }

  delete(id: number) {
    return this.#http.delete<ApiResponse>(`${this.#url}${id}`);
  }
}
