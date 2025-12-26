import { UpdateElectronicSignatureUseCase } from '@modules/config/application/use-cases/electronic-signature/update-electronic-signature.use-case';
import { CreateElectronicSignatureUseCase } from '@modules/config/application/use-cases/electronic-signature/create-electronic-signature.use-case';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { ElectronicSignatureList } from '@modules/config/domain/models/electronic-signature.model';
import { Button } from '@acontplus/ng-components';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { WarehouseList } from '@inventory/data/models/warehouse.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { getValidId, isValidField } from '@core/utils/utils';
import { MatButtonModule } from '@angular/material/button';
import { formatDateToString } from '@core/utils/date.util';
import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-electronic-signature',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCustomDialogComponent,
    Button,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './add-edit-electronic-signature.component.html',
  providers: [provideNativeDateAdapter()],
})
export class AddEditElectronicSignatureComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AddEditElectronicSignatureComponent>);
  params = inject<ElectronicSignatureList>(MAT_DIALOG_DATA);

  private $createUseCase = inject(CreateElectronicSignatureUseCase);
  private $updateUseCase = inject(UpdateElectronicSignatureUseCase);

  title = 'Nueva Firma Electrónica';
  btnText = 'Guardar';
  btnIcon = 'save';

  fileSign: File | undefined = undefined;

  data = {
    idFirmaElectronica: 0,
    contrasenia: '',
    estado: true,
  };

  ngOnInit() {
    if (this.params.idFirmaElectronica > 0) {
      this.title = 'Editar Firma Electrónica';
      this.btnText = 'Actualizar';
      this.btnIcon = 'edit';
      this.data.idFirmaElectronica = this.params.idFirmaElectronica;
      this.data.contrasenia = this.params.contrasenia;
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileSign = file;
  }

  save() {
    if (!isValidField(this.data.contrasenia)) {
      Swal.fire({
        icon: 'warning',
        text: 'Ingrese la contraseña',
      });
      return;
    }

    if (!getValidId(this.params.idFirmaElectronica) && !isValidField(this.fileSign)) {
      Swal.fire({
        icon: 'warning',
        text: 'Selecionele el archivo de la firma!',
      });
      return;
    }

    if (getValidId(this.params.idFirmaElectronica)) {
      this.$updateUseCase
        .execute({
          ...this.data,
        })
        .subscribe(this.successResponse);
      return;
    }
    this.$createUseCase
      .execute({
        ...this.data,
        file: this.fileSign,
      })
      .subscribe(this.successResponse);
  }

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      Swal.fire({
        icon: 'warning',
        text: response.message,
      });
    }
    if (response.code === '1') {
      Swal.fire({
        icon: 'success',
        text: response.message,
        timer: 1000,
      });
      this.dialogRef.close(response);
    }
  };
  close() {
    this.dialogRef.close();
  }
}
