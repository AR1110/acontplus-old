import { Route, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/customer-home.component').then((m) => m.CustomerHomeComponent),
    data: { breadcrumb: 'Clientes' },
  },
  {
    path: 'company-page-customer',
    title: 'Cliente',
    loadComponent: () =>
      import('@company-customer/presentation/company-customer/company-customer.component').then(
        (m) => m.CompanyCustomerComponent,
      ),
    data: {
      breadcrumb: 'Cliente',
    },
  },
];
