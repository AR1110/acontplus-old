import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { THEME_OPTIONS } from '@core/theme/theme-options';
import { PreloaderService, SettingsService } from '@core/bootstrap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class App implements OnInit, AfterViewInit {
  title = 'Acontplus';
  //temporalmente
  themeOptions = THEME_OPTIONS;
  //end temporalmente
  // userRoleState = inject(UserRoleStateService);
  //temporalmente
  // private readonly _themeService = inject(ThemeService);
  // private readonly _document = inject(DOCUMENT);
  // private readonly _renderer = inject(Renderer2);
  // private readonly _tokenUseCase = inject(TokenUseCase);
  // //end temporalmente
  //
  // constructor(
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private _authUseCase: AuthUseCase,
  //   library: FaIconLibrary,
  // ) {
  //   library.addIconPacks(fab);
  //   effect(() => {
  //     this._renderer.setAttribute(
  //       this._document.documentElement,
  //       'class',
  //       this._themeService.theme(),
  //     );
  //   });
  // }

  //temporalmente
  // changeTheme(newTheme: ThemeClass) {
  //   this._themeService.changeTheme(newTheme);
  // }

  //end temporalmente

  // ngOnInit() {
  //   const self = this;
  //   Object.keys(sessionStorage).forEach(function (key) {
  //     sessionStorage.removeItem(key);
  //   });
  //
  //   this.route.queryParams.subscribe((params) => {
  //     const { token, route, permission: dataPermission, userRoleData } = params;
  //
  //     console.log(route);
  //     if (dataPermission) {
  //       localStorage.setItem('permisos', dataPermission);
  //       localStorage.setItem('userRoleData', userRoleData);
  //       const getPermission = localStorage.getItem('permisos');
  //       const getUserRoleData = localStorage.getItem('userRoleData');
  //       if (getPermission && getUserRoleData) {
  //         const { acciones } = JSON.parse(getPermission);
  //
  //         const permission = JSON.parse(dataPermission);
  //         const userRoleData = JSON.parse(getUserRoleData);
  //
  //         const instancePermission = new UserPermission();
  //         this.userRoleState.setState({
  //           permission: {
  //             ...instancePermission,
  //             ...permission,
  //           },
  //           accion: acciones,
  //           acciones: [],
  //           codeRole: userRoleData.codeRole,
  //         });
  //       }
  //     }
  //
  //     if (token) {
  //       //temporalmente
  //       const themeClass = this.themeOptions.find((x) => x.name === 'azure')
  //         ?.light.class;
  //       if (themeClass) {
  //         //this.changeTheme(themeClass);
  //       } else {
  //         console.error('Theme not found!');
  //       }
  //
  //       //end temporalmente
  //
  //       if (!this._tokenUseCase.isTokenExpired()) {
  //         localStorage.removeItem('access_token');
  //       }
  //       const route_page = getEnumValueByKey(GlobalRoutes, route);
  //
  //       localStorage.setItem('access_token', token);
  //       self.router.navigate(['/', ...route_page.split('/')]);
  //     }
  //   });
  // }

  //new line code
  private readonly preloader = inject(PreloaderService);
  private readonly settings = inject(SettingsService);

  ngOnInit() {
    this.settings.setDirection();
    this.settings.setTheme();
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
