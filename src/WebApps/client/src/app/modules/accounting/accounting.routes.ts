import { Routes } from "@angular/router";
import { CashboxPageComponent } from "./pages/cashbox-page/cashbox-page.component";
import { MovimientoCajaPageComponent } from "./pages/movimiento-caja-page/movimiento-caja-page.component";
import { CobroPageComponent } from "./pages/cobro-page/cobro-page.component";
import { SupplierAccountsComponent } from "./reports/supplier-accounts/supplier-accounts.component";
import { SubEntidadFinancieraPageComponent } from "./pages/sub-entidad-financiera-page/sub-entidad-financiera-page.component";
import { CuentaPorCobrarPageComponent } from "./pages/cuenta-por-cobrar-page/cuenta-por-cobrar-page.component";
import { ReporteCobrosComponent } from "./reports/reporte-cobros/reporte-cobros.component";

export const routes: Routes = [
  {
    path: 'cashbox-page',
    title: 'Caja',
    component: CashboxPageComponent,
    data: {
      breadcrumb: 'Gestión Caja',
      buttonAction: "Nuevo"
    }
  },
  {
    path: 'movimiento-caja-page',
    title: 'Caja',
    component: MovimientoCajaPageComponent,
    data: {
      breadcrumb: 'Movimiento Caja',
    }
  },

  {
    path: 'cobro-page',
    title: 'Cobros',
    component: CobroPageComponent,
    data: {
      breadcrumb: 'Cobros',
    }
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
  }
]
