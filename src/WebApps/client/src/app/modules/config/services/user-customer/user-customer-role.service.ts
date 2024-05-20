import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CONFIG_PATHS } from "../../enums/config.enums";
import { HttpClient } from "@angular/common/http";
import {map, tap} from "rxjs";


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
        let menus = [...response.licenciaSubMenu, ...response.submenus]

        let menusResults = menus.reduce((acc:any, curr:any) => {
          // Buscar si ya existe un objeto con el id del menú actual
          let dataExist = acc.find((m:any) => m.id === curr.menuId);

          if (!dataExist) {
            // Si no existe, crear un nuevo objeto y agregarlo al acumulador
            acc.push({
              id: curr.menuId, // Usar curr.menuId aquí para mantener la estructura correcta
              name: curr.menu,
              code: curr.codeMenu,
              subMenus: [{
                subMenuId: curr.id,
                menuId: curr.menuId,
                name: curr.name,
                code: curr.code,
                actions: curr.actions && JSON.parse(curr.actions) || []
              }]
            });
          } else {
            // Si existe, agregar el submenú al array subMenus
            dataExist.subMenus.push({
              subMenuId: curr.id,
              menuId: curr.menuId,
              name: curr.name,
              code: curr.code,
              actions: curr.actions && JSON.parse(curr.actions) || []
            });
          }

          return acc; // No olvidar retornar el acumulador en cada iteración
        }, []);

        return {
          menus:menusResults,
          actions: response.actions
        }
      })
    )
  }



  updateAcceses<T>(userRoleId: number, data:T){
    return this.http.put(`${this.url}${userRoleId}`, {data})
  }

}
