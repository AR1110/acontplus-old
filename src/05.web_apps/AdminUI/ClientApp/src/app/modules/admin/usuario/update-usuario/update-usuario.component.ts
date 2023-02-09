import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioService } from '@services/admin/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-usuario',
  templateUrl: './update-usuario.component.html',
  styleUrls: ['./update-usuario.component.css']
})
export class UpdateUsuarioComponent implements OnInit {
  dataForm!:FormGroup;
  hidePassword:boolean= true;

  constructor(
    private _fb:FormBuilder,
    private _dialogRef: MatDialogRef<UpdateUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any,
    private _uSvc: UsuarioService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.dataForm = this._fb.group({
      nroIdentificacion: ['', Validators.required],
      nombreCompleto:['', Validators.required],
      correo:['', [Validators.required, Validators.email]],
      estado:[false],
    })

    if(this.dataEdit){
      this.dataForm.controls['nroIdentificacion'].setValue(this.dataEdit.nroIdentificacion);
      this.dataForm.controls['nombreCompleto'].setValue(this.dataEdit.nombreCompleto);
      this.dataForm.controls['correo'].setValue(this.dataEdit.correo);
      this.dataForm.controls['estado'].setValue(this.dataEdit.estado);
    }
  }

  update(){
    if(this.dataForm.invalid){
      this._toastr.warning('Ingrese todos los campos requeridos');
      return
    }

    this._uSvc.update(this.dataEdit.idUsuario, this.dataForm.value).subscribe(response=>{
      if(response.id==='0'){
        this._toastr.warning(response.message, response.titleSms)
      }

      if(response.id==="1"){
        this.dataForm.reset();
        this._dialogRef.close(1);
        this._toastr.success(response.message)
      }
    })
  }

}
