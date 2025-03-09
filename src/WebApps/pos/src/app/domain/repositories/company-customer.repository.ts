
import { Observable } from "rxjs";
import {
  CompanyCustomerDataForm,
  CompanyCustomerRead,
  CompanyCustomerSearch
} from "@domain/models/company-customer.model";
import {ApiResponse} from "@domain/models/api-response";

export abstract class CompanyCustomerRepository {
  abstract dataForm(): Observable<CompanyCustomerDataForm>;
  abstract getAll<T>(obj: T): Observable<{
    data: CompanyCustomerRead[]
  }>;
  abstract getId(id: number, noLoader?: boolean): Observable<any>;
  abstract post<T>(obj: T): Observable<ApiResponse>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponse>;
  abstract search<T extends { textSearch: string }>(obj:T): Observable<ApiResponse<CompanyCustomerSearch[]>>;
}
