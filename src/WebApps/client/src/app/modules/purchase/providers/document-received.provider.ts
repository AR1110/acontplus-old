import { ClassProvider } from '@angular/core';
import { DocumentReceivedRepository } from '@purchase/domain/repositories/document-received.repository';
import { DocumentReceivedWebRepository } from '@purchase/data/document-received/document-received-web.repository';

export const documentReceivedProvider: ClassProvider = {
  provide: DocumentReceivedRepository,
  useClass: DocumentReceivedWebRepository,
};
