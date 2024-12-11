import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/core/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {ApiResponse, isApiResponse} from "@core/models/api-response";
import {MovimientoCajaRepository} from "@accounting/core/repositories/movimiento-caja.repository";

@Injectable({
  providedIn: 'root',
})
export class MovimientoCajaWebRepository extends MovimientoCajaRepository{
 private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.MOVIMIENTO_CAJA}`;
 private _http = inject(HttpClient);

 constructor() {
   super();
 }

  getAll<T>(obj: T) {
    let json = JSON.stringify({ ...obj, tipo: 1 })

    return this._http.get<ApiResponse>(`${this._url}Get?json=${json}`)
      .pipe(
        map(response => {
            if (response.code === "1") {
              let { movimientos } = JSON.parse(response.payload as string)
              return movimientos;
            }
          return []
        })
      )
  }



  getDataFilter() {
    let json = JSON.stringify({ tipo: 3 })
    return this._http.get<ApiResponse>(`${this._url}Get?json=${json}`)
      .pipe(
        map(response => {
            if (response.code === "1") {
              let { establecimiento } = JSON.parse(response.payload as string)
              return {
                establecimientos: establecimiento
              };
            }
          return {
            establecimientos: []
          }
        })
      )
  }

  getDataForm() {
    let json = JSON.stringify({ tipo: 2 })
    return this._http.get<ApiResponse>(`${this._url}Get?json=${json}`)
      .pipe(
        map((response) => {
          let cajas = [],
            entidadesFinanciera = [],
            establecimientos = [],
            subEntidadesFinanciera = [],
            tiposDocumento = []
          if (response.code==="1") {
            let mainData = JSON.parse(response.payload as string);
            const { caja, entidadFinanciera, establecimiento, subEntidadFinanciera, tipoDocumento } = mainData;

            cajas = caja.map((c: any) => {
              return {
                idCaja: c.idCaja,
                descripcion: c.caja
              }
            }),
              entidadesFinanciera = entidadFinanciera;
            establecimientos = establecimiento;
            subEntidadesFinanciera = subEntidadFinanciera;
            tiposDocumento = tipoDocumento
          }
          return {
            cajas,
            entidadesFinanciera,
            establecimientos,
            subEntidadesFinanciera,
            tiposDocumento
          }
        })
      )
  }


  create<T>(data: T) {
    return this._http.post<ApiResponse>(`${this._url}`, { data })
  }

  update<T>(id: number, data: T) {
    return this._http.put<ApiResponse>(`${this._url}${id}`, { data })
  }

  delete(id: number) {
    return this._http.delete<ApiResponse>(`${this._url}${id}`)
  }



}
