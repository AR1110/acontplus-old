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

  delete(id: number) {
    return this._docSustentoRepository.delete(id);
  }
}
