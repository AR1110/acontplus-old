import { printerProvider } from '@modules/config/providers/printer.provider';
import {solicitudUsuarioProvider} from "@modules/config/providers/solicitud-usuario.provider";
import {
  asignacionBodegaProvider,
  asignacionEstablecimientoProvider, asignacionPuntoEmisionProvider, userCustomerPermissionProvider,
  userCustomerProvider,
  userCustomerRoleProvider
} from "@modules/config/providers/user-customer.provider";
import {solicitudAutorizacionProvider} from "@modules/config/providers/solicitud-autorizacion.provider";
import {generalConfigProvider} from "@modules/config/providers/general-config.provider";

export const configProvider = [
  printerProvider,
  solicitudUsuarioProvider,
  userCustomerProvider,
  userCustomerRoleProvider,
  asignacionEstablecimientoProvider,
  asignacionPuntoEmisionProvider,
  asignacionBodegaProvider,
  userCustomerPermissionProvider,
  solicitudAutorizacionProvider,
  generalConfigProvider
];
