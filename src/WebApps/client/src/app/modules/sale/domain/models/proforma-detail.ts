import { DocumentDetail, DocumentDetailModel } from '@shared/models/document-detail';

export class ProformaDetail extends DocumentDetail {
  constructor(data?: Partial<DocumentDetailModel>) {
    super(data);
  }
}
