import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
  ViewChild,
  AfterViewInit, // Import AfterViewInit
  ChangeDetectorRef, // Import ChangeDetectorRef
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';
import {MatToolbarModule} from "@angular/material/toolbar";
import {CustomSidenavComponent} from "./components/custom-sidenav/custom-sidenav.component";

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    HeaderComponent,
    FooterComponent,
    MatSidenavContainer,
    MatSidenavModule,
    CustomSidenavComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent   {


  collapsed = signal(false);
  sidenavWidth = computed(()=>this.collapsed()? '65px':'250px');

  toggleSidenav() {
    // Defer the change to the next change detection cycle
    setTimeout(() => {
      this.collapsed.set(!this.collapsed());
    }, 0);
  }
}
