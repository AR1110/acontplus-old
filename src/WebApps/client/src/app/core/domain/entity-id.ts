export abstract class EntityId {
  constructor(protected readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error(`${this.constructor.name} cannot be empty`);
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: EntityId): boolean {
    return other.constructor === this.constructor && other._value === this._value;
  }

  toString(): string {
    return this._value;
  }
}
