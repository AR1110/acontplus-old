import { Provider } from '@angular/core';
import { LOOKUP_HTTP_TOKEN, RECEIVED_DOCUMENT_HTTP_TOKEN } from '@purchases/data/purchases-token';
import { ReceivedDocumentHttp } from '@purchases/data/https/received-document-http';
import { LookUpHttp } from './https/lookup-http';

export const purchasesProvider: Provider[] = [
  {
    provide: RECEIVED_DOCUMENT_HTTP_TOKEN,
    useClass: ReceivedDocumentHttp,
  },
  {
    provide: LOOKUP_HTTP_TOKEN,
    useClass: LookUpHttp,
  },
];
