import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {WarehouseRepository} from "@inventory/domain/repositories/warehouse.repository";
import {ListWarehouseResponse} from "@inventory/domain/models/warehouse.model";

@Injectable({
  providedIn: 'root'
})
export class ListWarehouseUseCase implements BaseUseCase<ListWarehouseResponse, any>{
  constructor(private repo:WarehouseRepository) {
  }
  execute(params: any)  {
    return this.repo.list(params)
  }
}
