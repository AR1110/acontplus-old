import {inject, Injectable} from '@angular/core';
import {PATHS_API} from "@core/constants/global.constants";
import {ACCOUNTING_PATHS} from "@accounting/enums/accounting.constants";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import {
  ComprobanteEgresoRepositoryMapper
} from "@accounting/comprobante-egreso/data/comprobante-egreso.repository.mapper";
import {getNoLoader} from "@core/interceptors/loader.interceptor";
import {EntidadFinanciera, EntidadFinancieraPago} from "@accounting/interfaces/entidad-financiera.interface";

@Injectable({
  providedIn: 'root'
})
export class ComprobanteEgresoRepository {

  private url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_EGRESO}`
  private http = inject(HttpClient);


  getCuotasByIdCuentaPorPagar(idCuentaPorPagar: number){
    let json = JSON.stringify({
      tipo: 4,
       idCuentaPorPagar,
    })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map(response=>{
        let results = {
          cuotas: [] as any[]
        }
        if(response && typeof response==='object'){
          console.log(response)
          results.cuotas = ComprobanteEgresoRepositoryMapper.fromApiCuotasByICuentaPorPagar(response)
        }
        return results;
      })

    )
  }


  getDataFormPago(idProveedor:number){

    let json = JSON.stringify({
      tipo: 3,
      idProveedor,
    })
    return this.http.get(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response=>{
        let results = {
          entidadesFinanciera: [] as EntidadFinanciera[]
        }
        if(response && typeof response==='object'){
          results = ComprobanteEgresoRepositoryMapper.fromApiDataForm(response)
        }
        return results;
      })

    )


  }

}
