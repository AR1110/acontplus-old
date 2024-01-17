import { Routes } from "@angular/router";
import { CashboxComponent } from "./pages/cashbox/cashbox.component";
import { MovimientoCajaPageComponent } from "./pages/movimiento-caja-page/movimiento-caja-page.component";
export const routes: Routes = [
  {
    path: 'cashbox-page',
    title: 'Caja',
    component: CashboxComponent,
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

]
