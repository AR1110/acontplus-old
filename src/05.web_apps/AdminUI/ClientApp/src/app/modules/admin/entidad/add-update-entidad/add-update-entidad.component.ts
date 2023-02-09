import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntidadService } from '@app/services/admin/entidad.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-entidad',
  templateUrl: './add-update-entidad.component.html',
  styleUrls: ['./add-update-entidad.component.css']
})
export class AddUpdateEntidadComponent implements OnInit {
  tipoRegistro=1;
  dataForm!:FormGroup;

  constructor(
    private _fb:FormBuilder,
    private _eSvc: EntidadService,
    private _dialogRef: MatDialogRef<AddUpdateEntidadComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any,
    private _toastr:ToastrService

  ) { }

  ngOnInit(): void {
    this.dataForm = this._fb.group({
      ruc:['', [Validators.pattern(/[0-9\+\-\ ]/), Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
      razonSocial:['', Validators.required],
      nombreComercial:['', Validators.required],
      email:['', [Validators.email]],
      telefono: '',
      direccion:'',
      estado:false,
    });

    if(this.dataEdit){
      this.tipoRegistro = 2;
      this.dataForm.controls['ruc'].setValue(this.dataEdit.ruc)
      this.dataForm.controls['razonSocial'].setValue(this.dataEdit.razonSocial)
      this.dataForm.controls['nombreComercial'].setValue(this.dataEdit.nombreComercial)
      this.dataForm.controls['email'].setValue(this.dataEdit.correo)
      this.dataForm.controls['telefono'].setValue(this.dataEdit.telefono)
      this.dataForm.controls['direccion'].setValue(this.dataEdit.direccion)
      this.dataForm.controls['estado'].setValue(this.dataEdit.estado)
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
    this._eSvc.save(this.dataForm.value).subscribe(response=>{
      if(response.id==='0'){
        this._toastr.warning(response.message, response.titleSms)
      }

      if(response.id==="1"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message)
      }

    })
  }

  update(){
    this._eSvc.update(this.dataEdit.idEntidad, this.dataForm.value).subscribe(response=>{
      if(response.id==='0'){
        this._toastr.warning(response.message, response.titleSms)
      }

      if(response.id==="1"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message)
      }
    })
  }


}
