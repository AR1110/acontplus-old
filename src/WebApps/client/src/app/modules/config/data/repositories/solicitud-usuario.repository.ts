import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Printer, PrinterRead } from '@modules/config/data/models/printer.model';

export abstract class SolicitudUsuarioRepository {
  abstract getFilter(): Observable<any>;
  abstract getAll<T>(obj: T): Observable<{
    data: any[];
  }>;
  abstract put<T>(obj: T): Observable<ApiResponseLegacy>;
}
