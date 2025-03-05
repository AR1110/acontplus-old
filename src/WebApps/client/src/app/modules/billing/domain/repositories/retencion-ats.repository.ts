import { Observable } from 'rxjs';
import {
  RetencionAts,
  RetencionAtsList,
} from '@billing/domain/models/retencion-ats.model';
import { GroupedEstab } from '@core/models/estab.model';
import { TipoIdentificacion } from '@core/models/tipo-identificacion';

export abstract class RetencionAtsRepository {
  abstract getDataForm(parameters: unknown): Observable<{
    tiposIdentificacion: TipoIdentificacion[];
    sujetoRetenido: unknown[];
    documentoSustento: unknown[];
    sustentoTributario: unknown[];
    tiposPago: unknown[];
    tiposRegimen: unknown[];
    countries: unknown[];
    paraisosFiscales: unknown[];
    taxes: unknown[];
    tarifasImpuesto: unknown[];
    impuestosRetencion: unknown[];
    porcentajesRetIva: unknown[];
    codigosRetencion: unknown[];
    formasPago: unknown[];
    estabs: GroupedEstab[];
    infoAdicional?: unknown[];
  }>;
  abstract getAll<T>(parameters: T): Observable<{
    retenciones: RetencionAtsList[];
  }>;
  abstract getById(id: number): Observable<RetencionAts>;
  abstract create(data: RetencionAts): Observable<RetencionAts>;
  abstract update(data: RetencionAts): Observable<RetencionAts>;
  abstract delete(id: number): Observable<RetencionAts>;
}
