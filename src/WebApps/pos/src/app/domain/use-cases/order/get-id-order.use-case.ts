import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {GetIdOrderResponse} from "@domain/models/order.model";
import {OrderRepository} from "@domain/repositories/order.repository";

@Injectable({
  providedIn: 'root',
})
export class GetIdOrderUseCase implements BaseUseCase<GetIdOrderResponse, number> {
  constructor(private repo: OrderRepository) {
  }
    execute(id: number) {
       return this.repo.getId(id)
    }

}
