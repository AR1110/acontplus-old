import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { CuentaPorPagarMapper } from '../mappers/cuenta-por-pagar.mapper';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ComprobanteEgresoLista } from '@accounting/data/models/comprobante-egreso.entity';
import { HistorialPagoLista } from '@accounting/data/models/historial-pago.model';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';

import { TiempoCreditoSelectHtmlOnly } from '@accounting/shared/models/tiempo-credito.interface';
import { CuentaPorPagarRepository } from '@accounting/data/repositories/cuenta-por-pagar.repository';
import { GetFilterDataCuentaPorPagarMapper } from '@accounting/data/mappers/get-filter-data-cuenta-por-pagar.mapper';
import {
  CuentaPorPagarCuotaConfig,
  CuentaPorPagarLista,
} from '@accounting/data/models/cuenta-por-pagar.model';

@Injectable({
  providedIn: 'root',
})
export class CuentaPorPagarHttp implements CuentaPorPagarRepository {
  private http = inject(HttpClient);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  getDataFilter() {
    const json = GetFilterDataCuentaPorPagarMapper.toJson();
    return this.http
      .get<ApiResponseLegacy>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(map((response) => GetFilterDataCuentaPorPagarMapper.fromJson(response)));
  }

  getAll<T>(obj: T) {
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
            data: [] as CuentaPorPagarLista[],
            totalRecords: 0,
          };
          if (response.code === '1') {
            const [mainData] = JSON.parse(response.payload as string);
            result.data = CuentaPorPagarMapper.fromApiGetAll(mainData);
            result.totalRecords = result.data.length > 0 ? result.data[0].totalRecords : 0;
          }
          return result;
        }),
      );
  }

  getCuotasData() {
    const json = JSON.stringify({
      tipo: 5,
    });
    return this.http
      .get<ApiResponseLegacy>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          const result = {
            tiemposCredito: [] as TiempoCreditoSelectHtmlOnly[],
          };
          if (response.code === '1') {
            const [tempTiemposCredito] = JSON.parse(response.payload as string);

            result.tiemposCredito = tempTiemposCredito || [];
          }
          return result;
        }),
      );
  }

  getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar: number) {
    const json = JSON.stringify({
      tipo: 2,
      idCuentaPorPagar,
    });
    return this.http
      .get<ApiResponseLegacy>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          const result = {
            data: [] as CuentaPorPagarCuotaConfig[],
          };
          if (response.code === '1') {
            const [mainData] = JSON.parse(response.payload as string);
            result.data = CuentaPorPagarMapper.fromApiCuotaConfig(mainData);
          }
          return result;
        }),
      );
  }

  getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar: number) {
    const json = JSON.stringify({
      tipo: 4,
      idCuentaPorPagar,
    });
    return this.http
      .get<ApiResponseLegacy>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let result = {
            cuentaPorPagar: {} as Partial<CuentaPorPagarLista>,
            comprobantesEgreso: [] as ComprobanteEgresoLista[],
            historialPagos: [] as HistorialPagoLista[],
            pagosDetalle: [] as any[],
          };
          if (response.code === '1') {
            const mainData = JSON.parse(response.payload as string);
            console.log(mainData);
            result = CuentaPorPagarMapper.fromApiHistMovimiento(mainData);
          }
          return result;
        }),
      );
  }

  generarCuotas<T>(obj: T) {
    const params = CuentaPorPagarMapper.toApiGenerarCuota(obj);
    const json = JSON.stringify(params);
    return this.http.post<ApiResponseLegacy>(`${this.url}${json}`, null, {
      context: getNoLoader(),
    });
  }

  actualizarCuotas<T>(id: number, obj: T) {
    return this.http.post<ApiResponseLegacy>(`${this.url}${id}`, obj, {
      context: getNoLoader(),
    });
  }
}
