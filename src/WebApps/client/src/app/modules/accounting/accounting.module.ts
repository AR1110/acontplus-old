import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CompanyCustomerSearchComponent } from "@core/components/company-customer-search/company-customer-search.component";
@NgModule({
  imports: [
    BreadcrumbComponent,
    CompanyCustomerSearchComponent
  ],
  exports: [
    BreadcrumbComponent,
    CompanyCustomerSearchComponent
  ]
})

export class AccountingModule { }


