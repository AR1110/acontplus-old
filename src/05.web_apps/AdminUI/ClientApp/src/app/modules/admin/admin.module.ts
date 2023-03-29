import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { EntidadComponent } from './pages/entidad/entidad.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { MaterialModule } from '@app/material.module';
import { MenuComponent, ModalMenuComponent } from './pages';
import { SubmenuComponent } from './pages/submenu/submenu.component';
import { ModalSubmenuComponent } from './pages/submenu/modal-submenu/modal-submenu.component';


@NgModule({
  declarations: [
    MenuComponent,
    ModalMenuComponent,
    SubmenuComponent,
    ModalSubmenuComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
  ]
})
export class AdminModule { }
