import {BaseUseCase} from "@core/base-use-case";
import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ProductRepository} from "@inventory/product/domain/repositories/product.repository";

@Injectable({
  providedIn: "root",
})
export class ListProductWithPricesUseCase implements BaseUseCase<any, any>{
  private repo = inject(ProductRepository);
  execute = (params: any): Observable<any> =>{
    return this.repo.listProductWithPrices(params)
  }
}
