import {BaseUseCase} from "@core/base-use-case";
import {inject, Injectable} from "@angular/core";
import {CompanyCustomerRepository} from "@company-customer/domain/company-customer.repository";
import {ApiResponse} from "@core/models/api-response";
import {UpdateCompanyCustomerParamsDto} from "@company-customer/domain/dtos/company-customer.dto";

@Injectable({
  providedIn: "root",
})
export class UpdateCompanyCustomerUseCase implements BaseUseCase<ApiResponse, UpdateCompanyCustomerParamsDto>{
  private repo = inject(CompanyCustomerRepository);

  execute(params:UpdateCompanyCustomerParamsDto)  {
    return this.repo.put(params)
  }
}
