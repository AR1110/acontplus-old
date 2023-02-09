import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SistemaService } from '@app/services/config/sistema.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-sistema',
  templateUrl: './add-update-sistema.component.html',
  styleUrls: ['./add-update-sistema.component.css']
})
export class AddUpdateSistemaComponent implements OnInit {
  tipoRegistro:number = 1;
  dataForm!:FormGroup;

  constructor(
    private _fb: FormBuilder,
    private toast:ToastrService,
    private _sistemaSvc:SistemaService,
    private dialoRef:MatDialogRef<AddUpdateSistemaComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit: any,
  ) { }

  ngOnInit(): void {
    this.dataForm = this._fb.group({
      codigo:['', Validators.required],
      descripcion:['', Validators.required],
      urlSistema:['', Validators.required],
      hostApp:['', Validators.required],
      connectionStrings:['', Validators.required],
      estado:[false]
    });

    if(this.dataEdit){
      this.tipoRegistro=2;
      this.dataForm.controls["codigo"].setValue(this.dataEdit.codigo);
      this.dataForm.controls["descripcion"].setValue(this.dataEdit.descripcion);
      this.dataForm.controls["urlSistema"].setValue(this.dataEdit.urlSistema);
      this.dataForm.controls["hostApp"].setValue(this.dataEdit.hostApp);
      this.dataForm.controls["connectionStrings"].setValue(this.dataEdit.connectionStrings);
      this.dataForm.controls["estado"].setValue(this.dataEdit.estado);

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
    this._sistemaSvc.save(this.dataForm.value).subscribe(({payload})=>{
      console.log(payload)
      const parseResponse = JSON.parse(payload)[0];
      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
      if(parseResponse.code==="0"){
        this.dataForm.reset();
        this.dialoRef.close(this.tipoRegistro);
        this.toast.success(parseResponse.message);
      }
    })
  }

  update(){
    this._sistemaSvc.update(this.dataEdit.idSistema, this.dataForm.value).subscribe(({payload})=>{
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
