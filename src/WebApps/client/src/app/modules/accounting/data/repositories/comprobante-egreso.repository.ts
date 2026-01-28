import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  ComprobanteEgresoDeleteParams,
  ComprobanteEgresoDeleteResponse,
  ComprobanteEgresoFilterResponse,
  ComprobanteEgresoResponse,
} from '@accounting/data/models/comprobante-egreso.entity';
import { EntidadFinanciera } from '@accounting/shared/models/entidad-financiera.interface';
import { SubEntidadFinancieraSelectHtmlOnly } from '@accounting/data/models/subentidad-financiera.interface';
import { BancoSelectOnly } from '@accounting/shared/models/banco.interface';
import { EstadoPago } from '@accounting/data/models/estado-pago.interface';
import { ProvinciaCiudad } from '@shared/models/ciudad.interface';
import { ParamsGuardar } from '@accounting/data/mappers/comprobante-egreso.mapper';

/**
 * Interfaz para los datos del formulario de pago
 */
export interface ComprobanteEgresoFormaPagoData {
  entidadesFinanciera: EntidadFinanciera[];
  subEntidadesFinanciera: SubEntidadFinancieraSelectHtmlOnly[];
  bancos: BancoSelectOnly[];
  estadosPago: EstadoPago[];
  provinciaCiudades: ProvinciaCiudad[];
  documentos: unknown[];
}

/**
 * Interfaz para las cuotas por cuenta por pagar
 */
export interface ComprobanteEgresoCuotasData {
  cuotas: unknown[];
}

/**
 * Parámetros para listar comprobantes de egreso
 */
export interface ComprobanteEgresoListParams {
  pageIndex?: number;
  pageSize?: number;
  codEstab?: string;
  checkBoxFecha?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  byEstado?: number | null;
  byPersona?: number | null;
  byUsuario?: number | null;
  nroSecuencial?: string | null;
}

/**
 * Repositorio para la gestión de Comprobantes de Egreso
 */
export interface ComprobanteEgresoRepository {
  /**
   * Obtiene la lista de comprobantes según los parámetros especificados
   * @param params Parámetros de filtrado y paginación
   */
  list(params: ComprobanteEgresoListParams): Observable<ComprobanteEgresoResponse>;

  /**
   * Obtiene los datos para los filtros del listado
   */
  getFilterData(): Observable<ComprobanteEgresoFilterResponse>;

  /**
   * Obtiene los datos necesarios para la eliminación de un comprobante
   * @param id Identificador del comprobante
   */
  getDataForDeletion(id: number): Observable<ComprobanteEgresoDeleteResponse>;

  /**
   * Obtiene las cuotas asociadas a una cuenta por pagar
   * @param idCuentaPorPagar Identificador de la cuenta por pagar
   */
  getCuotasByCuentaPorPagarId(idCuentaPorPagar: number): Observable<ComprobanteEgresoCuotasData>;

  /**
   * Obtiene datos para el formulario de pago de un proveedor
   * @param idProveedor Identificador del proveedor
   */
  getFormaPagoData(idProveedor: number): Observable<ComprobanteEgresoFormaPagoData>;

  /**
   * Crea un nuevo comprobante de egreso
   * @param comprobante Datos del comprobante a crear
   */
  create(comprobante: ParamsGuardar): Observable<ApiResponseLegacy>;

  /**
   * Anula un comprobante de egreso
   * @param comprobante Datos del comprobante a anular
   */
  anular(comprobante: ComprobanteEgresoDeleteParams): Observable<ApiResponseLegacy>;
}
