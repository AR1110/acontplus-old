import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { RoomService } from '@restaurant/services/room.service';
import { ToasterService } from '@core/services/toaster.service';
import { ApiResponse } from '@core/models/api-response';
import { Room } from '@restaurant/models/room.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TableService } from '@restaurant/services/table.service';

@Component({
  selector: 'app-table-add-edit-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './table-add-edit-modal.component.html',
  styles: ``,
})
export class TableAddEditModalComponent {
  codEstab: string = '';
  data: any = {};
  rooms: Room[] = [];
  tableForm = new FormGroup({
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
  modalIcon: IconProp = 'plus';
  modalTitle: string = 'Registrar Mesa';
  #modalRef = inject(NgbActiveModal);
  #roomService = inject(RoomService);
  #tableService = inject(TableService);
  #tS = inject(ToasterService);

  getRooms() {
    this.#roomService.getByEstab(this.codEstab).subscribe((response) => {
      this.rooms = (response.payload as Room[]) || [];
    });
  }

  ngOnInit() {
    this.codEstab = this.data.codEstab;
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
    }

    this.#tableService.post(dataToSave).subscribe((response) => {
      this.successResponse(response);
    });
  }

  onModalClose() {
    this.#modalRef.close();
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
