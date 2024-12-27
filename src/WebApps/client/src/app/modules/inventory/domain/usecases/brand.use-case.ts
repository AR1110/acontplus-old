import { Injectable } from "@angular/core";
import {TagRepository} from "@inventory/domain/repositories/tag.repository";
import {BrandRepository} from "@inventory/domain/repositories/brand.repository";


@Injectable({
  providedIn: 'root'
})

export class BrandUseCase {
  constructor(private repo: BrandRepository) { }

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }

  post<T>(data: T) {
    return this.repo.post(data)
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data)
  }

  updateStatus(id: number) {
    return this.repo.updateStatus(id)
  }

}
