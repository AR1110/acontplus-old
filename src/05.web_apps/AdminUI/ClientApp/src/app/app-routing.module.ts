import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './modules';
import { SessionGuard } from './core/guards/session.guard';


const routes: Routes = [
  {
    path: 'auth', //Public (Login)
    loadChildren:()=>import('./modules').then(m=>m.AuthModule)
  },
  {
    path: '', //Privada
    component: HomePageComponent,
    loadChildren:()=>import('./modules').then(m=>m.HomeModule),
    canActivate: [SessionGuard]
  }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
