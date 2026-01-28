import { UserRoleResponse } from '@modules/config/data/models/user/user-role.model';

export class ListUserRoleMapper {
  static toJson<T>(parameters: T) {
    return JSON.stringify({
      tipo: 1,
      ...parameters,
    });
  }

  static fromJson(response: any): UserRoleResponse {
    const userCustomerRoles = response.userCustomerRoles || [];
    const data = userCustomerRoles.map((item: any, index: number) => {
      return {
        idUsuarioRol: item.idUsuarioRol,
        idUsuario: item.idUsuario,
        idEntidad: item.idEntidad,
        username: item.nombreUsuario,
        nroIdentificacion: item.nroIdentificacion,
        rucEmpresa: item.ruc,
        razonSocialEmpresa: item.razonSocial,
        estado: item.estado,
        roleName: item.roleName,
      };
    });
    return {
      data,
    };
  }
}
