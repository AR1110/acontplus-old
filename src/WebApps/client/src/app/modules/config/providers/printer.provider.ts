import { ClassProvider } from '@angular/core';
import { PrinterWebRepository } from '@modules/config/data/printer/printer-web.repository';
import { PrinterRepository } from '@modules/config/domain/repositories/printer.repository';

export const printerProvider: ClassProvider = {
  provide: PrinterRepository,
  useClass: PrinterWebRepository,
};
