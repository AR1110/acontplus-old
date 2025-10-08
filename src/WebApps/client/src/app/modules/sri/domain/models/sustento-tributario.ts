import { TipoComprobante } from '@sri/domain/models/tipo-comprobante';

export interface SustentoTributario extends Pick<TipoComprobante, 'id' | 'codigo' | 'descripcion'> {
  tipoComprobanteId: number;
  documentoSustentoTributarioId: number;
}
