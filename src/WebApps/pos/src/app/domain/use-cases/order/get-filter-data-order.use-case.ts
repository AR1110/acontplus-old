import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {GetFilterDataOrderResponse} from "@domain/models/order.model";
import {OrderRepository} from "@domain/repositories/order.repository";

@Injectable({
  providedIn: 'root',
})
export class GetFilterDataOrderUseCase implements BaseUseCase<GetFilterDataOrderResponse, any> {
  constructor(private repo: OrderRepository) {
  }
    execute() {
       return this.repo.getDataFilter()
    }

}
