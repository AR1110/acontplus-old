
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SuscripcionService } from '@app/services/config/suscripcion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-suscripcion',
  templateUrl: './add-update-suscripcion.component.html',
  styleUrls: ['./add-update-suscripcion.component.css']
})
export class AddUpdateSuscripcionComponent implements OnInit {
  dataForm!:FormGroup;
  tipoRegistro:number=1;//Add


  constructor(
    private formBuilder: FormBuilder,
    private suscripcionSvc: SuscripcionService,
    @Inject(MAT_DIALOG_DATA) private editData: any,
    private dialoRef: MatDialogRef<AddUpdateSuscripcionComponent>,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {

    this.dataForm = this.formBuilder.group({
      descripcion:['', Validators.required],
      codigo: ['', Validators.required],
      cantidad: ['', Validators.required],
      tiempo: ['', Validators.required],
      estado: [false]
    });

    if(this.editData){
      this.tipoRegistro = 2;
      this.dataForm.controls["codigo"].setValue(this.editData.codigo);
      this.dataForm.controls["descripcion"].setValue(this.editData.descripcion);
      this.dataForm.controls["cantidad"].setValue(this.editData.cantidad);
      this.dataForm.controls["tiempo"].setValue(this.editData.tiempo);
      this.dataForm.controls["estado"].setValue(this.editData.estado);
    }
  }

  addUpadteSuscripcion(){
    if(this.dataForm.valid){
      if(this.tipoRegistro===1){
        this.suscripcionSvc.save(this.dataForm.value).subscribe({
          next: data=>{
            this.dataForm.reset();
            this.dialoRef.close(this.tipoRegistro);
            this.toast.success('Registrado Correctamente', 'Suscripción');
            return
          },
          error:error=>{
            console.log(error)
          }
        })
      }else{

        this.suscripcionSvc.update(this.editData.idSuscripcion, this.dataForm.value).subscribe({
          next: data=>{
            this.dataForm.reset();
            this.dialoRef.close(this.tipoRegistro);
            this.toast.success('Actualizado Correctamente', 'Suscripción');
            return
          },
          error:error=>{
            console.log(error)
          }
        })
      }

    }
  }

}
