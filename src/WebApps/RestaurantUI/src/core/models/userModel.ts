 
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
  establecimientos: string;
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
