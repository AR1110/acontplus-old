import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { PermissionsService } from '@core/services/permissions';
import { ACTION_ALIASES } from '@core/constants/permission-actions';

/**
 * Guard funcional para proteger rutas con permisos.
 * Ahora utiliza la lógica unificada del PermissionsService para mayor simplicidad.
 *
 * Uso en routing:
 * // 1. Protección por módulo (Recomendado)
 * {
 *   path: 'clients',
 *   component: ClientsComponent,
 *   canActivate: [permissionGuard],
 *   data: {
 *     context: 'CLI', // 'context' es más genérico que 'moduleCode'
 *     requiredActions: ['leer'] // Acciones requeridas (opcional)
 *   }
 * }
 *
 * // 2. Protección por ruta (Fallback automático)
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [permissionGuard],
 *   data: {
 *     // No se necesita 'context', el guard usará la URL '/dashboard'
 *     requiredActions: ['leer']
 *   }
 * }
 */
export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const permissionsService = inject(PermissionsService);
  const router = inject(Router);

  // 1. Verificación inicial: ¿Hay una sesión de permisos cargada?
  // Si no hay datos de usuario, los permisos no se han cargado.
  if (!permissionsService.userData()) {
    console.warn(
      'Guard: No hay sesión de usuario o permisos cargados. Redirigiendo a no autorizado.',
    );
    router.navigate(['/unauthorized'], {
      queryParams: { returnUrl: state.url, reason: 'no_session' },
    });
    return false;
  }

  // 2. Extraer datos de la ruta de forma simplificada
  const { context, requiredActions } = route.data;

  // 3. Determinar el contexto de la verificación
  // - Si se define 'context' en los datos de la ruta, se usa (ej: 'CLI').
  // - Si no, se usa la URL actual como contexto (ej: '/dashboard').
  const targetContext = context || state.url;

  // 4. Determinar las acciones a verificar
  // - Si se definen 'requiredActions', se usan.
  // - Si no, por defecto se requiere permiso de 'leer' para acceder a la página.
  // Esto asegura que las rutas protegidas siempre necesiten un permiso mínimo.
  const actionsToCheck =
    requiredActions && requiredActions.length > 0 ? requiredActions : [ACTION_ALIASES.READ];

  console.log(
    `Guard: Verificando acceso a '${state.url}' con contexto '${targetContext}' y acciones [${actionsToCheck.join(', ')}]`,
  );

  // 5. Realizar la verificación unificada
  // Usamos el nuevo método hasAllPermissions que:
  // - Detecta automáticamente si 'targetContext' es un módulo o una ruta.
  // - Verifica que el usuario tenga TODAS las acciones requeridas en ese contexto.
  const hasAccess = permissionsService.hasAllPermissions(actionsToCheck, targetContext);

  if (hasAccess) {
    console.log('Guard: Acceso permitido.');
    return true;
  } else {
    console.warn(`Guard: Acceso denegado. No se cumplen los permisos requeridos.`);
    router.navigate(['/unauthorized'], {
      queryParams: {
        returnUrl: state.url,
        reason: 'forbidden',
        context: targetContext,
        required: actionsToCheck.join(','),
      },
    });
    return false;
  }
};
