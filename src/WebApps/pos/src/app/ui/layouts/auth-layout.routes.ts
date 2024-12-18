import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";
export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent:()=> import('@ui/auth/auth.component').then(c=>c.AuthComponent)
      }
    ]
  }
]
