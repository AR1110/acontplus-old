export interface FormaPago {
  id: number;
  codigo: '01' | '15' | '16' | '17' | '18' | '19' | '20' | '21';
  descripcion: string;
  enabled?: boolean;
}
