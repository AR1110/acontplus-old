import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  } from '@app/models/config/aplicacion.model';

import { Sistema } from '@app/models/config/sistema.model';
import { ToastrService } from 'ngx-toastr';
import { AplicacionService } from 'src/app/services/config/aplicacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-update-aplicacion',
  templateUrl: './add-update-aplicacion.component.html',
})
export class AddUpdateAplicacionComponent implements OnInit {
  tipoRegistro:number=1;
  dataForm!:FormGroup;
  sistemas: Sistema[]=[];

  constructor(
    private formBuilder: FormBuilder,
    private aplicacionSvc: AplicacionService,
    @Inject(MAT_DIALOG_DATA) private updateData:any,
    private dialoRef: MatDialogRef<AddUpdateAplicacionComponent>,
    private toast:ToastrService

  ) { }



  ngOnInit(): void {
    this.getAllSistema();

    this.dataForm = this.formBuilder.group({
      idSistema: ['', [Validators.required]],
      codigo:['', Validators.required ],
      descripcion:['', Validators.required],
      estado:[false]
    });

    if(this.updateData){
      this.tipoRegistro = 2;
      this.dataForm.controls['idSistema'].setValue(this.updateData.idSistema);
      this.dataForm.controls['codigo'].setValue(this.updateData.codigo);
      this.dataForm.controls['descripcion'].setValue(this.updateData.descripcion);
      this.dataForm.controls['estado'].setValue(this.updateData.estado);
    }
  }

  getAllSistema(){
    this.aplicacionSvc.getAllSistema().subscribe(({payload})=>{
      this.sistemas = JSON.parse(payload);
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
    this.aplicacionSvc.save(this.dataForm.value).subscribe(({payload})=>{
      const parseResponse = JSON.parse(payload)[0];
      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
      if(parseResponse.code==="0"){
        this.dataForm.reset();
        this.dialoRef.close(this.tipoRegistro);
        this.toast.success(parseResponse.message)
      }
    })
  }

  update(){
    this.aplicacionSvc.update(this.updateData.idAplicacion, this.dataForm.value).subscribe(({payload})=>{
      const parseResponse = JSON.parse(payload)[0];
      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
      if(parseResponse.code==="0"){
        this.dataForm.reset();
        this.dialoRef.close(this.tipoRegistro);
        this.toast.success(parseResponse.message)
      }
    })
  }


}
