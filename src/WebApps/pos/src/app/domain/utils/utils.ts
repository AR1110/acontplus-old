import { SRI_IDENTIFICATION_CODE } from "@domain/enums/main.enum";

export const getValidId = (id: number) => id > 0 ? id : null;
export const isValidField = <T>(field: T): T | null => {
  let value: any = field
  if (typeof field === 'string') {
    value = field.trim()
  }
  const invalidValues: ReadonlyArray<T | null | undefined | "" | 0> = ["", null, undefined, 0];

  return invalidValues.includes(value) ? null : value;
};

export const isValidEmail = function (valor: string) {
  return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
}


export function sanitizeAndEncodeURIComponent(value: string): string {
  // Remplazar caracteres especiales con espacios en blanco
  const sanitizedValue = value.replace(/[%&]/g, '');

  // Codificar el valor modificado
  const encodedValue = encodeURIComponent(sanitizedValue);

  return encodedValue;
}


export function indexById<T>(items: T[], getKey: (item: T) => string | number): Record<string | number, T> {
  const data: Record<string | number, T> = {};
  items.forEach(item => {
    data[getKey(item)] = item;
  });
  return data;
}



export const agruparPorProvinciaUtil = function (ciudades: any) {
  let provincias: any = {};
  ciudades.forEach(function (ciudad: any) {
    if (!provincias[ciudad.provincia]) {
      provincias[ciudad.provincia] = [];
    }
    provincias[ciudad.provincia].push(ciudad);
  });
  return Object.keys(provincias).map(function (provincia) {
    return { provincia: provincia, ciudades: provincias[provincia] };
  });
}


export const truncateNumber = function (number: number, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.floor(number * factor) / factor;
}




export const imgDefault:string = 'product-default.png'


export const consumirFinalSuperaElValorPermitido = function (codTipoIdentificacion: string, valor: number): boolean {
  return codTipoIdentificacion === SRI_IDENTIFICATION_CODE.CONSUMIDOR_FINAL && valor > 50;
}

export const messageSuperaElValorTotalPermitido = `La factura supera los 50 USD de importe total por cuanto no puede ser emitida a nombre del CONSUMIDOR FINAL`


export const truncateText = function (text: string | undefined, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
}


export const  isValidJSON = function (texto: string): boolean {
  try {
    JSON.parse(texto);
    return true;
  } catch (error) {
    return false;
  }
}
