import {Injectable} from "@angular/core";
import {ComprobanteEgresoRepository} from "@accounting/domain/repositories/comprobante-egreso.repository";
import {BaseUseCase} from "@core/base-use-case";
import {ComprobanteEgresoResponse} from "@accounting/domain/models/comprobante-egreso.model";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class ListComprobanteEgresoUseCase implements BaseUseCase<ComprobanteEgresoResponse, any> {
  constructor(private repo: ComprobanteEgresoRepository) {
  }

  execute(params: any): Observable<ComprobanteEgresoResponse> {
        return this.repo.list(params)
    }
}
