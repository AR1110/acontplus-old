import { Routes } from '@angular/router';
import { sessionGuard } from '@core/guards/session.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [sessionGuard],
    loadChildren: () => import(`./modules/home/home.routes`).then(m => m.routes),
    data: {
      breadcrumb: 'Home'
    }
  },
];
