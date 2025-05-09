import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {CuentaPorPagarRepository} from "@accounting/domain/repositories/cuenta-por-pagar.repository";
import {Observable} from "rxjs";
import {FilterDataCuentaPorPagarResponse} from "@accounting/domain/models/cuenta-por-pagar.model";


@Injectable({
  providedIn: 'root'
})
export class GetFilterDataCuentaPorPagarUseCase implements BaseUseCase<FilterDataCuentaPorPagarResponse, any>{
  constructor(private repo: CuentaPorPagarRepository) {
  }
  execute(): Observable<FilterDataCuentaPorPagarResponse> {
    return this.repo.getDataFilter()
  }
}
