
import {inject, Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import {MenuRepository} from "@domain/repositories/menu.repository";
import {StorageRepository} from "@domain/repositories/storage.repository";
import {MenuItem, SubMenuItem} from "@domain/models/menu.model";
import {TokenUseCase} from "@domain/use-cases/token.use-case";
import {LocalStorageRepositoryImpl} from "@data/local/storage/local-storage.repository.impl";
import {isValidJSON} from "@domain/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class MenuLocalStorageRepositoryImpl implements MenuRepository {
  private readonly MENU_KEY = 'app_menus';
  private $tokenUseCase = inject(TokenUseCase)
  private storageService = inject(LocalStorageRepositoryImpl)




  getMenus(): Observable<MenuItem[]> {
    const userData = this.$tokenUseCase.getUserData() as any;
    if(!userData) return of([])

    const menus = userData.menus || [];
    const submenus = userData.submenus || [];


    const submenusResult = submenus.map((sm:any)=>{
      let actions = {}
      if(isValidJSON(sm.actions)){
        const tempActions = JSON.parse(sm.actions) || [];
        let actionsName = tempActions.map((x:any) => x.name);
        actions = actionsName.reduce((obj:any, name: string) => {
          obj[name] = true;
          return obj;
        }, {});

      }
      return {
        ...sm,
        actions
      }
    })

    const result = menus.filter((m:any)=>m.code==='POS').map((m:any)=>{
        m.children = submenusResult.filter((sm: any)=>sm.menuId===m.id)

      return m;
    })

    return of(result);
  }

  getSubmenusByParentId(parentId: string): Observable<SubMenuItem[]> {
    // const menus = this.storageService.get<MenuItem[]>(this.MENU_KEY) || [];
    //
    // // Función recursiva para buscar el menú padre por ID
    // const findParentMenu = (items: MenuItem[], id: string): MenuItem | null => {
    //   for (const item of items) {
    //     if (item.id === id) {
    //       return item;
    //     }
    //     if (item.children && item.children.length > 0) {
    //       const found = findParentMenu(item.children, id);
    //       if (found) return found;
    //     }
    //   }
    //   return null;
    // };
    //
    // const parentMenu = findParentMenu(menus, parentId);
    // return of(parentMenu?.children || []);
    return of([])
  }
}
