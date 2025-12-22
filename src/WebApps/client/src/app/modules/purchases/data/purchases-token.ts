import {InjectionToken} from "@angular/core";
import {ReceivedDocumentRepository} from "@purchases/data/repositories/received-document";

export const RECEIVED_DOCUMENT_HTTP_TOKEN = new InjectionToken<ReceivedDocumentRepository>("RECEIVED_DOCUMENT_HTTP_TOKEN");
