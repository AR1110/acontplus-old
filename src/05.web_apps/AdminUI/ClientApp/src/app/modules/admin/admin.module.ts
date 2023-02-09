import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { UsuarioComponent } from './usuario/usuario.component';
import { AddUsuarioComponent } from './usuario/add-usuario/add-usuario.component';
import { UpdateUsuarioComponent } from './usuario/update-usuario/update-usuario.component';
import { EntidadComponent } from './entidad/entidad.component';
import { AddUpdateEntidadComponent } from './entidad/add-update-entidad/add-update-entidad.component';


import { UsuarioRolComponent } from './usuario-rol/usuario-rol.component';
import { AddUpdateUsuarioRolComponent } from './usuario-rol/add-update-usuario-rol/add-update-usuario-rol.component';
import { PipeModule } from '@app/pipes/pipe.module';
import { AccesoMenuComponent } from './acceso-menu/acceso-menu.component';
import { RolComponent } from './rol/rol.component';
import { AddUpdateRolComponent } from './rol/add-update-rol/add-update-rol.component';
import { DuplicarRolComponent } from './rol/duplicar-rol/duplicar-rol.component';



@NgModule({
  declarations: [
    UsuarioComponent,

    AddUsuarioComponent,
    UpdateUsuarioComponent,
    EntidadComponent,
    AddUpdateEntidadComponent,
    UsuarioRolComponent,
    AddUpdateUsuarioRolComponent,
    AccesoMenuComponent,
    RolComponent,
    AddUpdateRolComponent,
    DuplicarRolComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    PipeModule
  ]
})
export class AdminModule { }
