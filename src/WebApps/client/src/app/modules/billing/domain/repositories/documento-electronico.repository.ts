import { Observable } from 'rxjs';
import { DocumentoElectronico } from '@billing/domain/models/documento-electronico.model';
import { GroupedEstab } from '@core/models/estab.model';
import { ApiResponse } from '@core/models/api-response';

export abstract class DocumentoElectronicoRepository {
  abstract authorize(id: number): Observable<ApiResponse>;
  abstract getDataFilter(parameters: unknown): Observable<{
    tiposDoc: any[];
    estabs: GroupedEstab[];
    estadosDoc: any[];
  }>;
  abstract getAll<T>(parameters: T): Observable<{
    documentosElectronicos: DocumentoElectronico[];
  }>;
  abstract cancel(id: number): Observable<ApiResponse>;
  abstract downloadXml(id: number): Observable<Blob>;
}
