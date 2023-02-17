import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';


const routes: Routes = [
  {
    path: 'auth', //Public (Login)
    loadChildren:()=>import('./modules').then(m=>m.AuthModule),
  },
  {
    path: '', //Privada
    component: MainLayoutComponent,
    loadChildren:()=>import('./modules').then(m=>m.HomeModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
