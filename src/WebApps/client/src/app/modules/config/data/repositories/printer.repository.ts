import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Printer, PrinterRead } from '@modules/config/data/models/printer.model';

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
  abstract updateStatus<T>(id: number, printer: T): Observable<ApiResponseLegacy>;
  abstract removePrinter(id: number): Observable<ApiResponseLegacy>;
  abstract create<T>(printer: T): Observable<ApiResponseLegacy>;
  abstract update<T>(id: number, printer: T): Observable<ApiResponseLegacy>;
}
