import {Component, inject, OnInit} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {ToUpperCaseDirective} from "@shared/directives/ui/to-upper-case.directive";
import {CreateSeatUseCase} from "@barber-shop/application/use-cases/seat/create-seat.use-case";
import {UpdateSeatUseCase} from "@barber-shop/application/use-cases/seat/update-seat.use-case";
import {SeatList} from "@barber-shop/domain/models/seat.model";
import {getValidId} from "@core/utils/utils";
import {ApiResponse} from "@core/models/api-response";

@Component({
  selector: 'app-add-edit-seat',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCustomDialogComponent,
    ThemeButtonComponent,
    ReactiveFormsModule,
    ToUpperCaseDirective
  ],
  templateUrl: './add-edit-seat.component.html',
  styles: ``
})
export class AddEditSeatComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AddEditSeatComponent>);
  readonly params = inject<Partial<SeatList>>(MAT_DIALOG_DATA);
  private $createUseCase = inject(CreateSeatUseCase)
  private $updateUseCase = inject(UpdateSeatUseCase)

  btnText = 'Guardar'
  btnIcon = 'save';
  title = 'Nuevo Asiento';

  dataForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    description: new FormControl<string|null>(null),
    seatNumber: new FormControl<number|null>(null, [Validators.required]),
    code: new FormControl<string|null>(null, [Validators.required]),
  })

  ngOnInit(){
    console.log(this.params)
    if(this.params && this.params.id){
      this.btnText = 'Actualizar'
      this.btnIcon = 'edit';
      this.title = 'Editar Asiento';

      this.dataForm.patchValue({
        name: this.params.name,
        description: this.params.description,
        seatNumber: this.params.seatNumber,
        code: this.params.code
      })
    }
  }

  private successResponse = (response:ApiResponse)=>{
    if(response.code==="0"){
      Swal.fire({
        icon: "warning",
        text: response.message,
      })
    }
    if(response.code==="1"){
      Swal.fire({
        icon: "success",
        text: response.message,
        timer: 1000
      })
      setTimeout(()=>{
        this.dialogRef.close(response)
      }, 1000)
    }
  }

  save(){
    console.log(this.dataForm)
    if(this.dataForm.invalid){
      Swal.fire({
        icon: 'warning',
        text: 'Los campos con * son obligatorios'
      })
      return
    }
    this.dataForm.patchValue({
      code: `${this.dataForm.value.name?.slice(0,3)}${this.dataForm.value.seatNumber}`
    })

    const sendData = {
      ...this.dataForm.value,
      id: this.params.id
    }
    if(getValidId(this.params.id)){
      this.$updateUseCase.execute(sendData as any).subscribe(this.successResponse)
    }
    if(!getValidId(this.params.id)){
      this.$createUseCase.execute(sendData as any).subscribe(this.successResponse)
    }
  }


  close(){
    this.dialogRef.close()
  }
}
