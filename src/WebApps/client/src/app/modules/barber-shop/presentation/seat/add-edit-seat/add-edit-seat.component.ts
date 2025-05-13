import {Component, inject} from '@angular/core';
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
export class AddEditSeatComponent {
  private dialogRef = inject(MatDialogRef<AddEditSeatComponent>);
  readonly params = inject<Partial<SeatList>>(MAT_DIALOG_DATA);
  private $createUseCase = inject(CreateSeatUseCase)
  private $updateUseCase = inject(UpdateSeatUseCase)

  btnText = 'Guardar'
  btnIcon = 'save';
  title = 'Nuevo Asiento';

  dataForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    description: new FormControl(null),
    seatNumber: new FormControl(null, [Validators.required]),
    code: new FormControl<string|null>(null, [Validators.required]),
  })


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

    if(getValidId(this.params.id)){

    }
    if(!getValidId(this.params.id)){

      this.$createUseCase.execute(this.dataForm.value as any).subscribe(response=>{
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
        }
      })
    console.log(this.dataForm.invalid)
    }
  }


  close(){
    this.dialogRef.close()
  }
}
