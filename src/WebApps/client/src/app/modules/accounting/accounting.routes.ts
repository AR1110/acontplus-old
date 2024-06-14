import { Routes } from '@angular/router';
import { CashboxPageComponent } from './pages/cashbox-page/cashbox-page.component';
import { MovimientoCajaPageComponent } from './pages/movimiento-caja-page/movimiento-caja-page.component';
import { CobroPageComponent } from './pages/cobro-page/cobro-page.component';
import { SupplierAccountsComponent } from './reports/supplier-accounts/supplier-accounts.component';
import { SubEntidadFinancieraPageComponent } from './pages/sub-entidad-financiera-page/sub-entidad-financiera-page.component';
import { CuentaPorCobrarPageComponent } from './pages/cuenta-por-cobrar-page/cuenta-por-cobrar-page.component';
import { ReporteCobrosComponent } from './reports/reporte-cobros/reporte-cobros.component';
import { CategoryPageComponent } from '@modules/accounting/pages/category-page/category-page.component';
import { SubcategoryPageComponent } from '@modules/accounting/pages/subcategory-page/subcategory-page.component';
import {
  MovimientoCajaReportPageComponent
} from "@accounting/reports/movimiento-caja-report-page/movimiento-caja-report-page.component";
import {CarteraClientePageComponent} from "@accounting/reports/cartera-cliente-page/cartera-cliente-page.component";

export const routes: Routes = [
  {
    path: 'cashbox-page',
    title: 'Caja',
    component: CashboxPageComponent,
    data: {
      breadcrumb: 'Gestión Caja',
      buttonAction: 'Nuevo',
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
    title: 'Cobros',
    component: CobroPageComponent,
    data: {
      breadcrumb: 'Cobros',
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
    path: 'cuenta-por-cobrar-page',
    title: 'Cuenta por cobrar',
    component: CuentaPorCobrarPageComponent,
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
    component: CarteraClientePageComponent,
    data: {
      breadcrumb: 'Cartera Cliente',
    },
  },
];
