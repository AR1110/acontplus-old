export interface ImpuestoRetencion {
  id: number;
  codigo: '1' | '2' | '6';
  descripcion: string;
  enabled?: boolean;
}
