import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {OrderRepository} from "@domain/repositories/order.repository";
import {ApiResponse} from "acontplus-utils";

@Injectable({
  providedIn: 'root',
})
export class CreateOrderUseCase implements BaseUseCase<ApiResponse, any> {
  constructor(private repo: OrderRepository) {
  }
    execute(params:any) {
       return this.repo.post(params)
    }

}
