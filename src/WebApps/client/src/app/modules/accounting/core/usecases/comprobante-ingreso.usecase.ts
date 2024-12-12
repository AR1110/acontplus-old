import { Injectable } from "@angular/core";
import { SubEntidadFinancieraRepository } from "@accounting/core/repositories/sub-entidad-financiera.repository";
import {ComprobanteIngresoRepository} from "@accounting/core/repositories/comprobante-ingreso.repository";


@Injectable({
  providedIn: 'root'
})

export class ComprobanteIngresoUsecase {
  constructor(private repo: ComprobanteIngresoRepository) { }

  getDataFilter ( ) {
    return this.repo.getDataFilter()
  }

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }

  create<T>(data: T) {
    return this.repo.create(data)
  }

  // update<T>(id: number, data: T) {
  //   return this.repo.update(id, data)
  // }
  //
  // delete(id: number) {
  //   return this.repo.delete(id)
  // }

}
