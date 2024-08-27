import { Routes } from "@angular/router";

import { AuthLayoutComponent } from "./auth-layout.component";

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent:()=> import('@/pages/auth-page/auth-page.component').then(c=>c.AuthPageComponent)
      }
    ]
  }
]
