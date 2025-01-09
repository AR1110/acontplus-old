import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/core/enums/accounting.constants';
import {ComprobanteEgresoRepository} from "@accounting/core/repositories/comprobante-egreso.repository";
import {map} from "rxjs";
import {CuotaPorPagarLista} from "@accounting/core/domain/cuota-por-pagar.interface";

import {getNoLoader} from "@core/interceptors/loader.interceptor";
import {EntidadFinanciera} from "@accounting/core/domain/entidad-financiera.interface";
import {SubEntidadFinancieraSelectHtmlOnly} from "@accounting/core/domain/subentidad-financiera.interface";
import {BancoSelectOnly} from "@accounting/core/domain/banco.interface";
import {EstadoPago} from "@accounting/core/domain/estado-pago.interface";
import {ProvinciaCiudad} from "@shared/models/ciudad.interface";
import {ApiResponse} from "@core/models/api-response";
import {ComprobanteEgresoMapper} from "@accounting/data/comprobante-egreso/comprobante-egreso.mapper";
import {GroupedEstab} from "@core/models/estab.model";
import {groupEstabUtil} from "@core/utils/group-estab.util";

@Injectable({
  providedIn: 'root'
})
export class ComprobanteEgresoWebRepository extends ComprobanteEgresoRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_EGRESO}`
  constructor(private http:HttpClient) {
    super()
  }

  getCuotasByIdCuentaPorPagar(idCuentaPorPagar: number) {
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


  getDataFormPago(idProveedor: number) {

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

    return this.http.get<ApiResponse>(`${this._url}?json=${PARAMS}`, {context: getNoLoader()}).pipe(
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

  post(obj:any){
    let params = ComprobanteEgresoMapper.toApiPost(obj);

    return this.http.post<ApiResponse>(`${this._url}`, params)
  }

}
