import { Route, Routes } from "@angular/router";
import { CompanyCustomerPageComponent } from "@company-customer/pages/company-customer-page/company-customer-page.component";

export const routes: Routes = [
  {
    path: 'company-customer',
    title: 'Cliente',
    component: CompanyCustomerPageComponent,
    data: {
      breadcrumb: 'Cliente',
    },

  }
]
