
import { Injectable } from '@angular/core';
import { GenericStoreBehaviorSubjectService } from '@shared/services/generic-store-behaviorSubject.service';
import {CODE_ROLE} from "@core/constants/global.constants";

type ActionState = {
  crear: boolean
  editar: boolean
  eliminar: boolean
  anular: boolean
  cerrarCaja: boolean
  aperturarCaja: boolean
  movimiento: boolean
  reporte: boolean
}
export class PermissionCashAccounting  {
  verOtrasCajas: boolean = false;
  reporteMovimiento: boolean = false;
  cerrarCaja: boolean = false;
  enterKey: boolean = false;
  reporteTransaccionPendiente: boolean = false;
  reporteDetalleControlCaja: boolean = false;
}
export class UserPermission  {
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

interface UserRoleState {
  permission: UserPermission
  accion: ActionState;
  acciones: any[],
  codeRole: CODE_ROLE.ADM
}
@Injectable({
  providedIn: 'root'
})
export class UserRoleStateService extends GenericStoreBehaviorSubjectService<UserRoleState> {
  constructor() {
    super();
  }
}
