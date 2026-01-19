import { Component, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import { ActionList } from '@modules/seguridad/domain/models/action.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiResponse, ToastrNotificationService } from 'acontplus-utils';
import { CreateActionUseCase } from '@modules/seguridad/domain/use-cases/action/create-action.use-case';
import { UpdateActionUseCase } from '@modules/seguridad/domain/use-cases/action/update-action.use-case';
import {MatThemeButtonComponent} from "acontplus-ui-components";

@Component({
  selector: 'app-add-edit-action',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatThemeButtonComponent,
  ],
  templateUrl: './add-edit-action.component.html',
  styles: ``,
})
export class AddEditActionComponent {
  dialogRef = inject(MatDialogRef<AddEditActionComponent>);
  params = inject<ActionList>(MAT_DIALOG_DATA);

  private $createUseCase = inject(CreateActionUseCase);
  private $updateUseCase = inject(UpdateActionUseCase);

  private _tS = inject(ToastrNotificationService);

  title = 'Nueva Acción';

  dataForm = new FormGroup({
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  isAdd() {
    return !(this.params.id > 0);
  }

  isUpdate() {
    return this.params.id > 0;
  }

  ngOnInit() {
    if (this.isUpdate()) {
      this.title = 'Actualizar Acción';

      // * Set the data to the form
      this.dataForm.setValue({
        code: this.params.code,
        name: this.params.name,
        description: this.params.description,
      });
    }
  }

  commonResponse = (response: ApiResponse) => {
    if (response.code === '0') {
      this._tS.show({
        type: 'warning',
        message: response.message,
      });
    }
    if (response.code === '1') {
      this._tS.show({
        type: 'success',
        message: response.message,
      });
      this.dialogRef.close(response);
    }
  };

  save() {
    if (this.dataForm.invalid) {
      this._tS.show({
        type: 'warning',
        message: 'Ingrese todo los campos requeridos',
      });
      return;
    }

    const params = {
      ...this.dataForm.value,
      id: this.params.id,
    };
    if (this.isAdd()) {
      this.$createUseCase.execute(params).subscribe(this.commonResponse);
    }
    if (this.isUpdate()) {
      this.$updateUseCase.execute(params).subscribe(this.commonResponse);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
