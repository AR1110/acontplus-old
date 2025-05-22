import { signal, WritableSignal } from '@angular/core';
import { PersonType } from '@customer/domain/enums/customer.enum';

export interface DocumentoElectronico {
  idDocumentoElectronico: number;
  codDoc: string;
  comprobante: string;
  serieComprobante: string;
  rucReceptor: string;
  razonSocialReceptor: string;
  fechaEmision: string;
  claveAcceso: string;
  fechaAutorizacion: string;
  estado?: string;
  codEstado: string;
  versionComp: string;
  usuario?: string;
  codEstab: string;
  totalRecords?: number;
  idDocumento: number;
  idPuntoEmision: number;
  idEstablecimiento: number;
}

export interface FilterData {
  estabs: any[];
  tipoDocumentos: any[];
  estadoDocumentos: any[];
  estadoPagos: any[];
  lastUpdated: Date;
}
/**
 * Defines the structure for filter options, using Angular signals for reactivity.
 */
export interface FilterOptions {
  showEstablecimiento: WritableSignal<boolean>;
  showTipoDocumento: WritableSignal<boolean>;
  showEstadoDocumento: WritableSignal<boolean>;
  showEstadoPago: WritableSignal<boolean>;
  showPuntoEmision: WritableSignal<boolean>;
  showNroSecuencial: WritableSignal<boolean>;
  showInfoAdicional: WritableSignal<boolean>;
  showButtonNew: WritableSignal<boolean>;
  showPersonSearch: WritableSignal<boolean>;
  personType: WritableSignal<PersonType>;
}

/**
 * Provides the default set of filter options with all signals set to true.
 * @returns A FilterOptions object with default values.
 */
export function getDefaultDocElectFilterOptions(): FilterOptions {
  return {
    showEstablecimiento: signal(true),
    showTipoDocumento: signal(true),
    showEstadoDocumento: signal(true),
    showEstadoPago: signal(true),
    showPuntoEmision: signal(true),
    showNroSecuencial: signal(true),
    showInfoAdicional: signal(true),
    showButtonNew: signal(true),
    showPersonSearch: signal(true),
    personType: signal(PersonType.CUSTOMER),
  };
}

/**
 * Merges default filter options with any provided overrides.
 * This function allows a consuming component to selectively hide/show certain filter fields.
 *
 * @param overrides A Partial<FilterOptions> object containing only the options to be overridden.
 * @returns A new FilterOptions object with merged values.
 */
export function getMergedDocElectFilterOptions(
  overrides?: Partial<FilterOptions>,
): FilterOptions {
  const defaultOptions = getDefaultDocElectFilterOptions();
  // Using spread syntax to merge: properties in 'overrides' will overwrite
  // corresponding properties in 'defaultOptions'.
  return { ...defaultOptions, ...overrides };
}
