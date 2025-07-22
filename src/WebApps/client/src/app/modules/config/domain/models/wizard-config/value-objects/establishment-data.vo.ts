export interface EstablishmentDataValue {
  readonly canton: string;
  readonly estab: string;
  readonly establishmentCode: string;
  readonly commercialName: string;
  readonly address: string;
  readonly telefono?: string;
  readonly correo?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly ptosEmi: PuntoEmisionData[];
  readonly hasInventory: boolean;
  readonly bodegas: BodegaData[];
}

export interface PuntoEmisionData {
  readonly ptoEmi: string;
  readonly ambiente: string;
}

export interface BodegaData {
  readonly descripcion: string;
  readonly direccion: string;
  readonly telefono?: string;
}

export class EstablishmentData {
  private readonly _value: EstablishmentDataValue;

  constructor(value: EstablishmentDataValue) {
    this.validateValue(value);
    this._value = value;
  }

  get canton(): string {
    return this._value.canton;
  }

  get estab(): string {
    return this._value.estab;
  }

  get commercialName(): string {
    return this._value.commercialName;
  }

  get address(): string {
    return this._value.address;
  }

  get telefono(): string | undefined {
    return this._value.telefono;
  }

  get correo(): string | undefined {
    return this._value.correo;
  }

  get ptosEmi(): PuntoEmisionData[] {
    return [...this._value.ptosEmi];
  }

  get hasInventory(): boolean {
    return this._value.hasInventory;
  }

  get bodegas(): BodegaData[] {
    return [...this._value.bodegas];
  }

  get establishmentCode(): string {
    return this._value.establishmentCode || `${this.canton}-${this.estab}`;
  }

  get hasPuntosEmision(): boolean {
    return this.ptosEmi.length > 0;
  }

  get hasBodegas(): boolean {
    return this.bodegas.length > 0;
  }

  get requiresBodegas(): boolean {
    return this.hasInventory && this.bodegas.length === 0;
  }



  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  }

  addPuntoEmision(ptoEmi: PuntoEmisionData): EstablishmentData {
    const updatedPtosEmi = [...this.ptosEmi, ptoEmi];
    return new EstablishmentData({
      ...this._value,
      ptosEmi: updatedPtosEmi
    });
  }

  removePuntoEmision(index: number): EstablishmentData {
    const updatedPtosEmi = this.ptosEmi.filter((_, i) => i !== index);
    return new EstablishmentData({
      ...this._value,
      ptosEmi: updatedPtosEmi
    });
  }

  addBodega(bodega: BodegaData): EstablishmentData {
    const updatedBodegas = [...this.bodegas, bodega];
    return new EstablishmentData({
      ...this._value,
      bodegas: updatedBodegas
    });
  }

  removeBodega(index: number): EstablishmentData {
    const updatedBodegas = this.bodegas.filter((_, i) => i !== index);
    return new EstablishmentData({
      ...this._value,
      bodegas: updatedBodegas
    });
  }

  update(updates: Partial<EstablishmentDataValue>): EstablishmentData {
    return new EstablishmentData({
      ...this._value,
      ...updates
    });
  }

  toJSON(): EstablishmentDataValue {
    return { ...this._value };
  }

  equals(other: EstablishmentData): boolean {
    return this.establishmentCode === other.establishmentCode;
  }

  validate(): void {
    this.validateValue(this._value);
  }

  private validateValue(value: EstablishmentDataValue): void {
    if (!value.canton?.trim()) {
      throw new Error('Cantón es requerido');
    }

    if (!value.estab?.trim()) {
      throw new Error('Establecimiento es requerido');
    }

    if (value.estab.trim().length !== 3) {
      throw new Error('Establecimiento debe tener exactamente 3 caracteres');
    }

    if (!/^\d{3}$/.test(value.estab.trim())) {
      throw new Error('Establecimiento debe contener solo números');
    }

    if (!value.commercialName?.trim()) {
      throw new Error('Nombre comercial es requerido');
    }

    if (value.commercialName.trim().length < 3) {
      throw new Error('Nombre comercial debe tener al menos 3 caracteres');
    }

    if (value.commercialName.trim().length > 100) {
      throw new Error('Nombre comercial no puede exceder 100 caracteres');
    }

    if (!value.address?.trim()) {
      throw new Error('Dirección del establecimiento es requerida');
    }

    if (value.address.trim().length < 10) {
      throw new Error('Dirección debe tener al menos 10 caracteres');
    }

    if (value.correo && !this.isValidEmail(value.correo)) {
      throw new Error('Formato de correo inválido');
    }

    if (value.email && !this.isValidEmail(value.email)) {
      throw new Error('Formato de email inválido');
    }

    if (value.telefono && !this.isValidPhone(value.telefono)) {
      throw new Error('Formato de teléfono inválido');
    }

    if (value.phone && !this.isValidPhone(value.phone)) {
      throw new Error('Formato de teléfono inválido');
    }

    if (value.ptosEmi.length === 0) {
      throw new Error('Debe tener al menos un punto de emisión');
    }

    if (value.ptosEmi.length > 5) {
      throw new Error('No puede tener más de 5 puntos de emisión');
    }

    // Validate puntos de emisión
    value.ptosEmi.forEach((ptoEmi, index) => {
      if (!ptoEmi.ptoEmi?.trim()) {
        throw new Error(`Punto de emisión ${index + 1} es requerido`);
      }

      if (ptoEmi.ptoEmi.trim().length !== 3) {
        throw new Error(`Punto de emisión ${index + 1} debe tener exactamente 3 caracteres`);
      }

      if (!/^\d{3}$/.test(ptoEmi.ptoEmi.trim())) {
        throw new Error(`Punto de emisión ${index + 1} debe contener solo números`);
      }

      if (!ptoEmi.ambiente?.trim()) {
        throw new Error(`Ambiente para punto de emisión ${index + 1} es requerido`);
      }
    });

    // Validate bodegas if inventory is enabled
    if (value.hasInventory) {
      value.bodegas.forEach((bodega, index) => {
        if (!bodega.descripcion?.trim()) {
          throw new Error(`Descripción de bodega ${index + 1} es requerida`);
        }

        if (!bodega.direccion?.trim()) {
          throw new Error(`Dirección de bodega ${index + 1} es requerida`);
        }

        if (bodega.telefono && !this.isValidPhone(bodega.telefono)) {
          throw new Error(`Formato de teléfono de bodega ${index + 1} inválido`);
        }
      });
    }
  }
}
