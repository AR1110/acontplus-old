import { Injectable } from "@angular/core";
import {ComprobanteIngresoRepository} from "@accounting/domain/repositories/comprobante-ingreso.repository";


@Injectable({
  providedIn: 'root'
})

export class ComprobanteIngresoUseCase {
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
