import { Injectable } from "@angular/core";
import {
  ComprobanteIngresoRepository
} from "../../core/repositories/comprobante-ingreso.repository";

@Injectable({
  providedIn: 'root'
})

export class GetComprobanteIngresoUsecase {
  constructor(private repo: ComprobanteIngresoRepository) {}

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }
}
