import { Routes } from '@angular/router';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { PosLayoutComponent } from '@/ui/layouts/pos-layout/pos-layout.component';
import { NewLayoutComponent } from './new-layout/new-layout.component';
import { OrdersComponent } from '@ui/orders/orders.component';
import { CompanyCustomerPageComponent } from '../company-customer/company-customer-page.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PosSaleComponent } from '../pos-sale/pos-sale.component';

export const routes: Routes = [
  {
    path: '',
    component: NewLayoutComponent,
    children: [
      {
        path: 'dashboard',
        title: 'Dashboad',
        component: DashboardComponent,
      },
      {
        path: 'order',
        title: 'Order',
        component: OrdersComponent,
      },
      {
        path: 'customer',
        title: 'Clientes',
        component: CompanyCustomerPageComponent,
      },
      {
        path: 'pos',
        title: 'POS',
        component: PosSaleComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // {
  //   path: 'pos',
  //   component: PosLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       title: 'Pos',
  //       loadComponent: () =>
  //         import('@ui/pos/pos.component').then((m) => m.PosComponent),
  //     },
  //   ],
  // },
];
