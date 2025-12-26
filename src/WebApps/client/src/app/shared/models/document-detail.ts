import DecimalUtils from '@core/utils/decimal.util';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { ProductFee, ProductMeasure } from '@inventory/data/models/product-measure';

/**
 * Enumeración para el estado de una línea de detalle del documento.
 */
export enum DocumentDetailStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

/**
 * Tipo de descuento aplicado a la línea de detalle.
 */
export enum DiscountType {
  /** Sin descuento aplicado */
  NONE = 'NONE',
  /** Descuento basado en porcentaje */
  PERCENTAGE = 'PERCENTAGE',
  /** Descuento de monto fijo */
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

/**
 * Define la estructura de datos para una sola línea de detalle en un documento
 * (ej. una factura, cotización o pedido).
 * Esta interfaz representa el contrato público para un DocumentDetail.
 */
export interface DocumentDetailModel {
  // --- Identificadores Principales ---
  /** Un identificador único universal (UUID) para la línea de detalle. */
  uuid: string;

  /** El ID interno de la base de datos para la línea de detalle. */
  id: number;

  // --- Información del Producto y Servicio ---
  /** El ID del producto asociado. */
  productId: number;

  /** El código o SKU (Unidad de Mantenimiento de Stock) del producto. */
  productCode: string;

  /** Una descripción legible por humanos del producto o servicio. */
  description: string;

  /** El ID del almacén desde donde se origina el producto. */
  warehouseId: number;

  /** Indica si el producto maneja inventario. */
  hasInventory: boolean;

  /** Indica si el producto tiene datos adicionales configurados. */
  hasAdditionalData: boolean;

  // --- Configuración de Impuestos, Medidas y Tarifas ---
  /** La tasa de impuesto como decimal (ej. 0.12 para un 12%). */
  taxRate: number;

  /** El ID de la configuración de la tasa de impuesto. */
  taxRateId: number;

  /** El ID de la unidad de medida (ej. unidades, kg, horas). */
  measureId: number;

  /** El ID para cualquier tarifa o comisión asociada al producto. */
  feeId: number;

  /** Lista de tarifas o comisiones asociadas al producto. */
  fees: ProductFee[];

  /** Lista de medidas y conversiones disponibles para el producto. */
  measures: ProductMeasure[];

  /** Factor de conversión entre la unidad de medida seleccionada y la unidad base del producto. */
  conversionFactor: number;

  // --- Propiedades de Entrada (Configuradas por el Usuario) ---
  /** La cantidad del producto o servicio. */
  quantity: number;

  /** El precio unitario del producto, excluyendo impuestos. */
  unitPrice: number;

  /** El valor monetario fijo del descuento aplicado (si aplica). */
  discount: number;

  /** El porcentaje de descuento aplicado (si aplica). */
  discountPercentage: number;

  /** Tipo de descuento aplicado a esta línea. */
  discountType: DiscountType;

  // --- Propiedades Calculadas (Solo Lectura) ---
  /** El precio unitario incluyendo impuestos. */
  readonly unitPriceWithTax: number;

  /** El subtotal antes de descuentos e impuestos (cantidad × precio). */
  readonly subtotalBeforeDiscount: number;

  /** El monto total del descuento aplicado (calculado). */
  readonly appliedDiscountAmount: number;

  /** La base imponible (subtotal después del descuento). */
  readonly taxableBase: number;

  /** El valor monetario total del impuesto para esta línea. */
  readonly calculatedTaxAmount: number;

  /** El total final de la línea (base imponible + impuesto). */
  readonly totalAmount: number;

  // --- Propiedades Opcionales y de Estado ---
  /** Precio del producto antes de aplicar cualquier subsidio. */
  priceWithoutSubsidy?: number;

  /** Notas o comentarios adicionales sobre la línea de detalle. */
  notes?: string;

  /** Información adicional del producto, estructura flexible. */
  additionalProductInfo?: Record<string, unknown>[];

  /** Ajustes de inventario relacionados con esta línea de detalle. */
  inventoryAdjustments?: unknown[];

