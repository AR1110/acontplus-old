import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, effect, inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { GlobalRoutes } from '@core/constants/global-routes';
import { THEME_OPTIONS } from '@core/theme/theme-options';
import { ThemeService } from '@core/theme/theme.service';
import { ThemeClass } from '@core/theme/types';
import { getEnumValueByKey } from '@core/utils/constant-value';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { UserPermission, UserRoleStateService } from '@shared/store/user-role-state.service';
import {AuthUseCase} from "@modules/auth/domain/use-cases/auth.use-case";
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';
  //temporalmente
  themeOptions = THEME_OPTIONS;
  //end temporalmente
  userRoleState = inject(UserRoleStateService);
  //temporalmente
  #themeService = inject(ThemeService);
  #document = inject(DOCUMENT);
  #renderer = inject(Renderer2);
  private _tokenUseCase = inject(TokenUseCase)
  //end temporalmente

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _authUseCase: AuthUseCase,
    library: FaIconLibrary,
  ) {
    library.addIconPacks(fab, fas, far);
    effect(() => {
      this.#renderer.setAttribute(
        this.#document.documentElement,
        'class',
        this.#themeService.theme(),
      );
    });
  }

  //temporalmente
  changeTheme(newTheme: ThemeClass) {
    this.#themeService.changeTheme(newTheme);
  }

  //end temporalmente

  ngOnInit() {
    let self = this;
    Object.keys(sessionStorage).forEach(function (key) {
      sessionStorage.removeItem(key);
    });

    this.route.queryParams.subscribe((params) => {

      let { token, route, permission: dataPermission, userRoleData } = params;

      console.log(route);

      if (dataPermission) {
        localStorage.setItem('permisos', dataPermission);
        localStorage.setItem('userRoleData', userRoleData);
        let getPermission = localStorage.getItem('permisos');
        let getUserRoleData = localStorage.getItem('userRoleData');
        if (getPermission && getUserRoleData) {
          let { acciones } = JSON.parse(getPermission);


          let permission = JSON.parse(dataPermission);
          let userRoleData = JSON.parse(getUserRoleData);

          let instancePermission = new UserPermission();
          this.userRoleState.setState({
            permission: {
              ...instancePermission,
              ...permission,
            },
            accion: acciones,
            acciones: [],
            codeRole: userRoleData.codeRole,
          });
        }
      }

      if (token) {
        //temporalmente
        const themeClass = this.themeOptions.find((x) => x.name === 'azure')
          ?.light.class;
        if (themeClass) {
          //this.changeTheme(themeClass);
        } else {
          console.error('Theme not found!');
        }

        //end temporalmente

        if (!this._tokenUseCase.isTokenExpired()) {
          localStorage.removeItem('access_token');
        }
        let route_page = getEnumValueByKey(GlobalRoutes, route);

        localStorage.setItem('access_token', token);
        self.router.navigate(['/', ...route_page.split('/')]);
      }
    });
  }
}
