import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlanCliente } from '@models/config/plan-cliente.model';
import { RolService } from '@services/admin/rol.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-duplicar-rol',
  templateUrl: './duplicar-rol.component.html',
  styleUrls: ['./duplicar-rol.component.css']
})
export class DuplicarRolComponent implements OnInit {
  dataForm!: FormGroup;
  planClientes: PlanCliente[]=[];

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _rSvc: RolService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private _dialogRef: MatDialogRef<DuplicarRolComponent>

  ) { }

  ngOnInit(): void {
    this._rSvc.getAllPlanCliente().subscribe(response=>{
      this.planClientes = response;
      console.log(response)
    })

    this.dataForm = this._fb.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      codLicencia: ''
    });

    console.log(this.data)
    this.dataForm.controls['codLicencia'].setValue(this.data.codLicencia)
    this.dataForm.controls['codLicencia'].disable();
  }

  duplicar(){
    if(this.dataForm.invalid){
      this._toastr.warning('Ingrese todos los campos requeridos');
      return
    }
    this.data.codigo = this.dataForm.value.codigo;
    this.data.descripcion = this.dataForm.value.descripcion;
    
    this._rSvc.duplicate(this.data.idRol, this.data).subscribe(response=>{
      if(response.code==="-2"){
        this._toastr.warning(response.message);
        return
      }
      if(response.code==="0"){
        this.dataForm.reset();
        this._dialogRef.close(response);
        this._toastr.success(response.message)
      }
    })



  }

}
