import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '../enums/accounting.constants';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { GroupedEstab } from '@core/models/estab.model';
import { CuentaPorPagarCuotaConfig, CuentaPorPagarLista } from './interfaces/cuenta-por-pagar.interface';
import { CuentaPorPagarRepositoryMapper } from './cuenta-por-pagar.repository.mapper';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { TiempoCreditoSelectHtmlOnly } from '../interfaces/tiempo-credito.interface';
import {ComprobanteEgresoLista} from "@accounting/comprobante-egreso/comprobante-egreso.interface";
import {HistorialPagoLista} from "@modules/accounting/cuenta-por-pagar/interfaces/historial-pago.interface";
import {PagoDetalleLista} from "@modules/accounting/cuenta-por-pagar/interfaces/pago-detalle.interface";

@Injectable({
  providedIn: 'root'
})
export class CuentaPorPagarRepository {
  private http = inject(HttpClient)
  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CUENTA_POR_PAGAR}`

  getDataFilter(){
    let json = JSON.stringify({
      tipo: 6
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response=>{
        let resultData = {
          estabs: [] as GroupedEstab[],
          estadosDoc: [] as any[],
          tiposDoc: [] as any[],
          categorias: [] as any[]
        }

        if (response.code === "1") {
         resultData = CuentaPorPagarRepositoryMapper.fromApiDataFilter(response)
        }

        return resultData;
      })
    )
  }

  getAll<T>(obj:T){
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response=>{
        let result = {
          data: [] as CuentaPorPagarLista[],
          totalRecords: 0
        }
        if(response.code==="1"){
          let [mainData] = JSON.parse(response.payload as string);
          result.data = CuentaPorPagarRepositoryMapper.fromApiGetAll(mainData);
          result.totalRecords = result.data.length>0 ? result.data[0].totalRecords : 0

        }
        return result;

      })
    )

  }


  getCuotasData(){
    let json = JSON.stringify({
      tipo: 5,
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response=>{
        let result = {
          tiemposCredito: [] as TiempoCreditoSelectHtmlOnly[]
        }
        if(response.code==="1"){
          let [tempTiemposCredito] = JSON.parse(response.payload as string);

          result.tiemposCredito = tempTiemposCredito || []
        }
        return result
      })
    )
  }
  getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar:number){
    let json = JSON.stringify({
      tipo: 2,
      idCuentaPorPagar
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response=>{
        let result = {
          data: [] as CuentaPorPagarCuotaConfig[]
        }
        if(response.code==="1"){
          let [mainData] = JSON.parse(response.payload as string);
          result.data = CuentaPorPagarRepositoryMapper.fromApiCuotaConfig(mainData);
        }
        return result;
      })
    )
  }


  getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar:number){
    let json = JSON.stringify({
      tipo: 4,
      idCuentaPorPagar
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response=>{
        let result = {
          cuentaPorPagar: {} as Partial<CuentaPorPagarLista>,
          comprobantesEgreso: [] as ComprobanteEgresoLista[],
          historialPagos: [] as HistorialPagoLista[],
          pagosDetalle: [] as PagoDetalleLista[]
        }
        if(response.code==="1"){
          let mainData = JSON.parse(response.payload as string);
          console.log(mainData)
          result = CuentaPorPagarRepositoryMapper.fromApiHistMovimiento(mainData)
        }
        return result;
      })
    )

  }


  generarCuota(obj:any){
    let params = CuentaPorPagarRepositoryMapper.toApiGenerarCuota(obj);
    let json = JSON.stringify(params)
    return this.http.post<ApiResponse>(`${this.url}${json}`, null, {
      context: getNoLoader()
    })

  }


  actualizarCuotas<T>(id:number, obj:T){
    return this.http.post<ApiResponse>(`${this.url}${id}`, obj, {
      context: getNoLoader()
    })

  }

}
