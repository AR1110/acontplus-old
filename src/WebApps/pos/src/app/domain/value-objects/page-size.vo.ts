
export class PageSize {
  private constructor(private readonly value: number) {}

  static create(raw: number): PageSize {
    if (![10, 25, 50, 100].includes(raw)) {
      throw new Error('Tamaño de página inválido');
    }
    return new PageSize(raw);
  }

  getValue(): number {
    return this.value;
  }
}
