import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '@layout/app-layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from '@layout/app-layout/auth-layout/auth-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { Page404Component } from '@modules/auth/page404/page404.component';

const routes: Routes = [
  {
    path:'',
    component: MainLayoutComponent,
    canActivate:[AuthGuard],
    children:[
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
      {
        path:'configuracion',
        loadChildren: () => import('./modules/configuracion/configuracion.module').then(config => config.ConfiguracionModule)
      },
      {
        path:'admin',
        loadChildren:()=> import('./modules/admin/admin.module').then(admin=>admin.AdminModule)
      }
    ]
  },
  {
    path:'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>import('./modules/auth/auth.module').then(m => m.AuthModule)

  },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
