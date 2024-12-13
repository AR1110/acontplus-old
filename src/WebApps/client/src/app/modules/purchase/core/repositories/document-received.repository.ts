import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { DocumentReceived } from '@purchase/core/domain/document-received.model';

export abstract class DocumentReceivedRepository {
  abstract getDataFilter<T>(): Observable<{
    establecimientos: any[];
    subcategories: any[];
    documentTypes: any[];
  }>;
  abstract get<T>(parameters: T): Observable<{
    documents: DocumentReceived[];
  }>;
  abstract getById<T>(id: number): Observable<ApiResponse>;
  abstract create<T>(data: T): Observable<ApiResponse>;
  abstract update<T>(id: number, data: T): Observable<ApiResponse>;
  abstract delete<T>(id: number): Observable<ApiResponse>;
  abstract uploadXml<T>(parameters: T, file: any): Observable<ApiResponse>;
}
