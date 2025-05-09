
import {PaymentTypeCode} from "@accounting/domain/enums/accounting.constants";
import {SubEntidadFinanciera} from "@accounting/domain/models/subentidad-financiera.interface";

export interface EntidadFinanciera {
  idEntidadFinanciera: number,
  descripcion: string,
  codigo:  PaymentTypeCode

}

export interface EntidadFinancieraPago extends EntidadFinanciera {
  subEntidadesFinanciera: Array<SubEntidadFinanciera>
}
