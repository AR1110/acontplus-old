import { Routes } from '@angular/router';
import { TechnicalSupportPageComponent } from './pages/technical-support-page/technical-support-page.component';
import { DevicePageComponent } from './pages/device-page/device-page.component';

export const routes: Routes = [
  {
    path: 'technical-support-page',
    title: 'Soporte Técnico',
    component: TechnicalSupportPageComponent,
    data: {
      breadcrumb: 'Servicio Técnico',
    },
  },
  {
    path: 'device-page',
    title: 'Equipos',
    component: DevicePageComponent,
    data: {
      breadcrumb: 'Equipos',
      buttonAction: 'Nuevo',
    },
  },
];
