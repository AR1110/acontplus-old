export interface Item {
  id: number;
  categoria: string;
  descripcion: string;
  totalRecords: number;
  summary?: string;
  cooking?: boolean;
  recipe?: string;
  instructions: string;
  s3ObjectUrl?: string;
}
