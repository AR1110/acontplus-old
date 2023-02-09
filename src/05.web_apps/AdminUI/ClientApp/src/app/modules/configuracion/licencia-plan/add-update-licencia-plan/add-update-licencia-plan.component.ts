import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Aplicacion } from '@models/config/aplicacion.model';
import { Licencia } from '@models/config/licencia.model';
import { LicenciaPlanService } from '@services/config/licencia-plan.service';
import { ToastrService } from 'ngx-toastr';
import { zip } from 'rxjs';

@Component({
  selector: 'app-add-update-licencia-plan',
  templateUrl: './add-update-licencia-plan.component.html',
  styleUrls: ['./add-update-licencia-plan.component.css']
})
export class AddUpdateLicenciaPlanComponent implements OnInit {
  tipoRegistro:number=1;
  dataForm!:FormGroup
  aplicaciones:Aplicacion[]=[];
  licencias:Licencia[]=[];

  constructor(
    private _fb: FormBuilder,
    private _lPlan: LicenciaPlanService,
    private toast:ToastrService,
    private dialogRef: MatDialogRef<AddUpdateLicenciaPlanComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any,

  ) { }

  ngOnInit(): void {
    zip(this._lPlan.getAllAplicacion(), this._lPlan.getAllLicencia()).subscribe(response=>{
      const [responseUno, responseDos] = response;
      this.aplicaciones = JSON.parse(responseUno.payload);
      this.licencias = JSON.parse(responseDos.payload);
      return
    });

    this.dataForm = this._fb.group({
      idAplicacion:['', Validators.required],
      idLicencia:['', Validators.required],
      costo:['', Validators.required],
      impuesto:['', Validators.required],
      descuento:['', Validators.required],
      estado:[false]
    });

    if(this.dataEdit){
      console.log(this.dataEdit)
      this.tipoRegistro=2;
      this.dataForm.controls['idAplicacion'].setValue(this.dataEdit.idAplicacion);
      this.dataForm.controls['idLicencia'].setValue(this.dataEdit.idLicencia);
      this.dataForm.controls['costo'].setValue(this.dataEdit.costo);
      this.dataForm.controls['impuesto'].setValue(this.dataEdit.impuesto);
      this.dataForm.controls['descuento'].setValue(this.dataEdit.descuento);
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
    this._lPlan.save(this.dataForm.value).subscribe(({payload})=>{
      console.log(payload)
      const parseResponse = JSON.parse(payload)[0];
      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
      if(parseResponse.code==="0"){
        this.dataForm.reset();
        this.dialogRef.close(this.tipoRegistro);
        this.toast.success(parseResponse.message)
      }
    })

  }


  update(){
    this._lPlan.update(this.dataEdit.idLicenciaPlan,  this.dataForm.value).subscribe(({payload})=>{
      const parseResponse = JSON.parse(payload)[0];
      if(parseResponse.code==="-2"){
        this.toast.warning(parseResponse.message);
        return
      }
      if(parseResponse.code==="0"){
        this.dataForm.reset();
        this.dialogRef.close(this.tipoRegistro);
        this.toast.success(parseResponse.message)
      }
    })
  }
}
