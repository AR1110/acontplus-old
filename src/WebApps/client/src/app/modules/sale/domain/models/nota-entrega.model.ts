import { FieldDefinitionDetailSale } from "@shared/models/field-definition-detail-sale.model"

export class NotaEntregaDetail extends FieldDefinitionDetailSale {
  id = 0
  codePercentage?: string
  enabled = true
  deleted?: boolean
  idTipoIva?: number;
  ice?: number
}
