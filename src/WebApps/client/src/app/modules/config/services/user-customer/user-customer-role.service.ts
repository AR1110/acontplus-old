import { inject, Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CONFIG_PATHS } from "../../enums/config.enums";
import { HttpClient } from "@angular/common/http";
import {map, tap} from "rxjs";
import {Menu} from "@modules/config/models/menu.model";
import {SubMenuNode} from "@modules/config/models/sub-menu.model";


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
      tap(response=>{
        console.log(response)
      }),
      map((response: any)=>{
        let menus: Menu[]= response.menus.map((m:any)=>{
          let subMenusNode = response.submenus.filter((sm:any)=>sm.menuId===m.id)

          return {
            id: m.id,
            code: m.code,
            url: m.url,
            icon:m.icon,
            name:m.name,
            submenu: m.submenu,
            subMenusNode
          }
        })
        return {
          menus,
        }
      })
    )
  }
}
