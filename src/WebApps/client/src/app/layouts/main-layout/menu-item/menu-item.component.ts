import {Component, computed, effect, inject, input, signal} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { RouteBuilderUtils } from '@core/utils/route-builder.utils';
import { MatTooltip } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MenuItemList } from '../menu.types';
@Component({
  selector: 'app-menu-item',
  imports: [MatListModule, RouterModule, MatIcon, MatTooltip],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  animations: [
    trigger('expandContractMenu', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('500ms ease-in-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [animate('500ms ease-in-out', style({ opacity: 1, height: '0px' }))]),
    ]),
  ],
})
export class MenuItemComponent {
  item = input.required<MenuItemList>();
  collapsed = input(false);

  routeHistory = input('')
  nestedMenuOpen = signal(false);

  level = computed(()=>this.routeHistory().split('/').length - 1);

  indentation = computed(()=> this.collapsed()? '16px':`${(16+(this.level()*16))}px`);

  hasChildren = computed(()=>(this.item()?.subItems?.length || 0) > 0);

  logRoutes = effect(()=>{
    console.log(this.routeHistory());
  })
}
