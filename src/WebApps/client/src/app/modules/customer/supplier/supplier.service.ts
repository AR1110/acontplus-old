import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CUSTOMER_PATHS } from "../enums/customer.enum";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { ApiResponse } from "@core/models/api-response";
import { SupplierAdapter } from "./supplier.adapter";
import { SupplierSearch } from "./supplier.interface";


@Injectable({
  providedIn:'root'
})
export class SupplierService {
  private url = `${PATHS_API.PURCHASE}${CUSTOMER_PATHS.PROVEEDOR}`;
  private http = inject(HttpClient)


  search<T extends {textSearch: string}>(obj:T){
    let json = JSON.stringify({
      tipo: 5,
      textSearch: obj.textSearch
    })

    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response=>{
        let suppliers:SupplierSearch[] = [];

        if(response && response.code==="1"){
          let {proveedores} = JSON.parse(response.payload as string);
          suppliers = SupplierAdapter.fromApiSearch(proveedores)
        }
        return suppliers;
      })
    )

  }

}
