import { Component, inject } from '@angular/core';
import { Floor } from '@restaurant/domain/models/floor.model';
import { Room } from '@restaurant/domain/models/room.model';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { SharedService } from '@core/services/shared.service';
import { ToasterService } from '@core/services/toaster.service';
import { Table } from '@restaurant/domain/models/table.model';
import { FormsModule } from '@angular/forms';
import {  MatButtonModule} from '@angular/material/button';
import { TabulatorSemanticUiComponent } from '@core/components/tabulator-semantic-ui/tabulator-semantic-ui.component';
import { ApiResponse } from '@core/models/api-response';
import { TableAddEditModalComponent } from '@restaurant/ui/table/table-add-edit-modal/table-add-edit-modal.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {TableUseCase} from "@restaurant/domain/use-cases/table.use-case";
import {RoomUseCase} from "@restaurant/domain/use-cases/room.use-case";
import {MatTableModule} from "@angular/material/table";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from "@angular/material/tree";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {DialogService} from "@core/services/dialog.service";
import Swal from "sweetalert2";


interface TableNode {
  index?: string;
  description?: string;
  capacity?: number;
  hasOp?: boolean
  hasStatus?: boolean
  enabled?: boolean
  numberTable?:number
  roomId?:number
  id?:number
  children?: TableNode[];
}


@Component({
    selector: 'app-table-list',
    imports: [
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

  establecimientos: EstablecimientoSelectHtmlOnly[] = [];
  tables: any[] = [];

  private _roomUseCase = inject(RoomUseCase)
  private _tableUseCase = inject(TableUseCase)
  private _dialogSvc = inject(DialogService)
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
      this.dataSource.data = structuredClone(combinedData as any)
    });
  }

  ngOnInit() {
    this.getEstabs();
  }

  onModalOpen(data:any ={}) {
    const modalRef = this._dialogSvc.open(
      TableAddEditModalComponent,
      {
        size: 'sm',
        data: {
          establecimientoId: this.establecimientoId,
          id:data.id,
          roomId: data.roomId,
          description: data.description,
          numberTable: data.numberTable,
          capacity: data.capacity,
          enabled: data.enabled,
        }
      },
    );
    modalRef.subscribe((response) => {
      if (response && typeof response === 'object') {
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

   onDelete(table: Table) {
    Swal
      .fire({
        icon: 'warning',
        title: 'Inactivar',
        text: `Esta seguro/a de inactivar esta mesa?`,
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
        }else{
          this.refresh()
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
      numberTable: node.numberTable,
      roomId:node.roomId,
      id:node.id,
      level,
    };
  }

  treeControl = new FlatTreeControl<any>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

}
