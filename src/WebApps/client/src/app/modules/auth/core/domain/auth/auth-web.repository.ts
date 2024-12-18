import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/core/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {ApiResponse } from "@core/models/api-response";
import {map} from "rxjs";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {AnticipoMapper} from "@accounting/data/anticipo/anticipo.mapper";


@Injectable({
  providedIn: 'root'
})
export class AuthWebRepository implements AnticipoRepository{

  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.ANTICIPO}`
  private _http = inject(HttpClient);


  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })

    return this._http.get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(
        map(response => {
            if (response.code === "1") {
              return AnticipoMapper.fromApiGetAll(JSON.parse(response.payload as string));
            }
          return []
        })
      )
  }

  getDataFilter(){

    let json = JSON.stringify({ tipo: 3 })
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(
        map(response => {
            if (response.code === "1") {
              let mainData = JSON.parse(response.payload as string);
              const { establecimiento } = mainData;
              return {
                establecimientos: establecimiento
              }
            }
          return {
            establecimientos: []
          }
        })
      )
  }

  getDataForm(){
    let json = JSON.stringify({ tipo: 2 })
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(
        map((response) => {
          let
            entidadesFinanciera = [],
            establecimientos = [],
            subEntidadesFinanciera = [];
          if (response.code==="1") {
            let mainData = JSON.parse(response.payload as string);
            const { entidadFinanciera, establecimiento, subEntidadFinanciera } = mainData;

            entidadesFinanciera = entidadFinanciera;
            establecimientos = establecimiento;
            subEntidadesFinanciera = subEntidadFinanciera;
          }
          return {
            entidadesFinanciera,
            establecimientos,
            subEntidadesFinanciera,
          }
        })
      )
  }

  delete(id: number) {
    return this._http
      .delete<ApiResponse>(`${this._url}${id}`)
  }

  create(data: any) {
    return this._http
      .post<ApiResponse>(`${this._url}`, data)
  }

  update<T>(id: number, data: T) {
    return this._http
      .put<ApiResponse>(`${this._url}${id}`, data)
  }

}
