import { Injectable } from '@angular/core';
import { GenericStoreBehaviorSubjectService } from '@shared/services/generic-store-behaviorSubject.service';

type ActionState = {
  crear: boolean
  editar: boolean
  eliminar: boolean
  anular: boolean
  cerrarCaja: boolean
  aperturarCaja: boolean
  movimiento: boolean
}
interface PermissionState {
  permission: {}
  accion: ActionState;
  acciones: any[]
}
@Injectable({
  providedIn: 'root'
})
export class PermissionStateService extends GenericStoreBehaviorSubjectService<PermissionState> {
  constructor() {
    super();
  }
}
