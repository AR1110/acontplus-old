export interface PorcentajeRetencionIva {
  id: number;
  codigo: '7' | '8' | '9' | '10' | '1' | '11' | '2' | '3';
  descripcion: string;
  porcentaje: number;
  enabled?: boolean;
}
