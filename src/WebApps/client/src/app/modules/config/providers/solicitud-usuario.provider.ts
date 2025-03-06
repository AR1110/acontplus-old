import { ClassProvider } from '@angular/core';
import {SolicitudUsuarioRepository} from "@modules/config/domain/repositories/solicitud-usuario.repository";
import {SolicitudUsuarioWebRepository} from "@modules/config/data/printer/solicitud-usuario-web.repository";

export const solicitudUsuarioProvider: ClassProvider = {
  provide: SolicitudUsuarioRepository,
  useClass: SolicitudUsuarioWebRepository,
};
