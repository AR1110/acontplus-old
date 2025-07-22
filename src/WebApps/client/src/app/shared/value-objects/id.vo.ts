export class Id<T> {
  private readonly _value: string;

  constructor(value: string | number) {
    if (value === null || value === undefined || value === '') {
      throw new Error('Id value must not be empty');
    }

    const strValue = value.toString().trim();
    if (strValue.length === 0) {
      throw new Error('Id value must not be empty');
    }

    this._value = strValue;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Id<T>): boolean {
    return other instanceof Id && this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  getValue(): string {
    return this.value;
  }
}
