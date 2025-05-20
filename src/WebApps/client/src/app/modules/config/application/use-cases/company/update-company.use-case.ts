import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {CompanyList} from "@modules/config/domain/models/company.model";
import {CompanyRepository} from "@modules/config/domain/repositories/company.repository";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root',
})
export class UpdateCompanyUseCase implements BaseUseCase<ApiResponse, Partial<CompanyList>> {
  constructor(private repo:CompanyRepository) {
  }

  execute(params: Partial<CompanyList>): Observable<ApiResponse<unknown>> {
        return this.repo.update(params)
    }

}
