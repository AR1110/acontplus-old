import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { ComprobanteEgresoRepository } from '@accounting/comprobante-egreso/domain/comprobante-egreso.repository';
import { map, Observable } from 'rxjs';
import { CuotaPorPagarLista } from '@accounting/data/models/cuota-por-pagar.interface';

import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/data/models/subentidad-financiera.interface';
import { BancoSelectOnly } from '@accounting/shared/models/banco.interface';
import { EstadoPago } from '@accounting/comprobante-egreso/domain/estado-pago.interface';
import { ProvinciaCiudad } from '@shared/models/ciudad.interface';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ComprobanteEgresoMapper } from '@accounting/comprobante-egreso/infrastructure/mappers/comprobante-egreso.mapper';
import { GroupedEstab } from '@core/models/estab.model';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import {
  ComprobanteEgresoDeleteParams,
  ComprobanteEgresoFilterResponse,
  ComprobanteEgresoResponse,
} from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';
import { ListComprobanteEgresoMapper } from '@accounting/comprobante-egreso/infrastructure/mappers/list-comprobante-egreso.mapper';
import { DataFilterComprobanteEgresoMapper } from '@accounting/comprobante-egreso/infrastructure/mappers/data-filter-comprobante-egreso.mapper';
import { GetComprobanteEgresoForDeletionMapper } from '@accounting/comprobante-egreso/infrastructure/mappers/get-comprobante-egreso-for-deletion.mapper';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteEgresoWebRepository implements ComprobanteEgresoRepository {
  anular(comprobante: ComprobanteEgresoDeleteParams): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`${this._url}${comprobante.id}`, {
      data: comprobante.data,
    });
  }
  getDataForDeletion(id: number) {
    const json = GetComprobanteEgresoForDeletionMapper.toJson({ id });
    return this.http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => GetComprobanteEgresoForDeletionMapper.fromJson(response)));
  }

  getFilterData(): Observable<ComprobanteEgresoFilterResponse> {
    const json = DataFilterComprobanteEgresoMapper.toJson();
    return this.http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => DataFilterComprobanteEgresoMapper.fromJson(response)));
  }
  list(params: any): Observable<ComprobanteEgresoResponse> {
    const json = ListComprobanteEgresoMapper.toJson(params);
    return this.http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => ListComprobanteEgresoMapper.fromJson(response)));
  }
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_EGRESO}`;
  private http = inject(HttpClient);

  getCuotasByCuentaPorPagarId(idCuentaPorPagar: number) {
    const json = JSON.stringify({
      tipo: 4,
      idCuentaPorPagar,
    });
    return this.http.get(`${this._url}?json=${json}`).pipe(
      map((response) => {
        const results = {
          cuotas: [] as CuotaPorPagarLista[],
        };
        if (response && typeof response === 'object') {
          results.cuotas = ComprobanteEgresoMapper.fromApiCuotasByICuentaPorPagar(response);
        }
        console.log(results);
        return results;
      }),
    );
  }

  getFormaPagoData(idProveedor: number) {
    const json = JSON.stringify({
      tipo: 3,
      idProveedor,
    });
    return this.http
      .get(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let results = {
            entidadesFinanciera: [] as EntidadFinanciera[],
            subEntidadesFinanciera: [] as SubEntidadFinancieraSelectHtmlOnly[],
            bancos: [] as BancoSelectOnly[],
            estadosPago: [] as EstadoPago[],
            provinciaCiudades: [] as ProvinciaCiudad[],
            documentos: [],
          };
          if (response && typeof response === 'object') {
            results = ComprobanteEgresoMapper.fromApiDataForm(response);
          }
          return results;
        }),
      );
  }

  getDataFilter() {
    const PARAMS = JSON.stringify({ tipo: 2 });

    return this.http.get<ApiResponseLegacy>(`${this._url}?json=${PARAMS}`).pipe(
      map((response) => {
        const result = {
          establecimientos: [] as GroupedEstab[],
          tiposDoc: [],
          subEntidadesFinanciera: [],
          bancos: [],
        };

        if (response.code === '0') return result;

        const { ptoEmision, tipoDocumento, subEntidadFinanciera, banco } = JSON.parse(
          response.payload as string,
        );

        result.establecimientos = groupEstabUtil({
          estabs: ptoEmision,
          isGroupPuntoEmision: true,
        });

        result.tiposDoc = tipoDocumento;
        result.subEntidadesFinanciera = subEntidadFinanciera;
        result.bancos = banco;
        return result;
      }),
    );
  }

  create(obj: any) {
    const params = ComprobanteEgresoMapper.toApiPost(obj);

    return this.http.post<ApiResponseLegacy>(`${this._url}`, params);
  }
}
