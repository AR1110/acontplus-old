import { PermissionsService } from '@core/services/permissions';

/**
 * Decorador para proteger un método. El método solo se ejecutará si el usuario tiene el permiso requerido.
 *
 * @example
 * class MyComponent {
 *   @RequirePermission(ACTION_ALIASES.DELETE, 'CLI')
 *   deleteClient(id: string) {
 *     console.log('Cliente eliminado:', id);
 *   }
 * }
 */
export function RequirePermission(actionCode: string, context?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Intentar obtener el servicio del contexto o inyectarlo
      let permissionsService: PermissionsService;
      if (target.permissionsService) {
        permissionsService = target.permissionsService;
      } else {
        try {
          permissionsService = (target as any).injector?.get(PermissionsService);
        } catch (e) {
          console.error(`RequirePermission: No se pudo inyectar PermissionsService en el método ${propertyKey}. Asegúrate de que el componente tenga el injector disponible.`);
          return;
        }
      }

      if (!permissionsService.hasPermission(actionCode, context)) {
        console.warn(`Acceso denegado al método '${propertyKey}'. Permiso requerido: '${actionCode}' en contexto '${context}'`);
        return; // No ejecuta el método
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
