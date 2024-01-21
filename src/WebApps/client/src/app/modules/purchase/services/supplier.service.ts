
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { PATHS_API } from '@core/constants/global.constants'
import { isApiResponse } from '@core/models/api-response'
import { PURCHASE_PATHS } from '@modules/purchase/constants/purchase.constants'
import { Observable, map } from 'rxjs'
import { SupplierSearch } from '../models/supplier.model'
@Injectable({
  providedIn: 'root'
})


export class SupplierService {

  private url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.SUPPLIER}`

  constructor(private http: HttpClient) { }

  search<T extends { textSearch: string }>(data: T): Observable<Array<SupplierSearch>> {
    let query = {
      textSearch: data.textSearch,
      tipo: 5
    }
    return this.http.get(`${this.url}?json=${JSON.stringify(query)}`)
      .pipe(
        map(response => {
          if (isApiResponse(response)) {
            let { proveedores } = response.payload && JSON.parse(response.payload as string) || [];
            console.log(proveedores)
            let results = proveedores || [];
            return results.map((proveedor: any) => {
              return {
                idProveedor: proveedor.idProveedor,
                numeroIdentificacion: proveedor.numeroIdentificacion,
                razonSocial: proveedor.razonSocial,
                tipoIdentificacion: proveedor.tipoIdentificacion,
                subContribuyente: proveedor.subContribuyente,
              }
            })
          }
          return []
        })
      )
  }


}
