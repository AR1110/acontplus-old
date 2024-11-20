
import {PaymentTypeCode} from "@accounting/enums/accounting.constants";
import {SubEntidadFinanciera} from "@accounting/interfaces/subentidad-financiera.interface";

export interface EntidadFinanciera {
  idEntidadFinanciera: number,
  descripcion: string,
  codigo:  PaymentTypeCode

}

export interface EntidadFinancieraPago extends EntidadFinanciera {
  subEntidadesFinanciera: Array<SubEntidadFinanciera>
}
