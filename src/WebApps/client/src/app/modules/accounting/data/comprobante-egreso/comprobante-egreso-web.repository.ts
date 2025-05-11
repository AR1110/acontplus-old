import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/domain/enums/accounting.constants';
import {ComprobanteEgresoRepository} from "@accounting/domain/repositories/comprobante-egreso.repository";
import {map, Observable} from "rxjs";
import {CuotaPorPagarLista} from "@accounting/domain/models/cuota-por-pagar.interface";

import {getNoLoader} from "@core/interceptors/loader.interceptor";
import {EntidadFinanciera} from "@accounting/domain/models/entidad-financiera.interface";
import {SubEntidadFinancieraSelectHtmlOnly} from "@accounting/domain/models/subentidad-financiera.interface";
import {BancoSelectOnly} from "@accounting/domain/models/banco.interface";
import {EstadoPago} from "@accounting/domain/models/estado-pago.interface";
import {ProvinciaCiudad} from "@shared/models/ciudad.interface";
import {ApiResponse} from "@core/models/api-response";
import {ComprobanteEgresoMapper} from "@accounting/data/comprobante-egreso/comprobante-egreso.mapper";
import {GroupedEstab} from "@core/models/estab.model";
import {groupEstabUtil} from "@core/utils/group-estab.util";
import {
  ComprobanteEgresoDeleteParams, ComprobanteEgresoFilterResponse,
  ComprobanteEgresoResponse
} from '@accounting/domain/models/comprobante-egreso.model';
import {ListComprobanteEgresoMapper} from "@accounting/data/comprobante-egreso/list-comprobante-egreso.mapper";
import {
  DataFilterComprobanteEgresoMapper
} from "@accounting/data/comprobante-egreso/data-filter-comprobante-egreso.mapper";
import {
  GetComprobanteEgresoForDeletionMapper
} from "@accounting/data/comprobante-egreso/get-comprobante-egreso-for-deletion.mapper";

@Injectable({
  providedIn: 'root'
})
export class ComprobanteEgresoWebRepository implements ComprobanteEgresoRepository {
  anular(comprobante: ComprobanteEgresoDeleteParams): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this._url}${comprobante.id}`, {data: comprobante.data})
  }
  getDataForDeletion(id: number) {
    const json = GetComprobanteEgresoForDeletionMapper.toJson({id});
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map(response=>GetComprobanteEgresoForDeletionMapper.fromJson(response))
    )
  }


  getFilterData(): Observable<ComprobanteEgresoFilterResponse> {
    const json = DataFilterComprobanteEgresoMapper.toJson();
    return this.http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map(response=>DataFilterComprobanteEgresoMapper.fromJson(response))
    )
  }
  list(params: any): Observable<ComprobanteEgresoResponse> {
    const json = ListComprobanteEgresoMapper.toJson(params);
    return this.http.get(`${this._url}?json=${json}`).pipe(
      map(response=>ListComprobanteEgresoMapper.fromJson(response))
    )
  }
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_EGRESO}`
  private http = inject(HttpClient)

  getCuotasByCuentaPorPagarId(idCuentaPorPagar: number) {
    let json = JSON.stringify({
      tipo: 4,
      idCuentaPorPagar,
    })
    return this.http.get(`${this._url}?json=${json}`).pipe(
      map(response => {
        let results = {
          cuotas: [] as CuotaPorPagarLista[]
        }
        if (response && typeof response === 'object') {
          results.cuotas = ComprobanteEgresoMapper.fromApiCuotasByICuentaPorPagar(response)
        }
        console.log(results)
        return results;
      })

    )
  }


  getFormaPagoData(idProveedor: number) {

    let json = JSON.stringify({
      tipo: 3,
      idProveedor,
    })
    return this.http.get(`${this._url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let results = {
          entidadesFinanciera: [] as EntidadFinanciera[],
          subEntidadesFinanciera: [] as SubEntidadFinancieraSelectHtmlOnly[],
          bancos: [] as BancoSelectOnly[],
          estadosPago: [] as EstadoPago[],
          provinciaCiudades: [] as ProvinciaCiudad[],
          documentos: []
        }
        if (response && typeof response === 'object') {
          results = ComprobanteEgresoMapper.fromApiDataForm(response)
        }
        return results;
      })

    )
  }

  getDataFilter() {
    const PARAMS = JSON.stringify({tipo: 2})

    return this.http.get<ApiResponse>(`${this._url}?json=${PARAMS}`).pipe(
      map(response => {
        let result = {
          establecimientos: [] as GroupedEstab[],
          tiposDoc :[],
          subEntidadesFinanciera:[],
          bancos :[]
        }

        if (response.code === "0") return result;

        const { ptoEmision, tipoDocumento, subEntidadFinanciera, banco } = JSON.parse(response.payload as string);

        result.establecimientos = groupEstabUtil({
          estabs: ptoEmision,
          isGroupPuntoEmision: true,
        });

        result.tiposDoc = tipoDocumento;
        result.subEntidadesFinanciera = subEntidadFinanciera;
        result.bancos = banco;
        return result;
      })
    )
  }

  create(obj:any){
    let params = ComprobanteEgresoMapper.toApiPost(obj);

    return this.http.post<ApiResponse>(`${this._url}`, params)
  }

}
