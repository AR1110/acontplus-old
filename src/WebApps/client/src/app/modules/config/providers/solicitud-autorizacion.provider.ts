import { ClassProvider } from '@angular/core';
import {
  SolicitudAutorizacionRepositoryImpl
} from "@modules/config/data/solicitud-autorizacion/solicitud-autorizacion-repository-impl";
import {SolicitudAutorizacionRepository} from "@modules/config/domain/repositories/solicitud-autorizacion.repository";

export const solicitudAutorizacionProvider: ClassProvider = {
  provide: SolicitudAutorizacionRepository,
  useClass: SolicitudAutorizacionRepositoryImpl,
};
