
import {PaymentTypeCode} from "@accounting/core/enums/accounting.constants";
import {SubEntidadFinanciera} from "@accounting/core/models/subentidad-financiera.interface";

export interface EntidadFinanciera {
  idEntidadFinanciera: number,
  descripcion: string,
  codigo:  PaymentTypeCode

}

export interface EntidadFinancieraPago extends EntidadFinanciera {
  subEntidadesFinanciera: Array<SubEntidadFinanciera>
}
