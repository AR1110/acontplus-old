import { Observable } from 'rxjs';
import { CompanyList, ListCompanyResponse } from '@modules/config/data/models/company.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class CompanyRepository {
  abstract list(): Observable<ListCompanyResponse>;
  abstract update(params: Partial<CompanyList>): Observable<ApiResponseLegacy>;
}
