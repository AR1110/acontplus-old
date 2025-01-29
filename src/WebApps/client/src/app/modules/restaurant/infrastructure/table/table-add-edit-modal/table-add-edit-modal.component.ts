import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoomService } from '@restaurant/data/services/room.service';
import { ToasterService } from '@core/services/toaster.service';
import { ApiResponse } from '@core/models/api-response';
import { Room } from '@restaurant/domain/models/room.model';
import { TableService } from '@restaurant/data/services/table.service';
import {MatCustomDialogComponent} from "@core/components/mat-custom-dialog/mat-custom-dialog.component";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

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
      MatCustomDialogComponent
    ],
    templateUrl: './table-add-edit-modal.component.html',
    styles: ``
})
export class TableAddEditModalComponent {

  readonly dialogRef = inject(MatDialogRef<TableAddEditModalComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);

  establecimientoId: number = 0;
  data: any = {};
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

  modalTitle: string = 'Registrar Mesa';
  btnText = 'Guardar';
  #roomService = inject(RoomService);
  #tableService = inject(TableService);
  #tS = inject(ToasterService);


  getRooms() {
    this.#roomService
      .getByEstab(this.establecimientoId)
      .subscribe((response) => {
        this.rooms = (response.payload as Room[]) || [];


      });
  }

  ngOnInit() {
    const {establecimientoId,  ...rest} = this.params;
    this.data = structuredClone(this.params)
    if(this.data.id>0){
      this.modalTitle = 'Editar Mesa';
      this.btnText ='Actualizar'
    this.tableForm.setValue(rest)
    }
    this.establecimientoId = establecimientoId;
    this.getRooms();
  }

  onSave() {
    if (this.tableForm.invalid) {
      return this.#tS.toastr({
        type: 'warning',
        message: 'Revise los datos correctos',
      });
    }

    const dataToSave = {
      ...this.tableForm.value,
    };

    if (this.data.id > 0) {
      this.#tableService.put(this.data.id, dataToSave).subscribe((response) => {
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

  successResponse(response: ApiResponse) {
    this.#tS.toastr({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.dialogRef.close(response);
    }
  }


}
