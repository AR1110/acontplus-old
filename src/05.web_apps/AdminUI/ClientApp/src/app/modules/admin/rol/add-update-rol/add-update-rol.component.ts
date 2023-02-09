import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { RolService } from '@app/services/admin/rol.service';
import { ToastrService } from 'ngx-toastr';
import { PlanCliente } from '@models/config/plan-cliente.model';

@Component({
  selector: 'app-add-update-rol',
  templateUrl: './add-update-rol.component.html',
  styleUrls: ['./add-update-rol.component.css']
})
export class AddUpdateRolComponent implements OnInit {
  tipoRegistro=1;
  dataForm!:FormGroup;
  planClientes: PlanCliente[]=[];

  constructor(
    private _fb: FormBuilder,
    private _rSvc: RolService,
    private _dialogRef: MatDialogRef<AddUpdateRolComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this._rSvc.getAllPlanCliente().subscribe(response=>{
      this.planClientes = response;
      console.log(response)
    })
    this.dataForm = this._fb.group({
      codigo:['', Validators.required],
      descripcion:['', Validators.required],
      idPlanCliente:['', Validators.required],
      estado:false
    });

    if(this.dataEdit){
      this.tipoRegistro = 2;
      this.dataForm.controls['codigo'].setValue(this.dataEdit.codigo);
      this.dataForm.controls['descripcion'].setValue(this.dataEdit.rol);
      this.dataForm.controls['idPlanCliente'].setValue(this.dataEdit.idPlanCliente);
      this.dataForm.controls['estado'].setValue(this.dataEdit.estado);
    }
  }


  saveAndUpdate(){
    if(this.dataForm.invalid){
      this._toastr.warning('Ingrese todos los campo requeridos');
      return
    }

    if(this.tipoRegistro===1){
      this.save();
    }else{
      this.update();
    }
  }


  save(){
    this._rSvc.save(this.dataForm.value).subscribe(response=>{
      console.log(response)
      if(response.code==='-1' || response.code=='-2'){
        this._toastr.warning(response.message, response.titleSms)
      }
      
      if(response.code==="0"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message)
      }
    })
  }

  update(){
    this._rSvc.updateRolCliente(this.dataForm.value).subscribe(response=>{
      console.log(response)

    })
    return
    this._rSvc.update(this.dataEdit.idPolitica, this.dataForm.value).subscribe(response=>{
      // if(response.code==="-2"){
      //   this._toastr.warning(response.message);
      //   return
      // }
      // if(response.code==="0"){
      //   this.dataForm.reset();
      //   this._dialogRef.close(this.tipoRegistro);
      //   this._toastr.success(response.message)
      // }
    })
  }

}
