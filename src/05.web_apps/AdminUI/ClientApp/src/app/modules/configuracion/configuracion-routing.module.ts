import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccionComponent } from './accion/accion.component';

import { AplicacionComponent } from './aplicacion/aplicacion.component';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { LicenciaPlanComponent } from './licencia-plan/licencia-plan.component';
import { LicenciaComponent } from './licencia/licencia.component';
import { MenuComponent } from './menu/menu.component';
import { PlanClienteComponent } from './plan-cliente/plan-cliente.component';
import { SistemaComponent } from './sistema/sistema.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'configuracion',
    pathMatch: 'full'
  },
  {path:'suscripcion', component: SuscripcionComponent },
  {path:'accion', component: AccionComponent},
  {path:'menu', component: MenuComponent},
  {path:'submenu', component: SubmenuComponent},
  {path:'asignacion', component: AsignacionComponent},
  {path:'licencia', component: LicenciaComponent},
  {path:'aplicacion', component: AplicacionComponent},
  {path:'sistema', component: SistemaComponent},
  {path:'licencia-plan', component: LicenciaPlanComponent},
  {path:'plan-cliente', component: PlanClienteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
