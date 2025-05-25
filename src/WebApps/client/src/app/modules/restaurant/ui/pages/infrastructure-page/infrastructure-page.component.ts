import {Component, inject, model, signal} from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import {MatDynamicCardComponent} from "@shared/components/mat-dynamic-card/mat-dynamic-card.component";
import {EstablecimientoSelectHtmlOnly} from "@core/models/estab.model";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatTreeModule} from "@angular/material/tree";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {MatMenuModule} from "@angular/material/menu";
import {NgClass} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ThemeButtonComponent} from "@shared/components/theme-button/theme-button.component";
import {SharedService} from "@core/services/shared.service";
import {FloorUseCase} from "@restaurant/application/use-cases/floor.use-case";
import {GetFloorsByEstabIdUseCase} from "@restaurant/application/use-cases/floor/get-floors-by-estab-id.use-case";
import {Floor, FloorTreeNode} from "@restaurant/domain/models/floor.model";
import {DialogService} from "@core/services/dialog.service";
import {FloorAddEditModalComponent} from "@restaurant/ui/components/floor-add-edit-modal/floor-add-edit-modal.component";
import {RoomAddEditModalComponent} from "@restaurant/ui/components/room-add-edit-modal/room-add-edit-modal.component";
import Swal from "sweetalert2";
import {TableAddEditModalComponent} from "@restaurant/ui/components/table-add-edit-modal/table-add-edit-modal.component";
import {TableUseCase} from "@restaurant/application/use-cases/table.use-case";






@Component({
    selector: 'app-infrastructure-page',
  imports: [
    BreadcrumbComponent,
    MatDynamicCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgClass,
    MatTooltipModule,
    MatToolbarModule,
    ThemeButtonComponent,
  ],
    templateUrl: './infrastructure-page.component.html',
    styles: `
      .container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .tree-container {
        flex: 1;
        overflow: auto;
        padding: 16px;
        background-color: #fafafa;
      }

      .tree {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .spacer-button {
        opacity: 0;
        cursor: default;
      }

      .tree-node {
        min-height: 48px;
        border-bottom: 1px solid #e0e0e0;
        transition: background-color 0.3s ease;
        margin-left: -8px;
      }

      .tree-node:hover {
        background-color: #f5f5f5;
      }

      .tree-node:last-child {
        border-bottom: none;
      }

      .node-content {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        gap: 12px;
      }

      .toggle-icon {
        color: #666;
      }

      .node-icon {
        width: 24px;
        height: 24px;
        font-size: 24px;
      }

      .icon-floor {
        color: #1976d2;
      }

      .icon-room {
        color: #388e3c;
      }

      .icon-table {
        color: #f57c00;
      }

      .node-floor {
        border-left: 4px solid #1976d2;
        background-color: rgba(25, 118, 210, 0.05);
      }

      .node-room {
        border-left: 4px solid #388e3c;
        background-color: rgba(56, 142, 60, 0.05);
      }

      .node-table {
        border-left: 4px solid #f57c00;
        background-color: rgba(245, 124, 0, 0.05);
      }

      .node-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .node-name {
        font-weight: 500;
        font-size: 16px;
      }

      .node-capacity {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #666;
        font-size: 14px;
      }

      .children-count {
        color: #999;
        font-size: 12px;
        font-style: italic;
      }

      .capacity-icon {
        width: 18px;
        height: 18px;
        font-size: 18px;
      }

      .node-edit {
        flex: 1;
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .edit-field {
        margin: 0;
      }

      .capacity-field {
        width: 100px;
      }

      .node-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .more-options {
        color: #666;
      }

      ::ng-deep .mat-tree-node {
        min-height: auto !important;
      }

      ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
        background-color: white;
      }

      ::ng-deep .mat-form-field {
        font-size: 14px;
      }

      ::ng-deep .mat-form-field-infix {
        padding: 8px 0;
      }

      ::ng-deep .mat-tree {
        background: transparent;
      }

      ::ng-deep .mat-tree-node {
        border-bottom: none;
      }

    `
})
export class InfrastructurePageComponent {

