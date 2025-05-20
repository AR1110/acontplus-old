import { inject, Injectable } from '@angular/core';
import { DocSustentoTaxRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento-tax.repository';

@Injectable({
  providedIn: 'root',
})
export class DocSustentoTaxUseCase {
  private readonly _docSustentoTaxRepository = inject(DocSustentoTaxRepository);

  getById(id: number) {
    return this._docSustentoTaxRepository.getById(id);
  }
  create<T>(data: T) {
    return this._docSustentoTaxRepository.create(data);
  }
  update<T>(id: number, data: T) {
    return this._docSustentoTaxRepository.update(id, data);
  }
  delete(id: number) {
    return this._docSustentoTaxRepository.delete(id);
  }
}
