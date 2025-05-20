import {Injectable} from "@angular/core";
import {ComprobanteEgresoRepository} from "@accounting/domain/repositories/comprobante-egreso.repository";
import {BaseUseCase} from "@core/base-use-case";
import {
  ComprobanteEgresoFilterResponse,
} from "@accounting/domain/models/comprobante-egreso.model";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class DataFilterComprobanteEgresoUseCase implements BaseUseCase<ComprobanteEgresoFilterResponse, any> {
  constructor(private repo: ComprobanteEgresoRepository) {
  }

  execute(): Observable<ComprobanteEgresoFilterResponse> {
        return this.repo.getFilterData()
    }
}
