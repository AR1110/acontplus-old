import { PATHS_API } from '@core/constants/global.constants';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { DashboardRepository } from '@modules/common/core/repositories/dashboard.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { API_ENDPOINTS } from '@modules/common/core/enums/common.constants';

@Injectable({
  providedIn: 'root',
})
export class DashboardHttpRepository implements DashboardRepository {
  private http = inject(HttpClient);
  private url = `${PATHS_API.COMMON}${API_ENDPOINTS.DASHBOARD}`;

  list<T>(params: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...params,
    });
    return this.http.get<ApiResponseLegacy>(`${this.url}/?json=${json}`).pipe(
      map((response) => {
        const resultStatistics = {
          itemCount: 0,
          customerCount: 0,
          supplierCount: 0,
          userCount: 0,
        };
        const result = {
          licenses: [],
          stepsConfig: [],
          expiredSignatures: [],
          emittedDocuments: [],
          receivedDocuments: [],
          anotherSalesDocs: [],
        };

        if (response.code === '1') {
          const {
            statistics,
            licenses,
            stepsConfig,
            expiredSignatures,
            emittedDocuments,
            receivedDocuments,
            anotherSalesDocs,
          } = JSON.parse(response.payload as string);
          const {
            cantidadArticulo: itemCount,
            cantidadCliente: customerCount,
            cantidadProveedor: supplierCount,
            cantidadUsuario: userCount,
          } = statistics[0];

          resultStatistics.itemCount = itemCount;
          resultStatistics.customerCount = customerCount;
          resultStatistics.supplierCount = supplierCount;
          resultStatistics.userCount = userCount;

          result.licenses = licenses;
          result.stepsConfig = stepsConfig;
          result.expiredSignatures = expiredSignatures;
          result.emittedDocuments = emittedDocuments;
          result.receivedDocuments = receivedDocuments;
          result.anotherSalesDocs = anotherSalesDocs;
        }

        return {
          statistics: resultStatistics,
          ...result,
        };
      }),
    );
  }
}
