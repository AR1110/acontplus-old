export interface Promotion {
  readonly id?: number;
  codEstab: string;
  description: string;
  startDate: string;
  endDate: string;
  promotionDays: string;
  s3ObjectKey?: string;
  s3ObjectUrl?: string;
}
