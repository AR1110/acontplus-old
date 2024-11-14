
import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { PURCHASE_PATHS } from "../constants/purchase.constants";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "@core/models/api-response";
import { map, throwError } from "rxjs";
import { FacturaFisicaLista } from "./factura-fisica.interface";
import { FacturaFisicaRepositoryMapper } from "./factura-fisica.repository.mapper";
import { getNoLoader } from "@core/interceptors/loader.interceptor";


@Injectable({
  providedIn: 'root'
})

export class FacturaFisicaRepository {
  private url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.FACTURA_FISICA}`
  private http = inject(HttpClient);

  getDataFilter() {
    let json = JSON.stringify({
      tipo: 3,
    })
    return this.http.get<ApiResponse>(`${this.url}Get?json=${json}`).pipe(
      map(response => {
        if (response.code === "1") {
          let dataApi = JSON.parse(response.payload as string);

          return FacturaFisicaRepositoryMapper.fromApiDataFilter(dataApi)

        }
        return throwError(
          () => new Error('No se puedo cargar la data filter')
        );
      })
    )
  }


  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })
    return this.http.get<ApiResponse>(`${this.url}Get?json=${json}`).pipe(
      map(response => {
        let resultData = {
          data: [] as FacturaFisicaLista[],
          totalRecords: 0
        }
        if (response && response.code === "1") {
          let { facturas } = JSON.parse(response.payload as string);

          resultData.data = FacturaFisicaRepositoryMapper.fromApiGetAll(facturas)

          if (resultData.data.length > 0) {
            resultData.totalRecords = resultData.data[0].totalRecords;
          }

        }

        return resultData;
      })
    )
  }

  getDetalleCompleto(id: number) {
    let json = JSON.stringify({
      tipo: 5,
      id
    })
    return this.http.get<ApiResponse>(`${this.url}Get?json=${json}`).pipe(
      map(response => {
        let resultData = {} as any
        if (response && response.code === "1") {
          let mainData = JSON.parse(response.payload as string);
          resultData = FacturaFisicaRepositoryMapper.fromApiDetalleCompleto(mainData)

        }

        return resultData;
      })
    )
  }


  getDataForm(){
    let json = JSON.stringify({
      tipo: 2
    })

    return    this.http.get<ApiResponse>(`${this.url}Get?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response=>{
        if(response.code==="1"){
          let dataApi = JSON.parse(response.payload as string);
          return FacturaFisicaRepositoryMapper.fromApiDataForm(dataApi)
        }

        throw new Error('No se pudo cargar datos para formulario');

      })
    )

  }

}
