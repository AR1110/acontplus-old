export const isValidField = <T>(field: T): T | null => {
  let value: any = field;
  if (typeof field === 'string') {
    value = field.trim();
  }
  const invalidValues: readonly (T | null | undefined | '' | 0)[] = ['', null, undefined, 0];

  return invalidValues.includes(value) ? null : value;
};

export const removeSpacesInValue = function (value: string) {
  return value.trim();
};

export const isValidEmail = function (valor: string) {
  return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
};

export const getPermisosLocal = () => {
  let dataPermisos = localStorage.getItem('permisos');
  if (dataPermisos) {
    dataPermisos = JSON.parse(dataPermisos);
  }
  return dataPermisos;
};

export function isValidJSON(texto: string) {
  try {
    JSON.parse(texto);
    return true;
  } catch (error) {
    return false;
  }
}

export function getValidId(id?: number): number | null | undefined {
  if (id === undefined) return undefined;
  return id > 0 ? id : null;
}

export const imgDefault = () => '/assets/images/img-default.png';

const isNumber = (value: string | number): boolean => {
  const regex = /^\d+$/;
  // Convertimos el valor a string para evaluar con la expresión regular
  return regex.test(value.toString());
};

export class ValidatorUtils {
  static isValidField<T>(field: T): T | null {
    let value: any = field;
    if (typeof field === 'string') {
      value = field.trim();
    }
    const invalidValues: readonly (T | null | undefined | '' | 0)[] = ['', null, undefined, 0];
    return invalidValues.includes(value) ? null : value;
  }

  static removeSpacesInValue(value: string): string {
    return value.trim();
  }

  static isValidEmail(valor: string): boolean {
    return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
  }

  static getPermisosLocal(): any {
    const dataPermisos = localStorage.getItem('permisos');
    return dataPermisos ? JSON.parse(dataPermisos) : null;
  }

  static isValidJSON(texto: string): boolean {
    try {
      JSON.parse(texto);
      return true;
    } catch (error) {
      return false;
    }
  }

  static getValidId(id: number): number | null {
    return id > 0 ? id : null;
  }

  static imgDefault(): string {
    return '/assets/images/img-default.png';
  }

  static isNumber(value: string | number): boolean {
    const regex = /^\d+$/;
    return regex.test(value.toString());
  }

  static validAndFormatedRangeSequential(cadena: string): string | null {
    // Verifica si la cadena contiene solo números.
    const formatoValido = /^\d+$/;

    // Si la cadena solo contiene números, la formateamos a "xxx-xxx".
    if (formatoValido.test(cadena)) {
      cadena = `${cadena}-${cadena}`; // Se agrega el guión entre la cadena duplicada.
    }

    // Validamos que la cadena siga el formato "xxx-xxx" (números seguidos de un guion y más números).
    const formatoValidoFinal = /^\d+-\d+$/;

    // Si la cadena es válida, la devolvemos; de lo contrario, retornamos null.
    return formatoValidoFinal.test(cadena) ? cadena : null;
  }
}



export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};
