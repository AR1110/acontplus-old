import { PuntoEmision } from './punto-emision.model';
import { Bodega } from './bodega.model';

export interface Establecimiento {
  nombreComercial: string;
  actividad: string;
  estab: string;
  contribuyente: string;
  agenteRetencion: string;
  contribuyenteEspecial: string;
  obligadoContabilidad: string;
  canton: string;
  dirEstablecimiento: string;
  emails: string[];
  telephones: string[];
  ptosEmi: PuntoEmision[];
  bodegas: Bodega[];
}
