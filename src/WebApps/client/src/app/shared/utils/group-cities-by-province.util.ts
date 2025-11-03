import { ProvinciaCiudad } from '@shared/models/ciudad.interface';

export const groupCitiesByProvinceUtil = (ciudades: any[]): ProvinciaCiudad[] => {
  const provincias = ciudades.reduce(
    (acc, ciudad) => {
      // Agrupando las ciudades por provincia
      if (!acc[ciudad.provincia]) {
        acc[ciudad.provincia] = [];
      }
      acc[ciudad.provincia].push(ciudad);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Transformar el objeto agrupado en un arreglo de objetos
  return Object.keys(provincias).map((provincia) => ({
    provincia,
    ciudades: provincias[provincia],
  }));
};
