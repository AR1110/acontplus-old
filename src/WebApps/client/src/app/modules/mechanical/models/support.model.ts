import { FieldDefinitionDetailSale } from "@shared/models/field-definition-detail-sale.model"

export class SupportDetail extends FieldDefinitionDetailSale {
  id = 0
  idTipoIva:number=0
  codePercentage?: string
  enabled: boolean = true
  deleted?: boolean
  precioSinSubsidio = 0;
}
