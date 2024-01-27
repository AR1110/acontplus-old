import { Routes } from "@angular/router";
import { CashboxPageComponent } from "./pages/cashbox-page/cashbox-page.component";
import { MovimientoCajaPageComponent } from "./pages/movimiento-caja-page/movimiento-caja-page.component";
import { CobroPageComponent } from "./pages/cobro-page/cobro-page.component";
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

]
