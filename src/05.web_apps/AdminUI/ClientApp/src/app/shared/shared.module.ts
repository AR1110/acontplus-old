import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SideBarComponent,
    MenuItemComponent,
    PageHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports:[
    HeaderComponent,
    SideBarComponent,
    MenuItemComponent,
    PageHeaderComponent
  ]
})
export class SharedModule { }
