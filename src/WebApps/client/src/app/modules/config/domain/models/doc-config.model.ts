import { groupEstabUtil } from '@core/utils/group-estab.util';
import { GroupedEstab } from '@core/models/estab.model';

export interface DocConfig {
  idPuntoEmision?: number;
  idConfiguracionDocumento: number;
  idTipoDocumento: number;
  estado: boolean;
  ultimaSecuencia: number;
  descripcion: string;
  infoAdicional: boolean;
}

export interface DocConfigList {
  index: number;
  idConfiguracionDocumento: number;
  idTipoDocumento: number;
  ultimaSecuencia: number;
  nomDoc: string;
  estado: boolean;
  hasInfoAdicional: boolean;
}

export class DocConfigListResponse {
  data: DocConfigList[] = [];
}

export interface DocConfigInfoAdicionalList {
  unique: string;
  nombre: string;
  valor: string;
}

export class DocConfigFormDataResponse {
  establecimientos: GroupedEstab[] = [];
  tiposDoc: any[] = [];
}
