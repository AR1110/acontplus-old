import { Routes } from "@angular/router";
import { VehiclePageComponent } from "./pages/vehicle-page/vehicle-page.component";

export const routes: Routes = [
  {
    path: 'vehicle-page',
    title: 'Vehiculo',
    component: VehiclePageComponent,
    data: {
      breadcrumb: 'Vehiculo',
    },
  }
]
