import { Route, Routes } from "@angular/router";
import { CompanyCustomerComponent } from "@company-customer/presentation/company-customer/company-customer.component";

export const routes: Routes = [
  {
    path: 'company-customer',
    title: 'Cliente',
    component: CompanyCustomerComponent,
    data: {
      breadcrumb: 'Cliente',
    },

  }
]
