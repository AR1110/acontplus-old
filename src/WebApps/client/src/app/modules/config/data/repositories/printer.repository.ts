import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Printer, PrinterRead } from '@modules/config/data/models/printer.model';

export interface PrinterRepository {
  getPrinters(): Observable<{
    printers: PrinterRead[];
  }>;
  getDataForm(): Observable<{
    estabs: any[];
    documents: any[];
    printerTypes: any[];
  }>;
  getLocalPrinters(): Observable<{
    localPrinters: any[];
  }>;
  getById(id: number): Observable<{
    documents: any[];
    printer: any;
  }>;
  updateStatus<T>(id: number, printer: T): Observable<ApiResponseLegacy>;
  removePrinter(id: number): Observable<ApiResponseLegacy>;
  create<T>(printer: T): Observable<ApiResponseLegacy>;
  update<T>(id: number, printer: T): Observable<ApiResponseLegacy>;
}
