import {inject, Injectable} from "@angular/core";
import {PATHS_API} from "@core/constants/global.constants";
import {HttpClient, HttpContext} from "@angular/common/http";
import {ApiResponse} from "@core/models/api-response";
import {map } from "rxjs";
import {CompanyCustomerRepository} from "@customer/domain/repositories/company-customer.repository";
import {CompanyCustomerMapper} from "@customer/data/company-customer/company-customer.mapper";
import {getNoLoader} from "@core/interceptors/loader.interceptor";
import { SearchCompanyCustomerParams} from "@customer/domain/models/company-customer";
import {SearchCompanyCustomerMapper} from "@customer/data/company-customer/search-company-customer.mapper";
import {GetIdCompanyCustomerMapper} from "@customer/data/company-customer/get-id-company-customer.mapper";


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
    return this._http.get<ApiResponse>(`${this._url}GetId/${id}`, {
        context: noLoader ? getNoLoader() : new HttpContext()
      }
    ).pipe(
      map((response) => GetIdCompanyCustomerMapper.fromJson(response)),
    );
  }

  search(obj: SearchCompanyCustomerParams) {
   const json = SearchCompanyCustomerMapper.toJson(obj)
    return this._http
      .get<ApiResponse>(`${this._url}Search?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(map((response) => SearchCompanyCustomerMapper.fromJson(response)));
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
