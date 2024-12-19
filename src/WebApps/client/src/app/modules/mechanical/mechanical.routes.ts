import { Routes } from "@angular/router";
import { VehiclePageComponent } from "@mechanical/ui/pages/vehicle-page/vehicle-page.component";
import { MechanicalLayoutComponent } from "@mechanical/ui/layout/mechanical-layout/mechanical-layout.component";

export const routes: Routes = [
  {
    path: 'vehicle-page',
    title: 'Vehiculo',
    component: VehiclePageComponent,
    data: {
      breadcrumb: 'Vehiculo',
    },
  },
  {
    path: 'layout',
    title: 'Layot - Mechanical',
    component: MechanicalLayoutComponent,
    data: {
      breadcrumb: 'Mecánica',
    },
  }
]
