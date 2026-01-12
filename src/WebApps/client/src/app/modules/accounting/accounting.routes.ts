import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/accounting-home.component').then((m) => m.AccountingHomeComponent),
    data: { breadcrumb: 'Contabilidad' },
  },
  {
    path: 'cashboxes',
    title: 'Caja',
    loadComponent: () =>
      import('@accounting/ui/caja-page/caja-page').then((m) => m.CajaPage),
    data: {
      breadcrumb: 'Gestión Caja',
    },
  },
  {
    path: 'movimiento-caja-page-page',
    title: 'Caja',
    loadComponent: () =>
      import(
        '@accounting/movimiento-caja/presentation/movimiento-caja-page/movimiento-caja-page'
      ).then((m) => m.MovimientoCajaPage),
    data: {
      breadcrumb: 'Movimiento Caja',
    },
  },

  {
    path: 'cobro-page',
    title: 'Comprobante Ingreso',
    loadComponent: () =>
      import(
        '@accounting/comprobante-ingreso/presentation/comprobante-ingreso/comprobante-ingreso.component'
      ).then((m) => m.ComprobanteIngresoComponent),
    data: {
      breadcrumb: 'Comprobante Ingreso',
    },
  },

  {
    path: 'sub-entidad-financiera-page',
    title: 'SubEntidad Financiera',
    loadComponent: () =>
      import(
        '@accounting/sub-entidad-financiera/presentation/sub-entidad-financiera/sub-entidad-financiera-page.component'
      ).then((m) => m.SubEntidadFinancieraPageComponent),
    data: {
      breadcrumb: 'SubEntidad Financiera',
    },
  },
  {
    path: 'cuenta-por-cobrar',
    title: 'Cuenta por cobrar',
    loadComponent: () =>
      import(
        '@accounting/cuenta-por-cobrar/presentation/cuenta-por-cobrar/cuenta-por-cobrar.component'
      ).then((m) => m.CuentaPorCobrarComponent),
    data: {
      breadcrumb: 'Cuenta por cobrar',
    },
  },

  {
    path: 'category',
    title: 'Categorías',
    loadComponent: () =>
      import('@accounting/category/presentation/category/category.component').then(
        (m) => m.CategoryComponent,
      ),
    data: {
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'subcategory',
    title: 'Subcategorías',
    loadComponent: () =>
      import('@accounting/sub-category/presentation/subcategory/subcategory.component').then(
        (m) => m.SubcategoryComponent,
      ),
    data: {
      breadcrumb: 'Subcategorías',
    },
  },
  {
    path: 'cuenta-por-pagar',
    title: 'Cuenta por pagar',
    loadComponent: () =>
      import(
        '@accounting/cuenta-por-pagar/presentation/cuenta-por-pagar/cuenta-por-pagar.component'
      ).then((m) => m.CuentaPorPagarComponent),
    data: {
      breadcrumb: 'Cuenta por pagar',
    },
  },
  {
    path: 'cuenta-por-cobrar',
    title: 'Cuenta por cobrar',
    loadComponent: () =>
      import(
        '@accounting/cuenta-por-cobrar/presentation/cuenta-por-cobrar/cuenta-por-cobrar.component'
      ).then((m) => m.CuentaPorCobrarComponent),
    data: {
      breadcrumb: 'Cuenta por cobrar',
    },
  },
  {
    path: 'comprobante-egreso',
    title: 'Comprobante Egreso',
    loadComponent: () =>
      import(
        '@accounting/comprobante-egreso/presentation/comprobante-egreso/comprobante-egreso.component'
      ).then((m) => m.ComprobanteEgresoComponent),
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
        loadComponent: () =>
          import(
            '@accounting/resumen-contable/presentation/resumen-contable/resumen-contable.component'
          ).then((m) => m.ResumenContableComponent),
        data: {
          breadcrumb: 'Resumen Contable',
        },
      },
      {
        path: 'reporte-cobros',
        title: 'Reporte de Cobros',
        loadComponent: () =>
          import(
            '@accounting/comprobante-ingreso/presentation/reporte-cobros/reporte-cobros.component'
          ).then((m) => m.ReporteCobrosComponent),
        data: {
          breadcrumb: 'Reporte de Cobros',
        },
      },
      {
        path: 'movimiento-caja-page-report',
        title: 'Movimiento Caja Reporte',
        loadComponent: () =>
          import(
            '@accounting/movimiento-caja/presentation/movimiento-caja-report/movimiento-caja-report.component'
          ).then((m) => m.MovimientoCajaReportComponent),
        data: {
          breadcrumb: 'Movimiento Caja Reporte',
        },
      },
      {
        path: 'supplier-accounts',
        title: 'Cartera Proveedor',
        loadComponent: () =>
          import(
            '@accounting/comprobante-egreso/presentation/reports/supplier-accounts/supplier-accounts.component'
          ).then((m) => m.SupplierAccountsComponent),
        data: {
          breadcrumb: 'Cartera Proveedor',
        },
      },

      {
        path: 'cartera-cliente',
        title: 'Cartera Cliente',
        loadComponent: () =>
          import(
            '@accounting/cuenta-por-cobrar/presentation/cartera-cliente/cartera-cliente.component'
          ).then((m) => m.CarteraClienteComponent),
        data: {
          breadcrumb: 'Cartera Cliente',
        },
      },
      {
        path: 'payments',
        title: 'Reporte de Pagos',
        loadComponent: () =>
          import(
            '@accounting/comprobante-egreso/presentation/reports/payments-report/payments-report.component'
          ).then((m) => m.PaymentsReportComponent),
        data: {
          breadcrumb: 'Reporte de Pagos',
        },
      },
    ],
  },
];
