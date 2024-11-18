
import {PaymentTypeCode} from "@accounting/enums/accounting.constants";
import {SubentidadFinanciera} from "@accounting/interfaces/subentidad-financiera.interface";

export interface EntidadFinanciera {
  idEntidadFinanciera: number,
  descripcion: string,
  codigo: keyof typeof PaymentTypeCode

}

export interface EntidadFinancieraPago extends EntidadFinanciera {
  subEntidadesFinanciera: Array<SubentidadFinanciera>
}
