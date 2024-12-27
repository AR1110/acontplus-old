export interface Ciudad{
  idCiudad:number;
  descripcion:string;
}


export interface ProvinciaCiudad {
  provincia: string;
  ciudades: Ciudad[];
}
