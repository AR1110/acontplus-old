import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { map, Observable } from 'rxjs';
import { CuotaPorPagarLista } from '@accounting/data/models/cuota-por-pagar.interface';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/data/models/subentidad-financiera.interface';
import { BancoSelectOnly } from '@accounting/shared/models/banco.interface';
import { EstadoPago } from '@accounting/data/models/estado-pago.interface';
import { ProvinciaCiudad } from '@shared/models/ciudad.interface';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  ComprobanteEgresoDeleteParams,
  ComprobanteEgresoDeleteResponse,
  ComprobanteEgresoFilterResponse,
  ComprobanteEgresoResponse,
} from '@accounting/data/models/comprobante-egreso.entity';
import {
  ComprobanteEgresoRepository,
  ComprobanteEgresoListParams,
  ComprobanteEgresoFormaPagoData,
  ComprobanteEgresoCuotasData,
} from '@accounting/data/repositories/comprobante-egreso.repository';
import { ListComprobanteEgresoMapper } from '@accounting/data/mappers/list-comprobante-egreso.mapper';
import { DataFilterComprobanteEgresoMapper } from '@accounting/data/mappers/data-filter-comprobante-egreso.mapper';
import { GetComprobanteEgresoForDeletionMapper } from '@accounting/data/mappers/get-comprobante-egreso-for-deletion.mapper';
import {
  ComprobanteEgresoMapper,
  ParamsGuardar,
} from '@accounting/data/mappers/comprobante-egreso.mapper';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteEgresoHttp implements ComprobanteEgresoRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_EGRESO}`;
  private http = inject(HttpClient);

  list(params: ComprobanteEgresoListParams): Observable<ComprobanteEgresoResponse> {
    const json = ListComprobanteEgresoMapper.toJson(params);
    return this.http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => ListComprobanteEgresoMapper.fromJson(response)));
  }

  getFilterData(): Observable<ComprobanteEgresoFilterResponse> {
    const json = DataFilterComprobanteEgresoMapper.toJson();
    return this.http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => DataFilterComprobanteEgresoMapper.fromJson(response)));
  }

  getDataForDeletion(id: number): Observable<ComprobanteEgresoDeleteResponse> {
    const json = GetComprobanteEgresoForDeletionMapper.toJson({ id });
    return this.http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => GetComprobanteEgresoForDeletionMapper.fromJson(response)));
  }

  getCuotasByCuentaPorPagarId(idCuentaPorPagar: number): Observable<ComprobanteEgresoCuotasData> {
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
        return results;
      }),
    );
  }

  getFormaPagoData(idProveedor: number): Observable<ComprobanteEgresoFormaPagoData> {
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

  create(comprobante: ParamsGuardar): Observable<ApiResponseLegacy> {
    const params = ComprobanteEgresoMapper.toApiPost(comprobante);
    return this.http.post<ApiResponseLegacy>(`${this._url}`, params);
  }

  anular(comprobante: ComprobanteEgresoDeleteParams): Observable<ApiResponseLegacy> {
    return this.http.put<ApiResponseLegacy>(`${this._url}${comprobante.id}`, {
      data: comprobante.data,
    });
  }
}
