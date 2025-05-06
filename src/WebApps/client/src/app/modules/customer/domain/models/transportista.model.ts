import {Id} from "@shared/value-objects/id.vo";
export class Transportista {
  constructor(
    private readonly id: Id<number>,
    private readonly ruc: string,
    private readonly razonSocial: string,
    private readonly licenciaConducir?: string,
    private readonly placa?: string
  ) {
    this.validarTransportista();
  }

  private validarTransportista(): void {
    if (!this.ruc || this.ruc.trim() === '') {
      throw new Error('El RUC del transportista es requerido');
    }
    if (!this.razonSocial || this.razonSocial.trim() === '') {
      throw new Error('La razón social del transportista es requerida');
    }
  }

  getId(): Id<string> { return this.id; }
  getRuc(): string { return this.ruc; }
  getRazonSocial(): string { return this.razonSocial; }
  getLicenciaConducir(): string | undefined { return this.licenciaConducir; }
  getPlaca(): string | undefined { return this.placa; }

  // Método para serializar a un objeto plano
  toPlainObject(): any {
    return {
      id: this.id.value,
      ruc: this.ruc,
      razonSocial: this.razonSocial,
      licenciaConducir: this.licenciaConducir,
      placa: this.placa
    };
  }

  // Método de fábrica para crear desde un objeto plano
  static fromPlainObject(object: any): Transportista {
    return new Transportista(
      new Id(object.id),
      object.ruc,
      object.razonSocial,
      object.licenciaConducir,
      object.placa
    );
  }
}
