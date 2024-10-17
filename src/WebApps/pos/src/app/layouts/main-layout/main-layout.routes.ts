import { Routes } from "@angular/router";

import { MainLayoutComponent } from "./main-layout.component";
import {PosLayoutComponent} from "@/layouts/pos-layout/pos-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [

      {
        path: 'dashboard',
        title: 'Dashboad',
        loadComponent: () =>
          import('@dashboard/dashboard-page/dashboard-page.component').then((c) => c.DashboardPageComponent),
      },
      {
        path: 'order',
        title: 'Order',
        loadComponent: () =>
          import('@orders/order-page/order-page.component').then((c) => c.OrderPageComponent),
      },
      {
        path: 'customer',
        title: 'Clientes',
        loadComponent: () =>
          import('@company-customers/company-customer-page/company-customer-page.component').then((c) => c.CompanyCustomerPageComponent),
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
        loadComponent: () => import('@pos/pos-page/pos-page.component').then(m => m.PosPageComponent),
      },
      // {
      //   path: 'scheme-table',
      //   title: 'Mesa de Esquemas',
      //   loadComponent: () => import('@/pages/scheme-table-page/scheme-table-page.component').then(m => m.SchemeTablePageComponent),
      // },

    ]
  },

]
