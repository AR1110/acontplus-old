export interface CompanyList {
  idEntidad: number;
  razonSocial: string;
  ruc: string;
  nombreComercial: string;
  telefono?: string;
  estado: boolean;
  email?: string;
  direccion: string;
  idCiudad: number;
  nomEstado: string;
  emails: string[];
  telefonos: string[];
}

export interface ListCompanyResponse {
  data: CompanyList[];
}
