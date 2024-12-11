import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ComprobanteIngresoRepository } from '@modules/accounting/core/repositories/comprobante-ingreso.repository';
import { ACCOUNTING_PATHS } from '@accounting/core/enums/accounting.constants';

@Injectable({
  providedIn: 'root'
})
export class CompIngresoApiRepository extends ComprobanteIngresoRepository{
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.COMPROBANTE_INGRESO}`
  constructor(private http:HttpClient) {
    super()
  }

  getAll<T>(obj:T)  {
    let json = JSON.stringify({
      tipo: 1
    })
    return this.http.get<any[]>(`${this._url}?json=${json}`)
  }

}
