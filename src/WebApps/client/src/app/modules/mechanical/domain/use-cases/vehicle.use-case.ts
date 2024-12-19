import {Injectable} from "@angular/core";
import {VehicleRepository} from "@mechanical/domain/repositories/vehicle.repository";

@Injectable({
  providedIn: 'root'
})

export class VehicleUseCase {
  constructor(private repo : VehicleRepository) {}

  getAll<T extends { pageIndex: number; pageSize: number }>(obj:T) {
    return this.repo.getAll(obj)
  }

  getDataForm(){
    return this.repo.getDataForm();
  }

  getId(id: number, loader?: boolean){
    return this.repo.getId(id, loader);
  }

  post<T>( data: T){
    return this.repo.post(data);
  }

  put<T>(id: number, data: T){
    return this.repo.put(id, data);
  }

  putState(id: number){
    return this.repo.putState(id);
  }
}
