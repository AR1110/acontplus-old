import { DocumentoSustento } from '@modules/sri/domain/models/documento-sustento';

export interface SustentoTributario extends DocumentoSustento {
  idSustentoTribut: number;
  codSustento: string;
  codigo: string;
}
