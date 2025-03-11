import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ProductRepository} from "@inventory/domain/repositories/product.repository";
import {ProductDataForm} from "@inventory/domain/models/product.model";


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
