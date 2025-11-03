import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/mechanical-home.component').then((m) => m.MechanicalHomeComponent),
    data: { breadcrumb: 'Mecánica' },
  },
  {
    path: 'vehicle-page',
    title: 'Vehiculo',
    loadComponent: () =>
      import('@mechanical/ui/pages/vehicle-page/vehicle-page.component').then(
        (m) => m.VehiclePageComponent,
      ),
    data: {
      breadcrumb: 'Vehiculo',
    },
  },
  {
    path: 'layout',
    title: 'Layot - Mechanical',
    loadComponent: () =>
      import('@mechanical/ui/layout/mechanical-layout/mechanical-layout.component').then(
        (m) => m.MechanicalLayoutComponent,
      ),
    data: {
      breadcrumb: 'Mecánica',
    },
  },
  {
    path: 'config-inspection-page',
    title: 'Config. Inspección',
    loadComponent: () =>
      import('./ui/pages/config-inspection-page/config-inspection-page.component').then(
        (m) => m.ConfigInspectionComponent,
      ),
    data: {
      breadcrumb: 'Config. Inspección',
    },
  },
];
