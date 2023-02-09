import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioService } from '@services/admin/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {
  dataForm!:FormGroup;
  hidePassword:boolean= true;

  constructor(
    private _fb:FormBuilder,
    private _dialogRef: MatDialogRef<AddUsuarioComponent>,
    private _uSvc: UsuarioService,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.dataForm = this._fb.group({
      nroIdentificacion: ['', Validators.required],
      nombre:['', Validators.required],
      apellido:['', Validators.required],
      correo:['', [Validators.required, Validators.email]],
      nombreUsuario:['', Validators.required],
      contrasena:['', Validators.required],
      estado:[false],
    });
  }

  save(){
    if(this.dataForm.invalid){
      this._toastr.warning('Ingrese todos los campos requeridos');
      return
    }

    const nombreCompleto = this.dataForm.value.nombre + this.dataForm.value.apellido;
    this.dataForm.value.nombreCompleto = nombreCompleto;

    this._uSvc.save(this.dataForm.value).subscribe(response=>{
      console.log(response)
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
