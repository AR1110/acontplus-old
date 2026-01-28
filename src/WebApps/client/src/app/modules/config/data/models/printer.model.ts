export interface Printer {
  id: number;
  estab: string;
  printerTypeName: string;
  name: string;
  default: boolean;
  machine: string;
  server: string;
  ipAddress: string;
  isActive: boolean;
}

export interface PrinterRead extends Printer {
  isDefault: boolean;
  totalRecords: 0;
  labelEnabled: string;
}

interface PrinterType {
  id: number;
  name: string;
  code: string;
  formato: string;
  deviceInfo: string;
  thermal: boolean;
  isActive: boolean;
}

export interface PrinterTypeSelectHtmlOnly extends PrinterType {}
