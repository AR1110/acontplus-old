import { Routes } from '@angular/router';

import { OrdersComponent } from '@ui/orders/orders.component';
import { CompanyCustomerPageComponent } from '../company-customer/company-customer-page.component';
import { PosSaleComponent } from '../pos-sale/pos-sale.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import {sessionGuard} from "@core/guards/session.guard";
import {ForbiddenComponent} from "@ui/components/forbidden/forbidden.component";

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
        canActivate: [sessionGuard],
        component: OrdersComponent,
        data: {
          permissions: {
            resource: 'dashboard',

          }
        }
      },
      {
        path: 'customer',
        title: 'Clientes',
        canActivate: [sessionGuard],
        component: CompanyCustomerPageComponent,
        data: {
          permissions: {
            resource: 'customer',

          }
        }
      },
      {
        path: 'pos',
        title: 'POS',
        canActivate: [sessionGuard],
        component: PosSaleComponent,
        data: {
          permissions: {
            resource: 'pos',

          }
        }
      },
      {
        path: 'forbidden',
        component: ForbiddenComponent
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
