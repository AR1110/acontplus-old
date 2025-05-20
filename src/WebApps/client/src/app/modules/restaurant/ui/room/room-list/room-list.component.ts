import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Room } from '@restaurant/domain/models/room.model';
import { ModalService } from '@core/services/modal.service';
import { RoomAddEditModalComponent } from '@restaurant/ui/room/room-add-edit-modal/room-add-edit-modal.component';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { RoomService } from '@restaurant/data/services/room.service';
import { FormsModule } from '@angular/forms';
import { FloorService } from '@restaurant/data/services/floor.service';
import { Floor } from '@restaurant/domain/models/floor.model';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';

import swal from 'sweetalert2';
import { ToasterService } from '@core/services/toaster.service';
import { ApiResponse } from '@core/models/api-response';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-room-list',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    TabulatorSemanticUiComponent,
    MatCardContent,
    MatCard,
  ],
  templateUrl: './room-list.component.html',
  styles: ``,
})
export class RoomListComponent {
  establecimientoId = 0;
  columnNames = [
    { title: 'floorId', field: 'floorId', visible: false },
    {
      title: 'Código',
      field: 'code',
      editor: 'input',
      editable: function (cell: any) {
        return !!cell.getRow().getTreeParent();
      },
      validator: function (cell: any, value: any) {
        if (cell.getRow().getTreeParent()) {
          if (value === '' || value === null) {
            return { valid: false, message: 'Este campo es requerido' };
          }
        }
        return true;
      },
    },
    {
      title: 'Descripción',
      field: 'description',
      width: 200,
      editor: 'input',
      editable: function (cell: any) {
        return !!cell.getRow().getTreeParent();
      },
      validator: function (cell: any, value: any) {
        if (cell.getRow().getTreeParent()) {
          if (value === '' || value === null) {
            return { valid: false, message: 'Este campo es requerido' };
          }
        }
        return true;
      },
    },
    {
      title: 'Capacidad',
      field: 'capacity',
      editor: 'number',
      editorParams: {
        min: 1,
        step: 1,
      },
      editable: function (cell: any) {
        return !!cell.getRow().getTreeParent();
      },
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
      formatter: (cell: any) => {
        //const cellEl = cell.getElement();
        const rowDataMain = cell.getRow().getData();
        const isChild = !!cell.getRow().getTreeParent();
        let buttonHolder = document.createElement('span');

        // Check if the row is a parent
        if (isChild) {
          //create edit button
          let editBtn = document.createElement('button');
          editBtn.type = 'button';
          editBtn.innerHTML = `<i class="material-icons" style="cursor:pointer;">save</i>`;
          editBtn.classList.add('btn', 'btn-success', 'btn-sm');
          editBtn.title = 'Guardar Sala';
          editBtn.addEventListener('click', () => {
            const rowData = cell.getRow().getData();
            this.onEdit(rowData);
          });

          //create delete button
          let delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.innerHTML = `<i class="material-icons" style="cursor:pointer;">delete</i>`;
          delBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-r-5');
          delBtn.title = 'Eliminar Sala';
          delBtn.addEventListener('click', () => {
            const rowData = cell.getRow().getData();
            this.onDelete(rowData);
          });

          buttonHolder.appendChild(delBtn);
          if (rowDataMain.id > 0) {
            buttonHolder.appendChild(editBtn);
          }
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
  rooms: any[] = [];
  #florService = inject(FloorService);
  #modalService = inject(ModalService);
  #roomService = inject(RoomService);
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);

  getEstabs() {
    this.#sharedService.getEstabAsign().subscribe((response) => {
      this.establecimientos = response;

      let dataEstab = this.establecimientos.find((item) => item.predeterminado);
      if (dataEstab) {
        this.establecimientoId = dataEstab.idEstablecimiento;
        setTimeout(() => {
          this.loadData(this.establecimientoId);
        });
      }
    });
  }

  loadData(establecimientoId: number) {
    this.#florService.getByEstab(establecimientoId).subscribe((response) => {
      const tempFloors = (response.payload as Floor[]) || [];
      const combinedData = tempFloors.map((floor) => ({
        ...floor,
        _children: floor.rooms?.map((room: Room) => ({
          ...room,
          parentId: floor.id,
        })),
      }));
      this.rooms = combinedData as [];
    });
  }

  refresh() {
    this.loadData(this.establecimientoId);
  }

  ngOnInit() {
    this.getEstabs();
  }

  onModalOpen() {
    const modalRef = this.#modalService.openModalCustom(
      RoomAddEditModalComponent,
      { size: 'sm', centered: true },
    );
    modalRef.componentInstance.data = {
      establecimientoId: this.establecimientoId,
    };
    modalRef.result.then((response) => {
      if (typeof response === 'object') {
        this.loadData(this.establecimientoId);
      }
    });
  }

  onEstabChange($event: any) {
    this.establecimientoId = $event.value;
    if (!this.establecimientoId) return;
    this.loadData(this.establecimientoId);
  }

  successResponse = (response: ApiResponse) => {
    this.#tS.toastr({
      type: response.code == '1' ? 'success' : 'warning',
      message: response.message,
    });
    if (response.code == '1') {
      this.loadData(this.establecimientoId);
    }
  };

  private onDelete(room: Room) {
    swal
      .fire({
        icon: 'warning',
        title: 'Advertencia!',
        text: `Esta seguro/a de eliminar esta sala?`,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.#roomService.delete(room.id).subscribe((response) => {
            this.successResponse(response);
          });
        }
      });
  }

  private onEdit(room: Room) {
    this.#roomService
      .put(room.id, room)
      .subscribe((response) => this.successResponse(response));
  }
}
