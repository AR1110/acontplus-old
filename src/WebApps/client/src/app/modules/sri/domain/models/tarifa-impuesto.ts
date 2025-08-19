import { Impuesto } from '@sri/domain/models/impuesto';

export interface TarifaImpuesto
  extends Pick<Impuesto, 'descripcion' | 'estado'> {
  idTarifaImpuesto: number;
  idImpuesto: number;
  codigoPorcentaje: string;
  tarifa: number;
}
