import { Routes } from '@angular/router';
import { TechnicalSupportPageComponent } from './pages/technical-support-page/technical-support-page.component';
import { DevicePageComponent } from './pages/device-page/device-page.component';
import { BrandPageComponent } from './pages/brand-page/brand-page.component';
import { ModeloPageComponent } from './pages/modelo-page/modelo-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { TechnicalSupportHomeComponent } from './pages/technical-support-home.component';

export const routes: Routes = [
  {
    path: '',
    component: TechnicalSupportHomeComponent,
    data: { breadcrumb: 'Soporte Técnico' },
  },
  {
    path: 'technical-support-page',
    title: 'Soporte Técnico',
    component: TechnicalSupportPageComponent,
    data: {
      breadcrumb: 'Servicio Técnico',
    },
  },
  {
    path: 'category-page',
    title: 'Categorías',
    component: CategoryPageComponent,
    data: {
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'brand-page',
    title: 'Marcas',
    component: BrandPageComponent,
    data: {
      breadcrumb: 'Marcas',
    },
  },
  {
    path: 'modelo-page',
    title: 'Modelos',
    component: ModeloPageComponent,
    data: {
      breadcrumb: 'Modelos',
    },
  },
  {
    path: 'device-page',
    title: 'Equipos',
    component: DevicePageComponent,
    data: {
      breadcrumb: 'Equipos',
    },
  },
];
