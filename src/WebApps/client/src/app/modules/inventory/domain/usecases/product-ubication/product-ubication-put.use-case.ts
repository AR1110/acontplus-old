import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ApiResponse} from "@core/models/api-response";
import { Observable } from "rxjs";
import {ProductUbicationRepository} from "@inventory/domain/repositories/product-ubication.repository";

type Params<T> = {
  id: number, data: T
}
@Injectable({
  providedIn: 'root',
})
export class ProductUbicationPutUseCase<T> implements BaseUseCase<ApiResponse, Params<T>> {
  constructor(private repo: ProductUbicationRepository) {
  }

  execute(params: Params<T>): Observable<ApiResponse> {
        return this.repo.put(params.id, params.data)
    }


}
