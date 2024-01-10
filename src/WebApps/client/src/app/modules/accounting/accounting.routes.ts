import { Routes } from "@angular/router"; 
import { CashboxComponent } from "./pages/cashbox/cashbox.component";
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
  
]
