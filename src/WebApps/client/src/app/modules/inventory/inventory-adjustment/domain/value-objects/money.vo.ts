import { ValidationException, ValueObject } from '@core/domain';
import DecimalUtils from '@core/utils/decimal.util';

export class Money extends ValueObject<number> {
  private static readonly MAX_DECIMAL_PLACES = 5;
  private static readonly MAX_VALUE = 999999999.99999;
  private static readonly MIN_VALUE = 0;

  private constructor(value: number) {
    super(value);
  }

  static from(amount: number): Money {
    if (!this.isValid(amount)) {
      throw new ValidationException('money', amount, `Invalid money amount: ${amount}`);
    }
    return new Money(this.normalize(amount));
  }

  static zero(): Money {
    return new Money(0);
  }

  static fromString(amount: string): Money {
    const numericValue = parseFloat(amount);
    if (isNaN(numericValue)) {
      throw new ValidationException('money', amount, `Cannot parse money amount: ${amount}`);
    }
    return this.from(numericValue);
  }

  // Factory methods for common currencies
  static dollars(amount: number): Money {
    return this.from(amount);
  }

  static cents(cents: number): Money {
    return this.from(cents / 100);
  }

  private static isValid(amount: number) {
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
    // Round to 2 decimal places to avoid floating point issues
    return Math.round(amount * 100) / 100;
  }

  private static getDecimalPlaces(num: number): number {
    const str = num.toString();
    if (str.includes('.')) {
      return str.split('.')[1].length;
    }
    return 0;
  }

  // Mathematical operations
  add(other: Money): Money {
    return Money.from(DecimalUtils.addAsNumber(this.value, other.value));
  }

  subtract(other: Money): Money {
    const result = this.value - other.value;
    if (result < Money.MIN_VALUE) {
      throw new ValidationException('money', result, 'Money cannot be negative');
    }
    return Money.from(result);
  }

  multiply(factor: number): Money {
    if (!isFinite(factor) || isNaN(factor)) {
      throw new ValidationException('money', factor, 'Invalid multiplication factor');
    }

    const multiplicacion = DecimalUtils.multiplyAsNumber(this.value, factor);
    return Money.from(multiplicacion);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new ValidationException('money', divisor, 'Cannot divide money by zero');
    }
    if (!isFinite(divisor) || isNaN(divisor)) {
      throw new ValidationException('money', divisor, 'Invalid division factor');
    }
    return Money.from(this.value / divisor);
  }

  // Comparison methods
  isGreaterThan(other: Money): boolean {
    return this.value > other.value;
  }

  isLessThan(other: Money): boolean {
    return this.value < other.value;
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.value >= other.value;
  }

  isLessThanOrEqual(other: Money): boolean {
    return this.value <= other.value;
  }

  isZero(): boolean {
    return this.value === 0;
  }

  isPositive(): boolean {
    return this.value > 0;
  }

  // Formatting methods
  toFixed(decimals = 2): string {
    return this.value.toFixed(decimals);
  }

  toCurrency(locale = 'en-US', currency = 'USD'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(this.value);
  }

  toCents(): number {
    return Math.round(this.value * 100);
  }

  // Utility methods
  allocate(ratios: number[]): Money[] {
    if (ratios.length === 0) {
      throw new ValidationException('money', ratios, 'Cannot allocate to empty ratios');
    }

    const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
    if (total === 0) {
      throw new ValidationException('money', ratios, 'Total allocation ratio cannot be zero');
    }

    const cents = this.toCents();
    const allocatedCents: number[] = [];
    let remainder = cents;

    // Allocate based on ratios
    for (let i = 0; i < ratios.length - 1; i++) {
      const allocated = Math.floor((cents * ratios[i]) / total);
      allocatedCents.push(allocated);
      remainder -= allocated;
    }

    // Last allocation gets the remainder
    allocatedCents.push(remainder);

    return allocatedCents.map((cents) => Money.cents(cents));
  }

  override toString() {
    return this.toFixed(2);
  }
}
