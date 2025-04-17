import {Routes} from "@angular/router";

export const routes :Routes = [
  {
    path: 'seat',
    title: 'Asiento',
    loadComponent: ()=>import('./presentation/seat/seat.component').then(m => m.SeatComponent),
    data: {
      breadcrumb: 'Asiento',
    },
  }


]
