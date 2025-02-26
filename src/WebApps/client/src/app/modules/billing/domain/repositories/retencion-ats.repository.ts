import { Observable } from 'rxjs';
import {
  RetencionAts,
  RetencionAtsList,
} from '@billing/domain/models/retencion-ats.model';
import { GroupedEstab } from '@core/models/estab.model';
import { TipoIdentificacion } from '@core/models/tipo-identificacion';

export abstract class RetencionAtsRepository {
  abstract getDataForm(parameters: any): Observable<{
    tiposIdentificacion?: TipoIdentificacion[];
    sujetoRetenido?: any[];
    documentoSustento?: any[];
    sustentoTributario?: any[];
    tiposPago?: any[];
    tiposRegimen: any[];
    countries?: any[];
    paraisosFiscales?: any[];
    taxes?: any[];
    tarifasImpuesto?: any[];
    impuestosRetencion?: any[];
    porcentajesRetIva?: any[];
    codigosRetencion?: any[];
    formasPago?: any[];
    estabs?: GroupedEstab[];
    infoAdicional?: any[];
  }>;
  abstract getAll<T>(parameters: T): Observable<{
    retenciones: RetencionAtsList[];
  }>;
  abstract getById(id: number): Observable<RetencionAts>;
  abstract create(data: RetencionAts): Observable<RetencionAts>;
  abstract update(data: RetencionAts): Observable<RetencionAts>;
  abstract delete(id: number): Observable<RetencionAts>;
}
