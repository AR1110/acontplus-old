import {ACTION_ALIASES} from "@core/constants/permission-actions";
import {inject} from "@angular/core";
import {PermissionsService} from "@core/services/permissions";

/**
 * Valida múltiples permisos y retorna mensaje de error específico
 */
export function validatePermissions(
  requiredActions: string[],
  hasPermissionFn: (action: string) => boolean
): { valid: boolean; missingActions: string[] } {
  const missingActions = requiredActions.filter(action => !hasPermissionFn(action));

  return {
    valid: missingActions.length === 0,
    missingActions
  };
}

/**
 * Genera mensaje de error para permisos faltantes
 */
export function getPermissionErrorMessage(missingActions: string[]): string {
  if (missingActions.length === 0) return '';

  const actionNames = missingActions.map(code => {
    const action = Object.entries(ACTION_ALIASES).find(([_, value]) => value === code);
    return action ? action[0].toLowerCase() : code;
  });

  if (actionNames.length === 1) {
    return `No tiene permisos para: ${actionNames[0]}`;
  }

  return `No tiene permisos para: ${actionNames.join(', ')}`;
}




/**
 * Decorador para verificar permisos antes de ejecutar un método
 */
export function RequirePermission(actionCode: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const service = inject(PermissionsService);

      if (!service.hasAction(actionCode)) {
        console.warn(`Permiso denegado: ${actionCode} en ${propertyKey}`);
        alert(`No tiene permisos para esta acción: ${actionCode}`);
        return;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
