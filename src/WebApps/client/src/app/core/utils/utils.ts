export const isValidField = <T>(field: T): T | null => {
  const invalidValues: ReadonlyArray<T | null | undefined | "" | 0> = ["", null, undefined, 0];

  return invalidValues.includes(field) ? null : field;
};



export const getPermisosLocal = () => {
  let dataPermisos = localStorage.getItem("permisos");
  if(dataPermisos){
    dataPermisos = JSON.parse(dataPermisos)
  } 
  return dataPermisos;
}