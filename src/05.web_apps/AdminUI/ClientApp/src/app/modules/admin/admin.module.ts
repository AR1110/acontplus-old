import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { EntidadComponent } from './pages/entidad/entidad.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    EntidadComponent,
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class AdminModule { }
