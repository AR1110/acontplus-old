import {Injectable} from "@angular/core";
import {ComprobanteEgresoRepository} from "@accounting/core/repositories/comprobante-egreso.repository";
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from "rxjs";
import {ComprobanteEgresoDeleteResponse} from "@accounting/core/models/comprobante-egreso.model";


@Injectable({
  providedIn: 'root'
})

export class GetComprobanteEgresoForDeletionUseCase implements BaseUseCase<ComprobanteEgresoDeleteResponse, number> {
  constructor(private repo: ComprobanteEgresoRepository) {
  }

  execute(params: number): Observable<ComprobanteEgresoDeleteResponse> {
       return this.repo.getDataForDeletion(params)
    }


}
