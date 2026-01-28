import { Routes } from '@angular/router';
import { LoginPageComponent } from '@modules/auth/pages/login-page/login-page.component';
import { AuthLayoutComponent } from './auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: LoginPageComponent,
      },
    ],
  },
];
