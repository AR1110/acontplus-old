export interface Establecimiento {
  codEstab_Asig: string;
  idUsuarioRol: string;
  codEstab: string;
  predeterminado: boolean;
  idEstablecimiento: number;
  ruc: number;
  nombreComercial: string;
  estab: number;
  obligadoContabilidad: string;
  dirEstablecimiento: string;
  contribuyenteRimpe: string;
  actividad: string;
}

export interface UserData {
  idRol: number;
  userName: string;
  fullName: string;
  nroIdentificacion: string;
  companyId: number;
  ruc: string;
  image: string;
  entidad: string;
  nombreComercial: string;
  role: string;
  actividad: string;
  jwtToken: string;
}

export interface DataLogin {
  establecimientos: Array<Establecimiento>;
  menus: string;
  subMenus: string;
  userData: Array<UserData>;
}

export const UserEmptyState: UserData = {
  idRol: 0,
  userName: "",
  fullName: "",
  nroIdentificacion: "",
  companyId: 0,
  ruc: "",
  image: "",
  entidad: "",
  nombreComercial: "",
  role: "",
  actividad: "",
  jwtToken: "",
};
