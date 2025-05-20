import { FieldDefinitionDetailSale } from "@shared/models/field-definition-detail-sale.model"

export class SupportDetail extends FieldDefinitionDetailSale {
  id = 0
  idImpuesto = 0; // se utiliza cuando transforman a NE O FV
  idTipoIva: number = 0
  codePercentage?: string
  enabled: boolean = true
  deleted?: boolean
  precioSinSubsidio = 0;
}


export class FilterDataSupportResponse {
  supportStatus: any[]=[]
}
