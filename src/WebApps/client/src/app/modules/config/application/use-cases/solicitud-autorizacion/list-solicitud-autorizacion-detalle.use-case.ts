import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {
  SolicitudAutorizacionDetalle, SolicitudAutorizacionList,
} from "@modules/config/domain/models/solicitud-autorizacion.model";
import {SolicitudAutorizacionRepository} from "@modules/config/domain/repositories/solicitud-autorizacion.repository";

@Injectable({
  providedIn: 'root',
})
export class ListSolicitudAutorizacionDetalleUseCase implements BaseUseCase<SolicitudAutorizacionDetalle[], Partial<SolicitudAutorizacionList>> {
  constructor(private repo:SolicitudAutorizacionRepository) {
  }

  execute(params: Partial<SolicitudAutorizacionList>)  {
     return this.repo.listDetalle(params)
    }



}
