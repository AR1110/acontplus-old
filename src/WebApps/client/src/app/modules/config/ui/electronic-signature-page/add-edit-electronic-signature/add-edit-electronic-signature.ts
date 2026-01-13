import { ELECTRONIC_SIGNATURE_HTTP_TOKEN } from '@modules/config/data/config-token';
import { ElectronicSignatureList } from '@modules/config/data/models/electronic-signature.model';
import { Button } from '@acontplus/ng-components';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { getValidId, isValidField } from '@core/utils/utils';
import { MatButtonModule } from '@angular/material/button';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '@acontplus/ng-notifications';

@Component({
  selector: 'app-add-edit-electronic-signature',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogContent,
    MatDialogActions,
    Button,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './add-edit-electronic-signature.html',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditElectronicSignature implements OnInit {
  private dialogRef = inject(MatDialogRef<AddEditElectronicSignature>);
  params = inject<{ data: ElectronicSignatureList }>(MAT_DIALOG_DATA);

  private electronicSignatureHttp = inject(ELECTRONIC_SIGNATURE_HTTP_TOKEN);
  private notiSvc = inject(NotificationService);

  title = 'Nueva Firma Electrónica';
  btnText = 'Guardar';
  btnIcon = 'save';

  fileSign: File | undefined = undefined;

  data = {
    idFirmaElectronica: 0,
    contrasenia: '',
    estado: true,
  };

  private get getData() {
    return this.params.data;
  }

  ngOnInit() {
    if (this.getData.idFirmaElectronica > 0) {
      this.title = 'Editar Firma Electrónica';
      this.btnText = 'Actualizar';
      this.btnIcon = 'edit';
      this.data.idFirmaElectronica = this.getData.idFirmaElectronica;
      this.data.contrasenia = this.getData.contrasenia;
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileSign = file;
  }

  save() {
    if (!isValidField(this.data.contrasenia)) {
      this.notiSvc.warning({
        message: 'Ingrese la contraseña',
      });
      return;
    }

    if (!getValidId(this.getData.idFirmaElectronica) && !isValidField(this.fileSign)) {
      this.notiSvc.warning({
        message: 'Selecionele el archivo de la firma!',
      });
      return;
    }

    if (getValidId(this.getData.idFirmaElectronica)) {
      this.electronicSignatureHttp
        .update({
          ...this.data,
        })
        .subscribe(this.successResponse);
      return;
    }
    this.electronicSignatureHttp
      .create({
        ...this.data,
        file: this.fileSign,
      })
      .subscribe(this.successResponse);
  }

  successResponse = (response: ApiResponseLegacy) => {
    if (response.code === '0') {
      this.notiSvc.warning({
        message: response.message,
      });
    }
    if (response.code === '1') {
      this.notiSvc.show({
        message: response.message,
        type: 'success',
      });
      this.dialogRef.close(response);
    }
  };
}
