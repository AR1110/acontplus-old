import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ProductRepository} from "@inventory/product/domain/repositories/product.repository";
import {ApiResponse} from "@core/models/api-response";
import { Observable } from "rxjs";

interface Params {
  data: any,
  productPvps: any[],
  productBarcodes:any[],
  productLocations:any[]
}
@Injectable({
  providedIn: 'root',
})
export class ProductGetIdUseCase<T> implements BaseUseCase<ApiResponse<Params>, number> {
  constructor(private repo: ProductRepository) {
  }

  execute(id: number): Observable<ApiResponse<Params>> {
        return this.repo.getId(id) as any
    }





}
