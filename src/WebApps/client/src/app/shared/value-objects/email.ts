export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly _value: string) {
    this.validate(_value);
  }

  static from(value: string): Email {
    return new Email(value);
  }

  get value(): string {
    return this._value;
  }

  private validate(email: string): void {
    if (!email || !Email.EMAIL_REGEX.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
