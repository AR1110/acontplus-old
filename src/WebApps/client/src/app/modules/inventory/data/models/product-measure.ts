export interface ProductFee {
  /** Unique rate identifier */
  id: number;

  /** Sale price without tax */
  salePrice: number;

  /** Sale price including tax */
  priceWithTax: number;

  /** Human-readable name of the fee or rate */
  name: string;

  /** Optional description */
  description?: string;

  /** Indicates if this fee is the default one */
  isDefault: boolean;
}

/**
 * Represents a product measure, including pricing and conversion details.
 * Replaces the old `MedidaProducto` (deprecated).
 */
export interface ProductMeasure {
  /** Unique identifier for the measure */
  id: number;

  /** Conversion rate relative to the main measure */
  conversion: number;

  /** Name of the measure (e.g., 'unit', 'box', etc.) */
  name: string;

  /** Whether this measure is marked as default */
  defaultMeasure: boolean;

  /** Type of measure: 'MAIN' or 'FRACTIONAL' */
  type: 'MAIN' | 'FRACTIONAL';

  /** Unit sale price */
  unitPrice: number;

  /** Purchase or cost price */
  costPrice: number;

  /** Fractional cost price */
  fractionalCostPrice: number;

  /** Display or sorting order */
  order: number;

  /** List of fees or tariffs associated with this measure */
  fees: ProductFee[];
}
