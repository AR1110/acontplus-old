/**
 * @deprecated
 * This interface is deprecated.
 * Use the improved models from `@core/models/emission-point.ts` instead.
 *
 * Reason:
 * - Duplicated definitions for emission point entities.
 * - The new models provide unified types and improved naming consistency.
 *
 * Replacement:
 * ```ts
 * import { EmissionPoint } from '@core/models/emission-point.ts';
 * ```
 */
export interface PuntoEmision {
  idPuntoEmision: number;
  ptoEmi: string;
  idPtoEmi_asig?: number;
  codEstab_Asig?: string;
  defaultPtoEmi: boolean;
}

/**
 * @deprecated
 * This interface is deprecated.
 * Use the improved models from `@core/models/emission-point.ts` instead.
 *
 * Reason:
 * - It contains redundant fields already defined in the new `Establishment` model.
 * - The new design centralizes warehouse-page and emission point data for better grouping logic.
 *
 * Replacement:
 * ```ts
 * import { EmissionPointEstablishment } from '@core/models/emission-point.ts';
 * ```
 */
export interface PuntoEmisionEstablecimiento {
  idEstablecimiento: number;
  nombreComercial: string;
  codEstab: string;
  idPuntoEmision: number;
  ptoEmi: string;
  defaultEstab: boolean;
  defaultPtoEmi: boolean;
  correo?: string;
}

/**
 * @deprecated
 * This interface is deprecated.
 * Use the improved version from `@core/models/emission-point.ts` instead.
 *
 * Reason:
 * - This read model has been unified with the main emission point entity.
 * - The new model improves clarity between read/write representations.
 *
 * Replacement:
 * ```ts
 * import { EmissionPointRead } from '@core/models/emission-point.ts';
 * ```
 */
export interface PuntoEmisionRead {
  idPuntoEmision: number;
  ambiente: string;
  ptoEmi: string;
  descripcion: string;
  estado: boolean;
}
