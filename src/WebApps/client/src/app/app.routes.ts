import { Routes } from '@angular/router';
import { sessionGuard } from '@core/guards/session.guard';

export const routes: Routes = [
  // {
  //   path: 'home',
  //   canActivate: [sessionGuard],
  //   loadChildren: () => import(`./modules/home/home.routes`).then(m => m.routes),
  //   data: {
  //     breadcrumb: 'Home'
  //   }
  // },

  // {
  //   path: 'auth',
  //   title: 'Login',
  //   loadChildren: () =>
  //     import(`./layouts/auth-layout/auth-layout.routes`).then((m) => m.routes),
  // },

  {
    path: '',
    //canActivate: [sessionGuard],
    loadChildren: () =>
      import(`./layouts/main-layout/main-layout.routes`).then((m) => m.routes),
    // data: {
    //   breadcrumb: 'Soporte Técnico'
    // }
  },
];
