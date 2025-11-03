import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/vet-home.component').then((m) => m.VetHomeComponent),
    data: { breadcrumb: 'Veterinaria' },
  },
  {
    path: 'breeds',
    title: 'Razas',
    loadComponent: () =>
      import('@modules/vet/pages/breed-page/breed-page.component').then(
        (m) => m.BreedPageComponent,
      ),
    data: {
      breadcrumb: 'Razas',
    },
  },
  {
    path: 'pets',
    title: 'Mascotas',
    loadComponent: () =>
      import('@modules/vet/pages/pet-page/pet-page.component').then((m) => m.PetPageComponent),
    data: {
      breadcrumb: 'Mascotas',
    },
  },
  {
    path: 'medical-history',
    title: 'Registro Clínico',
    loadComponent: () =>
      import('@modules/vet/pages/medical-history-page/medical-history-page.component').then(
        (m) => m.MedicalHistoryPageComponent,
      ),
    data: {
      breadcrumb: 'Registro Clínico',
    },
  },
  {
    path: 'stats',
    title: 'Estadísticas',
    loadComponent: () =>
      import('@modules/vet/pages/stats-page/stats-page.component').then(
        (m) => m.StatsPageComponent,
      ),
    data: {
      breadcrumb: 'Estadísticas',
    },
  },
];
