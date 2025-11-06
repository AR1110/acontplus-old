import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  ComprobanteEgresoDeleteParams,
  ComprobanteEgresoDeleteResponse,
  ComprobanteEgresoFilterResponse,
  ComprobanteEgresoResponse,
} from '@accounting/comprobante-egreso/domain/comprobante-egreso.entity';

/**
 * Repositorio abstracto para la gestión de Comprobantes de Egreso
 */
export abstract class ComprobanteEgresoRepository {
  /**
   * Obtiene la lista de comprobantes según los parámetros especificados
   * @param params Parámetros de filtrado y paginación
   */
  abstract list(params: ComprobanteEgresoListParams): Observable<ComprobanteEgresoResponse>;

  /**
   * Obtiene los datos para los filtros del listado
   */
  abstract getFilterData(): Observable<ComprobanteEgresoFilterResponse>;

  /**
   * Obtiene los datos necesarios para la eliminación de un comprobante
   * @param id Identificador del comprobante
   */
  abstract getDataForDeletion(id: number): Observable<ComprobanteEgresoDeleteResponse>;

  /**
   * Obtiene las cuotas asociadas a una cuenta por pagar
   * @param idCuentaPorPagar Identificador de la cuenta por pagar
   */
  abstract getCuotasByCuentaPorPagarId(idCuentaPorPagar: number): Observable<any>;

  /**
   * Obtiene datos para el formulario de pago de un proveedor
   * @param idProveedor Identificador del proveedor
   */
  abstract getFormaPagoData(idProveedor: number): Observable<any>;

  /**
   * Crea un nuevo comprobante de egreso
   * @param comprobante Datos del comprobante a crear
   */
  abstract create<T>(comprobante: T): Observable<ApiResponseLegacy>;

  abstract anular(comprobante: ComprobanteEgresoDeleteParams): Observable<ApiResponseLegacy>;
}

/**
 * Parámetros para listar comprobantes de egreso
 */
export interface ComprobanteEgresoListParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  [key: string]: any;
}
