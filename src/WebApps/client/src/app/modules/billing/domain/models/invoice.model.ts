import { FieldDefinitionDetailSale } from '@shared/models/field-definition-detail-sale.model';

export class InvoiceDetail extends FieldDefinitionDetailSale {
  id = 0;
  codePercentage?: string;
  enabled = true;
  deleted?: boolean;
  idTipoIva?: number;
  ice?: number;
  precioSinSubsidio = 0;
}
