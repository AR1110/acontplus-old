import { computed, inject } from '@angular/core';
import { PermissionsService } from '@core/services/permissions';
import { ACTION_ALIASES } from '@core/constants/permission-actions';

/**
 * Composable unificado para permisos.
 * Funciona tanto para rutas como para códigos de módulo.
 *
 * @param context Opcional. La ruta (ej: '/cliente') o el código de módulo (ej: 'CLI'). Si no se proporciona, usa la ruta actual.
 * @returns Un objeto con signals de permisos y utilidades.
 *
 * @example
 * // En la ruta actual
 * const perms = usePermissions();
 * if (perms.canCreate()) { ... }
 *
 * // Para un módulo específico
 * const clientPerms = usePermissions('CLI');
 * if (clientPerms.canEdit()) { ... }
 *
 * // Para una ruta específica
 * const reportPerms = usePermissions('/reportes/ventas');
 * if (reportPerms.canRead()) { ... }
 */
export function usePermissions(context?: string) {
  const service = inject(PermissionsService);

  return {
    // Permisos básicos
    canRead: computed(() => service.hasPermission(ACTION_ALIASES.READ, context)),
    canCreate: computed(() => service.hasPermission(ACTION_ALIASES.CREATE, context)),
    canEdit: computed(() => service.hasPermission(ACTION_ALIASES.EDIT, context)),
    canDelete: computed(() => service.hasPermission(ACTION_ALIASES.DELETE, context)),
    canReport: computed(() => service.hasPermission(ACTION_ALIASES.REPORT, context)),
    canCancel: computed(() => service.hasPermission(ACTION_ALIASES.CANCEL, context)),

    // Verificaciones combinadas
    canManage: computed(() => service.hasAllPermissions([ACTION_ALIASES.READ, ACTION_ALIASES.EDIT], context)),
    canFullControl: computed(() => service.hasAllPermissions([ACTION_ALIASES.CREATE, ACTION_ALIASES.EDIT, ACTION_ALIASES.DELETE], context)),

    // Utilidades
    hasPermission: (actionCode: string) => service.hasPermission(actionCode, context),
    hasAnyPermission: (actionCodes: string[]) => service.hasAnyPermission(actionCodes, context),
    hasAllPermissions: (actionCodes: string[]) => service.hasAllPermissions(actionCodes, context),
  };
}
