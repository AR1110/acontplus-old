import {Id} from "@shared/value-objects/id.vo";

export class ItemGuia {
  constructor(
    private readonly productoId: Id<number>,
    private readonly codigoProducto: string,
    private readonly descripcion: string,
    private readonly cantidad: number,
    private readonly unidadMedida: string,
    private readonly peso?: number,
    private readonly volumen?: number,
    private readonly serieLote?: string,
    private readonly observaciones?: string,
    private readonly id?: Id<number>
  ) {
    this.validarItem();
  }

  private validarItem(): void {
    if (!this.productoId) {
      throw new Error('El ID del producto es requerido');
    }
    if (!this.codigoProducto || this.codigoProducto.trim() === '') {
      throw new Error('El código del producto es requerido');
    }
    if (!this.descripcion || this.descripcion.trim() === '') {
      throw new Error('La descripción del producto es requerida');
    }
    if (!this.cantidad || this.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a cero');
    }
    if (!this.unidadMedida || this.unidadMedida.trim() === '') {
      throw new Error('La unidad de medida es requerida');
    }
  }

  getId(): Id<number> | undefined { return this.id; }
  getProductoId(): Id<number> { return this.productoId; }
  getCodigoProducto(): string { return this.codigoProducto; }
  getDescripcion(): string { return this.descripcion; }
  getCantidad(): number { return this.cantidad; }
  getUnidadMedida(): string { return this.unidadMedida; }
  getPeso(): number | undefined { return this.peso; }
  getVolumen(): number | undefined { return this.volumen; }
  getSerieLote(): string | undefined { return this.serieLote; }
  getObservaciones(): string | undefined { return this.observaciones; }

  // Método para serializar a un objeto plano
  toPlainObject(): any {
    return {
      id: this.id?.toString(),
      productoId: this.productoId.toString(),
      codigoProducto: this.codigoProducto,
      descripcion: this.descripcion,
      cantidad: this.cantidad,
      unidadMedida: this.unidadMedida,
      peso: this.peso,
      volumen: this.volumen,
      serieLote: this.serieLote,
      observaciones: this.observaciones
    };
  }

  // Método de fábrica para crear desde un objeto plano
  static fromPlainObject(object: any): ItemGuia {
    return new ItemGuia(
      new Id(object.productoId),
      object.codigoProducto,
      object.descripcion,
      object.cantidad,
      object.unidadMedida,
      object.peso,
      object.volumen,
      object.serieLote,
      object.observaciones,
      object.id ? new Id(object.id) : undefined
    );
  }
}
