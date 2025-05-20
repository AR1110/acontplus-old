
import { inject, Injectable } from "@angular/core";
import { FacturaFisicaRepository } from "@purchase/domain/repositories/factura-fisica.repository";

@Injectable({
  providedIn: 'root'
})
export class FacturaFisicaService {
  private facturaFisicaRepository = inject(FacturaFisicaRepository)

  getDataFilter() {
    return this.facturaFisicaRepository.getDataFilter()
  }


  getAll<T>(obj: T) {
    let params =  {
      tipo: 1,
      ...obj
    }
    return this.facturaFisicaRepository.getAll(params)
  }




  getDetalleCompleto(id: number) {
    return this.facturaFisicaRepository.getDetalleCompleto(id)
  }


  getDataForm(){
    return this.facturaFisicaRepository.getDataForm()
  }

}
