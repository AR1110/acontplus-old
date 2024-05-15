export const isValidField = <T>(field: T): T | null => {
  let value:any = field
  if(typeof field==='string'){
    value = field.trim()
  }
  const invalidValues: ReadonlyArray<T | null | undefined | "" | 0> = ["", null, undefined, 0];

  return invalidValues.includes(value) ? null : value;
};

export const removeSpacesInValue = function(value: string) {
  return value.trim();
}

export const isValidEmail = function (valor: string) {
  return /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor);
}


export const getPermisosLocal = () => {
  let dataPermisos = localStorage.getItem("permisos");
  if (dataPermisos) {
    dataPermisos = JSON.parse(dataPermisos)
  }
  return dataPermisos;
}


export function isValidJSON(texto: string) {
  try {
    JSON.parse(texto);
    return true;
  } catch (error) {
    return false;
  }
}

