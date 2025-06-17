import {FormDataCompanyCustomerResponse} from "@company-customer/domain/entities/company-customer.entity";
import {CompanyCustomerRepository} from "@company-customer/domain/company-customer.repository";
import {BaseUseCase} from "@core/base-use-case";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class GetFormDataCompanyCustomerUseCase implements BaseUseCase<FormDataCompanyCustomerResponse, void>{
  constructor(private repo:CompanyCustomerRepository) {
  }
  execute() {
    return this.repo.getDataForm()
  }
}
