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
        '@accounting/ui/movimiento-caja-page/movimiento-caja-page'
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
        '@accounting/ui/comprobante-ingreso/comprobante-ingreso-page'
      ).then((m) => m.ComprobanteIngresoPage),
    data: {
      breadcrumb: 'Comprobante Ingreso',
    },
  },

  {
    path: 'sub-entidad-financiera-page-page',
    title: 'SubEntidad Financiera',
    loadComponent: () =>
      import(
        '@accounting/ui/sub-entidad-financiera-page/sub-entidad-financiera-page'
      ).then((m) => m.SubEntidadFinancieraPage),
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
      import('@accounting/ui/category-page/category-page').then(
        (m) => m.CategoryPage,
      ),
    data: {
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'subcategory',
    title: 'Subcategorías',
    loadComponent: () =>
      import('@accounting/ui/subcategory-page/subcategory-page').then(
        (m) => m.SubcategoryPage,
      ),
    data: {
      breadcrumb: 'Subcategorías',
    },
  },
  {
    path: 'cuenta-por-pagar-page',
    title: 'Cuenta por pagar',
    loadComponent: () =>
      import(
        '@accounting/ui/cuenta-por-pagar-page/cuenta-por-pagar.component'
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
    path: 'comprobante-egreso-page',
    title: 'Comprobante Egreso',
    loadComponent: () =>
      import(
        '@accounting/ui/comprobante-egreso-page/comprobante-egreso-page'
      ).then((m) => m.ComprobanteEgresoPage),
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
            '@accounting/ui/resumen-contable/resumen-contable.component'
          ).then((m) => m.ResumenContableComponent),
        data: {
          breadcrumb: 'Resumen Contable',
        },
      },
      {
        path: 'reporte-cobros-page',
        title: 'Reporte de Cobros',
        loadComponent: () =>
          import(
            '@accounting/ui/reporte-cobros-page/reporte-cobros-page'
          ).then((m) => m.ReporteCobrosPage),
        data: {
          breadcrumb: 'Reporte de Cobros',
        },
      },
      {
        path: 'movimiento-caja-page-report',
        title: 'Movimiento Caja Reporte',
        loadComponent: () =>
          import(
            '@accounting/ui/movimiento-caja-report/movimiento-caja-report.component'
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
