import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { MenuComponent } from './pages';
import { SubmenuComponent } from './pages/submenu/submenu.component';

const routes: Routes = [
  {
    path: 'usuario',
    component: UsuarioComponent
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'submenu',
    component: SubmenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
