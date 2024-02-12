import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CompanyCustomerSearchComponent } from "@core/components/company-customer-search/company-customer-search.component";
import { DateRangeSelectionComponent } from "@core/components/date-range-selection/date-range-selection.component";
import { SupplierSearchComponent } from "@modules/purchase/components/supplier-search/supplier-search.component";
@NgModule({
  imports: [
    BreadcrumbComponent,
    CompanyCustomerSearchComponent,
    SupplierSearchComponent,
    DateRangeSelectionComponent,
  ],
  exports: [
    BreadcrumbComponent,
    CompanyCustomerSearchComponent,
    SupplierSearchComponent,
    DateRangeSelectionComponent,
  ]
})

export class AccountingModule { }


