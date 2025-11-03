import { Injectable, Signal, computed, effect, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from '@core/models/menu.model';
import { ACTION_ALIASES } from '@core/constants/permission-actions';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { SessionCache } from '@modules/auth/domain/models/session';

// --- Interfaz de Configuración Centralizada ---
export interface PermissionConfig {
  defaultMode: 'all' | 'any';
  cacheEnabled: boolean;
  cacheDuration: number; // en milisegundos
  adminRoleCode: string;
  logPermissionChecks: boolean; // Para depuración
}

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private router = inject(Router);
  private tokenUseCase = inject(TokenUseCase);

  // --- Constantes de configuración ---
  private readonly PERMISSIONS_KEY = 'app_permissions_cache';
  private readonly CACHE_VERSION = '1.0.0';
  private readonly DEFAULT_CONFIG: PermissionConfig = {
    defaultMode: 'any',
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hora
    adminRoleCode: 'ADM',
    logPermissionChecks: false, // Desactivar en producción
  };

  // --- SIGNALS BASE ---
  private readonly _sessionCache = signal<SessionCache | null>(null);
  private readonly _currentRoute = signal<string>('');
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _config = signal<PermissionConfig>(this.DEFAULT_CONFIG);

  // --- COMPUTED SIGNALS PRINCIPALES ---
  readonly userData = computed(() => this._sessionCache()?.userData ?? null);
  readonly userRole = computed(() => this.userData()?.codeRole ?? '');
  readonly isAdmin = computed(() => this.userRole() === this._config().adminRoleCode);
  readonly menuItems = computed(() => this._sessionCache()?.menuItems ?? []);
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentRoute = this._currentRoute.asReadonly();

  // --- Mapas de permisos optimizados ---
  private readonly routePermissionsMap = computed(() =>
    this.buildRoutePermissionsMap(this.menuItems()),
  );
  private readonly codePermissionsMap = computed(() =>
    this.buildCodePermissionsMap(this.menuItems()),
  );

  // --- Permisos de la ruta actual ---
  readonly currentRoutePermissions = computed(() =>
    this.findPermissionsForRoute(this._currentRoute(), this.routePermissionsMap()),
  );
  readonly currentActions = computed(() => this.currentRoutePermissions()?.actions ?? []);
  readonly currentActionCodes = computed(() => new Set(this.currentActions().map((a) => a.code)));

  // --- COMPUTED SIGNALS DE ACCIONES COMUNES ---
  readonly canRead = computed(() => this.hasPermission(ACTION_ALIASES.READ));
  readonly canCreate = computed(() => this.hasPermission(ACTION_ALIASES.CREATE));
  readonly canEdit = computed(() => this.hasPermission(ACTION_ALIASES.EDIT));
  readonly canDelete = computed(() => this.hasPermission(ACTION_ALIASES.DELETE));
  readonly canReport = computed(() => this.hasPermission(ACTION_ALIASES.REPORT));
  readonly canCancel = computed(() => this.hasPermission(ACTION_ALIASES.CANCEL));

  // --- VALIDACIONES DE CACHE ---
  readonly isCacheValid = computed(() => {
    if (!this._config().cacheEnabled) return false;
    const cache = this._sessionCache();
    if (!cache) return false;
    const isExpired = Date.now() - cache.timestamp > this._config().cacheDuration;
    const isVersionValid = cache.version === this.CACHE_VERSION;
    return !isExpired && isVersionValid;
  });

  constructor() {
    this.loadFromStorage();
    this.initializeService();
  }

  // --- INICIALIZACIÓN ---
  private initializeService(): void {
    // effect(() => {
    //   if (!this._sessionCache()) {
    //     console.log('Cargando permisos desde almacenamiento local', this._sessionCache());
    //     this.loadFromStorage();
    //   }
    // });
    // effect(() => {
    //   const cache = this._sessionCache();
    //   console.log('Guardando permisos en almacenamiento local:', cache);
    //   if (cache) this.saveToStorage(cache);
    // });
    // effect(() => {
    //   if (!this.isCacheValid() && this._sessionCache()) {
    //     console.warn('Cache expirado o deshabilitado, limpiando permisos');
    //     this.clearPermissions();
    //   }
    // });
    this.setupRouteTracking();
  }

  // --- CONFIGURACIÓN ---
  updateConfig(newConfig: Partial<PermissionConfig>): void {
    this._config.update((current) => ({ ...current, ...newConfig }));
  }

  // --- MÉTODOS PÚBLICOS UNIFICADOS ---

  /**
   * Verifica si tiene una acción específica.
   * Detecta automáticamente si el 'contexto' es una ruta o un código de módulo.
   * @param actionCode El código de la acción (ej: 'leer', 'crear').
   * @param context Opcional. La ruta (ej: '/cliente') o el código de módulo (ej: 'CLI'). Si no se proporciona, usa la ruta actual.
   */
  hasPermission(actionCode: string, context?: string): boolean {
    // if (this.isAdmin()) {
    //   this.logCheck(actionCode, context, true, 'Admin bypass');
    //   return true;
    // }
    const targetContext = context ?? this._currentRoute();
    return this.isModuleCode(targetContext)
      ? this.hasActionByCode(targetContext, actionCode)
      : this.hasActionByRoute(targetContext, actionCode);
  }

  /**
   * Verifica si tiene ALGUNA de las acciones proporcionadas (modo 'any').
   */
  hasAnyPermission(actionCodes: string[], context?: string): boolean {
    return actionCodes.some((code) => this.hasPermission(code, context));
  }

  /**
   * Verifica si tiene TODAS las acciones proporcionadas (modo 'all').
   */
  hasAllPermissions(actionCodes: string[], context?: string): boolean {
    return actionCodes.every((code) => this.hasPermission(code, context));
  }

  // --- MÉTODOS LEGADOS (ahora privados y renombrados para claridad) ---
  private hasActionByRoute(route: string, actionCode: string): boolean {
    const map = this.routePermissionsMap();
    const permissions = this.findPermissionsForRoute(route, map);
    const hasAction = permissions?.actions.some((a) => a.name === actionCode) ?? false;
    this.logCheck(actionCode, route, hasAction, 'Route check');
    return hasAction;
  }

  private hasActionByCode(moduleCode: string, actionCode: string): boolean {
    const map = this.codePermissionsMap();
    const permissions = map.get(moduleCode);
    const hasAction = permissions?.actions.some((a) => a.name === actionCode) ?? false;
    this.logCheck(actionCode, moduleCode, hasAction, 'Module check');
    return hasAction;
  }

  // --- MÉTODOS PÚBLICOS ADICIONALES ---
  hasRouteAccess(route: string): boolean {
    //  if (this.isAdmin()) return true;
    return this.findPermissionsForRoute(route, this.routePermissionsMap()) !== null;
  }
  hasModuleAccess(moduleCode: string): boolean {
    //  if (this.isAdmin()) return true;
    return this.codePermissionsMap().has(moduleCode);
  }
  clearPermissions(): void {
    this._sessionCache.set(null);
    this._error.set(null);
    localStorage.removeItem(this.PERMISSIONS_KEY);
  }

  // --- MÉTODOS PRIVADOS ---
  private hasActionInCurrent(actionCode: string): boolean {
    //  if (this.isAdmin()) return true;
    return this.currentActionCodes().has(actionCode);
  }
  private isModuleCode(str: string): boolean {
    return /^[A-Z]{2,4}$/.test(str);
  }
  private logCheck(
    action: string,
    context: string | undefined,
    result: boolean,
    type: string,
  ): void {
    if (this._config().logPermissionChecks) {
      console.log(
        `[Permission Check] ${type}: Action='${action}', Context='${context}', Result=${result}`,
      );
    }
  }

  private buildRoutePermissionsMap(items: MenuItem[]): Map<string, MenuItem> {
    const map = new Map<string, MenuItem>();
    const processItem = (item: MenuItem) => {
      if (item.url && item.url !== 'javascript:void(0)') {
        const normalizedUrl = this.normalizeRoute(item.url);
        map.set(normalizedUrl, item);
      }
      if (item.children?.length) item.children.forEach((child) => processItem(child));
    };
    items.forEach((item) => processItem(item));
    return map;
  }
  private buildCodePermissionsMap(items: MenuItem[]): Map<string, MenuItem> {
    const map = new Map<string, MenuItem>();
    const processItem = (item: MenuItem) => {
      if (item.code) map.set(item.code, item);
      if (item.children?.length) item.children.forEach((child) => processItem(child));
    };
    items.forEach((item) => processItem(item));
    return map;
  }
  private findPermissionsForRoute(route: string, map: Map<string, MenuItem>): MenuItem | null {
    const normalized = this.normalizeRoute(route);
    if (map.has(normalized)) return map.get(normalized)!;
    for (const [key, value] of map.entries()) {
      if (this.routesMatch(normalized, key)) return value;
    }
    return null;
  }
  private normalizeRoute(route: string): string {
    return route.split('?')[0].split(';')[0].replace(/^\//, '').replace(/\/$/, '').toLowerCase();
  }
  private routesMatch(actualRoute: string, templateRoute: string): boolean {
    const actualParts = actualRoute.split('/').filter((p) => p);
    const templateParts = templateRoute.split('/').filter((p) => p);
    if (actualParts.length !== templateParts.length) return false;
    return templateParts.every(
      (part, index) => part.startsWith(':') || part === actualParts[index],
    );
  }
  private setupRouteTracking(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this._currentRoute.set(this.normalizeRoute(this.router.url));
    });
    this._currentRoute.set(this.normalizeRoute(this.router.url));
  }
  private loadFromStorage(): void {
    try {
      const stored = this.tokenUseCase.getSession();
      console.log('Permisos cargados desde almacenamiento local: xxxx', stored);
      if (
        stored &&
        stored.version === this.CACHE_VERSION
        // &&    Date.now() - stored.timestamp < this._config().cacheDuration
      ) {
        console.log('Permisos cargados desde almacenamiento local: yyyyyy', stored);
        this._sessionCache.set(stored);
      }
    } catch (error) {
      console.error('Error loading permissions from storage:', error);
    }
  }
  private saveToStorage(cache: SessionCache): void {
    try {
      localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving permissions to storage:', error);
    }
  }
}