  /** Estado de la línea de detalle. */
  status: DocumentDetailStatus;
}

/**
 * Representa una línea de detalle en un documento, encapsulando todos sus datos y lógica de cálculo.
 * Esta clase asegura que todos los valores financieros se calculen de forma consistente y precisa.
 *
 * PRINCIPIOS DE DISEÑO:
 * - Propiedades de entrada: Configurables por el usuario
 * - Propiedades calculadas: Solo lectura, generadas por calculate()
 * - Validación: Antes de cada cálculo
 * - Inmutabilidad: Los cálculos no modifican propiedades de entrada (excepto discountType)
 */
export class DocumentDetail implements DocumentDetailModel {
  // --- Identificadores Principales ---
  uuid = generateUuidv4();
  id = 0;

  // --- Información del Producto y Servicio ---
  productId = 0;
  productCode = '';
  description = '';
  warehouseId = 0;
  hasInventory = false;
  hasAdditionalData = false;

  // --- Configuración de Impuestos, Medidas y Tarifas ---
  taxRate = 0;
  taxRateId = 0;
  measureId = 0;
  feeId = 0;
  fees: ProductFee[] = [];
  measures: ProductMeasure[] = [];
  conversionFactor = 1;

  // --- Propiedades de Entrada ---
  quantity = 1;
  unitPrice = 0;
  discount = 0;
  discountPercentage = 0;
  discountType: DiscountType = DiscountType.NONE;

  // --- Propiedades Calculadas (Privadas) ---
  private _unitPriceWithTax = 0;
  private _subtotalBeforeDiscount = 0;
  private _appliedDiscountAmount = 0;
  private _taxableBase = 0;
  private _calculatedTaxAmount = 0;
  private _totalAmount = 0;

  // --- Getters para Propiedades Calculadas (Solo Lectura) ---
  get unitPriceWithTax(): number {
    return this._unitPriceWithTax;
  }

  get subtotalBeforeDiscount(): number {
    return this._subtotalBeforeDiscount;
  }

  get appliedDiscountAmount(): number {
    return this._appliedDiscountAmount;
  }

  get taxableBase(): number {
    return this._taxableBase;
  }

