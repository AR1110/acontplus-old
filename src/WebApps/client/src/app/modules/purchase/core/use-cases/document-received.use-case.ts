import { DocumentReceivedRepository } from '@purchase/core/repositories/document-received.repository';
import { inject } from '@angular/core';

export class DocumentReceivedUseCase {
  private readonly _documentReceivedRepository = inject(
    DocumentReceivedRepository,
  );

  getDataFilter<T>() {
    return this._documentReceivedRepository.getDataFilter<T>();
  }

  get<T>(parameters: T) {
    return this._documentReceivedRepository.get<T>(parameters);
  }

  getById<T>(id: number) {
    return this._documentReceivedRepository.getById<T>(id);
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
