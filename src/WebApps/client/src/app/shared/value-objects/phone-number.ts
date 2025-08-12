export class PhoneNumber {
  private static readonly PHONE_REGEX = /^\+?[\d\s\-\(\)]{7,15}$/;

  private constructor(private readonly _value: string) {
    this.validate(_value);
  }

  static from(value: string): PhoneNumber {
    return new PhoneNumber(value.trim());
  }

  get value(): string {
    return this._value;
  }

  private validate(phone: string): void {
    if (!phone || !PhoneNumber.PHONE_REGEX.test(phone)) {
      throw new Error('Invalid phone number format');
    }
  }
}
