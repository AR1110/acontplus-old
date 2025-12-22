import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { Subcategory } from '@accounting/sub-category/domain/subcategory';
import { TipoDoc } from '@core/models/tipo-doc.model';
import {ReceivedDocumentList} from "@purchases/data/models/received-document";

export interface ReceivedDocumentRepository {
   getDataFilter(): Observable<{
    establecimientos: EstablecimientoSelectHtmlOnly[];
    subcategories: Subcategory[];
    documentTypes: TipoDoc[];
  }>;
   get<T>(parameters: T): Observable<{
    documents: ReceivedDocumentList[];
  }>;
   getById(id: number): Observable<unknown>;
   create<T>(data: T): Observable<ApiResponseLegacy>;
   update<T>(id: number, data: T): Observable<ApiResponseLegacy>;
   delete<T>(id: number): Observable<ApiResponseLegacy>;
   uploadXml<T>(parameters: T, file: any): Observable<ApiResponseLegacy>;
   previewXml(id: number): Observable<ApiResponseLegacy>;
}
