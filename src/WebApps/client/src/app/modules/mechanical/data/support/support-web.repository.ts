import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { pricingCalculateUtil } from '@core/utils/pricing-calculate.util';
import { roundNumber } from '@core/utils/round-number.utils';
import { isValidField } from '@core/utils/utils';
import { mergeMeasureUtil } from '@modules/inventory/utils/merge-measure.util';
import {map, Observable} from 'rxjs';
import { ApiResponse } from "@core/models/api-response";
import { MECHANICAL_PATHS } from '@mechanical/domain/enums/mechanical.enum';
import { SupportDetail } from '@mechanical/domain/models/support.model';
import {SupportRepository} from "@mechanical/domain/repositories/support.repository";
import {MedidaProducto} from "@inventory/domain/models/measure.model";
import {SupportMapper} from "@mechanical/data/support/support.mapper";

@Injectable({
  providedIn: 'root'
})
export class SupportWebRepository extends SupportRepository {
  #url = `${PATHS_API.MECHANICAL}${MECHANICAL_PATHS.SUPPORT}`
  #http = inject(HttpClient)


  getAll<T>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 1
    })
    return this.#http.get(`${this.#url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response: any) =>  SupportMapper.fromApiGetAll(response))
    )
  }

  getDataFilter(){
    let json = JSON.stringify({
      tipo: 8
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response: any) => SupportMapper.fromApiFilter(response))
    )
  }

  getDataForm() {
    let json = JSON.stringify({
      tipo: 2
    })
    return this.#http.get<ApiResponse>(`${this.#url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response) => SupportMapper.fromApiDataForm(response))
    )
  }

  getId(id: number) {
    let json = JSON.stringify({
      id,
      tipo: 3
    })
    return this.#http.get(`${this.#url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map((response: any) => SupportMapper.fromApiGetId(response))
    )
  }

  getDashboard(){
    let json = JSON.stringify({
      tipo: 6
    })
    return this.#http.get<ApiResponse>(`${this.#url}?json=${json}`).pipe(
      map((response) =>SupportMapper.fromApiDashboard(response))
    )
  }

  getConvertToAprobDoc(id:number){
    let json = JSON.stringify({
      tipo: 5,
      id
    })
    return this.#http.get<ApiResponse>(`${this.#url}?json=${json}`).pipe(
      map((response) => SupportMapper.fromApiGetAprobacion(response)))
  }

  getDocView(id:number){
    let json = JSON.stringify({
      tipo: 7,
      id
    })
    return this.#http.get(`${this.#url}?json=${json}`).pipe(
      map((response:any)=>{
        let result = {} as any;
        if(response!==null && typeof response==='object'){
          let mainData = response.comprobante[0];
          result = mainData;
        }
        return result;
      })
    )
  }


  override generateSequential(idPuntoEmision: number): Observable<string> {
    let params = {
      tipo: 9,
      idPuntoEmision
    }
    return this.#http.get<ApiResponse>(`${this.#url}?json=${JSON.stringify(params)}`).pipe(
      map(res=>{
        let secuencual = "" as string;
        if(res.code==="1"){
          let {sequence}=JSON.parse(res.payload as string);

          secuencual = sequence[0].serieComprobante;
        }
        return secuencual;
      })
    )
  }

  search<T extends { textSearch: string }>(obj: T) {
    let json = JSON.stringify({
      tipo: 4,
      textSearch: obj.textSearch
    })
    return this.#http.get<ApiResponse>(`${this.#url}?json=${json}`,{
      context: getNoLoader()
    }).pipe(
      map((response) => SupportMapper.fromApiSearch(response) )
    )
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponse>(`${this.#url}`, { data })
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponse>(`${this.#url}${id}`, { data })
  }

  remove(id:number){
    return this.#http.delete<ApiResponse>(`${this.#url}${id}`)
  }

  putState(id: number, supportStatusId: number) {
    return this.#http.put<ApiResponse>(`${this.#url}PutState/${id}/${supportStatusId}`, null)
  }


}
