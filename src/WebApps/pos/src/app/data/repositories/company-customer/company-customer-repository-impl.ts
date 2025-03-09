
import { ApiResponse } from '@/domain/models/api-response';
import {inject, Injectable} from '@angular/core';
import {CompanyCustomerRepository} from "@domain/repositories/company-customer.repository";
import {HttpClient, HttpContext} from "@angular/common/http";
import {map} from "rxjs/operators";
import {PATHS, PATHS_API } from "@domain/enums/main.enum";
import {
  CompanyCustomerDataForm,
  CompanyCustomerRead,
  CompanyCustomerSearch
} from "@domain/models/company-customer.model";
import {CompanyCustomerDataFormMapper} from "@data/repositories/company-customer/company-customer-data-form.mapper";
import {getNoLoader} from "@core/interceptors/loader.interceptor";
import {CompanyCustomerGetAllMapper} from "@data/repositories/company-customer/company-customer-get-all.mapper";
import {CompanyCustomerGetIdMapper} from "@data/repositories/company-customer/company-customer-get-id.mapper";
import {CompanyCustomerPostMapper} from "@data/repositories/company-customer/company-customer-post.mapper";
import {Observable} from "rxjs";
import {CompanyCustomerSearchMapper} from "@data/repositories/company-customer/company-customer-search.mapper";

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerRepositoryImpl extends CompanyCustomerRepository {
  private _http = inject(HttpClient)
  private _url = `${PATHS_API.BILLING}${PATHS.COMPANY_CUSTOMER}`;


   dataForm()  {
       let json = JSON.stringify({
         tipo: 2
       })
       return this._http.get<ApiResponse>(`${this._url}?json=${json}`).pipe(
         map(response => {
           let result = new CompanyCustomerDataForm()
           if (response.code === "1") {
             let mainData = JSON.parse(response.payload as string);
             result = CompanyCustomerDataFormMapper.fromJson(mainData);
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
    return this._http.get<ApiResponse>(`${this._url}?json=${json}`, {
      context: getNoLoader()
    }).pipe(
      map(response => {
        let results: CompanyCustomerRead[] = []
        if (response.code === "1") {
          let [data] = JSON.parse(response.payload as string);

          results =  CompanyCustomerGetAllMapper.fromJson(data)
          }
        return {
          data: results
          }

      })
    )

  }


  getId(id: number, noLoader?: boolean) {
    return this._http.get<ApiResponse>(`${this._url}GetId/${id}`, {
      context: noLoader ? getNoLoader() : new HttpContext()
    }).pipe(
      map((response) => {
        let result = {} as any;
        if (response.code === "0") {
          console.log(response)
        }
        if (response.code === "1") {
          let dataRepository = JSON.parse(response.payload as string)[0];
          result =  CompanyCustomerGetIdMapper.fromJson(dataRepository)
        }
        return result;
      })
    );
  }


  post<T>(params: T) {
     let data = CompanyCustomerPostMapper.toJson(params)
    return this._http.post<ApiResponse>(this._url, { data })
      .pipe(
        map((response) => {
      if (response.code === "1") {
        let payload = JSON.parse(response.payload as string)[0]
        response.payload = {
          id: payload.idCliente
        }
      }
      return response;
    }));
  }

  put<T>(id: number, params: T) {
    let data = CompanyCustomerPostMapper.toJson(params)
    return this._http.put<ApiResponse>(`${this._url}${id}`, { data })
  }




  search<T extends { textSearch: string }>( data: T )  {
    let query = {
      textSearch: data.textSearch,
    };
    return this._http
      .get<ApiResponse<any>>(`${this._url}Search?json=${JSON.stringify(query)}`, {
        context: getNoLoader()
      })
      .pipe(
        map((response) => {
          if (response.code === "1") {
            let customers = (response.payload && JSON.parse(response.payload as string)) || [];
            response.payload = CompanyCustomerSearchMapper.fromJson(customers)
          }else{
            response.payload = []
          }
          return response;
        })
      );
  }

}
