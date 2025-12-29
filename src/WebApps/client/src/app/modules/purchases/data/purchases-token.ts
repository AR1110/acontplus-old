import { InjectionToken } from '@angular/core';
import { ReceivedDocumentRepository } from '@purchases/data/repositories/received-document';
import { LookUpRepository } from './repositories/lookup-repositoriy';

export const RECEIVED_DOCUMENT_HTTP_TOKEN = new InjectionToken<ReceivedDocumentRepository>(
  'RECEIVED_DOCUMENT_HTTP_TOKEN',
);

export const LOOKUP_HTTP_TOKEN = new InjectionToken<LookUpRepository>('LOOKUP_HTTP_TOKEN');
