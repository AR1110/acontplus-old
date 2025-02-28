

export class NumberUtil {

  static esNumeroValido(valor: string | number): boolean {
    // Si el valor es un número, lo convertimos a string para aplicar la expresión regular
    if (typeof valor === 'number') {
      valor = valor.toString();
    }

    // Validación de si el valor es un número válido usando la expresión regular
    return /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(valor);
  }


}
