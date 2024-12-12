import { Injectable } from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {ResumenContableRepository} from "@accounting/core/repositories/resumen-contable.repository";
import {CategoryRepository} from "@accounting/core/repositories/category.repository";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/models/api-response";


@Injectable({
  providedIn: 'root'
})

export class CategoryUsecase {
  constructor(private repo: CategoryRepository) { }
   get<T>(params: T) {
    return this.repo.get(params)
   }
   delete(id:number) {
    return this.repo.delete(id)
   }
   post<T>(data: T) {
    return this.repo.post(data)
   }
   put<T>(id: number, data: T) {
    return this.repo.put(id, data)
   }

}
