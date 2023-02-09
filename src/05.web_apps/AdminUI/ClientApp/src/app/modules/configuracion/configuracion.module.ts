import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '@app/material.module'; //import modules material

import { ConfiguracionRoutingModule } from './configuracion-routing.module';


import { PipeModule } from '@app/pipes/pipe.module';

//Suscripcion
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { AddUpdateSuscripcionComponent } from './suscripcion/add-update-suscripcion/add-update-suscripcion.component';

//Accion
import { AccionComponent } from './accion/accion.component';
import { AddUpdateAccionComponent } from './accion/add-update-accion/add-update-accion.component';

//Menu
import { MenuComponent } from './menu/menu.component';
import { AddUpdateMenuComponent } from './menu/add-update-menu/add-update-menu.component';

import { AplicacionComponent } from './aplicacion/aplicacion.component';

//SubMenu
import { SubmenuComponent } from './submenu/submenu.component';
import { AddUpdateSubmenuComponent } from './submenu/add-update-submenu/add-update-submenu.component';
import { AddUpdateAplicacionComponent } from './aplicacion/add-update-aplicacion/add-update-aplicacion.component';
import { LicenciaComponent } from './licencia/licencia.component';
import { AddUpdateLicenciaComponent } from './licencia/add-update-licencia/add-update-licencia.component';
import { SistemaComponent } from './sistema/sistema.component';
import { AddUpdateSistemaComponent } from './sistema/add-update-sistema/add-update-sistema.component';

import { AplicacionMenuComponent } from './aplicacion-menu/aplicacion-menu.component';
import { AddUpdateAplicacionMenuComponent } from './aplicacion-menu/add-update-aplicacion-menu/add-update-aplicacion-menu.component';
import { LicenciaPlanComponent } from './licencia-plan/licencia-plan.component';
import { AddUpdateLicenciaPlanComponent } from './licencia-plan/add-update-licencia-plan/add-update-licencia-plan.component';
import { PlanClienteComponent } from './plan-cliente/plan-cliente.component';

import { AddUpdatePlanClienteComponent } from './plan-cliente/add-update-plan-cliente/add-update-plan-cliente.component';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { AddUpdateAsignacionComponent } from './asignacion/add-update-asignacion/add-update-asignacion.component';


@NgModule({
  declarations: [
    SuscripcionComponent,
    AddUpdateSuscripcionComponent,
    AccionComponent,
    AddUpdateAccionComponent,
    MenuComponent,
    AplicacionComponent,
    SubmenuComponent,
    AddUpdateSubmenuComponent,
    AddUpdateMenuComponent,
    AddUpdateAplicacionComponent,
    LicenciaComponent,
    AddUpdateLicenciaComponent,
    SistemaComponent,
    AddUpdateSistemaComponent,

    AplicacionMenuComponent,
    AddUpdateAplicacionMenuComponent,
    LicenciaPlanComponent,
    AddUpdateLicenciaPlanComponent,
    PlanClienteComponent,
    AddUpdatePlanClienteComponent,
    AsignacionComponent,
    AddUpdateAsignacionComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    MaterialModule,
    PipeModule
  ]
})
export class ConfiguracionModule { }
