import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu } from '@models/config/menu.model';
import { Aplicacion } from '@models/config/aplicacion.model';
import { Submenu } from '@models/config/submenu.model';
import { AplicacionMenuService } from '@services/config/aplicacion-menu.service';
import { zip } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-update-aplicacion-menu',
  templateUrl: './add-update-aplicacion-menu.component.html',
  styleUrls: ['./add-update-aplicacion-menu.component.css']
})
export class AddUpdateAplicacionMenuComponent implements OnInit {
  tipoRegistro:number=1;
  dataForm!:FormGroup;

  aplicaciones:Aplicacion[]=[];
  menus:Menu[]=[];
  subMenus:Submenu[]=[];

  constructor(
    private _fb:FormBuilder,
    private _aMSvc:AplicacionMenuService,
    private toast:ToastrService,
    private dialogRef: MatDialogRef<AddUpdateAplicacionMenuComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any
  ) { }

  ngOnInit(): void {
    zip(this._aMSvc.getAllAplicacion(), this._aMSvc.getAllMenu()).subscribe(response=>{
      this.aplicaciones = response[0];
      this.menus = response[1];
    })

    this.dataForm = this._fb.group({
      idAplicacion:['', Validators.required],
      idMenu:['', Validators.required],
      idSubMenu:['', Validators.required],
      estado:[false]
    });

    if(this.dataEdit){
      this.tipoRegistro = 2;
      this.getSubMenu();

      this.dataForm.controls['idAplicacion'].setValue(this.dataEdit.idAplicacion);
      this.dataForm.controls['idMenu'].setValue(this.dataEdit.idMenu);
      this.dataForm.controls['idSubMenu'].setValue(this.dataEdit.idSubMenu);
      this.dataForm.controls['estado'].setValue(this.dataEdit.estado);

    }
  }

  getSubMenu(){
    const idMenu = this.tipoRegistro===1? this.dataForm.value.idMenu:this.dataEdit.idMenu;
    this._aMSvc.getSubMenuByMenu(idMenu).subscribe(response=>{
      this.subMenus = response;
    })
  }

  saveAndUpdate(){
    if(this.dataForm.invalid){
      this.toast.warning('Ingrese todos los campos requeridos');
      return
    }

    if(this.tipoRegistro===1){
      this.save();
    }else{
      this.update();
    }
  }

  save(){
    this._aMSvc.save(this.dataForm.value).subscribe(response=>{
      if(response.code==="-2"){
        this.toast.warning(response.message);
        return
      }
      if(response.code==="0"){
        this.dataForm.reset();
        this.dialogRef.close(this.tipoRegistro);
        this.toast.success(response.message)
      }
    })
  }

  update(){
    this._aMSvc.update(this.dataEdit.idAplicacionMenu, this.dataForm.value).subscribe(response=>{
      if(response.code==="-2"){
        this.toast.warning(response.message);
        return
      }
      if(response.code==="0"){
        this.dataForm.reset();
        this.dialogRef.close(this.tipoRegistro);
        this.toast.success(response.message)
      }
    })
  }


}
