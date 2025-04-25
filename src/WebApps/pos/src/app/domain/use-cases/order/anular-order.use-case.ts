import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {OrderRepository} from "@domain/repositories/order.repository";
import {ApiResponse} from "acontplus-utils";

@Injectable({
  providedIn: 'root',
})
export class AnularOrderUseCase implements BaseUseCase<ApiResponse, number> {
  constructor(private repo: OrderRepository) {
  }
    execute(id: number) {
       return this.repo.setAnul(id)
    }

}
