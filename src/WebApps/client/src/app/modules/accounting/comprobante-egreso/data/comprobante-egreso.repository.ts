import { inject, Injectable } from '@angular/core';
import { PATHS_API } from "@core/constants/global.constants";
import { ACCOUNTING_PATHS } from "@accounting/enums/accounting.constants";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import {
  ComprobanteEgresoRepositoryMapper
} from "@accounting/comprobante-egreso/data/comprobante-egreso.repository.mapper";
import { getNoLoader } from "@core/interceptors/loader.interceptor";
import { EntidadFinanciera, EntidadFinancieraPago } from "@accounting/interfaces/entidad-financiera.interface";
import { SubEntidadFinancieraSelectHtmlOnly } from "@accounting/interfaces/subentidad-financiera.interface";
import { BancoSelectOnly } from "@accounting/interfaces/banco.interface";
import { EstadoPago } from "@accounting/interfaces/estado-pago.interface";
import { ProvinciaCiudad } from "@shared/models/ciudad.interface";
import { CuotaPorPagarLista } from '@modules/accounting/interfaces/cuota-por-pagar.interface';
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root'
})
export class ComprobanteEgresoRepository {

  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_EGRESO}`
  private http = inject(HttpClient);


  getCuotasByIdCuentaPorPagar(idCuentaPorPagar: number) {
    let json = JSON.stringify({
      tipo: 4,
      idCuentaPorPagar,
    })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map(response => {
        let results = {
          cuotas: [] as CuotaPorPagarLista[]
        }
        if (response && typeof response === 'object') {
          results.cuotas = ComprobanteEgresoRepositoryMapper.fromApiCuotasByICuentaPorPagar(response)
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
    return this.http.get(`${this.url}?json=${json}`, {
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
          results = ComprobanteEgresoRepositoryMapper.fromApiDataForm(response)
        }
        return results;
      })

    )


  }

  post(obj:any){
    let params = ComprobanteEgresoRepositoryMapper.toApiPost(obj);

    console.log(params)
   throw new Error("params")
    return this.http.post<ApiResponse>(`${this.url}`, params)
  }

}
