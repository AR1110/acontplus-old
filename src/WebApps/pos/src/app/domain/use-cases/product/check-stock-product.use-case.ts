import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {
  CheckStockProps,
} from "@domain/models/inventory/product.model";
import {ProductRepository} from "@domain/repositories/product.repository";
import {ApiResponse} from "acontplus-utils";

@Injectable({
  providedIn: 'root',
})
export class CheckStockProductUseCase implements BaseUseCase<ApiResponse, CheckStockProps> {
  constructor(private repo: ProductRepository) {
  }

  execute(params: CheckStockProps) {
        return this.repo.checkStock(params);
  }


}
