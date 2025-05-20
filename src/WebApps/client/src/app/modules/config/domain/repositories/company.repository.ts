import {Observable} from "rxjs";
import {CompanyList, ListCompanyResponse} from "@modules/config/domain/models/company.model";
import {ApiResponse} from "@core/models/api-response";

export abstract class CompanyRepository {
  abstract list(): Observable<ListCompanyResponse>
  abstract update(params:Partial<CompanyList>):Observable<ApiResponse>;
}
