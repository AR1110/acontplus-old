import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { PreloaderService, SettingsService } from '@core/bootstrap';
import { PermissionsService } from '@core/services/permissions';
import { UserPermission, UserRoleStateService } from '@shared/store/user-role-state.service';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { AuthUseCase } from '@modules/auth/domain/use-cases/auth.use-case';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { getEnumValueByKey } from '@core/utils/constant-value';
import { GlobalRoutes } from '@core/constants/global-routes';
import { ThemeSwitcher } from '@acontplus/ng-components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class App implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private _authUseCase = inject(AuthUseCase);

  title = 'Acontplus';
  userRoleState = inject(UserRoleStateService);
  //temporalmente
  private readonly themeSwitcher = inject(ThemeSwitcher);
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly preloader = inject(PreloaderService);
  private readonly settings = inject(SettingsService);
  private readonly permissionsService = inject(PermissionsService);
  //end temporalmente

  constructor() {
    const library = inject(FaIconLibrary);
    library.addIconPacks(fab);
  }

  ngOnInit() {
    this.themeSwitcher.loadMode();

    // Limpiar sessionStorage en cada inicio
    Object.keys(sessionStorage).forEach(function (key) {
      sessionStorage.removeItem(key);
    });

    this.route.queryParams.subscribe((params) => {
      const token = params['token'] as string | undefined;
      const route = params['route'] as string | undefined;
      const dataPermission = params['permission'] as string | undefined;
      const userRoleData = params['userRoleData'] as string | undefined;

      // **FLUJO LEGACY**: Autenticación desde Razor Pages
      // Viene con token, route y permisos como query params
      if (token && route) {
        this.handleLegacyAuthentication(token, route, dataPermission, userRoleData);
      }
      // **FLUJO MODERNO**: Autenticación Angular nativa
      else {
        this.handleModernFlow();
      }
    });
  }

  /**
   * Maneja la autenticación legacy desde Razor Pages
   * Recibe token, ruta y permisos como query params
   */
  private handleLegacyAuthentication(
    token: string,
    route: string,
    dataPermission?: string,
    userRoleData?: string,
  ) {
    // Procesar permisos si existen
    if (dataPermission) {
      this.processPermissions(dataPermission, userRoleData);
    }

    // Si ya existe un token válido, eliminarlo antes de establecer el nuevo
    if (!this._tokenUseCase.isTokenExpired()) {
      localStorage.removeItem('access_token');
    }

    // Guardar el nuevo token
    localStorage.setItem('access_token', token);

    // Convertir la ruta legacy a ruta Angular
    const route_page = getEnumValueByKey(GlobalRoutes, route as keyof typeof GlobalRoutes);

    if (route_page) {
      // Redirigir a /legacy/... para cargar sin el layout admin
      void this.router.navigate(['/legacy', ...route_page.split('/')]);
    } else {
      // Redirigir a dashboard por defecto (con layout)
      void this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Procesa los permisos recibidos desde el sistema legacy
   */
  private processPermissions(dataPermission: string, userRoleData?: string) {
    try {
      localStorage.setItem('permisos', dataPermission);

      if (userRoleData) {
        localStorage.setItem('userRoleData', userRoleData);
      }

      const getPermission = localStorage.getItem('permisos');
      const getUserRoleData = localStorage.getItem('userRoleData');

      if (getPermission && getUserRoleData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedPermission = JSON.parse(getPermission) as { acciones: any };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { acciones } = parsedPermission;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const permission = JSON.parse(dataPermission) as Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userRole = JSON.parse(getUserRoleData) as { codeRole: any };

        const instancePermission = new UserPermission();
        this.userRoleState.setState({
          permission: {
            ...instancePermission,
            ...permission,
          },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          accion: acciones,
          acciones: [],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          codeRole: userRole.codeRole,
        });
      }
    } catch (error) {
      console.error('[Legacy Auth] Error processing permissions:', error);
    }
  }

  /**
   * Maneja el flujo moderno de Angular
   * Sin query params de autenticación legacy
   */
  private handleModernFlow() {
    this.settings.setDirection();
    this.themeSwitcher.loadMode();
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
