import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {GetStatsOrderResponse} from "@domain/models/order.model";
import {OrderRepository} from "@domain/repositories/order.repository";

@Injectable({
  providedIn: 'root',
})
export class GetStatsOrderUseCase implements BaseUseCase<GetStatsOrderResponse, any> {
  constructor(private repo: OrderRepository) {
  }
    execute(params:any) {
       return this.repo.getStats(params)
    }

}
