import { DocumentReceivedRepository } from '@purchase/core/repositories/document-received.repository';
import { inject, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class DocumentReceivedUseCase {
  private readonly _documentReceivedRepository = inject(
    DocumentReceivedRepository,
  );

  getDataFilter() {
    return this._documentReceivedRepository.getDataFilter();
  }

  get<T>(parameters: T) {
    return this._documentReceivedRepository.get<T>(parameters);
  }

  getById(id: number) {
    return this._documentReceivedRepository.getById(id);
  }

  create<T>(data: T) {
    return this._documentReceivedRepository.create<T>(data);
  }
  update<T>(id: number, data: T) {
    return this._documentReceivedRepository.update<T>(id, data);
  }
  delete<T>(id: number) {
    return this._documentReceivedRepository.delete<T>(id);
  }

  uploadXml<T>(parameters: T, file: any) {
    return this._documentReceivedRepository.uploadXml(parameters, file);
  }
}
