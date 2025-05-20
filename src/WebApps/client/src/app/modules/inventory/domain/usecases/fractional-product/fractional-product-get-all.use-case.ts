import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ProductRepository} from "@inventory/domain/repositories/product.repository";
import {ApiResponse} from "@core/models/api-response";
import { Observable } from "rxjs";
import {FractionalProductRepository} from "@inventory/domain/repositories/fractional-product.repository";

type Params = {
  data: any,
  totalRecords: number
}
@Injectable({
  providedIn: 'root',
})
export class FractionalProductGetAllUseCase <T> implements BaseUseCase<ApiResponse<Params>, T> {
  constructor(private repo: FractionalProductRepository) {
  }

  execute(params: T): Observable<ApiResponse<Params>> {
        return this.repo.getAll(params)
    }





}
