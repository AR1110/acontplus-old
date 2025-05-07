import {inject, Injectable} from "@angular/core";
import {PATHS_API, SEPARADORES_REGEX} from "@core/constants/global.constants";
import {HttpClient, HttpContext} from "@angular/common/http";
import {ApiResponse, isApiResponse} from "@core/models/api-response";
import {map, Observable} from "rxjs";
import {CompanyCustomerRepository} from "@customer/domain/repositories/company-customer.repository";
import {CompanyCustomerMapper} from "@customer/data/company-customer/company-customer.mapper";
import {getNoLoader} from "@core/interceptors/loader.interceptor";
import {CompanyCustomerSearch} from "@customer/domain/models/company-customer";


@Injectable({
  providedIn: 'root'
})
export class CompanyCustomerWebRepository extends CompanyCustomerRepository{

  private _url =  `${PATHS_API.FACT_ELECT}CompanyCustomer/`;
  private _http = inject(HttpClient);


  constructor() {
    super();
  }

  getAll<T extends { pageIndex: number; pageSize: number }>(obj: T) {
    let json = JSON.stringify({
      ...obj,
      tipo: 1,
      pageIndex: obj.pageIndex,
      pageSize: obj.pageSize,
    });
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        let results = [];
          if (response.code === '1') {
            results = CompanyCustomerMapper.fromApiGetAll( JSON.parse(response.payload as string))
          }

        return results;
      }),
    );
  }

  getDataForm() {
    let json = JSON.stringify({
      tipo: 2,
    });
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        let result = {
          tipoIdentificacion: [],
          tipoContribuyentes: [],
          tiempoCreditos: [],
          ciudades: [],
          tiposCliente: [],
          empresas: [],
          cargos: [],
          formasPagoSri: [],
        };

          if (response.code === '1') {
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
      }),
    );
  }


  getId(id: number, noLoader?: boolean) {
    return this._http.get(`${this._url}GetId/${id}`, {
        context: noLoader ? getNoLoader() : new HttpContext()
      }
    ).pipe(
      map((response) => {
        let result = {} as any;
        if (isApiResponse(response)) {
          if (response.code === '0') {
            console.log(response);
          }
          if (response.code === '1') {
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
              codigoSri: dataRepository.codigoSri,
              correos: dataRepository.correo
                ? dataRepository.correo.split(SEPARADORES_REGEX)
                : [],
              telefonos: dataRepository.telefono
                ? dataRepository.telefono.split(SEPARADORES_REGEX)
                : [],
              placas:
                dataRepository.placa !== ''
                  ? dataRepository.placa.split(SEPARADORES_REGEX)
                  : [],
              idFormaPagoSri: dataRepository.idFormaPagoSri,
            };
          }
        }

        return result;
      }),
    );
  }

  search<T extends { textSearch: string }>(
    data: T,
  ): Observable<Array<CompanyCustomerSearch>> {
    let query = {
      textSearch: data.textSearch,
    };
    return this._http
      .get<ApiResponse>(`${this._url}Search?json=${JSON.stringify(query)}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          let customers = [] as any[];
          if (response && response.code === "1") {
            let results = JSON.parse(response.payload as string) || [];

            customers = CompanyCustomerMapper.fromApiSearch(results)
          }
          return customers;
        }),
      );
  }

  checkExistence<T>(params: T) {
    let json = JSON.stringify({ ...params, tipo: 3 })
    return this._http
      .get<ApiResponse>(`${this._url}?json=${json}`)
  }

  updateState(idCliente: number) {
    return this._http.delete<ApiResponse>(`${this._url}${idCliente}`);
  }

  post<T>(obj: T) {
    let data = CompanyCustomerMapper.toSave(obj);

    return this._http.post<ApiResponse>(this._url, { data }).pipe(
      map((response) => {
        let result = response;
        if (response.code==="1") {
          let payload = JSON.parse(response.payload as string)[0];
          result = response;
          result.payload = {
            id: payload.idCliente,
          };
        }
        return result;
      }),
    );
  }

  put<T>(id: number, obj: T) {
    let data = CompanyCustomerMapper.toSave(obj);
    return this._http
      .put<ApiResponse>(`${this._url}${id}`, { data })
  }

}
