import { PaymentTypeCode } from "@/enums/main.enum"

type PaymentCode =
    PaymentTypeCode.EFE |
    PaymentTypeCode.TRA |
    PaymentTypeCode.TAR |
    PaymentTypeCode.CHE |
    PaymentTypeCode.DOC



//Start Adapter Front End
export interface PaymentSubType {
  idEntidadFinanciera: number,
  idSubEntidadFinanciera: number,
  descripcion: string,
  codigo: string
  controlCaja: boolean
}

export interface PaymentType {
  idEntidadFinanciera: number,
  descripcion: string,
  codigo: PaymentCode
  subEntidadesFinanciera: Array<PaymentSubType>
}


