import { InjectionToken } from '@angular/core';
import { ElectronicSignatureRepository } from '@modules/config/data/repositories/electronic-signature.repository';
import { SolicitudAutorizacionRepository } from '@modules/config/data/repositories/solicitud-autorizacion.repository';
import { PrinterRepository } from '@modules/config/data/repositories/printer.repository';

export const ELECTRONIC_SIGNATURE_HTTP_TOKEN = new InjectionToken<ElectronicSignatureRepository>(
  'ELECTRONIC_SIGNATURE_HTTP_TOKEN',
);

export const SOLICITUD_AUTORIZACION_HTTP_TOKEN =
  new InjectionToken<SolicitudAutorizacionRepository>('SOLICITUD_AUTORIZACION_HTTP_TOKEN');

export const PRINTER_HTTP_TOKEN = new InjectionToken<PrinterRepository>('PRINTER_HTTP_TOKEN');
