import { Routes } from '@angular/router';
import { PetPageComponent } from '@modules/vet/pages/pet-page/pet-page.component';
import { BreedPageComponent } from '@modules/vet/pages/breed-page/breed-page.component';
import { MedicalHistoryPageComponent } from '@modules/vet/pages/medical-history-page/medical-history-page.component';
import { StatsPageComponent } from '@modules/vet/pages/stats-page/stats-page.component';
import { VetHomeComponent } from './pages/vet-home.component';

export const routes: Routes = [
  {
    path: '',
    component: VetHomeComponent,
    data: { breadcrumb: 'Veterinaria' },
  },
  {
    path: 'breeds',
    title: 'Razas',
    component: BreedPageComponent,
    data: {
      breadcrumb: 'Razas',
    },
  },
  {
    path: 'pets',
    title: 'Mascotas',
    component: PetPageComponent,
    data: {
      breadcrumb: 'Mascotas',
    },
  },
  {
    path: 'medical-history',
    title: 'Registro Clínico',
    component: MedicalHistoryPageComponent,
    data: {
      breadcrumb: 'Registro Clínico',
    },
  },
  {
    path: 'stats',
    title: 'Estadísticas',
    component: StatsPageComponent,
    data: {
      breadcrumb: 'Estadísticas',
    },
  },
];
