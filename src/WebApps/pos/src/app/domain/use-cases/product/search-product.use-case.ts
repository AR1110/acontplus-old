import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ProductSearchDto, ProductSearchParams} from "@domain/models/inventory/product.model";
import {ProductRepository} from "@domain/repositories/product.repository";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SearchProductUseCase implements BaseUseCase<ProductSearchDto[], ProductSearchParams> {
  constructor(private repo: ProductRepository) {
  }

  execute(params: ProductSearchParams): Observable<ProductSearchDto[]> {
       return this.repo.search(params);
    }

}
