import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {ActionName, SubMenuItem} from "@domain/models/menu.model";
import {inject} from "@angular/core";
import {GetMenusUseCase} from "@domain/use-cases/menu/get-menus.use-case";




class PermissionState {
  actions: ActionName

  submenus:SubMenuItem[]
  constructor() {
    this.actions = new ActionName()
    this.submenus = []
  }
}

const initialPermissionState = new PermissionState()

export const PermissionStore = signalStore(
  {providedIn: 'root'},
  withState(initialPermissionState),
  withComputed(store=>({


  })),


  withMethods((store)=>({
    loadActions(route: string){
      let dataActions = store.submenus().find(m=>m.url===route);

      if(dataActions){
        patchState(store, () => ({
          actions: dataActions.actions
        }));
      }

    }


  })),

  withHooks({
    onInit(store, $getMenusUseCase = inject(GetMenusUseCase)) {
      $getMenusUseCase.execute().subscribe(response=>{
        let submenus = response.flatMap(m=>{
          return m.children && m.children.length>0 ? m.children: []
        })
        if(submenus && submenus.length>0){
          let dashboard:any = {
            url: 'dashboard',
            name: 'Dashboard',
            icon: 'home',
          }
          patchState(store, () => ({
            submenus: [dashboard, ...submenus]
          }));
        }
      })
    },
    onDestroy(store) {},
  })

)
