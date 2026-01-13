import {
  UserCustomerRole,
  UserCustomerRoleAccessResponse,
} from '@modules/config/data/models/user-customer/user-customer-role.model';
import { isValidJSON } from '@core/utils/utils';

function groupByParent(items: any[]) {
  // Separar padres e hijos
  const parents = items.filter((item) => !item.parentId);
  const children = items.filter((item) => item.parentId);

  // Agrupar hijos por parentId
  const childrenByParent = children.reduce((acc, child) => {
    if (!acc[child.parentId]) {
      acc[child.parentId] = [];
    }
    acc[child.parentId].push(child);
    return acc;
  }, {});

  // Construir árbol
  return parents.map((parent) => ({
    ...parent,
    children: childrenByParent[parent.menuId] || [],
  }));
}

export class ListAccessUserCustomerRoleMapper {
  static toJson(parameters: Partial<UserCustomerRole>) {
    return JSON.stringify({
      tipo: 2,
      idUsuarioRol: parameters.userRoleId,
    });
  }

  static fromJson(response: any): UserCustomerRoleAccessResponse {
    const processMenuActions = (actionsString: string) => {
      if (!actionsString || !isValidJSON(actionsString)) return [];

      const actions = JSON.parse(actionsString);
      return actions
        .filter((item: any) => item.name)
        .map((item: any) => ({
          ...item,
          level: 3,
        }));
      // return actions.reduce((obj: any, action: any) => {
      //
      //   if(action.name){
      //     obj[action.name] = true;
      //   }
      //   return obj;
      // }, {});
    };

    const menusWithActions = groupByParent(response.menus || []).map((menu) => ({
      ...menu,
      level: 1,
      actions: processMenuActions(menu.actions),
      children:
        menu.children?.map((child: any) => ({
          ...child,
          level: 2,
          children: processMenuActions(child.actions),
        })) || [],
    }));

    return {
      menus: menusWithActions,
      actions: response.actions || [],
    };
  }

  // static fromJson(response: any): UserCustomerRoleAccessResponse {
  //   console.log(response)
  //   const menus = response.menus.map((sm: any) => {
  //     let actions = isValidJSON(sm.actions) ? JSON.parse(sm.actions) : [];
  //     const unique = generateUuidv4();
  //     actions = actions.map((a: any) => {
  //       return {
  //         ...a,
  //         unique,
  //         level: 3,
  //         //       sub
  //       };
  //     });
  //
  //     sm.unique = unique;
  //     return {
  //       ...sm,
  //       children: actions,
  //     };
  //   });
  //
  //   const menusResults = menus.reduce((acc: any, curr: any) => {
  //     // Buscar si ya existe un objeto con el id del menú actual
  //     const dataExist = acc.find((m: any) => m.id === curr.menuId);
  //     const actions = curr.children || [];
  //     const isActive = actions.some(
  //       (a: any) => a.menuId === curr.menuId && a.enabled,
  //     );
  //
  //     if (!dataExist) {
  //       // Si no existe, crear un nuevo objeto y agregarlo al acumulador
  //       acc.push({
  //         id: curr.menuId, // Usar curr.menuId aquí para mantener la estructura correcta
  //         name: curr.menuName,
  //         code: curr.menuCode,
  //         isActive,
  //         level: 1,
  //         children: [
  //           {
  //             unique: curr.unique,
  //             id: curr.menuId,
  //             menuId: curr.menuId,
  //             name: curr.name,
  //             code: curr.code,
  //             children: structuredClone(actions),
  //             isActive,
  //             level: 2,
  //           },
  //         ],
  //       });
  //     } else {
  //       // Si existe, agregar el submenú al array subMenus
  //       dataExist.children.push({
  //         unique: curr.unique,
  //         id: curr.menuId,
  //         menuId: curr.menuId,
  //         name: curr.name,
  //         code: curr.code,
  //         children: structuredClone(actions),
  //         isActive,
  //         level: 2,
  //       });
  //     }
  //
  //     return acc; // No olvidar retornar el acumulador en cada iteración
  //   }, []);
  //
  //   let actions = response.actions || [];
  //   return {
  //     menus: menusResults,
  //     actions,
  //   };
  // }

  // static fromJson(response: any): UserCustomerRoleAccessResponse {
  //   let subMenus = response.submenus.map((sm:any)=>{
  //     let actions = JSON.parse(sm.actions) ?? []
  //     let unique = generateUuidv4()
  //     actions = actions.map((a:any)=>{
  //       return {
  //         ...a,
  //         codeAction: a.code,
  //         isActive: true,
  //         unique
  //         //       sub
  //       }
  //     })
  //
  //     sm.unique = unique;
  //     return {
  //       ...sm,
  //       actions
  //     }
  //   })
  //
  //   let licenciaSubMenus = response.licenciaSubMenu.map((sm:any)=>{
  //     let actions = JSON.parse(sm.actions) ?? []
  //     let unique = generateUuidv4()
  //     actions = actions.map((a:any)=>{
  //       return {
  //         ...a,
  //         codeAction: a.code,
  //         isActive: false,
  //         unique
  //       }
  //     })
  //
  //     sm.unique = unique;
  //     return {
  //       ...sm,
  //       actions
  //     }
  //   })
  //
  //   let menus = [...subMenus,...licenciaSubMenus ]
  //
  //   let menusResults = menus.reduce((acc:any, curr:any) => {
  //     // Buscar si ya existe un objeto con el id del menú actual
  //     let dataExist = acc.find((m:any) => m.id === curr.menuId);
  //
  //     if (!dataExist) {
  //       let actions =  curr.actions || [];
  //       // Si no existe, crear un nuevo objeto y agregarlo al acumulador
  //       acc.push({
  //         id: curr.menuId, // Usar curr.menuId aquí para mantener la estructura correcta
  //         name: curr.menu,
  //         code: curr.codeMenu,
  //         subMenus: [{
  //           unique: curr.unique,
  //           menuId: curr.id,
  //           menuId: curr.menuId,
  //           name: curr.name,
  //           code: curr.code,
  //           actions,
  //           children: structuredClone(actions),
  //           isActive: curr.isActive
  //         }]
  //       });
  //     } else {
  //       let actions = curr.actions  || [];
  //       // Si existe, agregar el submenú al array subMenus
  //       dataExist.subMenus.push({
  //         unique: curr.unique,
  //         menuId: curr.id,
  //         menuId: curr.menuId,
  //         name: curr.name,
  //         code: curr.code,
  //         actions,
  //         children: structuredClone(actions),
  //         isActive: curr.isActive
  //       });
  //     }
  //
  //     return acc; // No olvidar retornar el acumulador en cada iteración
  //   }, []);
  //
  //   let actions = response.actions.map((item:any)=>{
  //     let {code, ...restItem} = item;
  //     return {
  //       ...restItem,
  //       codeAction: code,
  //     }
  //   })
  //
  //   return {
  //     menus:menusResults,
  //     actions: actions
  //   }
  // }
}
