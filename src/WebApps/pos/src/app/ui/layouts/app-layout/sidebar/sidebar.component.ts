import {
  Component,
  computed,
  inject,
  Input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { menusRoutes } from '../../menus-routes';
import { MainStoreService } from '@/domain/services/main-store.service';
import {GetMenusUseCase} from "@domain/use-cases/menu/get-menus.use-case";
import {SubMenuItem} from "@domain/models/menu.model";

@Component({
  selector: 'app-sidebar',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  mainStore = inject(MainStoreService);
  private $getMenusUseCase = inject(GetMenusUseCase);

  userName = computed(() => this.mainStore.state().userName);

  toggle = output();
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  menuItems = signal<any[]>(menusRoutes);
//   menuItems = signal<SubMenuItem[]>([]);

  profilePickSize = computed(() => (this.sideNavCollapsed() ? '32' : '50'));


  // ngOnInit(){
  //   this.$getMenusUseCase.execute().subscribe(response=>{
  //     let submenus = response.flatMap(m=>{
  //       return m.children && m.children.length>0 ? m.children: []
  //     })
  //     console.log(submenus)
  //     if(submenus && submenus.length>0){
  //       this.menuItems.set(submenus)
  //     }
  //   })
  // }


}
