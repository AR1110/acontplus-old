import { PaymentTypeCode } from '@accounting/shared/enums/accounting.constants';
import { SubEntidadFinanciera } from '@accounting/data/models/subentidad-financiera.interface';

export interface EntidadFinanciera {
  idEntidadFinanciera: number;
  descripcion: string;
  codigo: PaymentTypeCode;
}

export interface EntidadFinancieraPago extends EntidadFinanciera {
  subEntidadesFinanciera: SubEntidadFinanciera[];
}
