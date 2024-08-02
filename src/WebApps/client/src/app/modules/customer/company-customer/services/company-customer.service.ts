import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDENTIFICATION_CODE, PATHS_API } from '@core/constants/global.constants';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ApiResponse, isApiResponse } from '@core/models/api-response';
import { CompanyCustomerSearch } from '@modules/customer/company-customer/models/company-customer';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerService {
  //For customers of Acontplus Customers (cliente)
  private url = `${PATHS_API.FACT_ELECT}CompanyCustomer/`;
  constructor(private http: HttpClient) { }

  getAll<T extends {pageIndex:number;pageSize:number}>(obj:T){
    let json = JSON.stringify({
      ...obj,
      tipo: 1,
      pageIndex: obj.pageIndex,
      pageSize: obj.pageSize
    })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map(response=>{
        let results = [];
        if(isApiResponse(response)){
          if(response.code==="0"){
            console.log(response)
          }
          if(response.code==="1"){
            let mainData = JSON.parse(response.payload as string)[0];

            results = mainData.map((item:any)=>{
              let obj = {
                idCliente: item.idCliente,
                idTipoIdentificacion: item.idTipoIdentificacion,
                identificacionComprador: item.numeroIdentificacion,
                razonSocialComprador: item.nombreFiscal,
                nombreComercial: item.nombreComercial,
                direccion: item.direccion,
                telefono: item.telefono,
                correo: item.correo,
                consumidorFinal: item.consumidorFinal,
                validationSri: item.validationSri,
                tipoIdentificacion: item.tipoIdentificacion,
                codTipoIdentificacion: item.codTipoIdentificacion,
                estado: item.estado,
                esConsumidorFinal: item.codTipoIdentificacion === 'CF',
                totalRecords: item.totalRecords,
              }
              return obj;
            })
          }
        }
        return results;
      })
    )
  }

  async checkExistence(params: any) {
    return this.http
      .get(`${this.url}?json=${JSON.stringify({ ...params, tipo: 3 })}`)
      .pipe(map((response) => response));
  }

  get(params: any) {
    return this.http
      .get(`${this.url}?json=${JSON.stringify({ ...params, tipo: 1 })}`)
      .pipe(map((response: any) => response));
  }

  getById(id: number) {
    return this.http.get(`${this.url}${id}`).pipe(map((response) => response));
  }

  /**
   * mejora
   */
  getId(id: number) {
    return this.http.get(`${this.url}GetId/${id}`).pipe(
      map((response) => {
        let result = {} as any;
        if (isApiResponse(response)) {
          if (response.code === "0") {
            console.log(response)
          }
          if (response.code === "1") {
            let dataRepository = JSON.parse(response.payload as string)[0];

            result = {
              idCliente: dataRepository.idCliente,
              idTipoClienteProveedor: dataRepository.idTipoClienteProveedor,
              idTipoEntidad: dataRepository.idTipoEntidad,
              idSubContribuyente: dataRepository.idSubContribuyente,
              idTiempoCredito: dataRepository.idTiempoCredito,
              idTipoIdentificacion: dataRepository.idTipoIdentificacion,
              idCiudad: dataRepository.idCiudad,
              numeroIdentificacion: dataRepository.numeroIdentificacion,
              identificacionComprador: dataRepository.numeroIdentificacion,
              razonSocialComprador: dataRepository.nombreFiscal,
              nombreFiscal: dataRepository.nombreFiscal,
              montoCredito: dataRepository.montoCredito,
              nombreComercial: dataRepository.nombreComercial,
              direccion: dataRepository.direccion,
              telefono: dataRepository.telefono,
              correo: dataRepository.correo,
              estado: dataRepository.estado,
              idEmpleado: dataRepository.idEmpleado,
              diasCredito: dataRepository.diasCredito,
              empleado: dataRepository.empleado,
              idEmpresa: dataRepository.idEmpresa,
              idCargo: dataRepository.idCargo,
              placa: dataRepository.placa,
              validationSri: dataRepository.validationSri,
              correos: dataRepository.correo ? dataRepository.correo.split('|') : [],
              telefonos: dataRepository.telefono ? dataRepository.telefono.split('|') : [],
              placas: dataRepository.placa !== '' ? dataRepository.placa.split('|') : [],
              idFormaPagoSri: dataRepository.idFormaPagoSri
            }
          }

        }

        return result;
      })
    );
  }

  // getDataForm() {
  //   return this.http
  //     .get(this.url + '?json=' + JSON.stringify({ tipo: 2 }))
  //     .pipe(map((response) => response));
  // }

  /**
   * mejora
   * @returns
   */
  getDataForm() {
    let json = JSON.stringify({
      tipo: 2
    })
    console.log('kjdhkjdhkjhk')
    return this.http.get(`${this.url}?json=${json}`).pipe(
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
        if (isApiResponse(response)) {
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
        }
        return result;
      })
    )
  }

  post(data: any) {
    return this.http
      .post(this.url, { data: data })
      .pipe(map((response) => {
        let result = {} as ApiResponse
        if(isApiResponse(response)){
          let payload = JSON.parse(response.payload as string)[0]
          result = response;
          result.payload = {
            id: payload.idCliente
          }
        }
        return result
      }));
  }

  put(id: number, data: any) {
    return this.http
      .put(`${this.url}${id}`, { data: data })
      .pipe(map((response) => response));
  }

  search<T extends { textSearch: string }>(
    data: T
  ): Observable<Array<CompanyCustomerSearch>> {
    let query = {
      textSearch: data.textSearch,
    };
    return this.http
      .get(`${this.url}Search?json=${JSON.stringify(query)}`, {
        context: getNoLoader()
      })
      .pipe(
        map((response) => {
          if (isApiResponse(response)) {
            let customers =
              (response.payload && JSON.parse(response.payload as string)) ||
              [];
            return customers || [];
          }
          return [];
        })
      );
  }

  updateState(id:number){
    return this.http.delete(`${this.url}${id}`)
  }
}
