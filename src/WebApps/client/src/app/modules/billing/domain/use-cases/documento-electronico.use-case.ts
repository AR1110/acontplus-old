import { inject, Injectable } from '@angular/core';
import { DocumentoElectronicoRepository } from '@billing/domain/repositories/documento-electronico.repository';

@Injectable({
  providedIn: 'root',
})
export class DocumentoElectronicoUseCase {
  private readonly _documentoElectronicoRepository = inject(
    DocumentoElectronicoRepository,
  );

  getDataFilter(parameters: unknown) {
    return this._documentoElectronicoRepository.getDataFilter(parameters);
  }

  getAll<T>(obj: T) {
    return this._documentoElectronicoRepository.getAll(obj);
  }

  cancel(id: number) {
    return this._documentoElectronicoRepository.cancel(id);
  }
  downloadXml(id: number) {
    return this._documentoElectronicoRepository.downloadXml(id);
  }
}
