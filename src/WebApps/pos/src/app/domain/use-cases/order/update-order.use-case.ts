import {Injectable} from "@angular/core";
import {OrderRepository} from "@domain/repositories/order.repository";

@Injectable({
  providedIn: 'root',
})
export class UpdateOrderUseCase  {
  constructor(private repo: OrderRepository) {
  }
    execute(id:number, params:any) {
       return this.repo.put( id, params)
    }

}
