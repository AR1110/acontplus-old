import { inject, Injectable } from '@angular/core';
import { FacturaFisicaRepository } from '@purchases/data/https/factura-fisica.repository';

@Injectable({
  providedIn: 'root',
})
export class FacturaFisicaService {
  private facturaFisicaRepository = inject(FacturaFisicaRepository);

  getDataFilter() {
    return this.facturaFisicaRepository.getDataFilter();
  }

  getAll<T>(obj: T) {
    const params = {
      tipo: 1,
      ...obj,
    };
    return this.facturaFisicaRepository.getAll(params);
  }

  getDetalleCompleto(id: number) {
    return this.facturaFisicaRepository.getDetalleCompleto(id);
  }

  getDataForm() {
    return this.facturaFisicaRepository.getDataForm();
  }
}
