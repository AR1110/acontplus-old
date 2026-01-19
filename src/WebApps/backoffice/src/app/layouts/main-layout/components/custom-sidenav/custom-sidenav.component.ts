import {Component, computed, input, signal} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {MenuItemList, menuItems} from '../../menu-items';
import {MenuItemComponent} from "../menu-item/menu-item.component";

@Component({
  selector: 'app-custom-sidenav',
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule,
    MenuItemComponent
  ],
  templateUrl: './custom-sidenav.component.html',
  styles: `
    :host * {
      transition: all 500ms ease-in-out;
    }

    .sidenav-header {
      padding-top: 24px;
      text-align: center;
      >img {
        border-radius: 100%;
        object-fit: cover;
        margin-bottom: 10px;
      }

      .header-text{
        > h2{
          margin: 0;
          font-size: 1rem;
          line-height: 1.5rem;
        }

        > p{
          margin: 0;
          font-size: 0.8rem;
        }
      }

    }
    .hide-header-text {
      opacity: 0;
      height: 0px !important;
    }

  `
})
export class CustomSidenavComponent {
  collapsed = input(false);
  profilePicSize = computed(()=>this.collapsed()?'32':'80')


  menuItems = signal<MenuItemList[]>(menuItems)
}
