import {Provider} from "@angular/core";
import {RECEIVED_DOCUMENT_HTTP_TOKEN} from "@purchases/data/purchases-token";
import {ReceivedDocumentHttp} from "@purchases/data/https/received-document-http";

export const purchasesProvider: Provider[] = [
  {
    provide: RECEIVED_DOCUMENT_HTTP_TOKEN,
    useClass: ReceivedDocumentHttp
  }
]
