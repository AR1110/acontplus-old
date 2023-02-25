import { Component } from '@angular/core';
import { IMenu } from '@app/core/interfaces/menu.interface';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent {

  menuList: IMenu[] = [
    // {
    //   text: "Dashboard",
    //   icon: "dashboard",
    //   routerLink: "/"
    // },
    {
      text: "Administración",
      icon: "domain",
      children: [
        {
          text: "Entidad",
          icon: "category",
          routerLink: "/admin/entidad"
        },
        {
          text: "Establecimiento",
          icon: "layers",
          routerLink: "/admin/establecimiento"
        },
        {
          text: "Punto Emisióm",
          icon: "layers",
          routerLink: "/admin/punto-emision"
        },
        {
          text: "Menú",
          icon: "layers",
          routerLink: "/admin/menu"
        },
        {
          text: "SubMenú",
          icon: "layers",
          routerLink: "/admin/submenu"
        },
      ]
    },
    {
      text: "Configuración",
      icon: "settings",
      children: [
        {
          text: "Category",
          icon: "category",
          routerLink: "/product/category"
        }
      ]
    }
  ]

  constructor() { }


}
