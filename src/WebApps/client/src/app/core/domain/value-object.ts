export abstract class ValueObject<T> {
  constructor(protected readonly _value: T) {
    Object.freeze(this);
  }

  get value(): T {
    return this._value;
  }

  equals(vo: ValueObject<T>): boolean {
    if (!(vo instanceof this.constructor)) {
      return false;
    }
    return this.isEqual(this._value, vo._value);
  }

  private isEqual(value1: T, value2: T): boolean {
    if (value1 === value2) {
      return true;
    }

    if (value1 == null || value2 == null) {
      return false;
    }

    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return JSON.stringify(value1) === JSON.stringify(value2);
    }

    return false;
  }

  toString(): string {
    return String(this._value);
  }
}