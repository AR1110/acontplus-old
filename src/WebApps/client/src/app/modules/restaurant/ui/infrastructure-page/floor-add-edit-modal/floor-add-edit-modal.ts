import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrNotificationService } from '@core/services/toastr-notification.service';

import { Room } from '@restaurant/data/models/room.model';
import { TabulatorTable } from '@acontplus/ng-components';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RoomService } from '@restaurant/data/services/room.service';
import { Button } from '@acontplus/ng-components';
import { MatCustomDialogComponent } from '@core/components/mat-custom-dialog/mat-custom-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FLOOR_HTTP_TOKEN } from '@restaurant/data/restaurant-token';

@Component({
  selector: 'app-floor-add-edit-modal',
  imports: [
    ReactiveFormsModule,
    TabulatorTable,
    MatSlideToggle,
    Button,
    MatCustomDialogComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './floor-add-edit-modal.html',
  styles: ``,
})
export class FloorAddEditModal implements OnInit {
  roomColumns: any[] = [
    { title: 'ID', field: 'id', visible: false },
    { title: 'Código', field: 'code', editor: 'input' },
    { title: 'Descripción', field: 'description', editor: 'input', width: 250 },
    {
      title: 'Capacidad (Mesas)',
      field: 'capacity',
      editor: 'number',
      editorParams: {
        min: 1,
        step: 1,
      },
      validator: function (cell: any, value: any) {
        if (value === '' || value === null) {
          return { valid: false, message: 'Este campo es requerido' };
        } else if (!Number.isInteger(Number(value)) || Number(value) < 0) {
          return {
            valid: false,
            message: 'Debe ser un número entero positivo',
          };
        }
        return true;
      },
    },
    {
      title: 'Estado',
      field: 'enabled',
      editor: 'tickCross',
      formatter: 'tickCross',
    },
    {
      formatter: (cell: any) => {
        //const cellEl = cell.getElement();
        const rowDataMain = cell.getRow().getData();

        //create edit button
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.innerHTML = `<i class="material-icons" style="cursor:pointer;">save</i>`;
        editBtn.classList.add('btn', 'btn-success', 'btn-sm');
        editBtn.title = 'Guardar Sala';
        editBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          // this.editDetail(rowData);
        });

        //create delete button
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `<i class="material-icons" style="cursor:pointer;">delete</i>`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-r-5');
        delBtn.title = 'Eliminar Sala';
        delBtn.addEventListener('click', () => {
          const rowData = cell.getRow();
          this.deleteRoom(rowData);
        });

        const buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);
        if (rowDataMain.id > 0 && this.data.id > 0) {
          buttonHolder.appendChild(editBtn);
        }
        return buttonHolder;
      },
      hozAlign: 'center',
      resizable: false,
      title: 'Opción',
      width: 100,
    },
  ];
  validation = [undefined, null, '', 0];
  floorForm = new FormGroup({
    id: new FormControl(0),
    establecimientoId: new FormControl(0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required, Validators.minLength(3)]),
    capacity: new FormControl(1, [Validators.required, Validators.min(1)]),
    enabled: new FormControl(true),
  });
  modalIcon = 'add';
  modalTitle = 'Registrar Piso';
  rooms: Room[] = [];

  private floorHttp = inject(FLOOR_HTTP_TOKEN);

  _modalRef = inject(MatDialogRef<FloorAddEditModal>);
  data = inject<any>(MAT_DIALOG_DATA);
  _roomService = inject(RoomService);
  _tS = inject(ToastrNotificationService);

  deleteRoom(row: any) {
    const rowData = row.getData();

    // Find the index of the room to delete in the array
    const index = this.rooms.findIndex((room) => room.id === rowData.id);
    if (index > -1) {
      // Remove the room from the array
      this.rooms.splice(index, 1);
      // Delete the row from the Tabulator table
      row.delete();
    }
  }

  ngOnInit() {
    this.floorForm.patchValue({
      establecimientoId: this.data.establecimientoId,
    });
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Piso';
      this.floorForm.patchValue(this.data);
      this.rooms = this.data.children || [];
    }
  }

  onSave() {
    if (this.floorForm.invalid) {
      return this._tS.show({
        type: 'warning',
        message: 'Revise los datos correctos',
      });
    }
    if (!(this.rooms.length > 0)) {
      return this._tS.show({
        type: 'warning',
        message: 'Debe agregar al menos una sala',
      });
    }

    const dataToSave = {
      ...this.floorForm.value,
      codEstab: this.data.codEstab,
      rooms: this.data.id > 0 ? [] : this.rooms, //solo añade si es nueva
    };

    if (this.data.id > 0) {
      this.floorHttp.put(this.data.id, dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    } else {
      this.floorHttp.post(dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    }
  }

  setCode() {
    const description = this.floorForm.get('description')?.value;
    if (description) {
      this.floorForm.patchValue({
        code: description.substring(0, 3).toUpperCase(),
      });
    }
  }

  successResponse(response: ApiResponseLegacy) {
    this._tS.show({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this._modalRef.close(response);
    }
  }

  onModalClose() {
    this._modalRef.close();
  }

  addRoom() {
    const maxId = this.rooms.length > 0 ? Math.max(...this.rooms.map((room) => room.id)) : 0;
    const code =
      this.rooms.length > 0
        ? `${Math.max(...this.rooms.map((room) => parseInt(room.code))) + 1}`
        : '1';
    const newRoom: Room = {
      id: maxId + 1, // Auto-increment the id based on the highest current id;
      code: code,
      description: `Sala ${code}`,
      capacity: 1,
      enabled: true,
      floorId: this.data.id,
    };
    if (this.data.id > 0) {
      newRoom.id = 0;
      this._roomService.post(newRoom).subscribe((response) => {
        this._tS.show({
          type: response.code === '1' ? 'success' : 'warning',
          message: response.message,
        });
        if (response.code === '1') {
          const { id } = response.payload as Room;
          newRoom.id = id;
          console.log(newRoom);
          this.rooms.push(newRoom);
        }
      });
    } else {
      this.rooms.push(newRoom);
    }
  }
}
