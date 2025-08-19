import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ProductRepository} from "@inventory/product/domain/repositories/product.repository";
import {ProductDataForm} from "@inventory/product/domain/entities/product.model";


@Injectable({
  providedIn: 'root',
})
export class ProductDataFormUseCase implements BaseUseCase<ProductDataForm, any>
{
  constructor(private repo: ProductRepository) {}

  execute() {
    return this.repo.getDataForm();
  }
}
