import { Routes } from "@angular/router";
import { MainLayoutComponent } from './main-layout.component'
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'purchase',
        title: 'App - Compras',
        loadChildren: () => import('@modules/purchase/purchase.routes').then(r => r.routes)
      },
      {
        path: 'technical-support',
        title: 'App - Soporte Técnico',
        loadChildren: () => import('@modules/technical-support/technical-support.routes').then(r => r.routes)
      },
      {
        path: 'accounting',
        title: 'App - Contabilidad',
        loadChildren: () => import('@modules/accounting/accounting.routes').then(r => r.routes)
      },
      {
        path: 'inventory',
        title: 'App - Inventario',
        loadChildren: () => import('@modules/inventory/inventory.routes').then(r => r.routes)
      }
    ]
  }
]
