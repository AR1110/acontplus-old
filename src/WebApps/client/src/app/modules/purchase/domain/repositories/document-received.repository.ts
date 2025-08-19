import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { DocumentReceived } from '@purchase/domain/document-received.model';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { Subcategory } from '@accounting/sub-category/domain/subcategory';
import { TipoDoc } from '@core/models/tipo-doc.model';

export abstract class DocumentReceivedRepository {
  abstract getDataFilter(): Observable<{
    establecimientos: EstablecimientoSelectHtmlOnly[];
    subcategories: Subcategory[];
    documentTypes: TipoDoc[];
  }>;
  abstract get<T>(parameters: T): Observable<{
    documents: DocumentReceived[];
  }>;
  abstract getById(id: number): Observable<unknown>;
  abstract create<T>(data: T): Observable<ApiResponse>;
  abstract update<T>(id: number, data: T): Observable<ApiResponse>;
  abstract delete<T>(id: number): Observable<ApiResponse>;
  abstract uploadXml<T>(parameters: T, file: any): Observable<ApiResponse>;
  abstract previewXml(id: number): Observable<ApiResponse>;
}
