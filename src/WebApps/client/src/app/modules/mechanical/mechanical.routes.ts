import { Routes } from '@angular/router';
import { VehiclePageComponent } from '@mechanical/ui/pages/vehicle-page/vehicle-page.component';
import { MechanicalLayoutComponent } from '@mechanical/ui/layout/mechanical-layout/mechanical-layout.component';
import { MechanicalHomeComponent } from './ui/mechanical-home.component';
import { ConfigInspectionComponent } from './ui/pages/config-inspection-page/config-inspection-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MechanicalHomeComponent,
    data: { breadcrumb: 'Mecánica' },
  },
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
  },
  {
    path: 'config-inspection-page',
    title: 'Config. Inspección',
    component: ConfigInspectionComponent,
    data: {
      breadcrumb: 'Config. Inspección',
    },
  },
];
