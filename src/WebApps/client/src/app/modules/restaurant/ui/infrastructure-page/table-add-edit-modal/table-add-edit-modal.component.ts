import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Room } from '@restaurant/data/models/room.model';
import { TableService } from '@restaurant/data/services/table.service';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-table-add-edit-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCustomDialogComponent,
  ],
  templateUrl: './table-add-edit-modal.component.html',
  styles: ``,
})
export class TableAddEditModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TableAddEditModalComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);

  rooms: Room[] = [];
  tableForm = new FormGroup({
    id: new FormControl(0),
    roomId: new FormControl(0, [Validators.required]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
    ]),
    numberTable: new FormControl(0, [Validators.required, Validators.min(1)]),
    capacity: new FormControl(1, [Validators.required, Validators.min(1)]),
    enabled: new FormControl(true),
  });

  modalTitle = 'Registrar Mesa';
  btnText = 'Guardar';
  #tableService = inject(TableService);
  #tS = inject(ToastrNotificationService);

  ngOnInit() {
    this.tableForm.patchValue({
      roomId: this.params.roomId,
    });
    if (this.params.id > 0) {
      const { roomName, ...rest } = this.params;
      this.modalTitle = 'Editar Mesa';
      this.btnText = 'Actualizar';
      this.tableForm.setValue(rest);
    }
  }

  onSave() {
    if (this.tableForm.invalid) {
      return this.#tS.show({
        type: 'warning',
        message: 'Revise los datos correctos',
      });
    }

    const dataToSave = {
      ...this.tableForm.value,
    };

    if (this.params.id > 0) {
      this.#tableService.put(this.params.id, dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    } else {
      this.#tableService.post(dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  successResponse(response: ApiResponseLegacy) {
    this.#tS.show({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.dialogRef.close(response);
    }
  }
}
