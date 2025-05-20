import { inject, Injectable } from '@angular/core';
import { DocSustentoPaymentRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento-payment.repository';

@Injectable({
  providedIn: 'root',
})
export class DocSustentoPaymentUseCase {
  private readonly _docSustentoPaymentRepository = inject(
    DocSustentoPaymentRepository,
  );

  getById(id: number) {
    return this._docSustentoPaymentRepository.getById(id);
  }
  create<T>(data: T) {
    return this._docSustentoPaymentRepository.create(data);
  }
  update<T>(id: number, data: T) {
    return this._docSustentoPaymentRepository.update(id, data);
  }
  delete(id: number) {
    return this._docSustentoPaymentRepository.delete(id);
  }
}
