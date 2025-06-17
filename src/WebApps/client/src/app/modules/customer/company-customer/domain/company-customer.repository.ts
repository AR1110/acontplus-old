import { ApiResponse } from "@core/models/api-response";
import { Observable } from "rxjs";
import {
  CompanyCustomerSearch, FormDataCompanyCustomerResponse,
  ListCompanyCustomerResponse,
  SearchCompanyCustomerParams
} from "@company-customer/domain/entities/company-customer.entity";
import {UpdateCompanyCustomerParamsDto} from "@company-customer/domain/dtos/company-customer.dto";

export abstract class CompanyCustomerRepository {
  abstract getAll<T extends { pageIndex: number; pageSize: number }>(obj:T): Observable<ListCompanyCustomerResponse>;
  abstract updateState(idCliente: number): Observable<ApiResponse>
  abstract   checkExistence<T>(params: T): Observable<ApiResponse>
  abstract getDataForm():Observable<FormDataCompanyCustomerResponse>
  abstract getId(idCliente: number, loader?: boolean):Observable<any>
  abstract  put(params:UpdateCompanyCustomerParamsDto): Observable<ApiResponse>
  abstract  post<T>(data: T): Observable<ApiResponse>

  abstract search (obj: SearchCompanyCustomerParams): Observable<CompanyCustomerSearch[]>
}
