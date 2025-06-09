import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { CuentaPorPagarMapper } from './cuenta-por-pagar.mapper';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ComprobanteEgresoLista } from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';
import { HistorialPagoLista } from '@accounting/comprobante-egreso/domain/historial-pago.model';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';

import { TiempoCreditoSelectHtmlOnly } from '@accounting/shared/models/tiempo-credito.interface';
import {CuentaPorPagarRepository} from "@accounting/cuenta-por-pagar/domain/cuenta-por-pagar.repository";
import {
  GetFilterDataCuentaPorPagarMapper
} from "@accounting/cuenta-por-pagar/infrastructure/get-filter-data-cuenta-por-pagar.mapper";
import {CuentaPorPagarCuotaConfig, CuentaPorPagarLista} from "@accounting/cuenta-por-pagar/domain/cuenta-por-pagar.model";

@Injectable({
  providedIn: 'root',
})
export class CuentaPorPagarWebRepository implements CuentaPorPagarRepository{
  private http = inject(HttpClient);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  getDataFilter() {
    const json = GetFilterDataCuentaPorPagarMapper.toJson()
    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => GetFilterDataCuentaPorPagarMapper.fromJson(response)),
      );
  }

  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let result = {
            data: [] as CuentaPorPagarLista[],
            totalRecords: 0,
          };
          if (response.code === '1') {
            let [mainData] = JSON.parse(response.payload as string);
            result.data =
              CuentaPorPagarMapper.fromApiGetAll(mainData);
            result.totalRecords =
              result.data.length > 0 ? result.data[0].totalRecords : 0;
          }
          return result;
        }),
      );
  }

  getCuotasData() {
    let json = JSON.stringify({
      tipo: 5,
    });
    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let result = {
            tiemposCredito: [] as TiempoCreditoSelectHtmlOnly[],
          };
          if (response.code === '1') {
            let [tempTiemposCredito] = JSON.parse(response.payload as string);

            result.tiemposCredito = tempTiemposCredito || [];
          }
          return result;
        }),
      );
  }

  getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar: number) {
    let json = JSON.stringify({
      tipo: 2,
      idCuentaPorPagar,
    });
    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let result = {
            data: [] as CuentaPorPagarCuotaConfig[],
          };
          if (response.code === '1') {
            let [mainData] = JSON.parse(response.payload as string);
            result.data =
              CuentaPorPagarMapper.fromApiCuotaConfig(mainData);
          }
          return result;
        }),
      );
  }

  getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar: number) {
    let json = JSON.stringify({
      tipo: 4,
      idCuentaPorPagar,
    });
    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`, {
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
            let mainData = JSON.parse(response.payload as string);
            console.log(mainData);
            result =
              CuentaPorPagarMapper.fromApiHistMovimiento(mainData);
          }
          return result;
        }),
      );
  }

  generarCuotas<T>(obj: T) {
    let params = CuentaPorPagarMapper.toApiGenerarCuota(obj);
    let json = JSON.stringify(params);
    return this.http.post<ApiResponse>(`${this.url}${json}`, null, {
      context: getNoLoader(),
    });
  }

  actualizarCuotas<T>(id: number, obj: T) {
    return this.http.post<ApiResponse>(`${this.url}${id}`, obj, {
      context: getNoLoader(),
    });
  }
}
