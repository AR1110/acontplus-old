import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/technical-support-home.component').then(
        (m) => m.TechnicalSupportHomeComponent,
      ),
    data: { breadcrumb: 'Soporte Técnico' },
  },
  {
    path: 'technical-support-page',
    title: 'Soporte Técnico',
    loadComponent: () =>
      import('./pages/technical-support-page/technical-support-page.component').then(
        (m) => m.TechnicalSupportPageComponent,
      ),
    data: {
      breadcrumb: 'Servicio Técnico',
    },
  },
  {
    path: 'category-page-page',
    title: 'Categorías',
    loadComponent: () =>
      import('./pages/category-page/category-page.component').then((m) => m.CategoryPageComponent),
    data: {
      breadcrumb: 'Categorías',
    },
  },
  {
    path: 'brand-page',
    title: 'Marcas',
    loadComponent: () =>
      import('./pages/brand-page/brand-page.component').then((m) => m.BrandPageComponent),
    data: {
      breadcrumb: 'Marcas',
    },
  },
  {
    path: 'modelo-page',
    title: 'Modelos',
    loadComponent: () =>
      import('./pages/modelo-page/modelo-page.component').then((m) => m.ModeloPageComponent),
    data: {
      breadcrumb: 'Modelos',
    },
  },
  {
    path: 'device-page',
    title: 'Equipos',
    loadComponent: () =>
      import('./pages/device-page/device-page.component').then((m) => m.DevicePageComponent),
    data: {
      breadcrumb: 'Equipos',
    },
  },
];