  private $sharedSvc = inject(SharedService);
  private $getFloorsUseCase = inject(GetFloorsByEstabIdUseCase);
  private _dialogSvc =inject(DialogService)
  private _floorUseCase = inject(FloorUseCase);
  private _tableUseCase = inject(TableUseCase);
  estabs = signal<EstablecimientoSelectHtmlOnly[]>([])
  estabId = model(0)



  private nextId = 15;

  dataSource  = signal<FloorTreeNode[]>([])

  childrenAccessor = (node: FloorTreeNode) => node.children ?? [];

  hasChild = (_: number, node: FloorTreeNode) => !!node.children && node.children.length > 0;

  constructor(private dialog: MatDialog) {}


  ngOnInit(){
    this.$sharedSvc.getEstabAsign().subscribe((response) => {
      this.estabs.set(response);
      const dataEstab = this.estabs().find((item) => item.predeterminado);
      this.estabId.set(dataEstab?.idEstablecimiento||0);
      this.getFloors();
    })
  }

  getFloors() {
    this.$getFloorsUseCase
      .execute(this.estabId())
      .subscribe((res) => {
       // this.floors = res;
        console.log(res)
        this.dataSource.set(res.floors)
      });
  }

  addEditFloor(data?:FloorTreeNode){
    const codEstab = this.estabs().find(
        (x) => x.idEstablecimiento === this.estabId(),
      )?.codEstab || null
    const ref = this._dialogSvc.open(FloorAddEditModalComponent, {
      data: {
        codEstab,
        establecimientoId: this.estabId(),
        ...structuredClone(data || {})
      },
      size: "lg"
    })
    ref.subscribe(result=>{
      if(result && typeof result==='object'){
        this.getFloors()
      }
    })
  }


  onFloorDelete(item: Floor) {
    Swal
      .fire({
        icon: 'warning',
        title: 'Aviso!',
        text: `Esta seguro/a de eliminar este piso: ${item.description}?`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        showCancelButton: true,
      })
      .then((response) => {
        if (response.isConfirmed) {
          this._floorUseCase.remove(item.id).subscribe((result) => {
            Swal.fire({
              icon: result.code == '1' ? 'success' : 'warning',
              html: result.message,
            })
            if (result.code == '1') {
              this.getFloors();
            }
          });
        }
      });
  }



  addEditTable(data: FloorTreeNode, isEdit?: boolean){
    const isEditing = isEdit && typeof data === 'object';

    const dialogData = {
      roomId: isEditing ? data.roomId : data.id,
      roomName: isEditing ? data.roomName : data.description,
      ...(isEditing && {
        id: data.id,
        description: data.description,
        numberTable: data.numberTable,
        capacity: data.capacity,
        enabled: data.enabled,
      }),
    };
    const ref = this._dialogSvc.open(TableAddEditModalComponent, {
      data:  dialogData,
    })
    ref.subscribe(result=>{
      if(result && typeof result==='object'){
        this.getFloors()
      }
    })
  }

  onTableDelete(table: FloorTreeNode) {
    Swal.fire({
      icon: 'warning',
      title: 'Inactivar',
      text: `Esta seguro/a de inactivar esta mesa?`,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((response) => {
      if (response.isConfirmed) {
        this._tableUseCase.remove(table.id).subscribe((response) => {
          Swal.fire({
            icon: response.code == '1' ? 'success' : 'warning',
            html: response.message,
          });
          if (response.code == '1') {
            this.getFloors();
          }
        });
      }
    });
  }

  addEditRoom(data:FloorTreeNode){
    const ref = this._dialogSvc.open(RoomAddEditModalComponent, {
      data: {
        floorId: data.id,
        floorName: data.description,
      },
    })
    ref.subscribe(result=>{
      if(result && typeof result==='object'){
        this.getFloors()
      }
    })
  }

  getNodeIcon(type: string): string {
    switch (type) {
      case 'floor': return 'meeting_room';
      case 'room': return 'layers';
      case 'table': return 'table_restaurant';
      default: return 'circle';
    }
  }

  getChildType(parentType: string): string {
    switch (parentType) {
      case 'floor': return 'Sala';
      case 'room': return 'Mesa';
      default: return 'Item';
    }
  }


}
