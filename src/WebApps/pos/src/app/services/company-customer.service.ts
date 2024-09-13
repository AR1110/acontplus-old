import { inject, Injectable } from '@angular/core';
import { PATHS, PATHS_API, STRING_SPLIT_REGEX } from "@/enums/main.enum";
import { HttpClient, HttpContext } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ApiResponse } from "@/models/api-response";
import { CompanyCustomerRead, CompanyCustomerSearch } from "@/models/company-customer.model";
import { Observable } from "rxjs";
import { getValidId, isValidField } from "@core/utils/utils";
import { getNoLoader } from '@/core/interceptors/loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class CompanyCustomerService {
  private url = `${PATHS_API.BILLING}${PATHS.COMPANY_CUSTOMER}`
  private http = inject(HttpClient)

  getDataForm() {
    let json = JSON.stringify({
      tipo: 2
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map(response => {
        let result = {
          tipoIdentificacion: [],
          tipoContribuyentes: [],
          tiempoCreditos: [],
          ciudades: [],
          tiposCliente: [],
          empresas: [],
          cargos: [],
          formasPagoSri: [],
        }
        if (response.code === "1") {
          let mainData = JSON.parse(response.payload as string);

          result.tipoIdentificacion = mainData[0];
          result.tipoContribuyentes = mainData[1];
          result.tiempoCreditos = mainData[2] || [];
          result.ciudades = mainData[3];
          result.tiposCliente = mainData[4] || [];
          result.empresas = mainData[5] || [];
          result.cargos = mainData[6] || [];
          result.formasPagoSri = mainData[7] || [];

        }
        return result;
      })
    )
  }
  getAll<T>(obj: T) {
    let json = JSON.stringify({
      tipo: 1,
      ...obj
    })
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let results: CompanyCustomerRead[] = []
        if (response.code === "1") {
          let [data] = JSON.parse(response.payload as string);

          results = data.map((item: any) => {
            return {
              idCliente: item.idCliente,
              idTipoIdentificacion: item.idTipoIdentificacion,
              numeroIdentificacion: item.numeroIdentificacion,
              nombreComercial: item.nombreComercial,
              razonSocial: item.nombreFiscal,
              direccion: item.direccion,
              telefono: item.telefono,
              correo: item.correo,
              consumidorFinal: item.consumidorFinal,
              validationSri: item.validationSri,
              estado: item.estado,
              totalRecords: item.totalRecords
            }
          })
        }
        return results;
      })
    )

  }

  getId(id: number, noLoader?: boolean) {
    return this.http.get<ApiResponse>(`${this.url}GetId/${id}`, {
      context: noLoader ? getNoLoader() : new HttpContext()
    }).pipe(
      map((response) => {
        let result = {} as any;

        if (response.code === "0") {
          console.log(response)
        }
        if (response.code === "1") {
          let dataRepository = JSON.parse(response.payload as string)[0];

          let { correo, telefono, placa, ...data } = dataRepository;

          const correos = correo ? correo.split(STRING_SPLIT_REGEX) : [];
          const telefonos = telefono ? telefono.split(STRING_SPLIT_REGEX) : [];
          const placas = placa ? placa.split(STRING_SPLIT_REGEX) : [];

          result = {
            idCliente: data.idCliente,
            idTipoClienteProveedor: data.idTipoClienteProveedor,
            idTipoEntidad: data.idTipoEntidad,
            idSubContribuyente: data.idSubContribuyente,
            idTiempoCredito: data.idTiempoCredito,
            idTipoIdentificacion: data.idTipoIdentificacion,
            idCiudad: data.idCiudad,
            numeroIdentificacion: data.numeroIdentificacion,
            identificacionComprador: data.numeroIdentificacion,
            razonSocialComprador: data.nombreFiscal,
            nombreFiscal: data.nombreFiscal,
            montoCredito: data.montoCredito,
            nombreComercial: data.nombreComercial,
            direccion: data.direccion,
            estado: data.estado,
            idEmpleado: data.idEmpleado,
            empleado: data.empleado,
            idEmpresa: data.idEmpresa,
            idCargo: data.idCargo,
            validationSri: data.validationSri,
            correos,
            telefonos,
            placas,
            idFormaPagoSri: dataRepository.idFormaPagoSri,
            codigoSri: dataRepository.codigoSri
          }
        }

        return result;
      })
    );
  }

  search<T extends { textSearch: string }>(
    data: T
  ): Observable<Array<CompanyCustomerSearch>> {
    let query = {
      textSearch: data.textSearch,
    };
    return this.http
      .get<ApiResponse>(`${this.url}Search?json=${JSON.stringify(query)}`, {
        context: getNoLoader()
      })
      .pipe(
        map((response) => {
          let results: CompanyCustomerSearch[] = []

          if (response.code === "1") {
            let customers = (response.payload && JSON.parse(response.payload as string)) || [];

            results = customers.map((item: any) => {
              return {
                customerId: item.customerId,
                idCliente: item.idCliente,
                razonSocialComprador: item.nombreFiscal,
                identificacionComprador: item.numeroIdentificacion,
                nombreComercial: item.nombreComercial,
                name: item.nombreComercial,
                codigoSri: item.codigoSri
              }
            })
          }
          return results;
        })
      );
  }

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
  
  post<T>(data: T) {
    return this.http.post<ApiResponse>(this.url, { data }).pipe(map((response) => {
      if (response.code === "1") {
        let payload = JSON.parse(response.payload as string)[0]
        response.payload = {
          id: payload.idCliente
        }
      }
      return response;
    }));
  }

  put<T>(id: number, data: T) {
    return this.http.put<ApiResponse>(`${this.url}${id}`, { data })
  }


  adapterTo(data: any) {

    return {
      idCliente: getValidId(data.idCliente),
      idEmpleado: getValidId(data.idEmpleado),
      idTipoIdentificacion: data.idTipoIdentificacion,
      idTipoClienteProveedor: getValidId(data.idTipoClienteProveedor),
      idTipoEntidad: getValidId(data.idTipoEntidad),
      idCiudad: getValidId(data.idCiudad),
      idSubContribuyente: getValidId(data.idSubContribuyente),
      idTiempoCredito: data.idTiempoCredito,
      idEmpresa: getValidId(data.idEmpresa),
      idCargo: getValidId(data.idCargo),
      numeroIdentificacion: data.numeroIdentificacion,
      nombreFiscal: data.nombreFiscal,
      nombreComercial: data.nombreComercial,
      direccion: isValidField(data.direccion),
      telefono: isValidField(data.telefono),
      correo: isValidField(data.correo),
      placa: isValidField(data.placa),
      montoCredito: isValidField(data.montoCredito),
      nota: isValidField(data.nota),
      validationSri: data.validationSri,
      idFormaPagoSri: getValidId(data.idFormaPagoSri),
      estado: data.estado || true
    }

  }

}
