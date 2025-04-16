import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { GroupedEstab } from '@core/models/estab.model';
import { CuentaPorPagarMapper } from './cuenta-por-pagar.mapper';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ComprobanteEgresoLista } from '@accounting/core/models/comprobante-egreso.model';
import { HistorialPagoLista } from '@accounting/core/models/historial-pago.model';
import { ACCOUNTING_PATHS } from '@accounting/core/enums/accounting.constants';
import {
  CuentaPorPagarCuotaConfig,
  CuentaPorPagarLista,
} from '../../core/models/cuenta-por-pagar.model';
import { TiempoCreditoSelectHtmlOnly } from '@accounting/core/models/tiempo-credito.interface';
import {CuentaPorPagarRepository} from "@accounting/core/repositories/cuenta-por-pagar.repository";

@Injectable({
  providedIn: 'root',
})
export class CuentaPorPagarWebRepository implements CuentaPorPagarRepository{
  private http = inject(HttpClient);
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`;

  getDataFilter() {
    let json = JSON.stringify({
      tipo: 6,
    });
    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let resultData = {
            estabs: [] as GroupedEstab[],
            estadosDoc: [] as any[],
            tiposDoc: [] as any[],
            categorias: [] as any[],
          };

          if (response.code === '1') {
            resultData =
              CuentaPorPagarMapper.fromApiDataFilter(response);
          }

          return resultData;
        }),
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
