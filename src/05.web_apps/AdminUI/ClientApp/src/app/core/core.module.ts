import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard } from './guards/auth.guard';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SideNavbarComponent } from './components/side-navbar/side-navbar.component';
import { MaterialModule } from '@app/material.module';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective } from './components/accordion';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,

    HeaderComponent,
    SidebarComponent,
    SideNavbarComponent,
    MainLayoutComponent
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,

    HeaderComponent,
    SideNavbarComponent,
    SidebarComponent
  ],
  imports: [CommonModule, RouterModule, MaterialModule],
  providers: [
    AuthGuard,
  ],
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error("Debe importar el módulo central solo en el módulo raíz")
  }
  }
 }
