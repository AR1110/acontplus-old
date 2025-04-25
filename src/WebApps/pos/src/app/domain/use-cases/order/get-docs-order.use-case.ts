import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {OrderRepository} from "@domain/repositories/order.repository";

@Injectable({
  providedIn: 'root',
})
export class GetDocsOrderUseCase implements BaseUseCase<any, number> {
  constructor(private repo: OrderRepository) {
  }
    execute(id: number) {
       return this.repo.getOrderDocs(id)
    }

}
