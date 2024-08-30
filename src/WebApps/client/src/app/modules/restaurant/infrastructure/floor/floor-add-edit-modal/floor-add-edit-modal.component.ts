import { Component, inject } from '@angular/core';
import { Floor } from '@restaurant/models/floor.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloorService } from '@restaurant/services/floor.service';
import { SharedService } from '@core/services/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '@core/services/toaster.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import { Room } from '@restaurant/models/room.model';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';
import { MatButton } from '@angular/material/button';
import { ApiResponse } from '@core/models/api-response';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';

@Component({
  selector: 'app-floor-add-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FaIconComponent,
    TabulatorSemanticUiComponent,
    MatButton,
    MatSlideToggle,
  ],
  templateUrl: './floor-add-edit-modal.component.html',
  styles: ``,
})
export class FloorAddEditModalComponent {
  data = {} as Floor;
  roomColumns: any[] = [
    { title: 'ID', field: 'id', sorter: 'number', width: 60 },
    { title: 'Código', field: 'code', editor: 'input' },
    { title: 'Descripción', field: 'description', editor: 'input' },
    {
      title: 'Capacidad',
      field: 'capacity',
      editor: 'number',
      validator: function (cell: any, value: any) {
        if (cell.getRow().getTreeParent()) {
          if (value === '' || value === null) {
            return { valid: false, message: 'Este campo es requerido' };
          } else if (!Number.isInteger(Number(value)) || Number(value) < 0) {
            return {
              valid: false,
              message: 'Debe ser un número entero positivo',
            };
          }
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
        let editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.innerHTML = `${icon(faSave).html.join('')}`;
        editBtn.classList.add('btn', 'btn-success', 'btn-sm');
        editBtn.title = 'Guardar Sala';
        editBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          // this.editDetail(rowData);
        });

        //create delete button
        let delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
        delBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-r-5');
        delBtn.title = 'Eliminar Sala';
        delBtn.addEventListener('click', () => {
          const rowData = cell.getRow().getData();
          console.log(rowData);
          if (rowData.id > 0) {
            // this.askToDeleteDetail(rowData);
          } else {
            this.deleteRoom(rowData.deviceId);
          }
        });

        let buttonHolder = document.createElement('span');
        buttonHolder.appendChild(delBtn);
        if (rowDataMain.id > 0) {
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

  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  validation = [undefined, null, '', 0];
  floorForm = new FormGroup({
    codEstab: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required, Validators.minLength(3)]),
    capacity: new FormControl(1, [Validators.required, Validators.min(1)]),
    enabled: new FormControl(true),
  });
  modalIcon: IconProp = 'plus';
  modalTitle: string = 'Registrar Piso';
  rooms: Room[] = [];
  #modalRef = inject(NgbActiveModal);
  #floorService = inject(FloorService);
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);

  deleteRoom(id: number) {
    this.rooms = this.rooms.filter((room) => room.id !== id);
  }

  getEstabAsign() {
    this.#sharedService.getEstabAsign().subscribe((response) => {
      if (response) {
        this.establecimientos = response;
      }
    });
  }

  ngOnInit() {
    this.getEstabAsign();
    this.floorForm.patchValue({ codEstab: this.data.codEstab });
    if (this.data.id > 0) {
      this.modalIcon = 'edit';
      this.modalTitle = 'Editar Piso';
      this.floorForm.patchValue(this.data);
      this.rooms = this.data.rooms || [];
    }
  }

  onSave() {
    if (this.floorForm.invalid) {
      return this.#tS.toastr({
        type: 'warning',
        message: 'Revise los datos correctos',
      });
    }
    if (!(this.rooms.length > 0)) {
      return this.#tS.toastr({
        type: 'warning',
        message: 'Debe agregar al menos una sala',
      });
    }

    const dataToSave = {
      ...this.floorForm.value,
      rooms: this.rooms,
    };

    if (this.data.id > 0) {
      this.#floorService.put(this.data.id, dataToSave).subscribe((response) => {
        this.successResponse(response);
      });
    } else {
      this.#floorService.post(dataToSave).subscribe((response) => {
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

  successResponse(response: ApiResponse) {
    this.#tS.toastr({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.onModalClose();
      this.floorForm.reset();
    }
  }

  onModalClose() {
    this.#modalRef.close();
  }

  addRoom() {
    const newRoom: Room = {
      id: 0,
      code: '',
      description: '',
      capacity: 0,
      enabled: true,
    };
    this.rooms.push(newRoom);
  }
}
