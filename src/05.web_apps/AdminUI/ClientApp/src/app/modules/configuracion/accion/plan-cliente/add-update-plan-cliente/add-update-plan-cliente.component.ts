import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Entidad } from '@models/admin/entidad.model';
import { Licencia } from '@app/models/config/licencia.model';
import { Suscripcion } from '@models/config/suscripcion.model';
import { PlanClienteService } from '@services/config/plan-cliente.service';
import { ToastrService } from 'ngx-toastr';
import { zip } from 'rxjs';

@Component({
  selector: 'app-add-plan-cliente',
  templateUrl: './add-update-plan-cliente.component.html',
  styleUrls: ['./add-update-plan-cliente.component.css']
})
export class AddUpdatePlanClienteComponent implements OnInit {
  tipoRegistro=1;
  dataForm!:FormGroup;
  entidades:Entidad[]=[];
  licencias:Licencia[]=[];
  suscripciones:Suscripcion[]=[];

  constructor(
    private _fb:FormBuilder,
    private _pCSvc:PlanClienteService,
    private _dialogRef: MatDialogRef<AddUpdatePlanClienteComponent>,
    @Inject(MAT_DIALOG_DATA) private dataEdit:any,
    private _toastr:ToastrService
    ) { }

  ngOnInit(): void {
    zip(
      this._pCSvc.getAllEntidad('2'),
      this._pCSvc.getAllLicencia(),
      this._pCSvc.getAllSuscripcion()
      ).subscribe(response=>{
        const [entidades, licencias, suscripciones] = response;
        this.entidades     = entidades
        this.licencias     = licencias;
        this.suscripciones = suscripciones;
      })

    this.dataForm = this._fb.group({
      ruc:['', Validators.required],
      idLicencia:['', Validators.required],
      idSuscripcion:['', Validators.required],
      valor:['', Validators.required],
      estado:false
    });

    if(this.dataEdit){
      this.tipoRegistro=2;
      this.dataForm.controls['ruc'].setValue(this.dataEdit.ruc);
      this.dataForm.controls['ruc'].disable();
      this.dataForm.controls['idLicencia'].setValue(this.dataEdit.idLicencia);
      this.dataForm.controls['idLicencia'].disable();
      this.dataForm.controls['idSuscripcion'].setValue(this.dataEdit.idSuscripcion);
      this.dataForm.controls['valor'].setValue(this.dataEdit.valor);
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
    this._pCSvc.save(this.dataForm.value).subscribe(response=>{
      if(response.code==="-2"){
        this._toastr.warning(response.message);
      }
      if(response.code==="0"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message)
      }
    });
  }

  update(){
    this._pCSvc.update(this.dataEdit.idPlanCliente, this.dataForm.value).subscribe(response=>{
      if(response.code==="-2"){
        this._toastr.warning(response.message);
        return
      }
      if(response.code==="0"){
        this.dataForm.reset();
        this._dialogRef.close(this.tipoRegistro);
        this._toastr.success(response.message)
      }
    });
  }




}
