export interface Item {
  categoria: string;
  descripcion: string;
  totalRecords: number;
  summary?: string;
  cooking?: boolean;
  recipe?: string;
  s3ObjectUrl?: string;
}
