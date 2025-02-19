import { Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { PosLayoutComponent } from '@/ui/layouts/pos-layout/pos-layout.component';
import { NewLayoutComponent } from './new-layout/new-layout.component';
export const routes: Routes = [
  {
    path: '',
    component: NewLayoutComponent,
    children: [
      {
        path: 'dashboard',
        title: 'Dashboad',
        loadComponent: () =>
          import('@ui/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'order',
        title: 'Order',
        loadComponent: () =>
          import('@ui/orders/orders.component').then((c) => c.OrdersComponent),
      },
      {
        path: 'customer',
        title: 'Clientes',
        loadComponent: () =>
          import('@ui/company-customer/company-customer-page.component').then(
            (c) => c.CompanyCustomerPageComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'pos',
    component: PosLayoutComponent,
    children: [
      {
        path: '',
        title: 'Pos',
        loadComponent: () =>
          import('@ui/pos/pos.component').then((m) => m.PosComponent),
      },
      // {
      //   path: 'scheme-table',
      //   title: 'Mesa de Esquemas',
      //   loadComponent: () => import('@/pages/scheme-table-page/scheme-table-page.component').then(m => m.SchemeTablePageComponent),
      // },
    ],
  },
];
