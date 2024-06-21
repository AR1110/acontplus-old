import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CONFIG_PATHS } from "../../enums/config.enums";
import { HttpClient } from "@angular/common/http";
import {map, tap} from "rxjs";
import {generateUuidv4} from "@core/utils/generate-uuidv4";


@Injectable({
  providedIn: 'root'
})
export class UserCustomerRoleService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE}`;
  private http = inject(HttpClient)

  getAll<T>(data: T) {
    let json = JSON.stringify({
      ...data,
      tipo: 1
    })
    return this.http.get(`${this.url}?json=${json}`)
  }


  getAccesses(idUsuarioRol:number){
    let json = JSON.stringify({
      idUsuarioRol,
      tipo: 2
    })
    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response: any)=>{
        console.log(response)
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
      })
    )
  }



  updateAcceses<T>(userRoleId: number, data:T){
    return this.http.put(`${this.url}${userRoleId}`, {data})
  }

}
