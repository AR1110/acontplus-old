import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ApiResponse} from "@core/models/api-response";
import { Observable } from "rxjs";
import {FractionalProductRepository} from "@inventory/domain/repositories/fractional-product.repository";
import {FractionalProductDataGetId} from "@inventory/domain/models/fractional-product.model";


@Injectable({
  providedIn: 'root',
})
export class FractionalProductGetIdUseCase  implements BaseUseCase<ApiResponse<FractionalProductDataGetId>, number> {
  constructor(private repo: FractionalProductRepository) {
  }

  execute(params: number): Observable<ApiResponse<FractionalProductDataGetId>> {
        return this.repo.getId(params)
    }





}
