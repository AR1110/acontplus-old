import { Component, inject } from '@angular/core';
import { Floor } from '@restaurant/domain/models/floor.model';
import { Room } from '@restaurant/domain/models/room.model';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { ModalService } from '@core/services/modal.service';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { Table } from '@restaurant/domain/models/table.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import {  MatButtonModule} from '@angular/material/button';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ApiResponse } from '@core/models/api-response';
import swal from 'sweetalert2';
import { TableAddEditModalComponent } from '@restaurant/infrastructure/table/table-add-edit-modal/table-add-edit-modal.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {TableUseCase} from "@restaurant/domain/use-cases/table.use-case";
import {RoomUseCase} from "@restaurant/domain/use-cases/room.use-case";
import {faCircleMinus} from "@fortawesome/free-solid-svg-icons";
import {MatTableModule} from "@angular/material/table";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from "@angular/material/tree";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";


interface TableNode {
  index?: string;
  description?: string;
  capacity?: number;
  hasOp?: boolean
  hasStatus?: boolean
  enabled?: boolean
  children?: TableNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  count: number;
  level: number;
}



@Component({
    selector: 'app-table-list',
    imports: [
        FaIconComponent,
        FormsModule,
        MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatTableModule,
      MatTreeModule,
      MatIconModule,
      MatSlideToggleModule,
        TabulatorSemanticUiComponent,
    ],
    templateUrl: './table-list.component.html',
    styles: ``
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
          delBtn.innerHTML = `${icon(faCircleMinus).html.join('')}`;
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

  private _roomUseCase = inject(RoomUseCase)
  private _tableUseCase = inject(TableUseCase)
  #sharedService = inject(SharedService);
  #tS = inject(ToasterService);


  refresh(){
    this.loadData(this.establecimientoId)
  }

  getEstabs() {
    this.#sharedService.getEstabAsign().subscribe((response) => {
      this.establecimientos = response;

      let dataEstab = this.establecimientos.find(item=>item.predeterminado);
      if(dataEstab){
        this.establecimientoId = dataEstab.idEstablecimiento;
        setTimeout(() => {
          this.loadData(this.establecimientoId);
        });
      }
    });
  }

  loadData(establecimientoId: number) {
    this._roomUseCase.getByEstab(establecimientoId).subscribe((response) => {
      const tempRooms = (response.payload as Floor[]) || [];
      const combinedData = tempRooms.map((room: Room, index: number) => ({
        index: index +1,
        description: room.description,
        children: room.tables?.map((table: Table) => ({
          ...table,
          parentId: room.id,
          hasOp: true,
          hasStatus: true,
        })),
      }));
     // this.tables = combinedData as [];
      this.dataSource.data = structuredClone(combinedData as any)
      console.log(this.dataSource.data)
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
          this._tableUseCase.remove(table.id).subscribe((response) => {
            this.successResponse(response);
          });
        }
      });
  }


  private onEdit(table: Table) {
    this._tableUseCase.put(table.id, table)
      .subscribe((response) => this.successResponse(response));
  }



  displayedColumns: string[] = ['index', 'description', 'capacity','status', 'op'];

  private transformer = (node: TableNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      index: node.index,
      description: node.description,
      capacity: node.capacity,
      hasOp: node.hasOp,
      hasStatus: node.hasStatus,
      enabled: node.enabled,
      level,
    };
  }

  treeControl = new FlatTreeControl<any>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


}
