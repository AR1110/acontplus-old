import { inject, Injectable } from '@angular/core';
import { DocSustentoRepository } from '@billing/domain/repositories/doc-sustento.repository';

@Injectable({
  providedIn: 'root',
})
export class DocSustentoUseCase {
  private readonly _docSustentoRepository = inject(DocSustentoRepository);

  getTaxes(parameters: unknown) {
    return this._docSustentoRepository.getTaxes(parameters);
  }

  create<T>(data: T) {
    return this._docSustentoRepository.create(data);
  }

  update<T>(id: number, data: T) {
    return this._docSustentoRepository.update(id, data);
  }

  delete(id: number) {
    return this._docSustentoRepository.delete(id);
  }
}
