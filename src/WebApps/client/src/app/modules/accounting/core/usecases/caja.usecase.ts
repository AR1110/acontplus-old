import { Injectable } from "@angular/core";
import { CajaRepository } from "../repositories/caja.repository";


@Injectable({
  providedIn: 'root'
})

export class CajaUsecase {
  constructor(private repo: CajaRepository) { }

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }

  getId(idCaja:number){
    return this.repo.getId(idCaja);
  }

  getDataForm(){
    return this.repo.getDataForm();
  }

  create<T>(data: T) {
    return this.repo.create(data)
  }

  update<T>(id: number, data: T) {
    return this.repo.update(id, data)
  }

  delete(id: number) {
    return this.repo.delete(id)
  }

}
