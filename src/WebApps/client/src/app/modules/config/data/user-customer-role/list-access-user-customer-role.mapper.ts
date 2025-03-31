import {
  UserCustomerRole, UserCustomerRoleAccessResponse,
} from "@modules/config/domain/models/user-customer/user-customer-role.model";
import {generateUuidv4} from "@core/utils/generate-uuidv4";

export class ListAccessUserCustomerRoleMapper {

  static toJson (parameters:Partial<UserCustomerRole>){
    return JSON.stringify({
      tipo: 2,
      idUsuarioRol: parameters.userRoleId
    })
  }

  static fromJson(response: any): UserCustomerRoleAccessResponse {
    let subMenus = response.submenus.map((sm:any)=>{
      let actions = JSON.parse(sm.actions) ?? []
      let unique = generateUuidv4()
      actions = actions.map((a:any)=>{
        return {
          ...a,
          codeAction: a.code,
          enabled: true,
          unique
          //       sub
        }
      })

      sm.unique = unique;
      return {
        ...sm,
        actions
      }
    })

    let licenciaSubMenus = response.licenciaSubMenu.map((sm:any)=>{
      let actions = JSON.parse(sm.actions) ?? []
      let unique = generateUuidv4()
      actions = actions.map((a:any)=>{
        return {
          ...a,
          codeAction: a.code,
          enabled: false,
          unique
        }
      })

      sm.unique = unique;
      return {
        ...sm,
        actions
      }
    })

    let menus = [...subMenus,...licenciaSubMenus ]

    let menusResults = menus.reduce((acc:any, curr:any) => {
      // Buscar si ya existe un objeto con el id del menú actual
      let dataExist = acc.find((m:any) => m.id === curr.menuId);

      if (!dataExist) {
        let actions =  curr.actions || [];
        // Si no existe, crear un nuevo objeto y agregarlo al acumulador
        acc.push({
          id: curr.menuId, // Usar curr.menuId aquí para mantener la estructura correcta
          name: curr.menu,
          code: curr.codeMenu,
          subMenus: [{
            unique: curr.unique,
            subMenuId: curr.id,
            menuId: curr.menuId,
            name: curr.name,
            code: curr.code,
            actions,
            children: structuredClone(actions),
            enabled: curr.enabled
          }]
        });
      } else {
        let actions = curr.actions  || [];
        // Si existe, agregar el submenú al array subMenus
        dataExist.subMenus.push({
          unique: curr.unique,
          subMenuId: curr.id,
          menuId: curr.menuId,
          name: curr.name,
          code: curr.code,
          actions,
          children: structuredClone(actions),
          enabled: curr.enabled
        });
      }

      return acc; // No olvidar retornar el acumulador en cada iteración
    }, []);

    let actions = response.actions.map((item:any)=>{
      let {code, ...restItem} = item;
      return {
        ...restItem,
        codeAction: code,
      }
    })

    return {
      menus:menusResults,
      actions: actions
    }
  }
}
