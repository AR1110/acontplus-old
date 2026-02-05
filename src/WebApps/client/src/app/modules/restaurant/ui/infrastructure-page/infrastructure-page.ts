import { Component, inject, model, signal, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { DynamicCard } from '@acontplus/ng-components';
import { EstablecimientoSelectHtmlOnly } from '@core/models/estab.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Button } from '@acontplus/ng-components';
import { SharedService } from '@core/services/shared.service';
import { Floor, FloorTreeNode } from '@restaurant/data/models/floor.model';
import { DialogService } from '@core/services/dialog.service';
import { FloorAddEditModal } from '@restaurant/ui/infrastructure-page/floor-add-edit-modal/floor-add-edit-modal';
import { RoomAddEditModalComponent } from '@restaurant/ui/infrastructure-page/room-add-edit-modal/room-add-edit-modal.component';
import Swal from 'sweetalert2';
import { TableAddEditModalComponent } from '@restaurant/ui/infrastructure-page/table-add-edit-modal/table-add-edit-modal.component';
import { TableUseCase } from '@restaurant/application/use-cases/table.use-case';
import {FLOOR_HTTP_TOKEN} from "@restaurant/data/restaurant-token";

@Component({
  selector: 'app-infrastructure-page',
  imports: [
    BreadcrumbComponent,
    DynamicCard,
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
    Button,
  ],
  templateUrl: './infrastructure-page.html',
  styleUrl: './infrastructure-page.scss',
})
export class InfrastructurePage implements OnInit {

  private $sharedSvc = inject(SharedService);
  private _dialogSvc = inject(DialogService);
  private floorHttp = inject(FLOOR_HTTP_TOKEN);
  private _tableUseCase = inject(TableUseCase);
  estabs = signal<EstablecimientoSelectHtmlOnly[]>([]);
  estabId = model(0);


  dataSource = signal<FloorTreeNode[]>([]);

  childrenAccessor = (node: FloorTreeNode) => node.children ?? [];

  hasChild = (_: number, node: FloorTreeNode) => !!node.children && node.children.length > 0;


  ngOnInit() {
    this.$sharedSvc.getEstabAsign().subscribe((response) => {
      this.estabs.set(response);
      const dataEstab = this.estabs().find((item) => item.predeterminado);
      this.estabId.set(dataEstab?.idEstablecimiento || 0);
      this.getFloors();
    });
  }

  getFloors() {
    this.floorHttp.getByEstablishmentId(this.estabId()).subscribe((res) => {
      // this.floors = res;
      console.log(res);
      this.dataSource.set(res.floors);
    });
  }

  addEditFloor(data?: FloorTreeNode) {
    const codEstab =
      this.estabs().find((x) => x.idEstablecimiento === this.estabId())?.codEstab || null;
    const ref = this._dialogSvc.open(FloorAddEditModal, {
      data: {
        codEstab,
        establecimientoId: this.estabId(),
        ...structuredClone(data || {}),
      },
      size: 'lg',
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getFloors();
      }
    });
  }

  onFloorDelete(item: Floor) {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso!',
      text: `Esta seguro/a de eliminar este piso: ${item.description}?`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      showCancelButton: true,
    }).then((response) => {
      if (response.isConfirmed) {
        this.floorHttp.remove(item.id).subscribe((result) => {
          Swal.fire({
            icon: result.code == '1' ? 'success' : 'warning',
            html: result.message,
          });
          if (result.code == '1') {
            this.getFloors();
          }
        });
      }
    });
  }

  addEditTable(data: FloorTreeNode, isEdit?: boolean) {
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
      data: dialogData,
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getFloors();
      }
    });
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

  addEditRoom(params: FloorTreeNode, isAdd?: boolean) {
    const data: any = {
      floorId: 0,
      floorName: '',
    };
    if (isAdd) {
      data.floorId = params.id;
      data.floorName = params.description;
    } else {
      data.id = params.id;
      data.floorId = params.floorId;
      data.floorName = '';
      data.enabled = params.enabled;
      data.description = params.description;
      data.capacity = params.capacity;
      data.code = params.code;
    }
    const ref = this._dialogSvc.open(RoomAddEditModalComponent, {
      data,
    });
    ref.subscribe((result) => {
      if (result && typeof result === 'object') {
        this.getFloors();
      }
    });
  }

  getNodeIcon(type: string): string {
    switch (type) {
      case 'floor':
        return 'meeting_room';
      case 'room':
        return 'layers';
      case 'table':
        return 'table_restaurant';
      default:
        return 'circle';
    }
  }

  getChildType(parentType: string): string {
    switch (parentType) {
      case 'floor':
        return 'Sala';
      case 'room':
        return 'Mesa';
      default:
        return 'Item';
    }
  }
}
