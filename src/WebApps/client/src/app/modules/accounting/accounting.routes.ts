import { Routes } from '@angular/router';
import { CajaComponent } from './caja/presentation/caja/caja.component';
import { MovimientoCajaPageComponent } from '@accounting/movimiento-caja/presentation/movimiento-caja-page/movimiento-caja-page.component';

import { SupplierAccountsComponent } from '@accounting/comprobante-egreso/presentation/reports/supplier-accounts/supplier-accounts.component';
import { SubEntidadFinancieraPageComponent } from '@accounting/sub-entidad-financiera/presentation/sub-entidad-financiera/sub-entidad-financiera-page.component';
import { CuentaPorCobrarComponent } from '@accounting/cuenta-por-cobrar/presentation/cuenta-por-cobrar/cuenta-por-cobrar.component';
import { ReporteCobrosComponent } from '@accounting/comprobante-ingreso/presentation/reporte-cobros/reporte-cobros.component';
import { CategoryComponent } from '@accounting/category/presentation/category/category.component';
import { SubcategoryComponent } from '@accounting/sub-category/presentation/subcategory/subcategory.component';
import { MovimientoCajaReportComponent } from '@accounting/movimiento-caja/presentation/movimiento-caja-report/movimiento-caja-report.component';

import { CuentaPorPagarComponent } from '@accounting/cuenta-por-pagar/presentation/cuenta-por-pagar/cuenta-por-pagar.component';
import { ResumenContableComponent } from '@accounting/resumen-contable/presentation/resumen-contable/resumen-contable.component';
import { CarteraClienteComponent } from '@accounting/cuenta-por-cobrar/presentation/cartera-cliente/cartera-cliente.component';
import { ComprobanteIngresoComponent } from '@accounting/comprobante-ingreso/presentation/comprobante-ingreso/comprobante-ingreso.component';
import { ComprobanteEgresoComponent } from '@accounting/comprobante-egreso/presentation/comprobante-egreso/comprobante-egreso.component';
import { PaymentsReportComponent } from '@accounting/comprobante-egreso/presentation/reports/payments-report/payments-report.component';
import { AccountingHomeComponent } from './home/accounting-home.component';

export const routes: Routes = [
  {
    path: '',
    component: AccountingHomeComponent,
    data: { breadcrumb: 'Contabilidad' },
  },
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
  },
  {
    path: 'reports',
    children: [
      {
        path: 'resumen-contable',
        title: 'Resumen Contable',
        component: ResumenContableComponent,
        data: {
          breadcrumb: 'Resumen Contable',
        },
      },
      {
        path: 'reporte-cobros',
        title: 'Reporte de Cobros',
        component: ReporteCobrosComponent,
        data: {
          breadcrumb: 'Reporte de Cobros',
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
        path: 'supplier-accounts',
        title: 'Cartera Proveedor',
        component: SupplierAccountsComponent,
        data: {
          breadcrumb: 'Cartera Proveedor',
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
        path: 'payments',
        title: 'Reporte de Pagos',
        component: PaymentsReportComponent,
        data: {
          breadcrumb: 'Reporte de Pagos',
        },
      },
    ],
  },
];
