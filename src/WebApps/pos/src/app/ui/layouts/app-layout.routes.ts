import { Routes } from '@angular/router';

import { OrdersComponent } from '@ui/orders/orders.component';
import { CompanyCustomerPageComponent } from '../company-customer/company-customer-page.component';
import { PosSaleComponent } from '../pos-sale/pos-sale.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import {ForbiddenComponent} from "@ui/components/forbidden/forbidden.component";
import {permissionGuard} from "@core/guards/permission.guard";
import {ROUTES_PATH} from "@domain/enums/main.enum";

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: ROUTES_PATH.DASHBOARD,
        title: 'Dashboad',
        component: DashboardComponent,
      },
      {
        path: ROUTES_PATH.ORDER,
        title: 'Order',
        canActivate: [permissionGuard],
        component: OrdersComponent,
        data: {
          permissions: {
            resource: ROUTES_PATH.ORDER,

          }
        }
      },
      {
        path: ROUTES_PATH.CUSTOMER,
        title: 'Clientes',
        canActivate: [permissionGuard],
        component: CompanyCustomerPageComponent,
        data: {
          permissions: {
            resource: ROUTES_PATH.CUSTOMER,

          }
        }
      },
      {
        path: ROUTES_PATH.POS,
        title: 'POS',
        canActivate: [permissionGuard],
        component: PosSaleComponent,
        data: {
          permissions: {
            resource: ROUTES_PATH.POS,

          }
        }
      },
      {
        path: 'forbidden',
        component: ForbiddenComponent
      },
      { path: '', redirectTo: ROUTES_PATH.DASHBOARD, pathMatch: 'full' },
    ],
  },
];
