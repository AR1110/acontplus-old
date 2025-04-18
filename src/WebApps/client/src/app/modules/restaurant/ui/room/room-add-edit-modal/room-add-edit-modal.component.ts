import { Component, inject } from '@angular/core';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ApiResponse } from '@core/models/api-response';
import { ToasterService } from '@core/services/toaster.service';
import { RoomService } from '@restaurant/data/services/room.service';
import { FloorService } from '@restaurant/data/services/floor.service';
import { Floor } from '@restaurant/domain/models/floor.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-room-add-edit-modal',
  imports: [FormsModule, ReactiveFormsModule, MatIcon, MatButton],
  templateUrl: './room-add-edit-modal.component.html',
  styles: ``,
})
export class RoomAddEditModalComponent {
  establecimientoId = 0;
  data: any = {};
  floors: Floor[] = [];
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
  modalTitle: string = 'Registrar Sala';
  #floorService = inject(FloorService);
  #modalRef = inject(NgbActiveModal);
  #roomService = inject(RoomService);
  #tS = inject(ToasterService);

  getFloors() {
    this.#floorService
      .getByEstab(this.establecimientoId)
      .subscribe((response) => {
        console.log(response);
        this.floors = (response.payload as Floor[]) || [];
      });
  }

  ngOnInit() {
    this.establecimientoId = this.data.establecimientoId;
    this.getFloors();
  }

  onSave() {
    if (this.roomForm.invalid) {
      return this.#tS.toastr({
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
    this.#modalRef.close();
  }

  setCode() {
    const description = this.roomForm.get('description')?.value;
    if (description) {
      this.roomForm.patchValue({
        code: description.substring(0, 3).toUpperCase(),
      });
    }
  }

  successResponse(response: ApiResponse) {
    this.#tS.toastr({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.#modalRef.close(response);
    }
  }
}
