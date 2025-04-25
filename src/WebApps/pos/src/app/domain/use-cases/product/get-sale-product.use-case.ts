import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {
  GetSaleProductParams,
  GetSaleProductResponse,
} from "@domain/models/inventory/product.model";
import {ProductRepository} from "@domain/repositories/product.repository";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class GetSaleProductUseCase implements BaseUseCase<GetSaleProductResponse, GetSaleProductParams> {
  constructor(private repo: ProductRepository) {
  }

  execute(params: GetSaleProductParams): Observable<GetSaleProductResponse> {
        return this.repo.getSale(params);
    }


}
