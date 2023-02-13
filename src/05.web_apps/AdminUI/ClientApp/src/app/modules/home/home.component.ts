import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Menu } from './menu.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  opened = true;

  toggle(): void {
    this.opened = !this.opened;
  }

  menu: Menu = [
    // {
    //   title: 'Usuario',
    //   icon: 'face',
    //   link: '/usuario',
    //   color: '#ff7f0e',
    // },
    {
      title: 'Configuracion',
      icon: 'setting',
      color: '#ff7f0e',
      subMenu: [],
    },
  ];

}
