export class Direccion {
  constructor(
    private readonly calle: string,
    private readonly numero: string,
    private readonly ciudad: string,
    private readonly provincia: string,
    private readonly pais: string,
    private readonly complemento?: string,
    private readonly codigoPostal?: string,
  ) {
    this.validarDireccion();
  }

  private validarDireccion(): void {
    if (!this.calle || this.calle.trim() === '') {
      throw new Error('La calle es requerida');
    }
    if (!this.numero || this.numero.trim() === '') {
      throw new Error('El número es requerido');
    }
    if (!this.ciudad || this.ciudad.trim() === '') {
      throw new Error('La ciudad es requerida');
    }
    if (!this.provincia || this.provincia.trim() === '') {
      throw new Error('La provincia es requerida');
    }
    if (!this.pais || this.pais.trim() === '') {
      throw new Error('El país es requerido');
    }
  }

  equals(direccion?: Direccion): boolean {
    if (!direccion) {
      return false;
    }
    return (
      this.calle === direccion.calle &&
      this.numero === direccion.numero &&
      this.ciudad === direccion.ciudad &&
      this.provincia === direccion.provincia &&
      this.pais === direccion.pais &&
      this.complemento === direccion.complemento &&
      this.codigoPostal === direccion.codigoPostal
    );
  }

  getCalle(): string {
    return this.calle;
  }
  getNumero(): string {
    return this.numero;
  }
  getCiudad(): string {
    return this.ciudad;
  }
  getProvincia(): string {
    return this.provincia;
  }
  getPais(): string {
    return this.pais;
  }
  getComplemento(): string | undefined {
    return this.complemento;
  }
  getCodigoPostal(): string | undefined {
    return this.codigoPostal;
  }

  // Método para serializar a un objeto plano
  toPlainObject(): any {
    return {
      calle: this.calle,
      numero: this.numero,
      complemento: this.complemento,
      ciudad: this.ciudad,
      provincia: this.provincia,
      codigoPostal: this.codigoPostal,
      pais: this.pais,
    };
  }

  // Método de fábrica para crear desde un objeto plano
  static fromPlainObject(object: any): Direccion {
    return new Direccion(
      object.calle,
      object.numero,
      object.ciudad,
      object.provincia,
      object.pais,
      object.complemento,
      object.codigoPostal,
    );
  }
}