  get calculatedTaxAmount(): number {
    return this._calculatedTaxAmount;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  // --- Propiedades Opcionales y de Estado ---
  priceWithoutSubsidy?: number;
  notes?: string;
  additionalProductInfo?: Record<string, unknown>[];
  inventoryAdjustments?: unknown[];
  status: DocumentDetailStatus = DocumentDetailStatus.ACTIVE;

  /**
   * Crea una instancia de DocumentDetail.
   * Permite una inicialización parcial de propiedades a partir de un objeto de datos.
   * @param data - Un objeto opcional con valores iniciales para el detalle.
   */
  constructor(data?: Partial<DocumentDetailModel>) {
    if (data) {
      // Establecer valores por defecto para propiedades críticas
      data.taxRate ??= 0;
      data.quantity ??= 1;
      data.fees ??= [];
      data.measures ??= [];
      data.conversionFactor ??= 1;
      data.status ??= DocumentDetailStatus.ACTIVE;
      data.discountType ??= DiscountType.NONE;
      data.discount ??= 0;
      data.discountPercentage ??= 0;
    }
    Object.assign(this, data);
  }

  /**
   * Valida que las propiedades de entrada tengan valores correctos.
   * @throws {Error} Si alguna validación falla.
   */
  private validateInputs(): void {
    if (this.quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    if (this.unitPrice < 0) {
      throw new Error('El precio unitario no puede ser negativo');
    }

    // if (this.taxRate < 0 || this.taxRate > 1) {
    //   throw new Error('La tasa de impuesto debe estar entre 0 y 1');
    // }

    if (this.discountPercentage < 0 || this.discountPercentage > 100) {
      throw new Error('El porcentaje de descuento debe estar entre 0 y 100');
    }

    if (this.discount < 0) {
      throw new Error('El monto del descuento no puede ser negativo');
    }

    if (this.conversionFactor <= 0) {
      throw new Error('El factor de conversión debe ser mayor a 0');
    }
  }

  /**
   * Determina el tipo de descuento aplicado basándose en los valores de entrada.
   * @returns {DiscountType} El tipo de descuento detectado.
   */
  private determineDiscountType(): DiscountType {
    if (this.discountPercentage > 0 && this.discount > 0) {
      // Ambos están establecidos, priorizar porcentaje
      console.warn(
        'Tanto discountPercentage como discount están establecidos. Se usará discountPercentage.',
      );
      return DiscountType.PERCENTAGE;
    }

    if (this.discountPercentage > 0) {
      return DiscountType.PERCENTAGE;
    }

    if (this.discount > 0) {
      return DiscountType.FIXED_AMOUNT;
    }

    return DiscountType.NONE;
  }

  /**
   * Calcula todos los valores financieros para la línea de detalle del documento.
   * El cálculo sigue un orden específico para asegurar la precisión:
   * 1. Validar entradas
   * 2. Calcular subtotal bruto
   * 3. Determinar y aplicar descuento
   * 4. Calcular la base imponible
   * 5. Calcular el valor del impuesto
   * 6. Calcular el precio unitario con impuesto
   * 7. Calcular el total final
   *
   * @returns {this} La instancia misma, permitiendo el encadenamiento de métodos.
   * @throws {Error} Si las validaciones de entrada fallan.
   */
  calculate(): this {
    // 1. Validar todas las entradas antes de calcular
    this.validateInputs();

    // 2. Calcular el subtotal bruto (precio × cantidad) antes de descuentos.
    const grossSubtotal = DecimalUtils.multiplyAsNumber(this.unitPrice, this.quantity);
    this._subtotalBeforeDiscount = Number(grossSubtotal.toFixed(5));

    // 3. Determinar el tipo de descuento y calcular el monto aplicado
    this.discountType = this.determineDiscountType();

    let discountAmount: number;
    switch (this.discountType) {
      case DiscountType.PERCENTAGE:
        // Calcular descuento basado en porcentaje
        discountAmount = grossSubtotal * (this.discountPercentage / 100);
        break;

      case DiscountType.FIXED_AMOUNT:
        // Usar el monto fijo de descuento
        discountAmount = this.discount;
        break;

      case DiscountType.NONE:
      default:
        discountAmount = 0;
        break;
    }

    // Validar que el descuento no exceda el subtotal
    if (discountAmount > grossSubtotal) {
      throw new Error('El descuento no puede ser mayor al subtotal');
    }

    this._appliedDiscountAmount = Number(discountAmount.toFixed(5));

    // 4. Calcular la base imponible (subtotal después del descuento)
    this._taxableBase = Number((grossSubtotal - discountAmount).toFixed(5));

    // 5. Calcular el valor del impuesto basado en la base imponible
    const taxAmount = DecimalUtils.multiplyAsNumber(this._taxableBase, this.taxRate);
    this._calculatedTaxAmount = Number(taxAmount.toFixed(5));

    // 6. Calcular el precio unitario con impuesto incluido
    const priceWithVat = DecimalUtils.multiplyAsNumber(this.unitPrice, 1 + this.taxRate);
    this._unitPriceWithTax = Number(priceWithVat.toFixed(5));

    // 7. Calcular el total final de la línea (base imponible + impuesto)
    const total = DecimalUtils.addAsNumber(this._taxableBase, taxAmount);
    this._totalAmount = Number(total.toFixed(5));

    return this;
  }

  /**
   * Verifica si la línea de detalle es válida para ser procesada.
   * @returns {boolean} true si todos los campos requeridos son válidos.
   */
  isValid(): boolean {
    try {
      this.validateInputs();
      return this.quantity > 0 && this.unitPrice >= 0 && this.productId > 0;
    } catch {
      return false;
    }
  }

  /**
   * Resetea todos los valores calculados a cero.
   * Útil antes de recalcular o al inicializar.
   */
  resetCalculatedValues(): void {
    this._unitPriceWithTax = 0;
    this._subtotalBeforeDiscount = 0;
    this._appliedDiscountAmount = 0;
    this._taxableBase = 0;
    this._calculatedTaxAmount = 0;
    this._totalAmount = 0;
  }

  /**
   * Crea una copia profunda de esta línea de detalle.
   * @returns {DocumentDetail} Una nueva instancia con los mismos valores.
   */
  clone(): DocumentDetail {
    const cloned = new DocumentDetail({
      // Identificadores
      uuid: generateUuidv4(), // Nuevo UUID para la copia
      id: 0, // Nuevo registro, sin ID

      // Información del Producto
      productId: this.productId,
      productCode: this.productCode,
      description: this.description,
      warehouseId: this.warehouseId,
      hasInventory: this.hasInventory,
      hasAdditionalData: this.hasAdditionalData,

      // Configuración
      taxRate: this.taxRate,
      taxRateId: this.taxRateId,
      measureId: this.measureId,
      feeId: this.feeId,
      fees: [...this.fees],
      measures: [...this.measures],
      conversionFactor: this.conversionFactor,

      // Propiedades de Entrada
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      discount: this.discount,
      discountPercentage: this.discountPercentage,
      discountType: this.discountType,

      // Opcionales
      priceWithoutSubsidy: this.priceWithoutSubsidy,
      notes: this.notes,
      additionalProductInfo: this.additionalProductInfo
        ? [...this.additionalProductInfo]
        : undefined,
      inventoryAdjustments: this.inventoryAdjustments ? [...this.inventoryAdjustments] : undefined,
      status: this.status,
    });

    // Recalcular valores
    return cloned.calculate();
  }

  /**
   * Convierte la línea de detalle a un objeto plano para serialización.
   * @returns {object} Objeto con todas las propiedades.
   */
  toJSON(): object {
    return {
      // Identificadores
      uuid: this.uuid,
      id: this.id,

      // Información del Producto
      productId: this.productId,
      productCode: this.productCode,
      description: this.description,
      warehouseId: this.warehouseId,
      hasInventory: this.hasInventory,
      hasAdditionalData: this.hasAdditionalData,

      // Configuración
      taxRate: this.taxRate,
      taxRateId: this.taxRateId,
      measureId: this.measureId,
      feeId: this.feeId,
      fees: this.fees,
      measures: this.measures,
      conversionFactor: this.conversionFactor,

      // Propiedades de Entrada
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      discount: this.discount,
      discountPercentage: this.discountPercentage,
      discountType: this.discountType,

      // Propiedades Calculadas
      unitPriceWithTax: this.unitPriceWithTax,
      subtotalBeforeDiscount: this.subtotalBeforeDiscount,
      appliedDiscountAmount: this.appliedDiscountAmount,
      taxableBase: this.taxableBase,
      calculatedTaxAmount: this.calculatedTaxAmount,
      totalAmount: this.totalAmount,

      // Opcionales
      priceWithoutSubsidy: this.priceWithoutSubsidy,
      notes: this.notes,
      additionalProductInfo: this.additionalProductInfo,
      inventoryAdjustments: this.inventoryAdjustments,
      status: this.status,
    };
  }

  /**
   * Un método de fábrica estático para crear una nueva instancia vacía de DocumentDetail
   * con valores predeterminados sensatos.
   * @returns {DocumentDetail} Una nueva instancia de DocumentDetail.
   */
  static create(): DocumentDetail {
    return new DocumentDetail({
      // Identificadores
      uuid: generateUuidv4(),
      id: 0,

      // Información del Producto
      productId: 0,
      productCode: '',
      description: '',
      warehouseId: 0,
      hasInventory: false,
      hasAdditionalData: false,

      // Configuración
      taxRate: 0,
      taxRateId: 0,
      measureId: 0,
      feeId: 0,
      fees: [],
      measures: [],
      conversionFactor: 1,

      // Propiedades de Entrada
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountPercentage: 0,
      discountType: DiscountType.NONE,

      // Estado
      status: DocumentDetailStatus.ACTIVE,
    });
  }
}
