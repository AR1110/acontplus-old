import { PaymentTypeCode } from '@accounting/shared/enums/accounting.constants';

type PaymentCode =
  | PaymentTypeCode.EFE
  | PaymentTypeCode.TRA
  | PaymentTypeCode.TAR
  | PaymentTypeCode.CHE
  | PaymentTypeCode.DOC;

//Start Api
export interface RawPaymentType {
  idEntidadFinanciera: number;
  descripcion: string;
  codigo: PaymentCode;
}

export interface RawPaymentSubType {
  idEntidadFinanciera: number;
  idSubEntidadFinanciera: number;
  descripcion: string;
  codigo: string;
  controlCaja: boolean;
}

//End Api

//Start Adapter Front End
export interface PaymentSubType {
  idEntidadFinanciera: number;
  idSubEntidadFinanciera: number;
  descripcion: string;
  codigo: string;
  controlCaja: boolean;
}

export interface PaymentType {
  idEntidadFinanciera: number;
  descripcion: string;
  codigo: PaymentCode;
  subEntidadesFinanciera: PaymentSubType[];
}
