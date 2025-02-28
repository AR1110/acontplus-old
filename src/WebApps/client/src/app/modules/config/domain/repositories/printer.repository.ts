import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import {
  Printer,
  PrinterRead,
} from '@modules/config/domain/models/printing/printer.model';

export abstract class PrinterRepository {
  abstract getPrinters(): Observable<{
    printers: PrinterRead[];
  }>;
  abstract getDataForm(): Observable<{
    estabs: any[];
    documents: any[];
    printerTypes: any[];
  }>;
  abstract getLocalPrinters(): Observable<{
    localPrinters: any[];
  }>;
  abstract getById(id: number): Observable<{
    documents: any[];
    printer: any;
  }>;
  abstract updateStatus<T>(id: number, printer: T): Observable<ApiResponse>;
  abstract removePrinter(id: number): Observable<ApiResponse>;
  abstract create<T>(printer: T): Observable<ApiResponse>;
  abstract update<T>(id: number, printer: T): Observable<ApiResponse>;
}
