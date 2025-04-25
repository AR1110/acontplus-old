
export class PageNumber {
  private constructor(private readonly value: number) {}

  static create(raw: number): PageNumber {
    if (!Number.isInteger(raw) || raw < 1) {
      throw new Error('Número de página inválido (debe ser 1 o mayor)');
    }
    return new PageNumber(raw);
  }

  getValue(): number {
    return this.value;
  }
}
