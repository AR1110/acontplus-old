import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AccesoMenuService } from '@app/services/admin/acceso-menu.service';
import { AccesoMenu, AccesoMenuAccion, AccesoMenuSubMenu} from '@app/models/admin/acceso-menu.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-acceso-menu',
  templateUrl: './acceso-menu.component.html',
  styleUrls: ['./acceso-menu.component.css'],
})


export class AccesoMenuComponent implements OnInit {
  menus: AccesoMenu[]=[];
  subMenus:AccesoMenuSubMenu[]=[];
  acciones:AccesoMenuAccion[]=[];
  dataUsuarioRol:any;

  constructor(
    private _accMSvc: AccesoMenuService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _toastr:ToastrService,
    private _dialogRef:MatDialogRef<AccesoMenuComponent>
  ) { }

  ngOnInit(): void {
    this.dataUsuarioRol = this.data;
    const codRol = this.data.codigo

    this._accMSvc.getAll({codRol}).subscribe(response=>{
      this.menus    = JSON.parse(response[0].menu).map((menu:AccesoMenu)=>{
        return {
          ...menu,
          isExpanded:false,
          subMenus:[]
        }
      });

      this.subMenus = JSON.parse(response[0].subMenu);
      this.acciones = JSON.parse(response[0].accion);
    })
  }


  toggleMenu(item:AccesoMenu){
    if(item.subMenus.length>0) return
    const subMenus = this.subMenus.filter(subMenu=>subMenu.codMenu === item.codMenu);

    item.subMenus = subMenus.map(subMenu=>{
      return {
        ...subMenu,
        acciones: this.acciones.filter(accion=>accion.codSubMenu===subMenu.codSubMenu)
      }
    });
  }

  updateAllCompleteAccion(subMenu:AccesoMenuSubMenu) {
    if(subMenu.acciones.every(accion=>!accion.estado)){
      subMenu.estado= false
      return
    }
    subMenu.estado = true;
  }

  setAllAccion(checkedSubMenu: boolean, subMenu:AccesoMenuSubMenu) {
    subMenu.estado = checkedSubMenu;
    subMenu.acciones.forEach(accion=>(accion.estado=checkedSubMenu));
  }


  saveAndUpdate(){
    // let subMenus = [];
    // let acciones = [];

    // for(let item of this.menus){
    //   subMenus.push(item.subMenus);
    //   for(let subMenu of item.subMenus){
    //     acciones.push(subMenu.acciones)
    //   }
    // }

    //  subMenus =  subMenus.flat();
    //  acciones =  acciones.flat();

    // this._accMSvc.update(subMenus, acciones).subscribe(response=>{
    //   if(response.code==="0"){
    //     this._dialogRef.close();
    //     this._toastr.success(response.message);

    //   }
    //   if(response.id==="-2"){
    //     this._toastr.warning(response.message)
    //   }
    // })


  }


}
