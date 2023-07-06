interface UserRoles {
  userId: number;
  roleId: number;
  companyId: number;
  role: string;
  companyUniqueId: string;
}
export interface User {
  username?: string;
  email?: string;
  roles: Array<UserRoles>;
}

export const UserEmptyState: User = {
  username: "",
  email: "",
  roles: [],
};

export interface UseAuth {
  actividad: string;
  companyId: number;
  entidad: string;
  fullName: string;
  idRol: number;
  image: string;
  jwtToken: string;
  nombreComercial: string;
  nroIdentificacion: string;
  role: string;
  ruc: string;
  userName: string;
}
