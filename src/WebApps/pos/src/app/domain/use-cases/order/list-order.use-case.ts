import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ListOrderResponse} from "@domain/models/order.model";
import {OrderRepository} from "@domain/repositories/order.repository";

@Injectable({
  providedIn: 'root',
})
export class ListOrderUseCase implements BaseUseCase<ListOrderResponse, any> {
  constructor(private repo: OrderRepository) {
  }
  execute(params: any) {
    return this.repo.list(params)
  }

}
