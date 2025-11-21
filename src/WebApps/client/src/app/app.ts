import { Component, inject, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { PreloaderService, SettingsService } from '@core/bootstrap';
import { PermissionsService } from '@core/services/permissions';
import {
  PermissionCashAccounting,
  ProductPermission,
  UserPermission,
  UserRoleStateService,
} from '@shared/store/user-role-state.service';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { AuthUseCase } from '@modules/auth/domain/use-cases/auth.use-case';
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

  private _authUseCase = inject(AuthUseCase);

  title = 'Acontplus';
  userRoleState = inject(UserRoleStateService);

  private readonly themeSwitcher = inject(ThemeSwitcher);
  private readonly _tokenUseCase = inject(TokenUseCase);
  private readonly preloader = inject(PreloaderService);
  private readonly settings = inject(SettingsService);
  private readonly permissionsService = inject(PermissionsService);

  // Add a flag to track if legacy authentication has been processed
  private legacyAuthProcessed = false;

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
      console.log('Query Params:', { token, route, dataPermission, userRoleData });

      // **FLUJO LEGACY**: Autenticación desde Razor Pages
      // Viene con token, route y permisos como query params
      if (token && route) {
        this.handleLegacyAuthentication(token, route, dataPermission, userRoleData);
      }
      // **FLUJO MODERNO**: Autenticación Angular nativa
      // Only handle modern flow if no legacy auth was processed AND no valid token exists
      else if (!this.legacyAuthProcessed && this.shouldHandleModernFlow()) {
        this.handleModernFlow();
      }
    });
  }

  /**
   * Determines if modern flow should be handled
   */
  private shouldHandleModernFlow(): boolean {
    // Check if we have a valid token in localStorage
    const existingToken = localStorage.getItem(environment.tokenKey);

    if (existingToken && !this._tokenUseCase.isTokenExpired()) {
      console.log('[Modern Flow] Valid token exists, skipping modern flow initialization');
      return false;
    }

    return true;
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
   * Maneja la autenticación legacy desde Razor Pages
   * Recibe token, ruta y permisos como query params
   */
  private handleLegacyAuthentication(
    token: string,
    route: string,
    dataPermission?: string,
    userRoleData?: string,
  ) {
    // Mark that legacy auth has been processed
    this.legacyAuthProcessed = true;

    // Validate and sync tokens - clear data if tokens don't match
    const shouldClearData = this.validateAndSyncTokens(token);

    // If tokens didn't match and data was cleared, we need to process everything fresh
    // If tokens matched, we might still want to update permissions if they changed
    if (shouldClearData || dataPermission) {
      this.processPermissions(dataPermission, userRoleData);
    }

    // Always set the new token (it might be the same or different)
    localStorage.setItem(environment.tokenKey, token);

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
  private processPermissions(dataPermission?: string, userRoleData?: string) {
    try {
      // Only process if we have permission data
      if (!dataPermission) {
        return;
      }

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
    console.log('[Modern Flow] Initializing modern Angular flow');
    this.settings.setDirection();
    this.themeSwitcher.loadMode();
  }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
