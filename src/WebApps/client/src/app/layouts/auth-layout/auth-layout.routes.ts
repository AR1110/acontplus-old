import { Routes } from "@angular/router";

import { AuthLayoutComponent } from "./auth-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent:()=> import('@modules/auth/ui/auth/auth.component').then(c=>c.AuthComponent)
      }
    ]
  }
]
