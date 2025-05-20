import { inject, Injectable } from '@angular/core';
import { DocSustentoRetencionRepository } from '@billing/domain/repositories/retencion-ats/doc-sustento-retencion.repository';

@Injectable({
  providedIn: 'root',
})
export class DocSustentoRetencionUseCase {
  private readonly _docSustentoRetencionRepository = inject(
    DocSustentoRetencionRepository,
  );

  getById(id: number) {
    return this._docSustentoRetencionRepository.getById(id);
  }
  create<T>(data: T) {
    return this._docSustentoRetencionRepository.create(data);
  }
  update<T>(id: number, data: T) {
    return this._docSustentoRetencionRepository.update(id, data);
  }
  delete(id: number) {
    return this._docSustentoRetencionRepository.delete(id);
  }
}
