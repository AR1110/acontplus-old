import { Component, inject, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { PreloaderService, SettingsService } from '@core/bootstrap';

import { UserPermission, UserRoleStateService } from '@shared/store/user-role-state.service';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';

import { getEnumValueByKey } from '@core/utils/constant-value';
import { GlobalRoutes } from '@core/constants/global-routes';
import { ThemeSwitcher } from '@acontplus/ng-components';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  title = 'Acontplus';
  userRoleState = inject(UserRoleStateService);

  private readonly themeSwitcher = inject(ThemeSwitcher);
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly preloader = inject(PreloaderService);
  private readonly settings = inject(SettingsService);

  // Add flags to track authentication state
  private legacyAuthProcessed = false;
  private modernFlowProcessed = false;

  ngOnInit() {
    // Limpiar sessionStorage en cada inicio
    Object.keys(sessionStorage).forEach(function (key) {
      sessionStorage.removeItem(key);
    });

    this.route.queryParams.subscribe((params) => {
      const token = params['token'] as string | undefined;
      const route = params['route'] as string | undefined;
      const dataPermission = params['permission'] as string | undefined;
      const userRoleData = params['userRoleData'] as string | undefined;

      console.log('Query Params received:', { token, route, dataPermission, userRoleData });

      // **FLUJO LEGACY**: Autenticación desde Razor Pages (iframe)
      // Debe tener token, route, permission y userRoleData para ser considerado legacy
      if (token && route && dataPermission && userRoleData && !this.legacyAuthProcessed) {
        console.log('[Legacy Flow] Processing legacy authentication from Razor Pages');
        this.handleLegacyAuthentication(token, route, dataPermission, userRoleData);
      }
      // **FLUJO MODERNO**: Aplicación Angular standalone
      // Se ejecuta cuando NO hay parámetros legacy o cuando los parámetros están incompletos
      else if (!this.legacyAuthProcessed && !this.modernFlowProcessed) {
        console.log('[Modern Flow] Processing modern Angular flow');
        this.handleModernFlow();
      }
    });
  }

  /**
   * Clears all authentication data from storage
   */
  private clearAllAuthData(): void {
    // Clear localStorage auth data
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem('permisos');
    localStorage.removeItem('userRoleData');

    // Clear sessionStorage
    sessionStorage.clear();

    // Reset user role state
    this.userRoleState.setState({});

    console.log('[Auth] All authentication data cleared from storage');
  }

  /**
   * Checks if tokens match and clears data if they don't
   */
  private validateAndSyncTokens(newToken: string): boolean {
    const existingToken = localStorage.getItem(environment.tokenKey);

    // If no existing token, proceed normally
    if (!existingToken) {
      return true;
    }

    // If tokens are different, clear all auth data
    if (existingToken !== newToken) {
      console.warn('[Auth] Token mismatch detected. Clearing existing auth data.');
      this.clearAllAuthData();
      return true;
    }

    // Tokens match, no action needed
    console.log('[Auth] Tokens match, preserving existing session');
    return false;
  }

  /**
   * Maneja la autenticación legacy desde Razor Pages (iframe)
   * Recibe token, ruta y permisos como query params
   */
  private handleLegacyAuthentication(
    token: string,
    route: string,
    dataPermission: string,
    userRoleData: string,
  ) {
    // Mark that legacy auth has been processed
    this.legacyAuthProcessed = true;

    console.log('[Legacy Flow] Processing legacy authentication with:', { token, route });

    // Validate and sync tokens - clear data if tokens don't match
    const shouldClearData = this.validateAndSyncTokens(token);

    // Process permissions (always process in legacy flow since we have all data)
    this.processPermissions(dataPermission, userRoleData);

    // Always set the new token
    localStorage.setItem(environment.tokenKey, token);

    // Convertir la ruta legacy a ruta Angular
    const route_page = getEnumValueByKey(GlobalRoutes, route as keyof typeof GlobalRoutes);

    console.log('[Legacy Flow] Navigating to route:', route_page);

    if (route_page) {
      // Redirigir a /legacy/... para cargar sin el layout admin
      void this.router.navigate(['/legacy', ...route_page.split('/')]);
    } else {
      console.warn('[Legacy Flow] Route not found, redirecting to dashboard');
      // Redirigir a dashboard por defecto (con layout)
      void this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Procesa los permisos recibidos desde el sistema legacy
   */
  private processPermissions(dataPermission: string, userRoleData: string) {
    try {
      console.log('[Legacy Flow] Processing permissions');

      localStorage.setItem('permisos', dataPermission);
      localStorage.setItem('userRoleData', userRoleData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedPermission = JSON.parse(dataPermission) as { acciones: any };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { acciones } = parsedPermission;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const permission = JSON.parse(dataPermission) as Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRole = JSON.parse(userRoleData) as { codeRole: any };

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

      console.log('[Legacy Flow] Permissions processed successfully');
    } catch (error) {
      console.error('[Legacy Auth] Error processing permissions:', error);
    }
  }

  /**
   * Maneja el flujo moderno de Angular
   * Sin query params de autenticación legacy
   */
  private handleModernFlow() {
    this.modernFlowProcessed = true;
    console.log('[Modern Flow] Initializing modern Angular flow');

    this.settings.setDirection();
    this.themeSwitcher.loadMode();

    // En el flujo moderno, verificar si hay token válido
    const existingToken = localStorage.getItem(environment.tokenKey);
    if (existingToken && !this._tokenUseCase.isTokenExpired()) {
      console.log('[Modern Flow] Valid token found, user is authenticated');
      // Usuario ya autenticado, puede continuar con la aplicación normal
    } else {
      // Redirigir al login o página de autenticación
      //  void this.router.navigate(['/auth/login']);
    }
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
