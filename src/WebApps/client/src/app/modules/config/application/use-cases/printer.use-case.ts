import { inject, Injectable } from '@angular/core';
import { PrinterRepository } from '@modules/config/data/repositories/printer.repository';

@Injectable({
  providedIn: 'root',
})
export class PrinterUseCase {
  private readonly _printerRepository = inject(PrinterRepository);

  getPrinters() {
    return this._printerRepository.getPrinters();
  }

  getDataForm() {
    return this._printerRepository.getDataForm();
  }

  getLocalPrinters() {
    return this._printerRepository.getLocalPrinters();
  }

  getById(id: number) {
    return this._printerRepository.getById(id);
  }

  updateStatus<T>(id: number, printer: T) {
    return this._printerRepository.updateStatus(id, printer);
  }

  removePrinter(id: number) {
    return this._printerRepository.removePrinter(id);
  }

  create<T>(printer: T) {
    return this._printerRepository.create(printer);
  }
  update<T>(id: number, printer: T) {
    return this._printerRepository.update(id, printer);
  }
}
