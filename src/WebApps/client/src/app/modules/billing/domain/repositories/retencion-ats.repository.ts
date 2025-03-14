import { Observable } from 'rxjs';
import {
  RetencionAts,
  RetencionAtsList,
} from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { GroupedEstab } from '@core/models/estab.model';
import { TipoIdentificacion } from '@core/models/tipo-identificacion';
import { RetAtsDocSustento } from '@billing/domain/models/retencion-ats/ret-ats-doc-sustento';
import { DocumentoSustento } from '@sri/domain/models/documento-sustento';
import { SustentoTributario } from '@sri/domain/models/sustento-tributario';
import { TipoPago } from '@sri/domain/models/tipo-pago';
import { TipoRegimenFe } from '@sri/domain/models/tipo-regimen-fe';
import { Pais } from '@sri/domain/models/pais';
import { ParaisoFiscal } from '@sri/domain/models/paraiso-fiscal';
import { Impuesto } from '@sri/domain/models/impuesto';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { ImpuestoRetencion } from '@sri/domain/models/impuesto-retencion';
import { PorcentajeRetIva } from '@sri/domain/models/porcentaje-ret-iva';
import { FormaPago } from '@sri/domain/models/forma-pago';
import { CodigoRetencion } from '@sri/domain/models/codigo-retencion';
import { SujetoRetenido } from '@sri/domain/models/sujeto-retenido';

export abstract class RetencionAtsRepository {
  abstract getDataForm(parameters: unknown): Observable<{
    codigosRetencion: CodigoRetencion[];
    countries: Pais[];
    documentoSustento: DocumentoSustento[];
    estabs: GroupedEstab[];
    formasPago: FormaPago[];
    impuestosRetencion: ImpuestoRetencion[];
    infoAdicional?: unknown[];
    paraisosFiscales: ParaisoFiscal[];
    porcentajesRetIva: PorcentajeRetIva[];
    sujetoRetenido: SujetoRetenido[];
    sustentoTributario: SustentoTributario[];
    tarifaImpuestos: TarifaImpuesto[];
    taxes: Impuesto[];
    tiposIdentificacion: TipoIdentificacion[];
    tiposPago: TipoPago[];
    tiposRegimen: TipoRegimenFe[];
  }>;
  abstract getAll<T>(parameters: T): Observable<{
    retenciones: RetencionAtsList[];
  }>;
  abstract getById(id: number): Observable<RetencionAts>;
  abstract create(data: RetencionAts): Observable<RetencionAts>;
  abstract update(data: RetencionAts): Observable<RetencionAts>;
  abstract delete(id: number): Observable<RetencionAts>;
  abstract getDocs(parameters: unknown): Observable<{
    documents: RetAtsDocSustento[];
  }>;
}
