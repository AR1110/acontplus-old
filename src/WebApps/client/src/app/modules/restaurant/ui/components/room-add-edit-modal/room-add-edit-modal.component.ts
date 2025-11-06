import { Component, inject, OnInit } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { RoomService } from '@restaurant/data/services/room.service';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-room-add-edit-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    MatCustomDialogComponent,

    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './room-add-edit-modal.component.html',
  styles: ``,
})
export class RoomAddEditModalComponent implements OnInit {
  roomForm = new FormGroup({
    id: new FormControl(0),
    floorId: new FormControl(0, [Validators.required]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(5),
    ]),
    capacity: new FormControl(1, [Validators.required, Validators.min(1)]),
    enabled: new FormControl(true),
  });
  modalIcon = 'add';
  modalTitle = 'Registrar Sala';
  btnText = 'Guardar';
  _modalRef = inject(MatDialogRef<RoomAddEditModalComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  #roomService = inject(RoomService);
  #tS = inject(ToastrNotificationService);

  ngOnInit() {
    this.roomForm.patchValue({
      floorId: this.data.floorId,
    });
    if (this.data.id > 0) {
      this.roomForm.patchValue(this.data);
      this.modalTitle = 'Editar Sala';
      this.btnText = 'Actualizar';
    }
  }

  onSave() {
    if (this.roomForm.invalid) {
      return this.#tS.show({
        type: 'warning',
        message: 'Revise los datos correctos',
      });
    }

    const dataToSave = {
      ...this.roomForm.value,
    };

    if (this.data.id > 0) {
      this.#roomService.put(this.data.id, dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    } else {
      this.#roomService.post(dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    }
  }

  onModalClose() {
    this._modalRef.close();
  }

  setCode() {
    const description = this.roomForm.get('description')?.value;
    if (description) {
      this.roomForm.patchValue({
        code: description.substring(0, 3).toUpperCase(),
      });
    }
  }

  successResponse(response: ApiResponseLegacy) {
    this.#tS.show({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this._modalRef.close(response);
    }
  }
}
