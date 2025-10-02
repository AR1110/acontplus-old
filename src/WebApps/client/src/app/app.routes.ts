import { Routes } from '@angular/router';
import { sessionGuard } from '@core/guards/session.guard';
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";

export const routes: Routes = [
  // {
  //   path: 'home',
  //   canActivate: [sessionGuard],
  //   loadChildren: () => import(`./modules/home/home.routes`).then(m => m.routes),
  //   data: {
  //     breadcrumb: 'Home'
  //   }
  // },

  {
    path: 'auth',
    title: 'Auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent:()=> import('@modules/auth/ui/auth/auth.component').then(c=>c.AuthComponent)
      }
    ]
  },

  {
    path: '',
    canActivate: [sessionGuard],
    loadChildren: () =>
      import(`./layouts/main-layout/main-layout.routes`).then((m) => m.routes),
    // data: {
    //   breadcrumb: 'Soporte Técnico'
    // }
  },
];
