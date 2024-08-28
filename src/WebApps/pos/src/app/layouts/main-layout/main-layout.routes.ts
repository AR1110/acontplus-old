import { Routes } from "@angular/router";

import { MainLayoutComponent } from "./main-layout.component";
import {PosLayoutComponent} from "@/layouts/pos-layout/pos-layout.component";
import { PosPageComponent } from "@/pages/pos-page/pos-page.component";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [

      {
        path: 'dashboard',
        title: 'Dashboad',
        loadComponent: () =>
          import('@/pages/dashboard-page/dashboard-page.component').then((c) => c.DashboardPageComponent),
      },
      {
        path: 'order',
        title: 'Order',
        loadComponent: () =>
          import('@/pages/order-page/order-page.component').then((c) => c.OrderPageComponent),
      },
      {
        path: 'customer',
        title: 'Order',
        loadComponent: () =>
          import('@/pages/company-customer/company-customer.component').then((c) => c.CompanyCustomerComponent),
      },
    ],
  },
  {
    path: 'pos',
    component: PosLayoutComponent,
    children: [
      {
        path: '',
        title: 'Pos', 
        loadComponent: () => import('@/pages/pos-page/pos-page.component').then(m => m.PosPageComponent),
      },
    ]
  },
]
