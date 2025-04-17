import { Routes } from '@angular/router';
import { CajaComponent } from './ui/cashbox-page/caja.component';
import { MovimientoCajaPageComponent } from '@accounting/ui/movimiento-caja-page/movimiento-caja-page.component';

import { SupplierAccountsComponent } from '@accounting/ui/supplier-accounts/supplier-accounts.component';
import { SubEntidadFinancieraPageComponent } from '@accounting/ui/sub-entidad-financiera/sub-entidad-financiera-page.component';
import { CuentaPorCobrarComponent } from '@accounting/ui/cuenta-por-cobrar/cuenta-por-cobrar.component';
import { ReporteCobrosComponent } from '@accounting/ui/reporte-cobros/reporte-cobros.component';
import { CategoryComponent } from '@accounting/ui/category/category.component';
import { SubcategoryComponent } from '@accounting/ui/subcategory/subcategory.component';
import { MovimientoCajaReportComponent } from '@accounting/ui/movimiento-caja-report/movimiento-caja-report.component';

 import { CuentaPorPagarComponent } from '@accounting/ui/cuenta-por-pagar/cuenta-por-pagar.component';
import {
  ResumenContableComponent
} from "@accounting/ui/resumen-contable/resumen-contable.component";
import {CarteraClienteComponent} from "@accounting/ui/cartera-cliente/cartera-cliente.component";
import {ComprobanteIngresoComponent} from "@accounting/ui/comprobante-ingreso/comprobante-ingreso.component";
import {ComprobanteEgresoComponent} from "@accounting/ui/comprobante-egreso/comprobante-egreso.component";

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
    component: ComprobanteIngresoComponent,
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
    path: 'category',
    title: 'Categorías',
    component: CategoryComponent,
    data: {
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'subcategory',
    title: 'Subcategorías',
    component: SubcategoryComponent,
    data: {
      breadcrumb: 'Subcategorías',
    },
  },
  {
    path: 'movimiento-caja-report',
    title: 'Movimiento Caja Reporte',
    component: MovimientoCajaReportComponent,
    data: {
      breadcrumb: 'Movimiento Caja Reporte',
    },
  },
  {
    path: 'cartera-cliente',
    title: 'Cartera Cliente',
    component: CarteraClienteComponent,
    data: {
      breadcrumb: 'Cartera Cliente',
    },
  },
  {
    path: 'resumen-contable',
    title: 'Resumen Contable',
    component: ResumenContableComponent,
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
    component: CuentaPorCobrarComponent,
    data: {
      breadcrumb: 'Cuenta por cobrar',
    },
  },
  {
    path: 'comprobante-egreso',
    title: 'Comprobante Egreso',
    component: ComprobanteEgresoComponent,
    data: {
      breadcrumb: 'Comprobante Egreso',
    },
  }
];
