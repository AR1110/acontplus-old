import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";
import {CompanyCustomerSearch, SearchCompanyCustomerParams} from "@customer/domain/models/company-customer";

export abstract class CompanyCustomerRepository {
  abstract getAll<T extends { pageIndex: number; pageSize: number }>(obj:T): Observable<any[]>;
  abstract updateState(idCliente: number): Observable<ApiResponse>
  abstract   checkExistence<T>(params: T): Observable<ApiResponse>
  abstract getDataForm():Observable<any>
  abstract getId(idCliente: number, loader?: boolean):Observable<any>
  abstract  put<T>(id: number, data: T): Observable<ApiResponse>
  abstract  post<T>(data: T): Observable<ApiResponse>

  abstract search (obj: SearchCompanyCustomerParams): Observable<CompanyCustomerSearch[]>
}
