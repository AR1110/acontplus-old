import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewChild, OnInit, ChangeDetectorRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { THEME_OPTIONS } from '@core/theme/theme-options';
import { ThemeService } from '@core/theme/theme.service';
import { ThemeClass } from '@core/theme/types';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import {BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {SettingsMenuComponent} from "./settings-menu/settings-menu.component";
import {ThemeTempService} from "@core/services/theme.service";

@Component({
  selector: 'app-main-layout',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    AsyncPipe,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    SettingsMenuComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  themeOptions = THEME_OPTIONS;
//  #themeService = inject(ThemeService);
    private service= inject(ThemeTempService)
//  activeTheme = this.#themeService.theme;


  @ViewChild('sidenav') sidenav!: MatSidenav;
  public isShowSidebar: boolean;
  public mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    this.isShowSidebar = !this.mobileQuery.matches;
  }

  public ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);

    this.sidenav?.close();
  }

  public isBlueTheme = true;
  public isPinkTheme = false;
  public isGreenTheme = false;
  public isDarkMode = false;

  public changeThemeOnBlue(): void {
    this.isBlueTheme = true;
    this.isPinkTheme = false;
    this.isGreenTheme = false;

    this.service.setBlueTheme();
  }
  public changeThemeOnPink(): void {
    this.isBlueTheme = false;
    this.isPinkTheme = true;
    this.isGreenTheme = false;

    this.service.setPinkTheme();
  }
  public changeThemeOnGreen(): void {
    this.isBlueTheme = false;
    this.isPinkTheme = false;
    this.isGreenTheme = true;

    this.service.setGreenTheme();
  }
  public onDarkMode(value: boolean): void {
    this.isDarkMode = value;

    this.service.setDarkMode(value);
  }

  ngOnInit() {
  }
}
