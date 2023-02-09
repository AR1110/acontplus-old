import { Injectable } from '@angular/core';

export interface Menu {
  path: string;
  name: string;
  type: string;
  icon: string;

}

const MENUITEMS = [
  { path: '/admin/usuario', name: 'Usuario', type: 'link', icon: 'people_outline' },
  { path: '/admin/entidad', name: 'Entidad', type: 'link', icon: 'business' },
  { path: '/admin/rol', name: 'Rol', type: 'link', icon: 'security' },
  { path: '/configuracion/suscripcion', name: 'Suscripción', type: 'link', icon: 'layers' },
  { path: '/configuracion/menu', name: 'Menu', type: 'link', icon: 'menu' },
  { path: '/configuracion/submenu', name: 'SubMenu', type: 'link', icon: 'dehaze' },
  { path: '/configuracion/accion', name: 'Acción', type: 'link', icon: 'attachment' },
  { path: '/configuracion/asignacion', name: 'Asignación', type: 'link', icon: 'assignment_turned_in' },
  { path: '/configuracion/licencia', name: 'Licencia', type: 'link', icon: 'monetization_on' },
  { path: '/configuracion/aplicacion', name: 'Aplicación', type: 'link', icon: 'view_compact' },
  { path: '/configuracion/sistema', name: 'Sistema', type: 'link', icon: 'dns' },
  { path: '/configuracion/licencia-plan', name: 'Plan', type: 'link', icon: 'dns' },
  { path: '/configuracion/plan-cliente', name: 'Plan Cliente', type: 'link', icon: 'credit_card' },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
