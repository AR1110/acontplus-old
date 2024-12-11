import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
 import { ACCOUNTING_PATHS } from '@accounting/core/enums/accounting.constants';
import { delay } from 'rxjs';
import {ComprobanteIngresoRepository} from "@accounting/core/repositories/comprobante-ingreso.repository";

@Injectable({
  providedIn: 'root'
})
export class CompIngresoApiDelayRepository extends ComprobanteIngresoRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_INGRESO}`
  constructor(private http:HttpClient) {
    super()
  }

  getAll<T>(obj:T)  {
    console.log(obj)
    let json = JSON.stringify({
      tipo: 1
    })
    return this.http.get<any[]>(`${this._url}?json=${json}`).pipe(delay(3000));
  }

}
