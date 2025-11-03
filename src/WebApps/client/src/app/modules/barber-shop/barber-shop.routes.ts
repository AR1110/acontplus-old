import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/barber-shop-home.component').then(m => m.BarberShopHomeComponent),
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
