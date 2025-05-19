import {Component, inject} from '@angular/core';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ElectronicSignatureList} from "@modules/config/domain/models/electronic-signature.model";
import {CreateCreditTimeUseCase} from "@modules/config/application/use-cases/credit-time/create-credit-time.use-case";
import {UpdateCreditTimeUseCase} from "@modules/config/application/use-cases/credit-time/update-credit-time.use-case";

@Component({
  selector: 'app-add-edit-credit-time',
  imports: [
    MatCustomDialogComponent
  ],
  templateUrl: './add-edit-credit-time.component.html',
  styles: ``
})
export class AddEditCreditTimeComponent {
  private dialogRef = inject(MatDialogRef<AddEditCreditTimeComponent>);
  params = inject<ElectronicSignatureList>(MAT_DIALOG_DATA);


  private $createUseCase = inject(CreateCreditTimeUseCase)
  private $updateUseCase = inject(UpdateCreditTimeUseCase)

  title = 'Nuevo Tiempo Crédito';
  btnText = 'Guardar';
  btnIcon = 'save';



  close(){
    this.dialogRef.close()
  }
}
