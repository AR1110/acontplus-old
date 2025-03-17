import { Injectable } from '@angular/core';
import {ProductPhotoRepository} from "@inventory/domain/repositories/product-photo.repository";


@Injectable({
  providedIn: 'root',
})
export class ProductPhotoDefaultUseCase {
  constructor(private repo: ProductPhotoRepository) {}

  execute(id: number, isDefault: boolean)  {
    return this.repo.setDefault(id , isDefault );
  }
}
