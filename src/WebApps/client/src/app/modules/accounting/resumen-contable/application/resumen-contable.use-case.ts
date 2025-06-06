import { Injectable } from "@angular/core";
import {ResumenContableRepository} from "@accounting/resumen-contable/domain/resumen-contable.repository";


@Injectable({
  providedIn: 'root'
})

export class ResumenContableUseCase {
  constructor(private repo: ResumenContableRepository) { }
  getDataFilter(){
    return this.repo.getDataFilter()
  }

}
