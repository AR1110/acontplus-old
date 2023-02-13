import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch:'full'},
  {path: 'home', loadChildren:()=>import('./modules').then(m=>m.HomeModule)},
  {path: 'administration', loadChildren:()=>import('./modules').then(m=>m.AdministrationModule)},
  {path: 'configuration', loadChildren:()=>import('./modules').then(m=>m.ConfigurationModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
