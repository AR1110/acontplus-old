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
import {importacionProvider} from "@modules/config/providers/importacion.provider";
import {companyProvider} from "@modules/config/providers/company.provider";


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
  generalConfigProvider,
  importacionProvider,
  companyProvider
];
