import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LicenciaService } from '@app/services/config/licencia.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-licencia',
  templateUrl: './add-update-licencia.component.html',
  styleUrls: ['./add-update-licencia.component.css']
})
export class AddUpdateLicenciaComponent implements OnInit {
  tipoRegistro:number = 1;
  dataForm!:FormGroup;

  constructor(
    private _fb: FormBuilder,
    private toast: ToastrService,
    private _lSvc: LicenciaService,
    private dialogRef: MatDialogRef<AddUpdateLicenciaComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any
  ) { }

  ngOnInit(): void {
      this.dataForm = this._fb.group({
        codigo: ['', Validators.required],
        titulo: ['', Validators.required],
        descripcion: ['', Validators.required],
        estado:[false]
      });

      if(this.dataEdit){
        this.tipoRegistro=2;
        this.dataForm.controls['codigo'].setValue(this.dataEdit.codigo);
        this.dataForm.controls['codigo'].disable()
        this.dataForm.controls['titulo'].setValue(this.dataEdit.titulo);
        this.dataForm.controls['descripcion'].setValue(this.dataEdit.descripcion);
        this.dataForm.controls['estado'].setValue(this.dataEdit.estado);
      }

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
    this._lSvc.save(this.dataForm.value).subscribe(({payload})=>{
      const parseResponse = JSON.parse(payload)[0];
      if(parseResponse.code==="0"){
        this.toast.success(parseResponse.message);
        this.dialogRef.close(this.tipoRegistro);
        this.dataForm.reset();
        return
      }
      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
    })
  }

  update(){
    this._lSvc.update(this.dataEdit.idLicencia, this.dataForm.value).subscribe(({payload})=>{
      const parseResponse = JSON.parse(payload)[0];
      if(parseResponse.code==="0"){
        this.toast.success(parseResponse.message);
        this.dialogRef.close(this.tipoRegistro);
        this.dataForm.reset();
        return
      }
      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
    })
  }



}
