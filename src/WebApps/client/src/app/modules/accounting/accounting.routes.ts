import { Routes } from '@angular/router';
import { CajaComponent } from './ui/cashbox-page/caja.component';
import { MovimientoCajaPageComponent } from '@accounting/ui/movimiento-caja-page/movimiento-caja-page.component';

import { SupplierAccountsComponent } from '@accounting/ui/supplier-accounts/supplier-accounts.component';
import { SubEntidadFinancieraPageComponent } from '@accounting/ui/sub-entidad-financiera/sub-entidad-financiera-page.component';
import { CuentaPorCobrarComponent } from '@accounting/ui/cuenta-por-cobrar/cuenta-por-cobrar.component';
import { ReporteCobrosComponent } from '@accounting/ui/reporte-cobros/reporte-cobros.component';
import { CategoryPageComponent } from '@accounting/ui/category-page/category-page.component';
import { SubcategoryPageComponent } from '@accounting/ui/subcategory-page/subcategory-page.component';
import { MovimientoCajaReportPageComponent } from '@accounting/ui/movimiento-caja-report-page/movimiento-caja-report-page.component';

 import { CuentaPorPagarComponent } from '@accounting/ui/cuenta-por-pagar/cuenta-por-pagar.component';
import {
  AccountingMovementPageComponent
} from "@accounting/ui/accounting-movement-page/accounting-movement-page.component";
import {CarteraClienteComponent} from "@accounting/ui/cartera-cliente/cartera-cliente.component";

export const routes: Routes = [
  {
    path: 'cashbox-page',
    title: 'Caja',
    component: CajaComponent,
    data: {
      breadcrumb: 'Gestión Caja',
    },
  },
  {
    path: 'movimiento-caja-page',
    title: 'Caja',
    component: MovimientoCajaPageComponent,
    data: {
      breadcrumb: 'Movimiento Caja',
    },
  },

  {
    path: 'cobro-page',
    title: 'Comprobante Ingreso',
    loadComponent: ()=>import('@accounting/ui/comprobante-ingreso/comprobante-ingreso.component').then(c=>c.ComprobanteIngresoComponent),
    data: {
      breadcrumb: 'Comprobante Ingreso',
    },
  },
  {
    path: 'reports/supplier-accounts',
    title: 'Cartera Proveedor',
    component: SupplierAccountsComponent,
    data: {
      breadcrumb: 'Cartera Proveedor',
    },
  },
  {
    path: 'sub-entidad-financiera-page',
    title: 'SubEntidad Financiera',
    component: SubEntidadFinancieraPageComponent,
    data: {
      breadcrumb: 'SubEntidad Financiera',
    },
  },
  {
    path: 'cuenta-por-cobrar',
    title: 'Cuenta por cobrar',
    component: CuentaPorCobrarComponent,
    data: {
      breadcrumb: 'Cuenta por cobrar',
    },
  },
  {
    path: 'reports/reporte-cobros',
    title: 'Reporte de Cobros',
    component: ReporteCobrosComponent,
    data: {
      breadcrumb: 'Reporte de Cobros',
    },
  },
  {
    path: 'category-page',
    title: 'Categorías',
    component: CategoryPageComponent,
    data: {
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'subcategory-page',
    title: 'Subcategorías',
    component: SubcategoryPageComponent,
    data: {
      breadcrumb: 'Subcategorías',
    },
  },
  {
    path: 'movimiento-caja-report',
    title: 'Movimiento Caja Reporte',
    component: MovimientoCajaReportPageComponent,
    data: {
      breadcrumb: 'Movimiento Caja Reporte',
    },
  },
  {
    path: 'cartera-cliente',
    title: 'Cartera Cliente',
    loadComponent: ()=>import('@accounting/ui/cartera-cliente/cartera-cliente.component').then(c=>c.CarteraClienteComponent),

    data: {
      breadcrumb: 'Cartera Cliente',
    },
  },
  {
    path: 'accounting-movement',
    title: 'Resumen Contable',
    component: AccountingMovementPageComponent,
    data: {
      breadcrumb: 'Resumen Contable',
    },
  },
  {
    path: 'cuenta-por-pagar',
    title: 'Cuenta por pagar',
    component: CuentaPorPagarComponent,
    data: {
      breadcrumb: 'Cuenta por pagar',
    },
  },
  {
    path: 'cuenta-por-cobrar',
    title: 'Cuenta por cobrar',
    loadComponent: ()=>import('@accounting/ui/cuenta-por-cobrar/cuenta-por-cobrar.component').then(c=>c.CuentaPorCobrarComponent),

    data: {
      breadcrumb: 'Cuenta por cobrar',
    },
  }
];
