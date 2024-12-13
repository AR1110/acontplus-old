import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";
import {MatPagination} from "@shared/models/pagination.model";
import {CompanyCustomerSearch} from "@customer/core/domain/company-customer";

export abstract class CompanyCustomerRepository {
  abstract getAll<T extends { pageIndex: number; pageSize: number }>(obj:T): Observable<any[]>;
  abstract updateState(idCliente: number): Observable<ApiResponse>
  abstract   checkExistence<T>(params: T): Observable<ApiResponse>
  abstract getDataForm():Observable<any>
  abstract getId(idCliente: number, loader?: boolean):Observable<any>
  abstract  put<T>(id: number, data: T): Observable<ApiResponse>
  abstract  post<T>(data: T): Observable<ApiResponse>

  abstract search<T extends { textSearch: string }>(obj: T): Observable<CompanyCustomerSearch[]>
}
