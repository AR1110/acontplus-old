import { Component, inject } from '@angular/core';
import { Floor } from '@restaurant/models/floor.model';
import { Room } from '@restaurant/models/room.model';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { TableService } from '@restaurant/services/table.service';
import { RoomService } from '@restaurant/services/room.service';
import { Table } from '@restaurant/models/table.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ApiResponse } from '@core/models/api-response';
import swal from 'sweetalert2';
import { TableAddEditModalComponent } from '@restaurant/infrastructure/table/table-add-edit-modal/table-add-edit-modal.component';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    MatButton,
    TabulatorSemanticUiComponent,
  ],
  templateUrl: './table-list.component.html',
  styles: ``,
})
export class TableListComponent {
  establecimientoId: number = 0;
  columnNames = [
    { title: 'floorId', field: 'floorId', visible: false },
    {
      title: 'Número',
      field: 'numberTable',
      editor: 'input',
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
          editBtn.innerHTML = `${icon(faSave).html.join('')}`;
          editBtn.classList.add('btn', 'btn-success', 'btn-sm');
          editBtn.title = 'Guardar Mesa';
          editBtn.addEventListener('click', () => {
            const rowData = cell.getRow().getData();
            this.onEdit(rowData);
          });

          //create delete button
          let delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.innerHTML = `${icon(faTrashAlt).html.join('')}`;
          delBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-r-5');
          delBtn.title = 'Eliminar Mesa';
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
  tables: any[] = [];
  #modalService = inject(ModalService);
  #roomService = inject(RoomService);
  #tableService = inject(TableService);
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);

  getEstabs() {
    this.#sharedService.getEstabAsign().subscribe((response) => {
      this.establecimientos = response;
      if (this.establecimientos.length > 0) {
        this.establecimientoId = this.establecimientos[0].idEstablecimiento;
        setTimeout(() => {
          this.loadData(this.establecimientoId);
        });
      }
    });
  }

  loadData(establecimientoId: number) {
    this.#roomService.getByEstab(establecimientoId).subscribe((response) => {
      const tempRooms = (response.payload as Floor[]) || [];
      const combinedData = tempRooms.map((room: Room) => ({
        ...room,
        _children: room.tables?.map((table: Table) => ({
          ...table,
          parentId: room.id,
        })),
      }));
      this.tables = combinedData as [];
    });
  }

  ngOnInit() {
    this.getEstabs();
  }

  onModalOpen() {
    const modalRef = this.#modalService.openModalCustom(
      TableAddEditModalComponent,
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
    this.establecimientoId = $event.target.value;
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

  private onDelete(table: Table) {
    swal
      .fire({
        icon: 'warning',
        title: 'Advertencia!',
        text: `Esta seguro/a de eliminar esta mesa?`,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.#tableService.delete(table.id).subscribe((response) => {
            this.successResponse(response);
          });
        }
      });
  }

  private onEdit(table: Table) {
    this.#tableService
      .put(table.id, table)
      .subscribe((response) => this.successResponse(response));
  }
}
