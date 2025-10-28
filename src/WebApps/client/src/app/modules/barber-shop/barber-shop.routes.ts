import { Routes } from '@angular/router';
import { BarberShopHomeComponent } from './presentation/barber-shop-home.component';

export const routes: Routes = [
  {
    path: '',
    component: BarberShopHomeComponent,
    data: { breadcrumb: 'Barbería' },
  },
  {
    path: 'seat',
    title: 'Asiento',
    loadComponent: () => import('./presentation/seat/seat.component').then(m => m.SeatComponent),
    data: {
      breadcrumb: 'Asiento',
    },
  },
];
