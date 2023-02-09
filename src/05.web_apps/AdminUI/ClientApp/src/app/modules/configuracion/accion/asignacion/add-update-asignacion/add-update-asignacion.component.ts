import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Accion } from '@models/config/accion.model';
import { AsignacionService } from '@services/config/asignacion.service';
import { ToastrService } from 'ngx-toastr';
import { zip } from 'rxjs';
import { AplicacionMenu } from '@app/models/config/aplicacion-menu.model';

@Component({
  selector: 'app-add-update-asignacion',
  templateUrl: './add-update-asignacion.component.html'
})
export class AddUpdateAsignacionComponent implements OnInit {
  tipoRegistro:number = 1;
  dataForm!:FormGroup;

  aplicacionesMenu:AplicacionMenu[]=[];
  acciones:Accion[] =[];

  constructor(
    private _fb:FormBuilder,
    private _asigSvc:AsignacionService,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any,
    private _dialogRef:MatDialogRef<AddUpdateAsignacionComponent>,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    zip(this._asigSvc.getAllAplicacionMenu(), this._asigSvc.getAllAction()).subscribe(response=>{
      this.aplicacionesMenu = response[0];
      this.acciones    = response[1];
    });

    this.dataForm = this._fb.group({
      idAplicacionMenu:['', Validators.required],
      idAccion:['', Validators.required],
      estado:false
    });

    if(this.dataEdit){
      this.tipoRegistro=2;
      this.dataForm.controls['idAplicacionMenu'].setValue(this.dataEdit.idAplicacionMenu);
      this.dataForm.controls['idAccion'].setValue(this.dataEdit.idAccion);
      this.dataForm.controls['estado'].setValue(this.dataEdit.estado);
    }
  }

  saveAndUpdate(){
    if(this.dataForm.invalid){
      this._toastr.warning('Ingrese todos los campos requeridos');
      return
    }

    if(this.tipoRegistro===1){
      this.save();
    }else{
      this.update();
    }
  }

  save(){
    this._asigSvc.save(this.dataForm.value).subscribe(response=>{
      if(response.code==="-2"){
        this._toastr.warning(response.message);
        return
      }
      if(response.code==="0"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message);
      }
    })
  }

  update(){
    this._asigSvc.update(this.dataEdit.idAsignacion, this.dataForm.value).subscribe(response=>{
      if(response.code==="-2"){
        this._toastr.warning(response.message);
        return
      }
      if(response.code==="0"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message);
      }
    })
  }




}
