import {InspectionRepository} from "@mechanical/domain/repositories/inspection.repository";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class InspectionUseCase {
  constructor( private repo : InspectionRepository ) {}

  getAll<T extends { pageIndex: number; pageSize: number }>(obj:T) {
    return this.repo.getAll(obj)
  }

  getDataForm(supportId: number){
    return this.repo.getDataForm(supportId);
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

  remove(id: number){
    return this.repo.remove(id);
  }

}
