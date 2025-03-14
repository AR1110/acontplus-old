import { inject, Injectable } from '@angular/core';
import { PATHS, PATHS_API, STRING_SPLIT_REGEX } from "@domain/enums/main.enum";
import { HttpClient, HttpContext } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ApiResponse } from "@domain/models/api-response";
import { CompanyCustomerRead, CompanyCustomerSearch } from "@domain/models/company-customer.model";
import { Observable } from "rxjs";
import { getValidId, isValidField } from "@domain/utils/utils";
import { getNoLoader } from '@core/interceptors/loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CompanyCustomerService {
  private url = `${PATHS_API.BILLING}${PATHS.COMPANY_CUSTOMER}`
  private http = inject(HttpClient)






  searchByNro(textSearch: string) {
    let json = JSON.stringify({
      tipo: 3,
      textSearch
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response => {
        if (response.code === "0") {
          const data: any = {
            customerCompanyId: 0,
            fiscalName: "",
            tradeName: "",
            identificationNumber: "",
            correo: "",
            telefono: "",
            direccion: ""
          }
          return data;
        }
        const mainData = JSON.parse(response.payload as string)[0][0]
        return {
          customerCompanyId: mainData.idCliente,
          identificationNumber: mainData.numeroIdentificacion,
          fiscalName: mainData.nombreFiscal,
          tradeName: mainData.nombreComercial,

          idSubContribuyente: mainData.idSubContribuyente,
          idTiempoCredito: mainData.idTiempoCredito,
          idTipoIdentificacion: mainData.idTipoIdentificacion,
          direccion: mainData.direccion,
          correo: mainData.correo,
          telefono: mainData.telefono,
        };

      })
    )
  }


  checkClientSRIByRUC(identificacion: string) {
    const url = `${PATHS_API.BILLING}${PATHS.CONSULTAS}`

    return this.http.get(`${url}GetRucSRI?Ruc=${identificacion.trim()}`).pipe(
      map(response => {
        const { email, telefono, ...rest } = response as any;

        const correos = email ? email.split(STRING_SPLIT_REGEX) : [];
        const telefonos = telefono ? telefono.split(STRING_SPLIT_REGEX) : [];

        return {
          ...rest,
          correos,
          telefonos
        }


      })
    )

  }

  checkClientSRIByCedula(identificacion: string) {
    const url = `${PATHS_API.BILLING}${PATHS.CONSULTAS}`
    return this.http.get(`${url}GetCedulaSri?Ruc=${identificacion.trim()}`).pipe(
      map(response => {
        const { email, telefono, ...rest } = response as any;

        const correos = email ? email.split(STRING_SPLIT_REGEX) : [];
        const telefonos = telefono ? telefono.split(STRING_SPLIT_REGEX) : [];

        return {
          ...rest,
          correos,
          telefonos
        }

      })
    )

  }



}
