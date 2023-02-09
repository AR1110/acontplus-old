import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntidadComponent } from './entidad/entidad.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';

const routes: Routes = [
  {path:'usuario', component:UsuarioComponent},
  {path:'entidad', component:EntidadComponent},
  {path:'rol', component:RolComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
