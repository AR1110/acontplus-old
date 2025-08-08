import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ApiResponse} from "@core/models/api-response";
import { Observable } from "rxjs";
import {ProductPhotoSaveParam} from "@inventory/product/domain/entities/product-photo.model";
import {ProductPhotoRepository} from "@inventory/product/domain/repositories/product-photo.repository";


@Injectable({
  providedIn: 'root',
})
export class ProductPhotoPutUseCase implements BaseUseCase<ApiResponse, ProductPhotoSaveParam> {
  constructor(private repo: ProductPhotoRepository) {
  }

  execute(params:ProductPhotoSaveParam): Observable<ApiResponse> {
        return this.repo.put(params)
    }


}
