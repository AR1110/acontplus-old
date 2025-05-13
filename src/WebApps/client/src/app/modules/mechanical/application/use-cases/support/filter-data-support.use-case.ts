import {BaseUseCase} from "@core/base-use-case";
import {Injectable} from "@angular/core";
import {SupportRepository} from "@mechanical/domain/repositories/support.repository";
import {Observable} from "rxjs";
import {FilterDataSupportResponse} from "@mechanical/domain/models/support.model";

@Injectable({
  providedIn: "root",
})
export class FilterDataSupportUseCase implements BaseUseCase<FilterDataSupportResponse, any>{
  constructor(private repo:SupportRepository) {
  }
  execute(): Observable<FilterDataSupportResponse> {
    return this.repo.getDataFilter()
  }
}
