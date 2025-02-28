import { Routes } from '@angular/router';

import { OrdersComponent } from '@ui/orders/orders.component';
import { CompanyCustomerPageComponent } from '../company-customer/company-customer-page.component';
import { PosSaleComponent } from '../pos-sale/pos-sale.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
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
];
