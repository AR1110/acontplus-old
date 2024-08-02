import { FieldDefinitionDetailSale } from "@shared/models/field-definition-detail-sale.model";

export class SupportMaintenanceDetail extends FieldDefinitionDetailSale {
  id = 0
  codePercentage?: string
  enabled: boolean = true
  deleted?: boolean
}

export type ColSupportMaintenanceDetail = keyof SupportMaintenanceDetail;
