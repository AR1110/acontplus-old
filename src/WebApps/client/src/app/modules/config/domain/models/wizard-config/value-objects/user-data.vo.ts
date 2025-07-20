export interface UserDataValue {
  readonly nroIdentificacion: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email?: string;
  readonly phone?: string;
}

export class UserData {
  private readonly _value: UserDataValue;

  constructor(value: UserDataValue) {
    this.validateValue(value);
    this._value = value;
  }

  get nroIdentificacion(): string {
    return this._value.nroIdentificacion;
  }

  get firstName(): string {
    return this._value.firstName;
  }

  get lastName(): string {
    return this._value.lastName;
  }

  get email(): string | undefined {
    return this._value.email;
  }

  get phone(): string | undefined {
    return this._value.phone;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get displayName(): string {
    return this.fullName || this.nroIdentificacion;
  }



  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  }

  update(updates: Partial<UserDataValue>): UserData {
    return new UserData({
      ...this._value,
      ...updates
    });
  }

  toJSON(): UserDataValue {
    return { ...this._value };
  }

  equals(other: UserData): boolean {
    return this.nroIdentificacion === other.nroIdentificacion;
  }

  validate(): void {
    this.validateValue(this._value);
  }

  private validateValue(value: UserDataValue): void {
    if (!value.nroIdentificacion?.trim()) {
      throw new Error('Número de identificación es requerido');
    }

    if (!value.firstName?.trim()) {
      throw new Error('Nombres son requeridos');
    }

    if (value.firstName.trim().length < 2) {
      throw new Error('Nombres deben tener al menos 2 caracteres');
    }

    if (value.firstName.trim().length > 50) {
      throw new Error('Nombres no pueden exceder 50 caracteres');
    }

    if (!value.lastName?.trim()) {
      throw new Error('Apellidos son requeridos');
    }

    if (value.lastName.trim().length < 2) {
      throw new Error('Apellidos deben tener al menos 2 caracteres');
    }

    if (value.lastName.trim().length > 50) {
      throw new Error('Apellidos no pueden exceder 50 caracteres');
    }

    if (value.email && !this.isValidEmail(value.email)) {
      throw new Error('Formato de email inválido');
    }

    if (value.phone && !this.isValidPhone(value.phone)) {
      throw new Error('Formato de teléfono inválido');
    }
  }
}
