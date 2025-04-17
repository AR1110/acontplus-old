import {Injectable} from "@angular/core";
import {ComprobanteEgresoRepository} from "@accounting/core/repositories/comprobante-egreso.repository";
import {BaseUseCase} from "@core/base-use-case";
import {
  ComprobanteEgresoDeleteParams,
} from "@accounting/core/models/comprobante-egreso.model";
import { Observable } from "rxjs";
import {ApiResponse} from "@core/models/api-response";


@Injectable({
  providedIn: 'root'
})

export class AnularComprobanteEgresoUseCase implements BaseUseCase<ApiResponse, ComprobanteEgresoDeleteParams> {
  constructor(private repo: ComprobanteEgresoRepository) {
  }

  execute(params: ComprobanteEgresoDeleteParams): Observable<ApiResponse> {
        return this.repo.anular(params)
    }
}
