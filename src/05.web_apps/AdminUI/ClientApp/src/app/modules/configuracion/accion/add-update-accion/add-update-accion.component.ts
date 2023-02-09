import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { AccionService } from '@services/config/accion.service';

@Component({
  selector: 'app-add-update-accion',
  templateUrl: './add-update-accion.component.html',
  styleUrls: ['./add-update-accion.component.css']
})
export class AddUpdateAccionComponent implements OnInit {
  tipoRegistro=1;
  dataForm!:any;

  constructor(
    private formBuilder:FormBuilder,
    private _aSvc:AccionService,
    private dialogRef: MatDialogRef<AddUpdateAccionComponent>,
    private toast:ToastrService,
    @Inject(MAT_DIALOG_DATA) private editData : any,
  ) { }

  ngOnInit(): void {
    if(this.tipoRegistro===1){
      this.dataForm = new FormGroup({
        codigo: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        estado: new FormControl(false)
      });
    }
    // this.dataForm = this.formBuilder.group({
    //   codigo:['', Validators.required],
    //   descripcion:['', Validators.required],
    //   estado:[false]
    // })

    if(this.editData){
      this.tipoRegistro = 2;
      this.dataForm = new FormGroup({
        codigo: new FormControl({value:'', disabled: true}, Validators.required),
        descripcion: new FormControl('', Validators.required),
        estado: new FormControl(false)
      });

      this.dataForm.controls["codigo"].setValue(this.editData.codigo);
      this.dataForm.controls["descripcion"].setValue(this.editData.descripcion);
      this.dataForm.controls["estado"].setValue(this.editData.estado);
    }


  }

  saveUpdate(){
    const tituloToast = this.tipoRegistro ===1?'Nuevo':'Editar';
    if(this.dataForm.invalid){
      this.toast.warning('Ingrese todos los campos requeridos', tituloToast);
      return
    }

    if(this,this.dataForm.valid){
      if(this.tipoRegistro===1){
        this.save();
      }else{
        this.update();
      }
    }
  }

  save(){
    this._aSvc.save(this.dataForm.value).subscribe({
      next: response=>{
        this.dataForm.reset();
        this.dialogRef.close(this.tipoRegistro);
        this.toast.success('Registrado correctamente');
      },error:error=>{
        this.toast.error(error.status)
      }
    })

  }

  update(){
    console.log(this.dataForm.value)
    this._aSvc.update(this.editData.idAccion, this.dataForm.value).subscribe({
      next: response=>{
        console.log(response)
        this.dataForm.reset();
        this.dialogRef.close(this.tipoRegistro);
        this.toast.success('Actualizado correctamente');
      },error:error=>{
        this.toast.error(error.status)
      }
    })
  }

}
