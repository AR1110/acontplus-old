import { Observable } from 'rxjs';
import {
  RetencionAts,
  RetencionAtsList,
} from '@billing/domain/models/retencion-ats/retencion-ats.model';
import { TipoIdentificacion } from '@core/models/tipo-identificacion';
import { RetAtsDocSustento } from '@billing/domain/models/retencion-ats/ret-ats-doc-sustento.model';
import { TipoComprobante } from '@sri/domain/models/tipo-comprobante';
import { SustentoTributario } from '@sri/domain/models/sustento-tributario';
import { TipoPago } from '@sri/domain/models/tipo-pago';
import { TipoRegimenFiscalExterior } from '@sri/domain/models/tipo-regimen-fiscal-exterior';
import { Pais } from '@sri/domain/models/pais';
import { ParaisoFiscal } from '@sri/domain/models/paraiso-fiscal';
import { Impuesto } from '@sri/domain/models/impuesto';
import { TarifaImpuesto } from '@sri/domain/models/tarifa-impuesto';
import { ImpuestoRetencion } from '@sri/domain/models/impuesto-retencion';
import { PorcentajeRetencionIva } from '@sri/domain/models/porcentaje-retencion-iva';
import { FormaPago } from '@sri/domain/models/forma-pago';
import { ConceptoRetencionAir } from '@sri/domain/models/concepto-retencion-air';
import { TipoIdentificacionProveedor } from '@sri/domain/models/tipo-identificacion-proveedor';
import { PuntoEmisionEstablecimiento } from '@core/models/punto-emision.model';
import { ApiResponse } from '@core/models/api-response';

export abstract class RetencionAtsRepository {
  abstract getDataForm(parameters: unknown): Observable<{
    conceptosRetencionAir: ConceptoRetencionAir[];
    countries: Pais[];
    tiposComprobante: TipoComprobante[];
    estabs: PuntoEmisionEstablecimiento[];
    formasPago: FormaPago[];
    impuestosRetencion: ImpuestoRetencion[];
    infoAdicional?: unknown[];
    paraisosFiscales: ParaisoFiscal[];
    porcentajesRetIva: PorcentajeRetencionIva[];
    tiposIdentificacionProveedor: TipoIdentificacionProveedor[];
    sustentosTributarios: SustentoTributario[];
    tarifaImpuestos: TarifaImpuesto[];
    taxes: Impuesto[];
    tiposIdentificacion: TipoIdentificacion[];
    tiposPago: TipoPago[];
    tiposRegimen: TipoRegimenFiscalExterior[];
  }>;
  abstract getAll<T>(parameters: T): Observable<{
    retenciones: RetencionAtsList[];
  }>;
  abstract getById(id: number): Observable<RetencionAts>;
  abstract create<T>(data: T): Observable<ApiResponse>;
  abstract update(data: RetencionAts): Observable<RetencionAts>;
  abstract delete(id: number): Observable<RetencionAts>;
  abstract getDocs(parameters: unknown): Observable<{
    documents: RetAtsDocSustento[];
  }>;
  abstract downloadXml(id: number): Observable<Blob>;
}
