import { Injectable } from "@angular/core";
import {InventarioModeloRepository} from "@inventory/domain/repositories/inventario-modelo.repository";


@Injectable({
  providedIn: 'root'
})

export class InventarioModeloUseCase {
  constructor(private repo: InventarioModeloRepository) { }

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }

  updateStatus(idModelo: number){
    return this.repo.updateStatus(idModelo)
  }
  post<T>(data: T) {
    return this.repo.post(data)
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data)
  }


}
