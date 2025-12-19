import { ValidationException, ValueObject } from '@core/domain';

export class Quantity extends ValueObject<number> {
  private static readonly MAX_DECIMAL_PLACES = 5;
  private static readonly MAX_VALUE = 999999999.99999;
  private static readonly MIN_VALUE = 0;

  private constructor(value: number) {
    super(value);
  }

  static from(amount: number): Quantity {
    if (!this.isValid(amount)) {
      throw new ValidationException('quantity', amount, `Invalid quantity: ${amount}`);
    }
    return new Quantity(this.normalize(amount));
  }

  static zero(): Quantity {
    return new Quantity(0);
  }

  static one(): Quantity {
    return new Quantity(1);
  }

  static fromString(amount: string): Quantity {
    const numericValue = parseFloat(amount);
    if (isNaN(numericValue)) {
      throw new ValidationException('quantity', amount, `Cannot parse quantity: ${amount}`);
    }
    return this.from(numericValue);
  }

  // Factory methods for common units
  static kilograms(kg: number): Quantity {
    return this.from(kg);
  }

  static grams(g: number): Quantity {
    return this.from(g / 1000); // Convert to kg
  }

  static units(units: number): Quantity {
    return this.from(units);
  }

  static liters(liters: number): Quantity {
    return this.from(liters);
  }

  static milliliters(ml: number): Quantity {
    return this.from(ml / 1000); // Convert to liters
  }

  private static isValid(amount: number): boolean {
    if (amount == null || isNaN(amount) || !isFinite(amount)) {
      return false;
    }

    if (amount < this.MIN_VALUE || amount > this.MAX_VALUE) {
      return false;
    }

    // Check decimal places
    const decimalPlaces = this.getDecimalPlaces(amount);
    return decimalPlaces <= this.MAX_DECIMAL_PLACES;
  }

  private static normalize(amount: number): number {
    // Round to 5 decimal places for precision
    return Math.round(amount * 100000) / 100000;
  }

  private static getDecimalPlaces(num: number): number {
    const str = num.toString();
    if (str.includes('.')) {
      return str.split('.')[1].length;
    }
    return 0;
  }

  // Mathematical operations
  add(other: Quantity): Quantity {
    return Quantity.from(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    const result = this.value - other.value;
    if (result < Quantity.MIN_VALUE) {
      throw new ValidationException('quantity', result, 'Quantity cannot be negative');
    }
    return Quantity.from(result);
  }

  multiply(factor: number): Quantity {
    if (!isFinite(factor) || isNaN(factor)) {
      throw new ValidationException('quantity', factor, 'Invalid multiplication factor');
    }
    if (factor < 0) {
      throw new ValidationException('quantity', factor, 'Multiplication factor cannot be negative');
    }
    return Quantity.from(this.value * factor);
  }

  divide(divisor: number): Quantity {
    if (divisor === 0) {
      throw new ValidationException('quantity', divisor, 'Cannot divide quantity by zero');
    }
    if (!isFinite(divisor) || isNaN(divisor) || divisor < 0) {
      throw new ValidationException('quantity', divisor, 'Invalid division factor');
    }
    return Quantity.from(this.value / divisor);
  }

  // Percentage operations
  percentage(percent: number): Quantity {
    if (percent < 0 || percent > 100) {
      throw new ValidationException('quantity', percent, 'Percentage must be between 0 and 100');
    }
    return this.multiply(percent / 100);
  }

  // Comparison methods
  isGreaterThan(other: Quantity): boolean {
    return this.value > other.value;
  }

  isLessThan(other: Quantity): boolean {
    return this.value < other.value;
  }

  isGreaterThanOrEqual(other: Quantity): boolean {
    return this.value >= other.value;
  }

  isLessThanOrEqual(other: Quantity): boolean {
    return this.value <= other.value;
  }

  isZero(): boolean {
    return this.value === 0;
  }

  isPositive(): boolean {
    return this.value > 0;
  }

  // Unit conversion methods
  toKilograms(): number {
    return this.value;
  }

  toGrams(): number {
    return this.value * 1000;
  }

  toLiters(): number {
    return this.value;
  }

  toMilliliters(): number {
    return this.value * 1000;
  }

  // Formatting methods
  toFixed(decimals = 5): string {
    return this.value.toFixed(decimals);
  }

  toPrecision(precision = 6): string {
    return this.value.toPrecision(precision);
  }

  toUnit(unit: string, decimals = 2): string {
    return `${this.value.toFixed(decimals)} ${unit}`;
  }

  // Inventory-specific methods
  canSatisfy(required: Quantity): boolean {
    return this.isGreaterThanOrEqual(required);
  }

  remaining(used: Quantity): Quantity {
    return this.subtract(used);
  }

  ratioTo(other: Quantity): number {
    if (other.isZero()) {
      throw new ValidationException(
        'quantity',
        other.value,
        'Cannot calculate ratio with zero quantity',
      );
    }
    return this.value / other.value;
  }

  override toString(): string {
    return this.toFixed(5).replace(/\.?0+$/, ''); // Remove trailing zeros
  }
}
