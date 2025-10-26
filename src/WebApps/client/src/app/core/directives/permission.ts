import { Directive, Input, TemplateRef, ViewContainerRef, inject, signal, computed, effect } from '@angular/core';
import { PermissionsService } from '@core/services/permissions';

/**
 * Directiva estructural para mostrar/ocultar elementos según permisos.
 * Detecta automáticamente si el contexto es una ruta o un código de módulo.
 *
 * @example
 * <button *hasPermission="'crear'">Crear</button>
 * <button *hasPermission="['editar', 'eliminar']; hasPermissionContext: 'CLI'">Editar o Eliminar Cliente</button>
 * <div *hasPermission="'leer'; else: noAccess">Contenido protegido</div>
 * <ng-template #noAccess>No tienes acceso</ng-template>
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private permissionsService = inject(PermissionsService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private hasView = false;

  private context = signal<string | undefined>(undefined);
  private actionCodes = signal<string[]>([]);

  // Computed que revisa los permisos automáticamente
  private canAccess = computed(() =>
    this.permissionsService.hasAnyPermission(this.actionCodes(), this.context())
  );

  constructor() {
    // Effect que actualiza la vista automáticamente cuando cambia canAccess
    effect(() => {
      this.updateView(this.canAccess());
    });
  }

  @Input()
  set hasPermission(value: string | string[]) {
    const codes = Array.isArray(value) ? value : [value];
    this.actionCodes.set(codes);
  }

  @Input('hasPermissionContext')
  set setContext(value: string | undefined) {
    this.context.set(value);
  }

  @Input('hasPermissionElse')
  elseTemplateRef?: TemplateRef<any>;

  private updateView(hasPermission: boolean) {
    if (hasPermission && !this.hasView) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
      if (this.elseTemplateRef) {
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
      }
    }
  }
}
