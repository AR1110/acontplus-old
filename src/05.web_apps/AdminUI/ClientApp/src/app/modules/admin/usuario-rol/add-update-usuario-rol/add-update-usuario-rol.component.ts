import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Entidad } from '@models/admin/entidad.model';
import { Rol } from '@app/models/admin/rol.model';
import { Usuario } from '@models/admin/usuario.model';
import { UsuarioRolService } from '@services/admin/usuario-rol.service';
import { ToastrService } from 'ngx-toastr';
import { zip } from 'rxjs';

@Component({
  selector: 'app-add-update-usuario-rol',
  templateUrl: './add-update-usuario-rol.component.html',
  styleUrls: ['./add-update-usuario-rol.component.css']
})
export class AddUpdateUsuarioRolComponent implements OnInit {
  tipoRegistro = 1;
  dataForm!:FormGroup;

  usuarios:Usuario[]=[];
  entidades:Entidad[]=[];
  roles:Rol[]=[];

  constructor(
    private _dialogRef: MatDialogRef<AddUpdateUsuarioRolComponent>,
    private _uRSvc:UsuarioRolService,
    private _fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any,
    private _toastr:ToastrService
  ) { }

  ngOnInit(): void {
    zip(
      this._uRSvc.getAllUsuario(2),
      this._uRSvc.getAllEntidad(2),
      this._uRSvc.getAllRol()
    ).subscribe(response=>{
      const [usuarios, entidades, roles] = response;
      this.usuarios  = usuarios
      this.entidades = entidades
      this.roles     = roles;

    })

    this.dataForm = this._fb.group({
      idUsuario:['', Validators.required],
      idEntidad:['', Validators.required],
      codRol:['', Validators.required],
      estado:false
    })

    if(this.dataEdit){
      this.tipoRegistro=2;
      this.dataForm.controls['idUsuario'].setValue(this.dataEdit.idUsuario);
      this.dataForm.controls['idUsuario'].disable();
      this.dataForm.controls['idEntidad'].setValue(this.dataEdit.idEntidad);
      this.dataForm.controls['idEntidad'].disable();
      this.dataForm.controls['codRol'].setValue(this.dataEdit.codRol);
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
    this._uRSvc.save(this.dataForm.value).subscribe(response=>{
      if(response.id==="0"){
        this._toastr.warning(response.message);
        return
      }
      if(response.id==="1"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message)
      }
    })
  }

  update(){
    this._uRSvc.update(this.dataEdit.idUsuarioRol, this.dataForm.value.codRol).subscribe(response=>{
      if(response.id==="0"){
        this._toastr.warning(response.message);
        return
      }
      if(response.id==="1"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message)
      }
    })
  }



}
