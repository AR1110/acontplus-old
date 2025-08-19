import { Route, Routes } from "@angular/router";
import { CompanyCustomerComponent } from "@company-customer/presentation/company-customer/company-customer.component";
import { CustomerHomeComponent } from './ui/customer-home.component';

export const routes: Routes = [
  {
    path: '',
    component: CustomerHomeComponent,
    data: { breadcrumb: 'Clientes' },
  },
  {
    path: 'company-customer',
    title: 'Cliente',
    component: CompanyCustomerComponent,
    data: {
      breadcrumb: 'Cliente',
    },

  }
]
