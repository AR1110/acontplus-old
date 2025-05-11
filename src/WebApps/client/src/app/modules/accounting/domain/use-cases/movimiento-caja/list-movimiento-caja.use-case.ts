import {Injectable} from "@angular/core";
import {BaseUseCase} from "@core/base-use-case";
import {ListMovimientoCajaResponse} from "@accounting/domain/models/movimiento-caja.model";
import {MovimientoCajaRepository} from "@accounting/domain/repositories/movimiento-caja.repository";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ListMovimientoCajaUseCase implements BaseUseCase<ListMovimientoCajaResponse, any>{
  constructor(private repo: MovimientoCajaRepository) {
  }
  execute(params: any): Observable<ListMovimientoCajaResponse> {
    return this.repo.getAll(params)
  }
}
