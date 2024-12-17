import { Injectable } from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";


@Injectable({
  providedIn: 'root'
})

export class AnticipoUsecase {
  constructor(private repo: AnticipoRepository) { }

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }

  getDataFilter(){
    return this.repo.getDataFilter()
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
