import {BaseUseCase} from "@core/base-use-case";
import {Observable} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {CompanyCustomerRepository} from "@customer/domain/repositories/company-customer.repository";
import {ListCompanyCustomerResponse} from "@customer/domain/models/company-customer";

@Injectable({
  providedIn: "root",
})
export class ListCompanyCustomerUseCase implements BaseUseCase<ListCompanyCustomerResponse, any>{
  private repo = inject(CompanyCustomerRepository);

  execute(params: any): Observable<any> {
    return this.repo.getAll(params)
  }
}
