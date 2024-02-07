export const isValidField = <T>(field: T): T | null => {
  const invalidValues: ReadonlyArray<T | null | undefined | "" | 0> = ["", null, undefined, 0];

  return invalidValues.includes(field) ? null : field;
};


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
