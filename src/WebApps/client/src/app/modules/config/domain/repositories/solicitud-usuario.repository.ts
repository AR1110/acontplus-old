import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import {
  Printer,
  PrinterRead,
} from '@modules/config/domain/models/printing/printer.model';

export abstract class SolicitudUsuarioRepository {

  abstract getFilter():Observable<any>
  abstract getAll<T>(obj: T):Observable<{
    data: any[]
  }>
  abstract put<T>(obj:T):Observable<ApiResponse>;
}
