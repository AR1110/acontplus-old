



import { IMenu, ISubMenu } from "../../domain/models/menu.model";
import { ISubMenuEntity, MenuEntity} from "../entities/";
import { Mapper } from "@app/core/utils/mapper";


export class MenuMapper extends Mapper<MenuEntity, IMenu>{
  mapFrom(param: MenuEntity): IMenu {
    return {
      idMenu: param.idMenu,
      codigo: param.codigo,
      urlMenu: param.urlMenu,
      icono: param.icono,
      descripcion: param.descripcion,
      estado: param.estado
    }
  }

  mapTo(param: IMenu): MenuEntity {
    return {
      idMenu: param.idMenu,
      codigo: param.codigo,
      urlMenu: param.urlMenu,
      icono: param.icono,
      descripcion: param.descripcion,
      estado: param.estado
    }
  }

}


export class SubMenuMapper extends Mapper<ISubMenuEntity, ISubMenu>{
  mapFrom(param: ISubMenuEntity): ISubMenu {
    return {
      idSubMenu: param.idSubMenu,
      idMenu: param.idMenu,
      codigo: param.codigo,
      codMenu: param.codMenu,
      urlSubMenu: param.urlSubMenu,
      icono: param.icono,
      descripcion: param.descripcion,
      estado: param.estado
    }
  }

  mapTo(param: ISubMenu): ISubMenuEntity {
    return {
      idSubMenu: param.idSubMenu,
      idMenu: param.idMenu,
      codigo: param.codigo,
      codMenu: param.codMenu,
      urlSubMenu: param.urlSubMenu,
      icono: param.icono,
      descripcion: param.descripcion,
      estado: param.estado
    }
  }

}
