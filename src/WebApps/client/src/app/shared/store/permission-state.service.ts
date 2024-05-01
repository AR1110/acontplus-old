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
export class PermissionCashAccounting  {
  verOtrasCajas: boolean = false;
  reporteMovimiento: boolean = false;
  cerrarCaja: boolean = false;
  enterKey: boolean = false;
  reporteTransaccionPendiente: boolean = false;
  reporteDetalleControlCaja: boolean = false;
}
export class Permission  {
  // "sales": {
  //   "comprobante": {
  //     "fechaEmision": true,
  //     "tiempoCredito": true,
  //     "tarifa": true,
  //     "porcentajeDescuento": true,
  //     "descuento": true
  //   },
  //   "detalle": {
  //     "medida": true,
  //     "tipoIva": true,
  //     "tarifa": true,
  //     "precioUnitario": true,
  //     "precioConIva": true,
  //     "porcentajeDescuento": true,
  //     "descuento": true
  //   },
  //   "adicionales": {
  //     "keyRequest": false,
  //     "usersAdmin": [],
  //     "viewOthersDocs": true,
  //     "kardex": true,
  //     "totalesVenta": true
  //   },
  //   "permisoEditarDoc": {
  //     "requiereClave": false
  //   }
  // },
  cashAccounting: PermissionCashAccounting = {
    verOtrasCajas: false,
    reporteMovimiento: false,
    cerrarCaja: false,
    enterKey: false,
    reporteTransaccionPendiente: false,
    reporteDetalleControlCaja: false
  }
}
interface PermissionState {
  permission: Permission
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
