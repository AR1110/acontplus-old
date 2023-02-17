import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@app/material.module';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent, SideBarComponent, Page404Component} from './components';



@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SideBarComponent,
    Page404Component,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports:[
    MainLayoutComponent,
    HeaderComponent, 
    SideBarComponent,
    Page404Component
  ]
})
export class SharedModule { }
