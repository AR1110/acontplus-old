import { Injectable } from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {ResumenContableRepository} from "@accounting/core/repositories/resumen-contable.repository";


@Injectable({
  providedIn: 'root'
})

export class ResumenContableUsecase {
  constructor(private repo: ResumenContableRepository) { }
  getDataFilter(){
    return this.repo.getDataFilter()
  }

}
