import { printerProvider } from '@modules/config/providers/printer.provider';
import {solicitudUsuarioProvider} from "@modules/config/providers/solicitud-usuario.provider";
import {userCustomerProvider} from "@modules/config/providers/user-customer.provider";

export const configProvider = [
  printerProvider,
  solicitudUsuarioProvider,
  userCustomerProvider
];
