import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '../enums/accounting.constants';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { groupEstabUtil } from '@core/utils/group-estab.util';
import { GroupedEstab } from '@core/models/estab.model';
import { CuentaPorPagarCuotaConfig, CuentaPorPagarLista } from './cuenta-por-pagar.interface';
import { CuentaPorPagarAdapter } from './cuenta-por-pagar.adapter';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { TiempoCreditoSelectHtmlOnly } from '../interfaces/tiempo-credito.interface';

@Injectable({
  providedIn: 'root'
})
export class CuentaPorPagarService {
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
          let [tempEstabs, tempEstadosDoc, tempTiposDoc, tempCategorias] = JSON.parse(response.payload as string);


          let dataToGroup = {
            estabs: tempEstabs,
            isGroupPuntoEmision: true
          }
          resultData.estabs = groupEstabUtil(dataToGroup);
          resultData.estadosDoc = tempEstadosDoc;
          resultData.tiposDoc = tempTiposDoc;
          resultData.categorias = tempCategorias;
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
          data: [] as CuentaPorPagarLista[]
        }
        if(response.code==="1"){
          let [mainData] = JSON.parse(response.payload as string);

          result.data = CuentaPorPagarAdapter.fromApiGetAll(mainData)

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
          result.data = CuentaPorPagarAdapter.fromApiCuotaConfig(mainData);
        }
        return result;
      })
    )
  }



}
